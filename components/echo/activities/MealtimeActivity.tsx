import React from 'react';
import { ScheduleItem } from '../../../types/index';
import { FaAppleAlt } from 'react-icons/fa';

interface ActivityProps {
    item: ScheduleItem;
    onClose: () => void;
    onFinish: () => void;
}

const MealtimeActivity: React.FC<ActivityProps> = ({ item, onClose, onFinish }) => {
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-neutral-900 border-4 border-dotted border-neutral-700 rounded-2xl w-full max-w-lg text-center p-8 flex flex-col items-center gap-6">
                <div className="text-7xl text-red-400"><FaAppleAlt /></div>
                <h1 className="text-4xl font-bold text-red-300">Mealtime</h1>
                <p className="text-lg text-neutral-300">{item.content}</p>
                <button onClick={onFinish} className="w-full max-w-md mt-4 py-4 bg-green-600 text-white text-2xl font-bold rounded-full hover:bg-green-700 transition-transform hover:scale-105">
                    I'm Finished!
                </button>
            </div>
        </div>
    );
};
export default MealtimeActivity;
