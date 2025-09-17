import React, { useState } from 'react';
import { SparklesIcon, XMarkIcon } from '../icons';

interface DefineNodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDefine: (description: string) => Promise<{ success: boolean; error?: string }>;
    isSandbox: boolean;
}

const DefineNodeModal: React.FC<DefineNodeModalProps> = ({ isOpen, onClose, onDefine, isSandbox }) => {
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!description.trim()) return;
        setIsLoading(true);
        setError(null);
        const result = await onDefine(description);
        setIsLoading(false);
        if (result.success) {
            onClose();
        } else {
            setError(result.error || "An unknown error occurred.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
            <div className="bg-brand-gray border border-brand-border rounded-xl w-full max-w-lg">
                <header className="flex justify-between items-center p-4 border-b border-brand-border">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-brand-cyan"/> Define New Agent</h2>
                    <button onClick={onClose} className="text-brand-text-secondary hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </header>
                <main className="p-4">
                    <p className="text-sm text-brand-text-secondary mb-2">Describe the agent you want to create in plain English.</p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., An agent that takes a topic and generates three multiple-choice quiz questions about it."
                        rows={4}
                        className="w-full bg-brand-dark border border-brand-border rounded-md p-2 text-sm"
                    />
                     {isSandbox && <p className="text-xs text-yellow-400 mt-2">Sandbox Mode: This agent will be reviewed by The Gatekeeper before it can be used in the main studio.</p>}
                     {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
                </main>
                <footer className="p-4 border-t border-brand-border flex justify-end">
                    <button onClick={handleSubmit} disabled={isLoading} className="bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded-md text-sm font-semibold disabled:bg-brand-text-secondary">
                        {isLoading ? 'Defining...' : 'Create Agent'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default DefineNodeModal;
