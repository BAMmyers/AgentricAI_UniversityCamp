import React, { useState, useRef, useEffect } from 'react';
// FIX: Explicitly import from types/index.ts to resolve module issue.
import { ChatMessage } from '../types/index';
import { startChatStream } from '../services/geminiService';
import { PaperAirplaneIcon, XMarkIcon, ArrowsPointingOutIcon, SparklesIcon } from './icons';

export const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    sender: 'bot',
                    text: 'Hello, I am your data analytics specialist. I can provide insights on system performance, student analytics, agent status, and much more. What would you like to analyze?',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }
    }, [isOpen, messages.length]);
    
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

        const botMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: botMessageId,
            sender: 'bot',
            text: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        try {
            const stream = await startChatStream(currentInput, 'You are a helpful and concise data analytics specialist for a company called AgentricAI. Provide insights on system performance, student analytics, and agent status. Keep your answers brief and to the point.');
            let responseText = '';
            for await (const chunk of stream) {
                responseText += chunk;
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
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-brand-light-gray rounded-xl shadow-2xl flex flex-col border border-brand-border z-50">
            <header className="bg-brand-gray p-3 flex justify-between items-center rounded-t-xl">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-brand-cyan to-brand-primary rounded-full flex items-center justify-center font-bold text-white text-xs">
                        AI
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">AgentricAI</h3>
                        <p className="text-xs text-brand-text-secondary">Analytics Specialist</p>
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
                        </div>
                        <span className="text-xs text-brand-text-secondary mt-1">{msg.timestamp}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <footer className="p-3 border-t border-brand-border">
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
    );
};