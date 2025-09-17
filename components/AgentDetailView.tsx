import React from 'react';
import { useAppContext } from '../context/AppContext';
import { manifestAgents } from '../core/agentManifest';
import { ArrowUturnLeftIcon, BookOpenIcon, Cog6ToothIcon, CubeTransparentIcon, LightBulbIcon } from './icons';
import { AVAILABLE_TOOLS } from '../core/tools';
import { View } from '../types/index';

interface AgentDetailViewProps {
  setActiveView: (view: View) => void;
}

const DetailSection: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
        <div className="flex items-center text-brand-cyan mb-3">
            {icon}
            <h2 className="ml-2 text-lg font-semibold text-white">{title}</h2>
        </div>
        <div className="text-sm text-brand-text-secondary space-y-2">
            {children}
        </div>
    </div>
);

const AgentDetailView: React.FC<AgentDetailViewProps> = ({ setActiveView }) => {
    const { state } = useAppContext();
    const manifestAgent = manifestAgents.find(a => a.id === state.activeAgentId);
    const dynamicAgent = state.agents.find(a => a.id === state.activeAgentId);

    const agentData = dynamicAgent 
      ? { ...manifestAgent, ...dynamicAgent, role: manifestAgent?.role || dynamicAgent.systemInstruction } 
      : manifestAgent;

    if (!agentData) {
        return (
            <div className="p-6 text-center">
                <p>Agent not found or no agent selected.</p>
                <button onClick={() => setActiveView('agent-roster')} className="mt-4 text-brand-secondary">Return to Roster</button>
            </div>
        );
    }
    
    // Defaulting to 'agent-roster' for the back button for simplicity, as this view is used in multiple portals.
    const backView: View = state.currentUser?.role === 'admin' ? 'agent-roster' : 'student-roster';

    const agentTools = dynamicAgent?.tools || [];

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">{agentData.name}</h1>
                    <p className="text-brand-text-secondary font-mono">{agentData.id}</p>
                </div>
                <button onClick={() => setActiveView(backView)} className="flex items-center gap-2 bg-brand-gray px-4 py-2 rounded-lg hover:bg-brand-light-gray">
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                    <span className="text-sm">Back to Roster</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DetailSection icon={<BookOpenIcon className="w-5 h-5" />} title="System Instruction & Role">
                        <p className="whitespace-pre-wrap leading-relaxed">{agentData.role}</p>
                    </DetailSection>

                    <DetailSection icon={<Cog6ToothIcon className="w-5 h-5" />} title="Equipped Tools">
                        {agentTools.length > 0 ? (
                            <div className="space-y-3">
                                {agentTools.map(toolConfig => {
                                    const toolDef = AVAILABLE_TOOLS.find(t => t.id === toolConfig.toolId);
                                    return (
                                        <div key={toolConfig.toolId} className="p-3 bg-brand-dark rounded-md">
                                            <h3 className="font-semibold text-brand-text">{toolDef?.name || toolConfig.toolId}</h3>
                                            <p className="text-xs text-brand-text-secondary">{toolDef?.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>No tools equipped.</p>
                        )}
                    </DetailSection>
                </div>

                <div className="space-y-6">
                     <DetailSection icon={<LightBulbIcon className="w-5 h-5" />} title="Configuration">
                        <p><strong>Category:</strong> {agentData.category}</p>
                        {dynamicAgent && <>
                            <p><strong>Model:</strong> <span className="font-mono">{dynamicAgent.model}</span></p>
                            <p><strong>Tone:</strong> {dynamicAgent.personality.tone}</p>
                            <p><strong>Creativity:</strong> {dynamicAgent.personality.creativity}</p>
                            <p><strong>Verbosity:</strong> {dynamicAgent.personality.verbosity}</p>
                        </>}
                     </DetailSection>
                     <DetailSection icon={<CubeTransparentIcon className="w-5 h-5" />} title="Core Memory">
                        {dynamicAgent?.coreMemory && dynamicAgent.coreMemory.length > 0 ? (
                           <div className="space-y-2">
                               {dynamicAgent.coreMemory.map(mem => (
                                   <div key={mem.id} className="p-2 bg-brand-dark rounded">
                                       <h4 className="font-semibold text-brand-text">{mem.title}</h4>
                                       <p className="text-xs italic">{mem.content}</p>
                                   </div>
                               ))}
                           </div>
                        ) : (
                            <p>Core memory is empty.</p>
                        )}
                    </DetailSection>
                </div>
            </div>
        </div>
    );
};

export default AgentDetailView;