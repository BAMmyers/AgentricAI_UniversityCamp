import React, { useState, useMemo } from 'react';
import { DynamicNodeConfig, ExecutionHistoryEntry, LlmServiceConfig, SavedWorkflow, Environment, ExecutionRuntime, AiMode, ContextMemory } from '../../types/index';
import { PlusIcon, PlayIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, Cog8ToothIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '../icons';

interface SidebarProps {
    availableAgents: DynamicNodeConfig[];
    executionHistory: ExecutionHistoryEntry[];
    setExecutionHistory: React.Dispatch<React.SetStateAction<ExecutionHistoryEntry[]>>;
    savedWorkflows: Record<string, SavedWorkflow>;
    currentWorkflowName: string;
    setCurrentWorkflowName: React.Dispatch<React.SetStateAction<string>>;
    onSave: () => void;
    onLoad: (name: string) => void;
    onDelete: (name: string) => void;
    onOpenLlmSettings: () => void;
    hasApiKey: boolean;
    environment: Environment;
    setEnvironment: (env: Environment) => void;
    executionRuntime: ExecutionRuntime;
    setExecutionRuntime: (runtime: ExecutionRuntime) => void;
    aiMode: AiMode;
    setAiMode: (mode: AiMode) => void;
    contextMemory: ContextMemory;
    setContextMemory: (memory: ContextMemory) => void;
    onDefineAgent: () => void;
    onClearCanvas: () => void;
    onRunWorkflow: () => void;
    isWorkflowRunning: boolean;
}

const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-brand-light-gray/50 rounded-md">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-2 text-sm font-semibold text-white">
                <span>{title}</span>
                {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {isOpen && <div className="p-2 border-t border-brand-border">{children}</div>}
        </div>
    );
};

const Sidebar: React.FC<SidebarProps> = (props) => {
    const { onDefineAgent, onClearCanvas, onRunWorkflow, isWorkflowRunning, availableAgents, executionHistory, setExecutionHistory, savedWorkflows, currentWorkflowName, setCurrentWorkflowName, onSave, onLoad, onDelete, onOpenLlmSettings } = props;
    const [searchTerm, setSearchTerm] = useState('');

    const handleDragStart = (e: React.DragEvent, agentConfig: DynamicNodeConfig) => {
        e.dataTransfer.setData('application/json', JSON.stringify(agentConfig));
    };
    
    const filteredAgents = useMemo(() => {
        const grouped: Record<string, DynamicNodeConfig[]> = {};
        availableAgents
            .filter(agent => agent.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .forEach(agent => {
                if (!grouped[agent.category]) {
                    grouped[agent.category] = [];
                }
                grouped[agent.category].push(agent);
            });
        return grouped;
    }, [availableAgents, searchTerm]);

    return (
        <aside className="w-72 bg-brand-gray border-r border-brand-border flex flex-col p-2 space-y-2">
            <div className="flex-shrink-0 grid grid-cols-2 gap-2">
                <button onClick={onDefineAgent} className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5">
                    <PlusIcon className="w-4 h-4" />
                    <span>Define Agent</span>
                </button>
                <button onClick={onRunWorkflow} disabled={isWorkflowRunning} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-medium disabled:opacity-50 flex items-center justify-center gap-1.5">
                    <PlayIcon className="w-4 h-4" />
                    <span>{isWorkflowRunning ? 'Running...' : 'Run'}</span>
                </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pr-1">
                <Accordion title="Agent Library" defaultOpen>
                    <input type="text" placeholder="Search agents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-brand-dark border border-brand-border rounded px-2 py-1 mb-2 text-sm" />
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                        {Object.entries(filteredAgents).map(([category, agents]) => (
                            <div key={category}>
                                <h4 className="text-xs font-bold text-brand-primary mb-1">{category}</h4>
                                <div className="space-y-1">
                                    {agents.map(agent => (
                                        <div key={agent.name} draggable onDragStart={(e) => handleDragStart(e, agent)} className="p-1.5 bg-brand-light-gray rounded cursor-grab text-xs flex items-center gap-1.5">
                                            <span>{typeof agent.icon === 'string' ? agent.icon : React.cloneElement(agent.icon as React.ReactElement<any>, { className: "w-4 h-4" })}</span>
                                            <span>{agent.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Accordion>
                <Accordion title="Workflow Management">
                    <div className="space-y-2">
                        <input type="text" value={currentWorkflowName} onChange={e => setCurrentWorkflowName(e.target.value)} className="w-full bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm"/>
                        <button onClick={onSave} className="w-full text-xs bg-brand-primary hover:bg-brand-accent text-white px-2 py-1 rounded flex items-center justify-center gap-1.5"><ArrowDownTrayIcon className="w-4 h-4"/> Save</button>
                        <div className="space-y-1 max-h-28 overflow-y-auto">
                           {Object.keys(savedWorkflows).map(name => (
                                <div key={name} className="flex items-center justify-between bg-brand-light-gray p-1.5 rounded text-xs">
                                    <span className="truncate">{name}</span>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => onLoad(name)}><ArrowUpTrayIcon className="w-4 h-4"/></button>
                                        <button onClick={() => onDelete(name)}><TrashIcon className="w-4 h-4 text-red-500"/></button>
                                    </div>
                                </div>
                           ))}
                        </div>
                    </div>
                </Accordion>
                <Accordion title="Execution History">
                     <div className="space-y-1 max-h-40 overflow-y-auto text-xs">
                        {executionHistory.map(entry => (
                            <div key={entry.id} className="p-1.5 bg-brand-light-gray rounded">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{entry.nodeName}</span>
                                    <span className={entry.status === 'success' ? 'text-green-400' : 'text-red-400'}>{entry.status}</span>
                                </div>
                                <div className="text-gray-400 text-[10px]">{entry.executionTime}</div>
                            </div>
                        ))}
                     </div>
                </Accordion>
            </div>
            
            <div className="flex-shrink-0 border-t border-brand-border pt-2 space-y-2">
                <button onClick={onOpenLlmSettings} className="w-full text-xs bg-brand-light-gray hover:bg-brand-border text-white px-2 py-1 rounded flex items-center justify-center gap-1.5">
                    <Cog8ToothIcon className="w-4 h-4" /> LLM Settings
                </button>
                <button onClick={onClearCanvas} className="w-full text-xs bg-red-800/50 hover:bg-red-800/80 text-white px-2 py-1 rounded flex items-center justify-center gap-1.5">
                    <TrashIcon className="w-4 h-4" /> Clear Canvas
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;