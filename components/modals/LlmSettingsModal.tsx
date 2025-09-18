import React, { useState, useEffect } from 'react';
import { LlmServiceConfig } from '../../types/index';
import { XMarkIcon, Cog8ToothIcon } from '../icons';

interface LlmSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: LlmServiceConfig) => void;
    initialConfig: LlmServiceConfig;
}

const LlmSettingsModal: React.FC<LlmSettingsModalProps> = ({ isOpen, onClose, onSave, initialConfig }) => {
    const [config, setConfig] = useState<LlmServiceConfig>(initialConfig);
    const [activeTab, setActiveTab] = useState<'gemini' | 'openai'>(initialConfig.service);

    useEffect(() => {
        setConfig(initialConfig);
        setActiveTab(initialConfig.service);
    }, [initialConfig, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({ ...config, service: activeTab });
    };

    const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; type?: string }> = ({ label, value, onChange, placeholder, type = 'text' }) => (
        <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-brand-dark border border-brand-border rounded-md p-2 text-sm text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
        </div>
    );
    
    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
            <div className="bg-brand-gray border border-brand-border rounded-xl w-full max-w-md">
                <header className="flex justify-between items-center p-4 border-b border-brand-border">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2"><Cog8ToothIcon className="w-5 h-5 text-brand-cyan"/> LLM Service Configuration</h2>
                    <button onClick={onClose} className="text-brand-text-secondary hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </header>
                <main className="p-4">
                    <div className="flex border-b border-brand-border mb-4">
                        <button onClick={() => setActiveTab('gemini')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'gemini' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>
                            Gemini (Cloud)
                        </button>
                        <button onClick={() => setActiveTab('openai')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'openai' ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-secondary'}`}>
                            Local LLM (Ollama)
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        {activeTab === 'gemini' ? (
                             <div className="animate-fade-in">
                                <InputField label="Gemini API Key" value={config.apiKey || ''} onChange={e => setConfig({...config, apiKey: e.target.value})} placeholder="Enter your Google AI API Key" type="password" />
                                <p className="text-xs text-brand-text-secondary mt-2">Your API key is stored securely in your browser's local database and never leaves your machine.</p>
                             </div>
                        ) : (
                             <div className="animate-fade-in">
                                <InputField label="Ollama Host URL" value={config.ollamaHost || ''} onChange={e => setConfig({...config, ollamaHost: e.target.value})} placeholder="e.g., http://localhost:11434" />
                                <InputField label="Ollama Model Name" value={config.ollamaModel || ''} onChange={e => setConfig({...config, ollamaModel: e.target.value})} placeholder="e.g., gemma:latest" />
                                <p className="text-xs text-brand-text-secondary mt-2">Ensure your local Ollama server is running and accessible at the specified host.</p>
                             </div>
                        )}
                    </div>
                </main>
                <footer className="p-4 border-t border-brand-border flex justify-end gap-2">
                    <button onClick={onClose} className="bg-brand-light-gray hover:bg-brand-border text-white px-4 py-2 rounded-md text-sm font-semibold">Cancel</button>
                    <button onClick={handleSave} className="bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded-md text-sm font-semibold">Save Settings</button>
                </footer>
            </div>
        </div>
    );
};

export default LlmSettingsModal;