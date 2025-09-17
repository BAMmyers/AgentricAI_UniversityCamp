import React from 'react';
import { DynamicNodeConfig, ExecutionHistoryEntry, LlmServiceConfig, SavedWorkflow, Environment, ExecutionRuntime, AiMode, ContextMemory } from '../../types/index';
import { PlusIcon, PlayIcon, TrashIcon } from '../icons';

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
    llmConfig: LlmServiceConfig;
    onLlmSettingsSave: (config: LlmServiceConfig) => void;
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

const Sidebar: React.FC<SidebarProps> = (props) => {
    // This is a simplified placeholder for the complex sidebar UI.
    // A full implementation would have tabs for each section (Agents, History, etc.).
    const { onDefineAgent, onClearCanvas, onRunWorkflow, isWorkflowRunning, availableAgents } = props;
    
    const handleDragStart = (e: React.DragEvent, agentConfig: DynamicNodeConfig) => {
        e.dataTransfer.setData('application/json', JSON.stringify(agentConfig));
    };

    return (
        <aside className="w-64 bg-brand-gray border-r border-brand-border flex flex-col p-2 space-y-4">
            <div className="flex flex-col space-y-2">
                 <button onClick={onDefineAgent} className="bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1.5">
                    <PlusIcon className="w-4 h-4" />
                    <span>Define New Agent</span>
                </button>
                 <button onClick={onRunWorkflow} disabled={isWorkflowRunning} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium disabled:opacity-50 flex items-center space-x-1.5">
                    <PlayIcon className="w-4 h-4" />
                    <span>{isWorkflowRunning ? 'Running...' : 'Run Workflow'}</span>
                </button>
                <button onClick={onClearCanvas} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center space-x-1.5">
                    <TrashIcon className="w-4 h-4" />
                    <span>Clear Canvas</span>
                </button>
            </div>
            <div className="flex-grow overflow-y-auto">
                <h3 className="text-sm font-bold text-white mb-2">Agents</h3>
                <div className="space-y-2">
                    {availableAgents.map(agent => (
                        <div 
                            key={agent.name}
                            draggable
                            onDragStart={(e) => handleDragStart(e, agent)}
                            className="p-2 bg-brand-light-gray rounded-md cursor-grab text-sm"
                        >
                            {agent.icon} {agent.name}
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
