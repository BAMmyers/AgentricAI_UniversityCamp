import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheckIcon, UserIcon } from './icons';
import { SecurityLogEntry, SecurityEventType } from '../types/index';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-brand-text-secondary">{title}</span>
        <span className={color}>{icon}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold text-brand-text">{value}</div>
    </div>
);

const SecuritySentinelView: React.FC = () => {
    const { state } = useAppContext();
    const { securityLog, users } = state;

    const failedLogins = securityLog.filter(log => log.type === 'LOGIN_FAILURE').length;
    const successfulLogins = securityLog.filter(log => log.type === 'LOGIN_SUCCESS').length;
    
    const getLogTypeStyle = (type: SecurityEventType) => {
        switch (type) {
            case 'LOGIN_SUCCESS':
                return { bg: 'bg-green-600/20', text: 'text-green-400', label: 'Login Success' };
            case 'LOGIN_FAILURE':
                return { bg: 'bg-red-600/20', text: 'text-red-400', label: 'Login Failure' };
            case 'USER_REGISTERED':
                return { bg: 'bg-blue-600/20', text: 'text-blue-400', label: 'User Registered' };
            case 'LOGOUT':
                return { bg: 'bg-yellow-600/20', text: 'text-yellow-400', label: 'User Logout' };
            case 'SYSTEM_ERROR_DETECTED':
                return { bg: 'bg-orange-600/20', text: 'text-orange-400', label: 'System Error' };
            case 'INTEGRITY_SCAN_STARTED':
                return { bg: 'bg-cyan-600/20', text: 'text-cyan-400', label: 'Integrity Scan Start' };
            case 'INTEGRITY_SCAN_COMPLETED':
                return { bg: 'bg-purple-600/20', text: 'text-purple-400', label: 'Integrity Scan End' };
            default:
                return { bg: 'bg-brand-dark', text: 'text-brand-text-secondary', label: 'System Event' };
        }
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <ShieldCheckIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Security Sentinel Console</h1>
                    <p className="text-brand-text-secondary">Real-time monitoring of system-wide security events.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard 
                    title="Total Security Events" 
                    value={securityLog.length}
                    icon={<ShieldCheckIcon className="w-6 h-6" />}
                    color="text-brand-cyan"
                />
                <StatCard 
                    title="Registered Users" 
                    value={users.length}
                    icon={<UserIcon className="w-6 h-6" />}
                    color="text-brand-text-secondary"
                />
                <StatCard 
                    title="Successful Logins (session)" 
                    value={successfulLogins}
                    icon={<ShieldCheckIcon className="w-6 h-6" />}
                    color="text-green-400"
                />
                 <StatCard 
                    title="Failed Login Attempts" 
                    value={failedLogins}
                    icon={<ShieldCheckIcon className="w-6 h-6" />}
                    color="text-red-400"
                />
            </div>
            
            <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white mb-3">Live Event Log</h2>
                <div className="overflow-y-auto h-[60vh] font-mono text-xs pr-2">
                    {securityLog.length === 0 ? (
                        <p className="text-center text-brand-text-secondary p-8">No security events logged yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {securityLog.map((log, index) => {
                                const styles = getLogTypeStyle(log.type);
                                return (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-center p-2 bg-brand-dark rounded-md">
                                        <div className="col-span-3 text-brand-text-secondary">{new Date(log.timestamp).toLocaleString()}</div>
                                        <div className="col-span-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles.bg} ${styles.text}`}>
                                                {styles.label}
                                            </span>
                                        </div>
                                        <div className="col-span-7 text-brand-text">{log.details}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecuritySentinelView;
