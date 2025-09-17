import React, { useState } from 'react';
import { ScheduleItem } from '../../../types/index';

interface ActivityProps {
    item: ScheduleItem;
    onClose: () => void;
    onFinish: () => void;
}

const FreePlayActivity: React.FC<ActivityProps> = ({ item, onClose, onFinish }) => {
    const [isLoadingMusic, setIsLoadingMusic] = useState(false);
    
    const handleMusicClick = () => {
        setIsLoadingMusic(true);
        setTimeout(() => setIsLoadingMusic(false), 2500); // Simulate loading music
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-neutral-900 border-4 border-dotted border-neutral-700 rounded-2xl w-full max-w-2xl text-center p-8 flex flex-col items-center gap-6">
                <h1 className="text-4xl font-bold text-cyan-300">Time for Fun!</h1>
                <p className="text-lg text-neutral-300">{item.content}</p>
                 <div className="bg-neutral-800 p-6 rounded-lg w-full">
                    <p className="text-neutral-400 mb-4">If you would like, here is a couple of music choices you can play in the background while you are playing:</p>
                    {isLoadingMusic ? (
                        <div className="flex items-center justify-center gap-3 text-purple-300 h-10">
                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Composing your track...</span>
                        </div>
                    ) : (
                         <div className="flex justify-center gap-4">
                            <button onClick={handleMusicClick} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">Pop</button>
                            <button onClick={handleMusicClick} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">Electronica</button>
                            <button onClick={handleMusicClick} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">Funk</button>
                        </div>
                    )}
                </div>
                <button onClick={onFinish} className="w-full max-w-md mt-4 py-4 bg-green-600 text-white text-2xl font-bold rounded-full hover:bg-green-700 transition-transform hover:scale-105">
                    I'm Finished!
                </button>
            </div>
        </div>
    );
};
export default FreePlayActivity;
