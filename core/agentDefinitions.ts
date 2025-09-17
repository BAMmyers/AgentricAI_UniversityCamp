import React from 'react';
import { DynamicNodeConfig } from '../types/index';
import { CodeBracketIcon, PencilSquareIcon } from '../components/icons';

// This file defines "Juggernaut" agents - dynamic nodes driven by execution logic prompts.

export const initialSystemAgents: DynamicNodeConfig[] = [
    {
        name: 'The Apprentice',
        description: 'An AI assistant that can plan, research, and use other tools. Can be used to generate a sequence of tasks from a high-level goal.',
        inputs: [{ name: 'High-Level Goal', dataType: 'string', id: 'goal' }],
        outputs: [{ name: 'Task List', dataType: 'string', id: 'tasks' }],
        executionLogicPrompt: "Analyze the 'High-Level Goal'. Break it down into a concise, numbered list of actionable sub-tasks. Each task should be a clear instruction for another agent.",
        color: 'border-yellow-500',
        icon: '🎓',
        isDynamic: true,
        category: 'System Agents'
    },
    {
        name: 'Echo Project Orchestrator',
        description: 'A specialized agent that generates a daily schedule for a student in the Echo Project, based on goals and curriculum.',
        inputs: [
            { name: 'Parent Goals', dataType: 'string', id: 'parentGoals' },
            { name: 'Teacher Curriculum', dataType: 'string', id: 'teacherCurriculum' },
            { name: 'Student Interests', dataType: 'string', id: 'studentInterests' },
        ],
        outputs: [{ name: 'JSON Schedule', dataType: 'json', id: 'schedule' }],
        executionLogicPrompt: `You are a curriculum designer for a neurodiverse learner. Synthesize the Parent Goals, Teacher Curriculum, and Student Interests. Create a JSON array of 5 schedule items for a day. Each item must have "id", "title", "time" (e.g., "9:00 AM"), "type" (one of: 'reading', 'math', 'art', 'writing', 'free-play'), and "content" (a short, G-rated prompt for the activity). Respond with ONLY the JSON array.`,
        color: 'border-green-500',
        icon: ' ECHO ',
        isDynamic: true,
        category: 'System Agents'
    },
    {
        name: 'Code Debugger',
        description: 'Analyzes a code snippet and its error message to suggest a fix.',
        inputs: [
            { name: 'Code Snippet', dataType: 'string', id: 'code' },
            { name: 'Error Message', dataType: 'string', id: 'error' }
        ],
        outputs: [{ name: 'Suggested Fix', dataType: 'string', id: 'fix' }],
        executionLogicPrompt: "Analyze the 'Code Snippet' and the 'Error Message'. Provide a corrected version of the code snippet and a brief explanation of the fix.",
        color: 'border-red-500',
        // FIX: Use React.createElement for icon components to resolve parsing errors.
        icon: React.createElement(CodeBracketIcon, { className: "w-4 h-4"}),
        isDynamic: true,
        category: 'System Agents'
    },
    {
        name: 'System Instruction Writer',
        description: 'Writes a detailed system instruction prompt for a new agent based on a short description of its role.',
        inputs: [{ name: 'Agent Role', dataType: 'string', id: 'role' }],
        outputs: [{ name: 'System Instruction', dataType: 'string', id: 'instruction' }],
        executionLogicPrompt: `Based on the 'Agent Role', write a comprehensive system instruction (persona) for a new AI agent. The instruction should be detailed, written in the second person ("You are..."), and clearly define the agent's purpose, capabilities, and constraints.`,
        color: 'border-purple-500',
        // FIX: Use React.createElement for icon components to resolve parsing errors.
        icon: React.createElement(PencilSquareIcon, { className: "w-4 h-4"}),
        isDynamic: true,
        category: 'System Agents'
    },
];
