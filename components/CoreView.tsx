import React, { useState } from 'react';
import { manifestAgents } from '../core/agentManifest';
import { ManifestAgent, MissionPlan } from '../types/index';
import { useAppContext } from '../context/AppContext';
import { PlusIcon, MinusCircleIcon, PaperAirplaneIcon, SparklesIcon } from './icons';
import { generateContent } from '../services/geminiService';

const CoreView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [objective, setObjective] = useState('');
    const [isPlanning, setIsPlanning] = useState(false);

    const groupedAgents = manifestAgents.reduce((acc, agent) => {
        const category = agent.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(agent);
        return acc;
    }, {} as Record<string, ManifestAgent[]>);

    const handleAddAgent = (agent: ManifestAgent) => {
        dispatch({ type: 'ADD_AGENT_TO_TEAM', payload: agent });
    };

    const handleRemoveAgent = (agentId: string) => {
        dispatch({ type: 'REMOVE_AGENT_FROM_TEAM', payload: agentId });
    };
    
    const handleGeneratePlan = async () => {
        if (!objective.trim() || state.missionTeam.length === 0) {
            alert('Please enter an objective and assemble a team.');
            return;
        }
        setIsPlanning(true);
        dispatch({ type: 'SET_MISSION_PLAN', payload: null });

        const teamDetails = state.missionTeam.map(a => `- ${a.name}: ${a.role}`).join('\n');
        const prompt = `
            You are Orchestrator Alpha, an expert AI mission planner. Your task is to create a detailed, step-by-step mission plan to achieve a user's objective using a designated team of specialized agents.

            **Objective:** "${objective}"

            **Available Team:**
            ${teamDetails}

            Analyze the team's capabilities and the objective. Break the objective down into a logical sequence of actions. For each step, assign the most appropriate agent from the team.

            Respond with ONLY a JSON object with two keys:
            1. "overview": A brief, one-sentence summary of the overall mission strategy.
            2. "steps": An array of objects, where each object has the keys "step" (number), "agent" (the name of the assigned agent), "action" (a concise verb-based description of the task, e.g., "Analyze financial data"), and "objective" (a detailed description of what this step aims to accomplish).
        `;

        const { text } = await generateContent({ prompt });
        setIsPlanning(false);

        try {
            const plan: MissionPlan = JSON.parse(text);
            dispatch({ type: 'SET_MISSION_PLAN', payload: plan });
        } catch (e) {
            console.error("Failed to parse mission plan:", e);
            alert("The Orchestrator AI failed to generate a valid plan. Please try refining your objective.");
        }
    };

    return (
        <div className="flex h-full bg-brand-dark text-brand-text font-sans">
            {/* Left Panel: Agent Roster */}
            <div className="w-1/3 bg-brand-gray border-r border-brand-border p-4 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-4">Agent Roster</h2>
                <div className="flex-grow overflow-y-auto pr-2">
                    {Object.entries(groupedAgents).map(([category, agents]) => (
                        <div key={category} className="mb-6">
                            <h3 className="text-sm font-semibold text-brand-primary mb-2 sticky top-0 bg-brand-gray py-1">{category}</h3>
                            <div className="space-y-2">
                                {agents.map(agent => (
                                    <div key={agent.id} className="bg-brand-light-gray p-3 rounded-md border border-brand-border">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-sm text-white">{agent.name}</h4>
                                            <button 
                                                onClick={() => handleAddAgent(agent)}
                                                className="text-brand-text-secondary hover:text-white transition-colors"
                                                title="Add to team"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-brand-text-secondary mt-1">{agent.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Middle Panel: Mission Control */}
            <div className="flex-1 p-6 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-4">Mission Control</h2>
                <div className="flex-grow bg-brand-gray border border-brand-border rounded-md p-4 flex flex-col overflow-hidden">
                    {isPlanning ? (
                        <div className="flex-grow flex items-center justify-center text-center text-brand-text-secondary">
                            <div>
                                <SparklesIcon className="w-12 h-12 mx-auto text-brand-cyan animate-pulse"/>
                                <p className="mt-2">Orchestrator Alpha is analyzing the objective and generating a mission plan...</p>
                            </div>
                        </div>
                    ) : state.missionPlan ? (
                         <div className="flex-grow overflow-y-auto">
                            <h3 className="font-bold text-white">Mission Overview:</h3>
                            <p className="text-sm text-brand-text-secondary italic mb-4">{state.missionPlan.overview}</p>
                            <div className="space-y-3">
                                {state.missionPlan.steps.map(step => (
                                    <div key={step.step} className="bg-brand-dark p-3 rounded-lg border border-brand-border">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-brand-cyan">Step {step.step}: {step.action}</h4>
                                            <span className="text-xs font-mono bg-brand-light-gray px-2 py-1 rounded">{step.agent}</span>
                                        </div>
                                        <p className="text-sm text-brand-text-secondary mt-1">{step.objective}</p>
                                    </div>
                                ))}
                            </div>
                         </div>
                    ) : (
                         <div className="text-sm text-brand-text-secondary">AgentricAI Core OS Initialized. Assemble your team and define your mission objective.</div>
                    )}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleGeneratePlan(); }} className="mt-4 flex gap-2">
                    <input 
                        type="text" 
                        value={objective}
                        onChange={e => setObjective(e.target.value)}
                        placeholder="Enter mission objective..."
                        className="w-full bg-brand-light-gray border border-brand-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <button type="submit" disabled={isPlanning} className="bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:bg-brand-text-secondary">
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span>Plan</span>
                    </button>
                </form>
            </div>

            {/* Right Panel: Team Status */}
            <div className="w-1/4 bg-brand-gray border-l border-brand-border p-4 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-4">Team Status</h2>
                <div className="flex-grow overflow-y-auto">
                    {state.missionTeam.length === 0 ? (
                        <p className="text-sm text-brand-text-secondary">No agents on team.</p>
                    ) : (
                        <div className="space-y-3">
                            {state.missionTeam.map(agent => (
                                <div key={agent.id} className="bg-brand-light-gray p-3 rounded-md border border-brand-border flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{agent.name}</h4>
                                        <p className="text-xs text-brand-text-secondary mt-1">Status: Idle</p>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveAgent(agent.id)}
                                        className="text-red-500 hover:text-red-400 transition-colors flex-shrink-0 ml-2"
                                        title="Remove from team"
                                    >
                                        <MinusCircleIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoreView;
