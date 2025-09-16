import React, { useState, useEffect } from 'react';
import { ServerStackIcon, ShieldCheckIcon, SignalIcon, CpuIcon } from './icons';

interface LogEntry {
  id: number;
  timestamp: string;
  direction: 'IN' | 'OUT';
  source: string;
  destination: string;
  status: 'Success' | 'Denied';
  details: string;
}

const sources = ['Studio (WF-1)', 'Chat Widget', 'Core OS (Mission)', 'Agent Editor'];
const destinations = ['Gemini API', 'Internal Cache', 'AgentricAI API'];
const details = ['Text Generation', 'Data Retrieval', 'Agent Coordination', 'Tool Execution'];

const generateRandomLog = (id: number): LogEntry => ({
  id,
  timestamp: new Date().toLocaleTimeString(),
  direction: Math.random() > 0.5 ? 'IN' : 'OUT',
  source: sources[Math.floor(Math.random() * sources.length)],
  destination: destinations[Math.floor(Math.random() * destinations.length)],
  status: Math.random() > 0.1 ? 'Success' : 'Denied',
  details: details[Math.floor(Math.random() * details.length)],
});


const StatCard: React.FC<{ title: string; value: string | React.ReactNode; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
      <div className="flex justify-between items-start text-brand-text-secondary">
        <span className="text-sm font-medium">{title}</span>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-semibold text-brand-text">{value}</div>
    </div>
);


const GatewayView: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isEncrypted, setIsEncrypted] = useState(true);
    const [isIdsActive, setIsIdsActive] = useState(true);

    useEffect(() => {
        const initialLogs = Array.from({ length: 5 }, (_, i) => generateRandomLog(i));
        setLogs(initialLogs);

        const interval = setInterval(() => {
            setLogs(prevLogs => {
                const newLog = generateRandomLog(prevLogs.length > 0 ? prevLogs[0].id + 1 : 1);
                const updatedLogs = [newLog, ...prevLogs];
                if (updatedLogs.length > 100) {
                    updatedLogs.pop();
                }
                return updatedLogs;
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <ServerStackIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Gateway Console</h1>
                    <p className="text-brand-text-secondary">Manage and monitor the secure proxy for all AgentricAI services.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                 <StatCard 
                    title="Connection Status" 
                    value={<span className="text-green-400">Connected</span>}
                    icon={<SignalIcon className="w-6 h-6" />} 
                />
                <StatCard title="Uptime" value="99.98%" icon={<ShieldCheckIcon className="w-6 h-6" />} />
                <StatCard title="Avg. Latency" value="45ms" icon={<SignalIcon className="w-6 h-6" />} />
                <StatCard title="CPU Load" value="15%" icon={<CpuIcon className="w-6 h-6" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Log */}
                <div className="lg:col-span-2 bg-brand-gray border border-brand-border rounded-lg p-4 flex flex-col">
                    <h2 className="text-lg font-semibold text-white mb-3">Live Traffic Log</h2>
                    <div className="flex-grow overflow-y-auto h-96 font-mono text-xs pr-2">
                        <div className="grid grid-cols-6 gap-2 text-brand-text-secondary sticky top-0 bg-brand-gray pb-2">
                            <div>Timestamp</div>
                            <div>Direction</div>
                            <div>Source</div>
                            <div>Destination</div>
                            <div>Status</div>
                            <div className="col-span-2">Details</div>
                        </div>
                        <div className="space-y-1">
                            {logs.map(log => (
                                <div key={log.id} className="grid grid-cols-6 gap-2 p-1 rounded bg-brand-dark/50 animate-fade-in">
                                    <div className="text-brand-text-secondary">{log.timestamp}</div>
                                    <div>
                                        <span className={`px-1.5 py-0.5 rounded text-white text-[10px] ${log.direction === 'IN' ? 'bg-blue-600' : 'bg-purple-600'}`}>{log.direction}</span>
                                    </div>
                                    <div>{log.source}</div>
                                    <div>{log.destination}</div>
                                    <div>
                                        <span className={log.status === 'Success' ? 'text-green-400' : 'text-red-400'}>{log.status}</span>
                                    </div>
                                    <div className="col-span-2 text-brand-text-secondary truncate">{log.details}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Security & Settings */}
                <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
                     <h2 className="text-lg font-semibold text-white mb-4">Security Configuration</h2>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-brand-light-gray rounded-lg">
                            <div>
                                <h3 className="font-semibold text-white">End-to-End Encryption</h3>
                                <p className="text-xs text-brand-text-secondary">Enforce TLS 1.3+ on all connections.</p>
                            </div>
                            <button onClick={() => setIsEncrypted(!isEncrypted)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isEncrypted ? 'bg-brand-primary' : 'bg-brand-dark'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isEncrypted ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-brand-light-gray rounded-lg">
                            <div>
                                <h3 className="font-semibold text-white">Intrusion Detection (IDS)</h3>
                                <p className="text-xs text-brand-text-secondary">Monitor for malicious patterns.</p>
                            </div>
                             <button onClick={() => setIsIdsActive(!isIdsActive)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isIdsActive ? 'bg-brand-primary' : 'bg-brand-dark'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isIdsActive ? 'translate-x-6' : 'translate-x-1'}`}/>
                            </button>
                        </div>
                         <div className="p-3 bg-brand-light-gray rounded-lg">
                            <h3 className="font-semibold text-white">API Call Brokering</h3>
                            <p className="text-xs text-brand-text-secondary mt-1">The intelligent gateway analyzes incoming requests. Simple, internal tasks are routed to the private AgentricAI API to conserve resources. Complex or knowledge-intensive requests are securely proxied to external LLMs.</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default GatewayView;