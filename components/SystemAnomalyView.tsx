import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CpuIcon, ArrowPathIcon, ChevronDownIcon, ChevronUpIcon } from './icons';

const SystemAnomalyView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { systemError } = state;
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    if (!systemError) {
        return null;
    }

    const handleReload = () => {
        dispatch({ type: 'CLEAR_SYSTEM_ERROR' });
        window.location.reload();
    };
    
    const errorName = systemError.error.name || 'Error';
    const errorMessage = systemError.error.message || 'An unknown error occurred.';
    const componentStack = systemError.errorInfo?.componentStack || 'No component stack available.';

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
            <div className="w-full max-w-2xl bg-brand-light-gray rounded-xl shadow-2xl border-2 border-red-500/50 flex flex-col animate-fade-in">
                <header className="p-4 bg-red-900/50 rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <CpuIcon className="w-8 h-8 text-yellow-300 animate-pulse" />
                        <div>
                            <h1 className="text-xl font-bold text-white">Bug Agent Alert: System Anomaly Intercepted</h1>
                            <p className="text-sm text-red-200">A critical error was caught, preventing an application crash.</p>
                        </div>
                    </div>
                </header>

                <main className="p-6 space-y-4">
                    <p className="text-brand-text-secondary">
                        The application encountered an unexpected state. The <strong className="text-white">Bug Agent</strong> has contained the issue, and the <strong className="text-white">Mechanic Agent</strong> is standing by to apply corrective actions and restore the system.
                    </p>
                    <div className="p-3 bg-brand-dark rounded-md border border-brand-border">
                        <p className="font-mono text-sm text-red-400">
                           <strong>{errorName}:</strong> {errorMessage}
                        </p>
                    </div>

                    <div>
                        <button 
                            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                            className="text-xs text-brand-text-secondary hover:text-white flex items-center gap-1"
                        >
                            {isDetailsOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                            Show Technical Details
                        </button>
                        {isDetailsOpen && (
                            <pre className="mt-2 p-3 bg-brand-dark rounded-md border border-brand-border text-xs text-gray-400 max-h-48 overflow-auto font-mono">
                                {componentStack}
                            </pre>
                        )}
                    </div>
                </main>

                <footer className="p-4 bg-brand-gray rounded-b-xl border-t border-brand-border">
                     <button
                        onClick={handleReload}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 text-sm"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        Deploy Fix & Reload Application
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default SystemAnomalyView;