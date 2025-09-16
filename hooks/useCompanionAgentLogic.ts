import React, { useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Agent, Student, Workflow, ScheduleItem } from '../types/index';
import { generateContent } from '../services/geminiService';
import { BookOpenIcon, PaintBrushIcon, SparklesIcon } from '../components/icons';

export const useCompanionAgentLogic = () => {
    const { state, dispatch } = useAppContext();
    const activeStudent = state.students.find(s => s.id === state.activeStudentId) || null;
    const companionAgent = activeStudent ? state.agents.find(a => a.id === activeStudent.companionAgentId) || null : null;
    
    // Use a ref to track which goals have already been processed to avoid re-generating activities for the same goal.
    const processedGoalsRef = useRef<string[]>([]);

    const evolveSchedule = useCallback(async (student: Student, agent: Agent) => {
        // Synthesize all inputs: parent goals, teacher curriculum, and student preferences.
        const allInputs = [
            ...student.parentGoals,
            ...student.teacherCurriculum,
            ...student.preferences.preferredTopics
        ];
        
        // Determine which inputs are new and haven't been processed yet.
        const newInputs = allInputs.filter(g => !processedGoalsRef.current.includes(g));
        if (newInputs.length === 0) return;

        console.log(`Companion Agent [${agent.name}] is evolving the schedule based on new inputs: [${newInputs.join(', ')}]`);
        dispatch({ type: 'SHOW_TOAST', payload: { message: `Companion Agent is designing a new activity based on updated goals...`, type: 'info' } });

        const prompt = `
            An AI tutor needs to create a new learning activity for a student. Synthesize the following data points to propose a new, engaging activity.
            
            - Student's Existing Preferences: [${student.preferences.preferredTopics.join(', ')}]
            - New Goals/Curriculum/Interests to Address: [${newInputs.join(', ')}]
            
            Based on ALL of the above, devise a single, creative activity. For example, if a parent wants less gaming, a teacher adds a 'game dev' course, and the student likes dinosaurs, you could suggest "Design a Dinosaur-themed Game Level".
            
            Respond with ONLY a JSON object with three keys:
            1. "title": A short, fun title for the activity (e.g., "Dino Game Design").
            2. "topic": A concise prompt for another AI to generate the activity's content (e.g., "a simple level design document for a 2D platformer game featuring a friendly T-Rex").
            3. "summary": A one-sentence summary for the parent/teacher log explaining why you created this activity (e.g., "Created a 'Dino Game Design' activity to channel the student's interest in gaming towards the teacher's new game development curriculum.").
        `;
        
        try {
            const { text: result } = await generateContent({ prompt, systemInstruction: "You are an expert educational strategist who designs personalized learning plans." });
            const newActivity = JSON.parse(result);
            const newWorkflow: Workflow = {
                id: `wf-custom-${student.id}-${Date.now()}`, name: newActivity.title, ownerAgentId: agent.id,
                nodes: [
                    { id: 'n1', type: 'textInput', title: 'Topic Input', position: { x: 50, y: 100 }, inputs: [], outputs: [{ name: 'text', type: 'string' }], color: 'border-blue-500', content: { text: newActivity.topic } },
                    { id: 'n2', type: 'storyGenerator', title: 'Generate Content', position: { x: 350, y: 100 }, inputs: [{ name: 'prompt', type: 'string' }], outputs: [{ name: 'story', type: 'string' }], color: 'border-pink-500', content: { systemInstruction: 'You create short, simple, happy educational content for a young learner based on a specific topic.' } }
                ],
                connections: [{ fromNodeId: 'n1', fromOutput: 'text', toNodeId: 'n2', toInput: 'prompt' }]
            };
            dispatch({ type: 'ADD_WORKFLOW', payload: newWorkflow });

            const newScheduleItem: ScheduleItem = {
                id: `sched-custom-${Date.now()}`, title: newActivity.title, workflowId: newWorkflow.id, status: 'pending',
                icon: React.createElement(SparklesIcon, { className: "w-16 h-16" }), color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
                notes: `Suggested for you!`
            };
            
            const currentSchedule = state.students.find(s => s.id === student.id)?.schedule || [];
            dispatch({ type: 'UPDATE_STUDENT_SCHEDULE', payload: { studentId: student.id, schedule: [...currentSchedule, newScheduleItem] } });
            
            // Mark these inputs as processed.
            processedGoalsRef.current.push(...newInputs);

        } catch (error) {
            console.error("Failed to parse AI response for schedule evolution:", error);
            dispatch({ type: 'SHOW_TOAST', payload: { message: `Agent failed to design a new activity. Error: ${error}`, type: 'error' } });
        }
    }, [dispatch, state.students]);

    // This effect manages the agent's lifecycle: initial setup and ongoing evolution.
    useEffect(() => {
        if (activeStudent && companionAgent) {
            // "Day One" Experience: If the student has no schedule, create the initial one.
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
                    { id: 'sched1', title: "Today's Story", workflowId: storyWorkflow.id, status: 'pending', icon: React.createElement(BookOpenIcon, { className: "w-16 h-16" }), color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
                    { id: 'sched2', title: 'Art Idea', workflowId: artWorkflow.id, status: 'pending', icon: React.createElement(PaintBrushIcon, { className: "w-16 h-16" }), color: 'bg-gradient-to-br from-red-500 to-orange-500' },
                ];
                dispatch({ type: 'UPDATE_STUDENT_SCHEDULE', payload: { studentId: activeStudent.id, schedule: initialSchedule } });
            }
            // Ongoing Evolution: Check for new goals/preferences and adapt.
            evolveSchedule(activeStudent, companionAgent);
            
        }
    }, [activeStudent, companionAgent, dispatch, evolveSchedule]);
};