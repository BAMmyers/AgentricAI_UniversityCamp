import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserRole, ProposedChanges, Action } from '../types/index';
import { generateCodeModification, startChatStream } from '../services/logicBroker';
import { PaperAirplaneIcon, XMarkIcon, ArrowsPointingOutIcon, SparklesIcon } from './icons';
import { architectureContext } from '../core/architectureContext';
import { frameworkContext } from '../core/frameworkContext';
import { agentOperationsContext } from '../core/agentOperationsContext';
import { languageAndPromptsContext } from '../core/languageAndPromptsContext';
import DiffViewModal from './DiffViewModal';
import { useAppContext } from '../context/AppContext';

interface ChatWidgetProps {
  currentUserRole: UserRole;
}

const getPersonaForRole = (role: UserRole): { instruction: string; greeting: string; title: string } => {
    switch (role) {
        case 'parent':
        case 'teacher':
            return {
                title: 'Platform Guide',
                instruction: "You are a friendly and helpful guide for the AgentricAI University platform. Your audience is parents and teachers. You explain core concepts simply: how to set goals, how companion agents work, and our privacy-first model. Be patient and supportive.",
                greeting: "Hello! I'm your Platform Guide. I can help explain how to set goals for a student, how the companion agents work, or answer questions about our privacy model. How can I assist you today?"
            };
        case 'admin':
            return {
                title: 'Recursive Code Assistant',
                instruction: "You are a specialized AI assistant for the Creator of AgentricAI. Your purpose is to modify the application's source code based on natural language requests. You are equipped with a `code_editor` tool. Always analyze the full codebase context before proposing changes. Adhere to the mandatory confirmation protocol. If you detect a derailment or cannot fulfill a request safely, you must report to the 'Mechanic Agent' for diagnostics.",
                greeting: "Creator access confirmed. I am ready to modify the application's source code based on your directives. How can I assist you?"
            };
        case 'student':
        default:
             return {
                title: 'Student Companion Guide',
                instruction: 'You are a helpful and encouraging guide for students using AgentricAI. Your goal is to explain platform features in a simple, friendly way. You cannot help with homework or assignments, but you can explain how the platform works.',
                greeting: "Hi there! I'm the Student Companion Guide. I can help you understand how your schedule works or tell you more about your Companion Agent. What are you curious about?",
            };
    }
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({ currentUserRole }) => {
    const { state, dispatch } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [proposedChanges, setProposedChanges] = useState<ProposedChanges | null>(null);
    const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const persona = getPersonaForRole(currentUserRole);
    const brokerParams = {
        isPremium: state.currentUser?.subscriptionPlan === 'pro',
        isOnline: !state.isOfflineMode,
        dispatch: dispatch as React.Dispatch<Action>, // Cast for service layer
    };

    useEffect(() => {
        if (isOpen) {
            setMessages([
                {
                    id: '1',
                    sender: 'bot',
                    text: persona.greeting,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } else {
            setMessages([]);
        }
    }, [isOpen, currentUserRole]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        // --- CREATOR CODE PATH (Premium Only) ---
        if (currentUserRole === 'admin') {
            try {
                // Assemble the full context from the new, specialized files.
                const fullCodebaseContext = [
                    architectureContext,
                    frameworkContext,
                    agentOperationsContext,
                    languageAndPromptsContext
                ].join('\n\n');

                const changes = await generateCodeModification(currentInput, fullCodebaseContext, brokerParams);
                if (changes.changes.length === 0) {
                     setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: `Request processed, but no code changes were generated. Reason: ${changes.summary}`, timestamp: new Date().toLocaleTimeString() }]);
                } else {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        sender: 'bot',
                        text: `I have analyzed your request and prepared the following changes.`,
                        timestamp: new Date().toLocaleTimeString(),
                        mode: 'confirmation',
                        proposedChanges: changes,
                    }]);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
                const derailmentMessage = `DERAILMENT DETECTED: An error occurred while generating code modifications. \n\nError: ${errorMessage}\n\nReporting to Mechanic Agent for diagnostics. Please try refining your request.`;
                setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: derailmentMessage, timestamp: new Date().toLocaleTimeString() }]);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // --- STANDARD USER PATH (Freemium) ---
        const botMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: botMessageId,
            sender: 'bot',
            text: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        try {
            const stream = await startChatStream(currentInput, persona.instruction, brokerParams);
            let responseText = '';
            for await (const chunk of stream) {
                // Special character '\f' signals a reset of the message text.
                // This allows the RAG-style agent to show "Thinking..." then replace it.
                if (chunk === '\f') {
                    responseText = '';
                } else {
                    responseText += chunk;
                }
                
                setMessages(prev => prev.map(msg => 
                    msg.id === botMessageId ? { ...msg, text: responseText } : msg
                ));
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.map(msg => 
                msg.id === botMessageId ? { ...msg, text: 'Sorry, I encountered an error.' } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleConfirmChanges = (changes: ProposedChanges) => {
        setProposedChanges(changes);
        setIsDiffModalOpen(true);
    };

    const handleApproveChanges = () => {
        setIsDiffModalOpen(false);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'bot',
            text: `Changes approved. (Simulation: Applying changes to the codebase now.)`,
            timestamp: new Date().toLocaleTimeString()
        }]);
        setProposedChanges(null);
    };


    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-gradient-to-br from-brand-cyan to-brand-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
            >
                <SparklesIcon className="w-8 h-8"/>
            </button>
        );
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-brand-light-gray rounded-xl shadow-2xl flex flex-col border border-brand-border z-50">
                <header className="bg-brand-gray p-3 flex justify-between items-center rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-cyan to-brand-primary rounded-full flex items-center justify-center font-bold text-white text-xs">
                            AI
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">AgentricAI</h3>
                            <p className="text-xs text-brand-text-secondary">{persona.title}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-brand-text-secondary">
                        <button className="hover:text-white"><ArrowsPointingOutIcon className="w-4 h-4" /></button>
                        <button onClick={() => setIsOpen(false)} className="hover:text-white"><XMarkIcon className="w-5 h-5" /></button>
                    </div>
                </header>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-brand-gray text-brand-text rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text || '...'}</p>
                                {msg.mode === 'confirmation' && msg.proposedChanges && (
                                    <div className="mt-2">
                                        <p className="text-sm italic text-brand-text-secondary mb-2">{msg.proposedChanges.summary}</p>
                                        <button
                                            onClick={() => handleConfirmChanges(msg.proposedChanges!)}
                                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
                                        >
                                            View & Confirm Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-brand-text-secondary mt-1">{msg.timestamp}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="p-3 border-t border-brand-border">
                    {brokerParams.isPremium && state.isOfflineMode && (
                        <div className="text-xs text-center text-yellow-300 bg-yellow-900/50 p-2 mb-2 rounded-md">
                            <p><strong>Connection Lost</strong></p>
                            <p>Using basic RAG agent. Responses will be less detailed. We will reconnect you automatically.</p>
                        </div>
                    )}
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-brand-gray border border-brand-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            disabled={isLoading}
                        />
                        <button type="submit" className="p-2 bg-brand-primary rounded-lg text-white disabled:bg-brand-text-secondary" disabled={isLoading}>
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </footer>
            </div>
            <DiffViewModal 
                isOpen={isDiffModalOpen}
                onClose={() => setIsDiffModalOpen(false)}
                onApprove={handleApproveChanges}
                changes={proposedChanges}
            />
        </>
    );
};
