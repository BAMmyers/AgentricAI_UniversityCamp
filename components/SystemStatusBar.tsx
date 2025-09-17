import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CpuIcon, ArrowPathIcon } from './icons';

const SystemStatusBar: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { systemError } = state;

    if (!systemError) {
        return null;
    }

    const handleReload = () => {
        dispatch({ type: 'CLEAR_SYSTEM_ERROR' });
        window.location.reload();
    };

    return (
        <div className="fixed top-0 left-0 right-0 bg-red-800/90 backdrop-blur-sm border-b-2 border-red-500 text-white p-3 z-[200] flex items-center justify-between animate-fade-in-down">
            <div className="flex items-center gap-3">
                <CpuIcon className="w-6 h-6 text-yellow-300 animate-pulse" />
                <div>
                    <h3 className="font-bold">Bug Agent Alert: System Anomaly Detected</h3>
                    <p className="text-xs text-red-200">An operational error was caught. The agent is standing by to apply corrective actions.</p>
                </div>
            </div>
            <button
                onClick={handleReload}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md flex items-center gap-2 text-sm"
            >
                <ArrowPathIcon className="w-4 h-4" />
                Apply Fix & Reload
            </button>
        </div>
    );
};

export default SystemStatusBar;