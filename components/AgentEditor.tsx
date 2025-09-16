import React, { useState, useEffect, useRef } from 'react';
import { 
    PlusIcon, BellIcon, VariableIcon, Squares2X2Icon, PlusCircleIcon,
    ArrowUpOnSquareIcon, UserCircleIcon, InformationCircleIcon,
    IdentificationIcon, LightBulbIcon, DocumentMagnifyingGlassIcon,
    ArrowPathIcon, CommandLineIcon, BookOpenIcon, GlobeAltIcon, PaperAirplaneIcon, BeakerIcon, XMarkIcon, Cog6ToothIcon
} from './icons';
import { useAppContext } from '../context/AppContext';
import { Agent, ChatMessage, ToolConfig } from '../types/index';
import { startChatStream } from '../services/geminiService';
import { View } from '../App';
import { AVAILABLE_TOOLS } from '../core/tools';

const SectionHeader: React.FC<{ title: string; children?: React.ReactNode; }> = ({ title, children }) => (
    <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold uppercase text-brand-text-secondary tracking-wider">{title}</h3>
        {children}
    </div>
);

const FormField: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div className="mb-4">
        <label className="text-sm text-brand-text-secondary block mb-1">{label}</label>
        {children}
    </div>
);

const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  const formatText = (text: string) => {
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-brand-secondary">$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
    return { __html: formattedText };
  };

  return <div className="p-2 text-xs bg-brand-light-gray border border-brand-border rounded-md prose prose-sm prose-invert h-[192px] whitespace-pre-wrap" dangerouslySetInnerHTML={formatText(content)} />;
};

interface AgentEditorProps {
    setActiveView: (view: View) => void;
}

