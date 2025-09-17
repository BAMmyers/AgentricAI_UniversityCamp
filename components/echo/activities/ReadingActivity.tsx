import React from 'react';
import { ScheduleItem } from '../../../types/index';

interface ActivityProps {
    item: ScheduleItem;
    onClose: () => void;
    onFinish: () => void;
}

const ReadingActivity: React.FC<ActivityProps> = ({ item, onClose, onFinish }) => {
    const handleReadAloud = () => {
        if ('speechSynthesis' in window && item.content) {
            // Cancel any previous speech
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(item.content);
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech is not supported in your browser.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-neutral-900 border-4 border-dotted border-neutral-700 rounded-2xl w-full max-w-2xl text-center p-8 flex flex-col items-center gap-6">
                <h1 className="text-4xl font-bold text-cyan-300">{item.title}</h1>
                <div className="bg-neutral-800 p-6 rounded-lg max-h-60 overflow-y-auto w-full">
                    <p className="text-lg text-neutral-200 leading-relaxed whitespace-pre-wrap">{item.content || "Loading story..."}</p>
                </div>
                <button onClick={handleReadAloud} className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors">
                    Read Aloud 🔊
                </button>
                <button onClick={onFinish} className="w-full max-w-md mt-4 py-4 bg-green-600 text-white text-2xl font-bold rounded-full hover:bg-green-700 transition-transform hover:scale-105">
                    I'm Finished!
                </button>
            </div>
        </div>
    );
};
export default ReadingActivity;
