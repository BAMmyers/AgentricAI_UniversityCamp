import React, { useState } from 'react';
import { BoltIcon, TrashIcon, CpuIcon, BeakerIcon, ArrowPathIcon, ShieldCheckIcon } from './icons';
import { useAppContext } from '../context/AppContext';

const ControlCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-sm text-brand-text-secondary mt-1 mb-6">{description}</p>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-brand-text">{label}</span>
        <button onClick={() => setEnabled(!enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-brand-primary' : 'bg-brand-dark'}`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const SystemOptimizationView: React.FC = () => {
    const { dispatch } = useAppContext();
    const [predictiveLoading, setPredictiveLoading] = useState(true);
    const [responseStreaming, setResponseStreaming] = useState(true);
    const [renderFrequency, setRenderFrequency] = useState('high');
    const [diagnosticsStatus, setDiagnosticsStatus] = useState<'idle' | 'running' | 'complete'>('idle');
    const [scanStatus, setScanStatus] = useState<'idle' | 'running' | 'complete'>('idle');

    const handleClearCache = () => {
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'LLM and data caches have been purged.', type: 'success' } });
    };

    const handlePrefetch = () => {
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'Prefetching core models initiated.', type: 'info' } });
    };

    const runDiagnostics = () => {
        setDiagnosticsStatus('running');
        setTimeout(() => {
            setDiagnosticsStatus('complete');
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'System diagnostics complete. All systems nominal.', type: 'success' } });
        }, 3000);
    };
    
    const runIntegrityScan = () => {
        setScanStatus('running');
        dispatch({ type: 'LOG_SECURITY_EVENT', payload: { type: 'INTEGRITY_SCAN_STARTED', details: 'Medic Agent initiated system-wide integrity scan.' } });
        setTimeout(() => {
            setScanStatus('complete');
            dispatch({ type: 'LOG_SECURITY_EVENT', payload: { type: 'INTEGRITY_SCAN_COMPLETED', details: 'Medic Agent scan complete. No vulnerabilities found. 2 "vaccine" patches applied.' } });
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'System Integrity Scan Complete.', type: 'success' } });
        }, 4000);
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <BoltIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">System Optimization & Performance</h1>
                    <p className="text-brand-text-secondary">Fine-tune system parameters and manage resources for optimal performance.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Performance Tuning */}
                <ControlCard
                    title="Performance Tuning"
                    description="Adjust real-time performance settings. Changes are applied immediately."
                >
                    <ToggleSwitch label="Enable Predictive Loading" enabled={predictiveLoading} setEnabled={setPredictiveLoading} />
                    <ToggleSwitch label="Agent Response Streaming" enabled={responseStreaming} setEnabled={setResponseStreaming} />
                    <div>
                        <label className="text-sm text-brand-text block mb-2">UI Render Frequency</label>
                        <select
                            value={renderFrequency}
                            onChange={(e) => setRenderFrequency(e.target.value)}
                            className="w-full bg-brand-light-gray border border-brand-border rounded-md px-3 py-2 text-sm"
                        >
                            <option value="high">High (Fluid)</option>
                            <option value="medium">Medium (Balanced)</option>
                            <option value="low">Low (Resource Saver)</option>
                        </select>
                    </div>
                </ControlCard>

                {/* System Integrity & Security */}
                <ControlCard
                    title="System Integrity & Security"
                    description="Deploy maintenance agents to scan for vulnerabilities and ensure code integrity."
                >
                    <button
                        onClick={runIntegrityScan}
                        disabled={scanStatus === 'running'}
                        className="w-full bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 font-bold py-3 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                         {scanStatus === 'running' ? (
                            <>
                                <CpuIcon className="w-5 h-5 animate-spin" />
                                <span>Medic Agent Scanning...</span>
                            </>
                        ) : (
                             <>
                                <ShieldCheckIcon className="w-5 h-5" />
                                <span>Run Integrity Scan</span>
                             </>
                        )}
                    </button>
                    <div className="text-sm p-3 bg-brand-dark rounded-md h-32 overflow-y-auto font-mono text-xs">
                         <p className="text-brand-text-secondary">&gt; Medic Agent standing by...</p>
                         <p className="text-brand-text-secondary">&gt; Mechanic Agent on alert for repairs.</p>
                         {scanStatus === 'running' && <p className="text-yellow-400 animate-pulse">&gt; Scanning for known vulnerabilities...</p>}
                         {scanStatus === 'complete' && 
                            <>
                                <p className="text-green-400">&gt; Scan complete. 0 critical threats found.</p>
                                <p className="text-yellow-400">&gt; Identified 2 minor code integrity issues.</p>
                                <p className="text-cyan-400">&gt; Mechanic Agent dispatched to apply "vaccine" patches.</p>
                                <p className="text-green-400">&gt; Patches applied successfully.</p>
                                <p className="text-brand-text-secondary">&gt; System secure. Returning to standby.</p>
                            </>
                        }
                    </div>
                </ControlCard>
                
                {/* System Diagnostics */}
                <ControlCard
                    title="System Diagnostics"
                    description="Run a full system check to ensure all agents and services are operational."
                >
                    <button
                        onClick={runDiagnostics}
                        disabled={diagnosticsStatus === 'running'}
                        className="w-full bg-brand-primary hover:bg-brand-accent text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {diagnosticsStatus === 'running' ? (
                            <>
                                <CpuIcon className="w-5 h-5 animate-spin" />
                                <span>Running Diagnostics...</span>
                            </>
                        ) : (
                             <>
                                <BeakerIcon className="w-5 h-5" />
                                <span>Run System Diagnostics</span>
                             </>
                        )}
                    </button>
                    <div className="text-sm p-3 bg-brand-dark rounded-md h-32 overflow-y-auto font-mono text-xs">
                        <p className="text-brand-text-secondary">&gt; Initiating diagnostics...</p>
                        <p className="text-brand-text-secondary">&gt; Reviewing logs from Bug Agent...</p>
                        {diagnosticsStatus === 'running' && <p className="text-yellow-400 animate-pulse">&gt; Checking agent integrity...</p>}
                        {diagnosticsStatus === 'complete' && 
                            <>
                                <p className="text-green-400">&gt; Agent integrity check: PASSED</p>
                                <p className="text-green-400">&gt; Gateway connection: STABLE</p>
                                <p className="text-green-400">&gt; API latency: 45ms (NOMINAL)</p>
                                <p className="text-green-400">&gt; All systems nominal.</p>
                            </>
                        }
                    </div>
                </ControlCard>
            </div>
        </div>
    );
};

export default SystemOptimizationView;
