import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { manifestAgents } from '../core/agentManifest';
import { UserCircleIcon, SignalIcon, DocumentMagnifyingGlassIcon } from './icons';
import { View } from '../types/index';

interface AgentRosterProps {
  setActiveView: (view: View) => void;
  navigateToConsole?: (studentId: string) => void;
}

const AgentRoster: React.FC<AgentRosterProps> = ({ setActiveView, navigateToConsole }) => {
    const { state, dispatch } = useAppContext();
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const { students, agents: dynamicAgentsState } = state;


    const allAgents = useMemo(() => {
        const manifestAgentIds = new Set(manifestAgents.map(a => a.id));
        const dynamicAgents = dynamicAgentsState
            .filter(a => !manifestAgentIds.has(a.id))
            .map(a => ({
                id: a.id,
                name: a.name,
                category: a.type || 'Dynamic',
                role: a.systemInstruction,
            }));
        return [...manifestAgents, ...dynamicAgents];
    }, [dynamicAgentsState]);
    
    const studentAgents = useMemo(() => students.map(student => {
        const agent = dynamicAgentsState.find(a => a.id === student.companionAgentId && a.type === 'Companion');
        return {
            studentId: student.id,
            agentName: agent?.name || 'Companion Agent',
            agentId: agent?.id || 'N/A'
        };
    }).filter(sa => sa.agentId !== 'N/A'), [students, dynamicAgentsState]);


    const categories = useMemo(() => ['All', 'Student Companions', ...Array.from(new Set(allAgents.map(a => a.category)))], [allAgents]);

    const filteredAndSortedAgents = useMemo(() => {
        let agentsToDisplay = [];
        if (filterCategory === 'Student Companions') {
            agentsToDisplay = studentAgents.map(sa => ({
                id: sa.agentId,
                name: sa.agentName,
                category: 'Student Companions',
                role: `Companion for student ${sa.studentId.slice(-6)}`,
                studentId: sa.studentId, // For navigation
            }));
        } else {
             agentsToDisplay = allAgents.map(a => ({...a, studentId: undefined}));
             if (filterCategory !== 'All') {
                agentsToDisplay = agentsToDisplay.filter(a => a.category === filterCategory);
            }
        }

        agentsToDisplay.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            if (sortBy === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
            return 0;
        });

        return agentsToDisplay;
    }, [allAgents, studentAgents, filterCategory, sortBy]);
    
    const handleSelectAgent = (agent: {id: string, studentId?: string}) => {
        if (navigateToConsole && agent.studentId) {
            navigateToConsole(agent.studentId);
        } else {
            dispatch({ type: 'SET_ACTIVE_AGENT_ID', payload: agent.id });
            setActiveView('agent-detail');
        }
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <UserCircleIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">System Agent Roster</h1>
                        <p className="text-brand-text-secondary">Browse, filter, and inspect all agents in the ecosystem.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-brand-gray border border-brand-border rounded-md px-3 py-1.5 text-sm">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                     <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-brand-gray border border-brand-border rounded-md px-3 py-1.5 text-sm">
                        <option value="name">Sort by Name</option>
                        <option value="category">Sort by Category</option>
                    </select>
                </div>
            </header>

            {filteredAndSortedAgents.length === 0 ? (
                <div className="text-center p-10 bg-brand-gray rounded-lg border border-brand-border">
                    <p className="text-brand-text-secondary">No agents match the current filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAndSortedAgents.map(agent => (
                        <div 
                            key={agent.id} 
                            onClick={() => handleSelectAgent(agent)}
                            className="bg-brand-gray border border-brand-border rounded-lg p-4 cursor-pointer group hover:border-brand-primary transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-bold text-white truncate">{agent.name}</h2>
                                    <p className="text-xs text-brand-text-secondary">{agent.id}</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-green-400">
                                    <SignalIcon className="w-4 h-4" />
                                    <span>Active</span>
                                </div>
                            </div>
                            <div className="mt-4 border-t border-brand-border pt-3 space-y-2 text-sm">
                               <p className="text-brand-text-secondary text-xs h-16 overflow-hidden text-ellipsis">{agent.role}</p>
                               <div className="flex justify-between items-center">
                                   <span className="text-xs bg-brand-dark px-2 py-1 rounded-full">{agent.category}</span>
                                   <div className="flex items-center gap-1 text-xs text-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                       <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                                       <span>{agent.studentId ? "Manage" : "View Details"}</span>
                                   </div>
                               </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgentRoster;