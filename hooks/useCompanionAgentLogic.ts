import React, { useEffect, useCallback, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Agent, Student, ScheduleItem, Action, ScheduleItemType } from '../types/index';
import { generateContent } from '../services/logicBroker';
import { BookOpenIcon, PaintBrushIcon, SparklesIcon, StarIcon } from '../components/icons';
import { FaAppleAlt, FaPlus, FaPencilAlt, FaGamepad } from 'react-icons/fa';

export const useCompanionAgentLogic = () => {
    const { state, dispatch } = useAppContext();
    const activeStudent = state.students.find(s => s.id === state.activeStudentId) || null;
    const companionAgent = activeStudent ? state.agents.find(a => a.id === activeStudent.companionAgentId) || null : null;
    const { curriculum } = state;
    
    const brokerParams = {
        isPremium: state.currentUser?.subscriptionPlan === 'pro',
        isOnline: !state.isOfflineMode,
        dispatch: dispatch as React.Dispatch<Action>
    };

    const processedGoalsRef = useRef<string[]>([]);

    const generateActivityContent = useCallback(async (student: Student, agent: Agent, activityType: ScheduleItemType, topic: string): Promise<any> => {
        let systemInstruction = "You are an AI tutor for a young, neurodiverse learner. Create a simple, engaging, G-rated activity description.";
        let prompt = `Create content for a '${activityType}' activity about '${topic}'.`;

        switch(activityType) {
            case 'reading':
                systemInstruction = 'You are an exceptionally creative storyteller for young, neurodiverse learners. Your stories must be imaginative, positive, G-rated, and very easy to understand. Keep stories to 1-2 short paragraphs.';
                prompt = `Write a short, happy story about ${topic}.`;
                break;
            case 'math':
                 systemInstruction = 'You create simple, one-sentence math word problems for young children involving counting, addition, or subtraction with numbers under 10.';
                 prompt = `Create a simple math problem about ${topic}. The answer should be a number.`;
                 break;
            case 'art':
                 systemInstruction = 'You give a single, simple, fun drawing prompt for a child. Be very imaginative and descriptive in one short paragraph.';
                 prompt = `Create a drawing prompt about ${topic}.`;
                 break;
            case 'writing':
                 systemInstruction = 'You create a simple prompt to encourage a child to practice writing their name or simple words.';
                 prompt = 'Create a simple writing prompt for a child.';
                 break;
        }
        
        // For simple activities, we can use the local agent.
        const { text } = await generateContent({ prompt, systemInstruction }, { ...brokerParams, isPremium: false });
        return text;
    }, [brokerParams]);


    useEffect(() => {
        if (activeStudent && companionAgent && activeStudent.schedule.length === 0) {
            console.log(`Companion Agent [${companionAgent.name}] is generating the initial "Day One" schedule.`);

            const createInitialSchedule = async () => {
                // Generate content for each activity asynchronously
                const readingContent = await generateActivityContent(activeStudent, companionAgent, 'reading', activeStudent.preferences.preferredTopics[0] || 'a friendly robot');
                const mathContent = await generateActivityContent(activeStudent, companionAgent, 'math', 'counting stars');
                const artContent = await generateActivityContent(activeStudent, companionAgent, 'art', activeStudent.preferences.preferredTopics[1] || 'a friendly alien');
                const writingContent = await generateActivityContent(activeStudent, companionAgent, 'writing', 'writing our name');
                const freePlayContent = "Enjoy your free play time with your favorite toys!";
                const mealtimeContent = "Enjoy your delicious meal!!";

                const initialSchedule: ScheduleItem[] = [
                    { id: 'sched-read', title: "Reading Time", time: "9:00 AM", type: 'reading', status: 'pending', content: readingContent },
                    { id: 'sched-math', title: "Math Fun", time: "10:00 AM", type: 'math', status: 'pending', content: mathContent },
                    { id: 'sched-art', title: "Art Corner", time: "11:00 AM", type: 'art', status: 'pending', content: artContent },
                    { id: 'sched-meal', title: "Mealtime", time: "12:00 PM", type: 'mealtime', status: 'pending', content: mealtimeContent },
                    { id: 'sched-write', title: "Writing Practice", time: "1:00 PM", type: 'writing', status: 'pending', content: writingContent },
                    { id: 'sched-play', title: "Free Play", time: "2:00 PM", type: 'free-play', status: 'pending', content: freePlayContent },
                ];
                dispatch({ type: 'UPDATE_STUDENT_SCHEDULE', payload: { studentId: activeStudent.id, schedule: initialSchedule } });
            };
            
            createInitialSchedule();
        }
    }, [activeStudent, companionAgent, dispatch, generateActivityContent]);
};
