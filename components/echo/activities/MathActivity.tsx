import React, { useState } from 'react';
import { ScheduleItem } from '../../../types/index';

interface ActivityProps {
    item: ScheduleItem;
    onClose: () => void;
    onFinish: () => void;
}

const MathActivity: React.FC<ActivityProps> = ({ item, onClose, onFinish }) => {
    const [showAnswer, setShowAnswer] = useState(false);
    // A simple regex to find numbers in the question.
    const numbers = item.content?.match(/\d+/g)?.map(Number);
    const answer = numbers ? numbers.reduce((a: number, b: number) => a + b, 0) : '...';

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-neutral-900 border-4 border-dotted border-neutral-700 rounded-2xl w-full max-w-2xl text-center p-8 flex flex-col items-center gap-6">
                <h1 className="text-4xl font-bold text-cyan-300">Counting Stars!</h1>
                 <div className="bg-neutral-800 p-6 rounded-lg">
                    <p className="text-xl text-neutral-200">{item.content}</p>
                </div>
                
                {showAnswer ? (
                     <div className="p-4 bg-green-800 rounded-lg text-4xl font-bold text-white animate-fade-in">
                        {answer}
                    </div>
                ) : (
                    <button onClick={() => setShowAnswer(true)} className="px-8 py-3 bg-neutral-700 text-white text-xl rounded-lg font-semibold hover:bg-neutral-600 transition-colors">
                        Answer
                    </button>
                )}
               
                <button onClick={onFinish} className="w-full max-w-md mt-4 py-4 bg-green-600 text-white text-2xl font-bold rounded-full hover:bg-green-700 transition-transform hover:scale-105">
                    I'm Finished!
                </button>
            </div>
        </div>
    );
};
export default MathActivity;