const AgentEditor: React.FC<AgentEditorProps> = ({ setActiveView }) => {
    const { state, dispatch } = useAppContext();
    const activeAgent = state.agents.find(a => a.id === state.activeAgentId);
    
    const [agentData, setAgentData] = useState<Partial<Agent>>(activeAgent || { model: 'gemini-2.5-flash', name: 'New Agent', tools: [], coreMemory: [] });
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);
    const [instructionMode, setInstructionMode] = useState<'edit' | 'preview'>('edit');
    const [expandedTool, setExpandedTool] = useState<string | null>(null);
    const toolSelectorRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const agentToLoad = activeAgent || { 
            model: 'gemini-2.5-flash', 
            name: 'New Agent', 
            id: `agent-${Date.now()}`,
            tools: [],
            coreMemory: [],
            systemInstruction: '',
            identity: '',
        };
        setAgentData(agentToLoad);
        setChatMessages([]);
    }, [state.activeAgentId, activeAgent]);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (toolSelectorRef.current && !toolSelectorRef.current.contains(event.target as Node)) {
                setIsToolSelectorOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [toolSelectorRef]);


    const handleSave = () => {
        if (agentData.id && agentData.name) {
            const actionType = state.agents.some(a => a.id === agentData.id) ? 'UPDATE_AGENT' : 'ADD_AGENT';
            dispatch({ type: actionType, payload: agentData as Agent });
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'Agent saved successfully!', type: 'success' } });
        }
    };
    
    const handleChatSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isLoadingChat || !agentData.systemInstruction) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput, timestamp: new Date().toLocaleTimeString() };
        setChatMessages(prev => [...prev, userMessage]);
        const currentInput = chatInput;
        setChatInput('');
        setIsLoadingChat(true);

        const botMessageId = (Date.now() + 1).toString();
        setChatMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: '', timestamp: new Date().toLocaleTimeString() }]);

        try {
            const stream = await startChatStream(currentInput, agentData.systemInstruction, agentData.id);
            let responseText = '';
            for await (const chunk of stream) {
                responseText += chunk;
                setChatMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: responseText } : msg));
            }
        } catch (error) {
            console.error(error);
            setChatMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: 'An error occurred.' } : msg));
        } finally {
            setIsLoadingChat(false);
        }
    };
    
    const handleAddTool = (toolId: string) => {
        const existingTools = agentData.tools || [];
        if (!existingTools.some(t => t.toolId === toolId)) {
            const toolDef = AVAILABLE_TOOLS.find(t => t.id === toolId);
            const defaultSettings = (toolDef?.settings || []).reduce((acc, setting) => {
                acc[setting.key] = setting.defaultValue;
                return acc;
            }, {} as Record<string, any>);
            
            const newTool: ToolConfig = { toolId, settings: defaultSettings };
            setAgentData({ ...agentData, tools: [...existingTools, newTool] });
        }
        setIsToolSelectorOpen(false);
    };

    const handleRemoveTool = (toolId: string) => {
        setAgentData({ ...agentData, tools: (agentData.tools || []).filter(t => t.toolId !== toolId) });
    };
    
    const handleToolSettingChange = (toolId: string, settingKey: string, value: string | number | boolean) => {
        setAgentData(prev => ({
            ...prev,
            tools: (prev.tools || []).map(tool => 
                tool.toolId === toolId 
                    ? { ...tool, settings: { ...tool.settings, [settingKey]: value } }
                    : tool
            )
        }));
    };

    if (!agentData) {
        return <div className="p-4">No Agent Selected or New Agent not Initialized.</div>
    }
    
    const availableToolsToAdd = AVAILABLE_TOOLS.filter(tool => !(agentData.tools || []).some(t => t.toolId === tool.id));

    return (
        <div className="flex flex-col h-full bg-brand-dark text-brand-text">
          <header className="flex-shrink-0 bg-brand-gray border-b border-brand-border px-4 py-2 flex justify-between items-center">
            <h1 className="text-lg font-bold text-white">{agentData.name || 'New Agent'}</h1>
            <div className="flex items-center gap-4">
                <button onClick={handleSave} className="bg-brand-primary hover:bg-brand-accent text-white px-3 py-1 rounded-md text-sm">Save Agent</button>
            </div>
          </header>
          
          <div className="flex-1 flex overflow-hidden">
            <aside className="w-[350px] bg-brand-gray border-r border-brand-border p-4 flex flex-col overflow-y-auto">
                <SectionHeader title="Agent Settings" />
                <FormField label="Name">
                    <input type="text" value={agentData.name || ''} onChange={e => setAgentData({...agentData, name: e.target.value})} className="w-full bg-brand-light-gray border border-brand-border rounded-md px-2 py-1.5 text-sm" />
                </FormField>
                <FormField label="Identity">
                    <input type="text" value={agentData.identity || ''} onChange={e => setAgentData({...agentData, identity: e.target.value})} className="w-full bg-brand-light-gray border border-brand-border rounded-md px-2 py-1.5 text-sm" />
                </FormField>
                <FormField label="Model">
                    <select value={agentData.model} onChange={e => setAgentData({...agentData, model: e.target.value})} className="w-full bg-brand-light-gray border border-brand-border rounded-md px-2 py-1.5 text-sm appearance-none">
                        <option>gemini-2.5-flash</option>
                    </select>
                </FormField>
                <div className="border-t border-brand-border my-4"></div>
                <SectionHeader title="Reasoning" />
                 <div>
                    <div className="flex border-b border-brand-border text-sm mb-2">
                        <button onClick={() => setInstructionMode('edit')} className={`px-3 py-1 ${instructionMode === 'edit' ? 'text-white border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>Edit</button>
                        <button onClick={() => setInstructionMode('preview')} className={`px-3 py-1 ${instructionMode === 'preview' ? 'text-white border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>Preview</button>
                    </div>
                     {instructionMode === 'edit' ? (
                        <textarea value={agentData.systemInstruction || ''} onChange={e => setAgentData({...agentData, systemInstruction: e.target.value})} rows={8} className="w-full bg-brand-light-gray border border-brand-border rounded-md p-2 text-xs resize-none" />
                     ) : (
                        <MarkdownPreview content={agentData.systemInstruction || ''} />
                     )}
                </div>
            </aside>

            <main className="flex-1 flex flex-col bg-brand-dark">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {chatMessages.map(msg => (
                         <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-brand-light-gray flex items-center justify-center font-bold text-sm flex-shrink-0">{agentData?.identity?.charAt(0) || 'A'}</div>}
                            <div className={`max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-brand-gray text-brand-text rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text || '...'}</p>
                            </div>
                         </div>
                    ))}
                </div>
                <div className="p-4 border-t border-brand-border bg-brand-dark">
                    <form onSubmit={handleChatSend} className="relative">
                        <textarea placeholder="Test your agent..." rows={2} value={chatInput} onChange={e => setChatInput(e.target.value)} className="w-full bg-brand-light-gray border border-brand-border rounded-md p-2 pr-12 text-sm resize-none"></textarea>
                        <button type="submit" disabled={isLoadingChat} className="absolute right-2 bottom-2 p-2 bg-brand-primary rounded-md text-white disabled:bg-brand-text-secondary">
                           <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </main>

            <aside className="w-[350px] bg-brand-gray border-l border-brand-border p-4 flex flex-col overflow-y-auto">
                <SectionHeader title="Context Window" />
                <div className="relative mb-4">
                    <div className="w-full bg-brand-dark rounded-full h-2.5"><div className="bg-brand-primary h-2.5 rounded-full" style={{width: "15%"}}></div></div>
                    <div className="text-xs text-center text-brand-text-secondary mt-1">Estimated tokens</div>
                </div>
                <div className="border-t border-brand-border my-4"></div>
                <SectionHeader title="Core Memory" />
                 <p className="text-xs text-brand-text-secondary mb-4 flex items-center gap-2">
                    <InformationCircleIcon className="w-4 h-4"/>
                    <span>Memory is not yet implemented.</span>
                </p>
                <div className="border-t border-brand-border my-4"></div>
                <SectionHeader title="Tools">
                    <div className="relative" ref={toolSelectorRef}>
                         <button onClick={() => setIsToolSelectorOpen(!isToolSelectorOpen)} className="flex items-center gap-1 text-xs text-brand-secondary hover:text-white"><PlusCircleIcon className="w-4 h-4" /> Add Tool</button>
                         {isToolSelectorOpen && (
                            <div className="absolute right-0 mt-2 w-60 bg-brand-light-gray border border-brand-border rounded-md shadow-lg z-10">
                                {availableToolsToAdd.length > 0 ? (
                                    <ul>
                                        {availableToolsToAdd.map(tool => (
                                            <li key={tool.id} onClick={() => handleAddTool(tool.id)} className="flex items-center gap-3 p-2 text-sm hover:bg-brand-accent cursor-pointer">
                                                <span className="text-brand-text-secondary">{tool.icon}</span>
                                                <span>{tool.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="p-2 text-sm text-brand-text-secondary">No more tools to add.</p>
                                )}
                            </div>
                         )}
                    </div>
                </SectionHeader>
                 <div className="space-y-2 mt-2">
                    {(agentData.tools || []).map(toolConfig => {
                        const toolDef = AVAILABLE_TOOLS.find(t => t.id === toolConfig.toolId);
                        if (!toolDef) return null;
                        return (
                             <div key={toolConfig.toolId} className="rounded-md bg-brand-dark border border-brand-border">
                                <div className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-brand-text-secondary">{toolDef.icon}</span>
                                        <span className="text-sm">{toolDef.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {toolDef.settings && toolDef.settings.length > 0 && (
                                            <button onClick={() => setExpandedTool(expandedTool === toolDef.id ? null : toolDef.id)} className="text-brand-text-secondary hover:text-white">
                                                <Cog6ToothIcon className={`w-4 h-4 transition-transform ${expandedTool === toolDef.id ? 'rotate-90' : ''}`} />
                                            </button>
                                        )}
                                        <button onClick={() => handleRemoveTool(toolDef.id)} className="text-red-500 hover:text-red-400">
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                {expandedTool === toolDef.id && toolDef.settings && (
                                    <div className="p-3 border-t border-brand-border space-y-3">
                                        {toolDef.settings.map(setting => (
                                            <div key={setting.key}>
                                                <label className="text-xs text-brand-text-secondary block mb-1">{setting.label}</label>
                                                <input
                                                    type={setting.type}
                                                    value={toolConfig.settings[setting.key] ?? setting.defaultValue}
                                                    onChange={e => handleToolSettingChange(toolDef.id, setting.key, setting.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                                                    className="w-full bg-brand-light-gray border border-brand-border rounded-md px-2 py-1 text-xs"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                 </div>
            </aside>
          </div>
        </div>
    );
};

export default AgentEditor;
