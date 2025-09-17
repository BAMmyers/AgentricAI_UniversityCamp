import React from 'react';
import { ScheduleItem } from '../../../types/index';

interface CompletionModalProps {
    item: ScheduleItem;
    onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ item, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-neutral-900 border-4 border-dotted border-neutral-700 rounded-2xl w-full max-w-lg text-center p-8 flex flex-col items-center gap-6">
                <img src="https://www.gstatic.com/gemini/images/party_popper.svg" alt="Celebrate" className="w-24 h-24" />
                <h1 className="text-4xl font-bold text-green-300">Task Complete!</h1>
                <p className="text-lg text-neutral-300">
                    Great job completing {item.title}! I bet you explored some amazing stories or learned something new.
                </p>
                <button onClick={onClose} className="mt-4 px-10 py-3 bg-cyan-600 text-white text-xl font-bold rounded-full hover:bg-cyan-700 transition-transform hover:scale-105">
                    Continue
                </button>
            </div>
        </div>
    );
};

export default CompletionModal;
