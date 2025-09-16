import React from 'react';
import { manifestAgents } from '../core/agentManifest';
// FIX: Explicitly import from types/index.ts to resolve module and type inference issues.
import { ManifestAgent } from '../types/index';
import { useAppContext } from '../context/AppContext';
import { PlusIcon, MinusCircleIcon } from './icons';

const CoreView: React.FC = () => {
    const { state, dispatch } = useAppContext();

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
                <div className="flex-grow bg-brand-gray border border-brand-border rounded-md p-4 flex flex-col">
                    <div className="text-sm text-brand-text-secondary">AgentricAI Core OS Initialized. Assemble your team and define your mission objective.</div>
                    {/* Mission log or chat would go here */}
                </div>
                <div className="mt-4">
                    <input 
                        type="text" 
                        placeholder="Enter objective..."
                        className="w-full bg-brand-light-gray border border-brand-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
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