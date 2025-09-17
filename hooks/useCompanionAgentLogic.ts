import React, { useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Agent, Student, Workflow, ScheduleItem } from '../types/index';
import { generateContent } from '../services/logicBroker';
import { BookOpenIcon, PaintBrushIcon, SparklesIcon, StarIcon } from '../components/icons';

export const useCompanionAgentLogic = () => {
    const { state, dispatch } = useAppContext();
    const activeStudent = state.students.find(s => s.id === state.activeStudentId) || null;
    const companionAgent = activeStudent ? state.agents.find(a => a.id === activeStudent.companionAgentId) || null : null;
    const { curriculum } = state;
    const brokerParams = { isPremium: state.currentUser?.subscriptionPlan === 'pro' };

    const processedGoalsRef = useRef<string[]>([]);

    const evolveSchedule = useCallback(async (student: Student, agent: Agent) => {
        const allParentAndTeacherInputs = [
            ...student.parentGoals,
            ...student.teacherCurriculum,
        ];

        const relevantCurriculum = (curriculum || []).filter(item => 
            student.preferences.preferredTopics.some(topic => 
                item.title.toLowerCase().includes(topic) || item.content.toLowerCase().includes(topic)
            )
        );

        const newInputs = [
            ...allParentAndTeacherInputs,
            ...relevantCurriculum.map(c => `${c.title}: ${c.content}`)
        ].filter(g => !processedGoalsRef.current.includes(g));

        if (newInputs.length === 0) return;

        dispatch({ type: 'SHOW_TOAST', payload: { message: `Companion Agent is designing a new activity based on updated goals...`, type: 'info' } });

        const newTopic = newInputs[newInputs.length - 1];
        
        const curriculumContext = relevantCurriculum.length > 0
            ? `\n\nReference the following curriculum points provided by the teacher:\n${relevantCurriculum.map(c => `- ${c.title}: ${c.content}`).join('\n')}`
            : '';
        
        const prompt = brokerParams.isPremium 
            ? `You are a curriculum designer for a young, neurodiverse learner. Your task is to generate a single, engaging learning activity. The activity should be simple, creative, and positive. The content should be G-rated and suitable for all ages.

**Topic:** "${newTopic}"
${curriculumContext}

Your response MUST be a single, raw JSON object and nothing else. Do not use markdown formatting.
The JSON object must have this exact structure:
{
  "title": "A short, engaging title for the activity.",
  "description": "A one-paragraph, easy-to-understand description of the activity."
}`
            : `Create a simple activity about ${newTopic}`;

        const { text: generationResult } = await generateContent({ prompt }, brokerParams);
        
        let activity: { title: string, description: string };
        try {
            const parsed = JSON.parse(generationResult);
            activity = { title: parsed.title, description: parsed.description };
        } catch (e) {
            activity = { title: `Activity: ${newTopic}`, description: generationResult };
        }

        const newWorkflow: Workflow = {
            id: `wf-custom-${student.id}-${Date.now()}`, name: activity.title, ownerAgentId: agent.id,
            nodes: [
                { id: 'n1', type: 'textInput', title: 'Activity Details', position: { x: 50, y: 100 }, inputs: [], outputs: [{ name: 'text', type: 'string' }], color: 'border-blue-500', content: { text: activity.description } },
                { id: 'n2', type: 'dataDisplay', title: 'Your Task', position: { x: 350, y: 100 }, inputs: [{ name: 'data', type: 'any' }], outputs: [], color: 'border-gray-500' }
            ],
            connections: [{ fromNodeId: 'n1', fromOutput: 'text', toNodeId: 'n2', toInput: 'data' }]
        };

        dispatch({ type: 'ADD_WORKFLOW', payload: newWorkflow });

        const newScheduleItem: ScheduleItem = {
            id: `sched-custom-${Date.now()}`, title: activity.title, workflowId: newWorkflow.id, status: 'pending',
            icon: React.createElement(SparklesIcon, { className: "w-16 h-16" }), color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
            notes: `Suggested for you!`,
            type: 'activity',
        };
        
        const currentSchedule = state.students.find(s => s.id === student.id)?.schedule || [];
        dispatch({ type: 'UPDATE_STUDENT_SCHEDULE', payload: { studentId: student.id, schedule: [...currentSchedule, newScheduleItem] } });
        
        processedGoalsRef.current.push(...newInputs);
        
    }, [dispatch, state.students, brokerParams, curriculum]);

    useEffect(() => {
        if (activeStudent && companionAgent) {
            if (activeStudent.schedule.length === 0) {
                console.log(`Companion Agent [${companionAgent.name}] is generating the initial "Day One" schedule.`);
                const storyWorkflow: Workflow = {
                    id: `wf-story-${activeStudent.id}`, name: "Daily Story Generation", ownerAgentId: companionAgent.id,
                    nodes: [
                        { id: 'n1', type: 'textInput', title: 'Topic', position: { x: 50, y: 100 }, inputs: [], outputs: [{name: 'text', type: 'string'}], color: 'border-blue-500', content: {text: `a short, happy story about a ${activeStudent.preferences.preferredTopics[0] || 'friendly robot'}`}},
                        { id: 'n2', type: 'storyGenerator', title: 'Write Story', position: { x: 350, y: 100 }, inputs: [{name: 'prompt', type: 'string'}], outputs: [{name: 'story', type: 'string'}], color: 'border-pink-500', content: {systemInstruction: 'You write very short, happy stories (2-3 paragraphs) for young children.'}}
                    ],
                    connections: [{ fromNodeId: 'n1', fromOutput: 'text', toNodeId: 'n2', toInput: 'prompt' }]
                };
                const artWorkflow: Workflow = {
                    id: `wf-art-${activeStudent.id}`, name: "Art Idea Generation", ownerAgentId: companionAgent.id,
                     nodes: [
                        { id: 'n1', type: 'textInput', title: 'Topic', position: { x: 50, y: 100 }, inputs: [], outputs: [{name: 'text', type: 'string'}], color: 'border-blue-500', content: {text: `a fun, simple drawing idea involving ${activeStudent.preferences.preferredTopics[1] || 'stars and planets'}`}},
                        { id: 'n2', type: 'storyGenerator', title: 'Generate Idea', position: { x: 350, y: 100 }, inputs: [{name: 'prompt', type: 'string'}], outputs: [{name: 'story', type: 'string'}], color: 'border-teal-500', content: {systemInstruction: 'You give a single, simple, fun drawing prompt for a child.'}}
                    ],
                    connections: [{ fromNodeId: 'n1', fromOutput: 'text', toNodeId: 'n2', toInput: 'prompt' }]
                };
                dispatch({ type: 'ADD_WORKFLOW', payload: storyWorkflow });
                dispatch({ type: 'ADD_WORKFLOW', payload: artWorkflow });
                const initialSchedule: ScheduleItem[] = [
                    { id: 'sched1', title: "Today's Story", workflowId: storyWorkflow.id, status: 'pending', icon: React.createElement(BookOpenIcon, { className: "w-16 h-16" }), color: 'bg-gradient-to-br from-blue-500 to-cyan-500', type: 'activity' },
                    { id: 'sched2', title: 'Art Idea', workflowId: artWorkflow.id, status: 'pending', icon: React.createElement(PaintBrushIcon, { className: "w-16 h-16" }), color: 'bg-gradient-to-br from-red-500 to-orange-500', type: 'activity' },
                    { id: 'sched-live', title: "Live Seminar", workflowId: 'live-lecture-workflow', status: 'pending', type: 'lecture', icon: React.createElement(StarIcon, { className: "w-16 h-16" }), color: 'bg-gradient-to-br from-yellow-400 to-orange-500', notes: "Join Live!" },
                ];
                dispatch({ type: 'UPDATE_STUDENT_SCHEDULE', payload: { studentId: activeStudent.id, schedule: initialSchedule } });
            }
            evolveSchedule(activeStudent, companionAgent);
        }
    }, [activeStudent, companionAgent, dispatch, evolveSchedule, curriculum]);
};