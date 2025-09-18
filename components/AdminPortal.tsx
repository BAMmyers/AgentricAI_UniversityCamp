import React, { useState } from 'react';
import AgenticStudio from './AgenticStudio';
import MissionCommandView from './MissionCommandView';
import AgentRoster from './AgentRoster';
import SecuritySentinelView from './SecuritySentinelView';
import SystemOptimizationView from './SystemOptimizationView';
import GatewayView from './GatewayView';
import Dashboard from './Dashboard';
import StudentUIBuilderView from './StudentUIBuilderView';
import AgentDetailView from './AgentDetailView';
import { BrainCircuitIcon, ArrowRightOnRectangleIcon, CommandLineIcon, GroupIcon, ShieldCheckIcon, ServerStackIcon, BoltIcon, LayoutDashboardIcon, AcademicCapIcon } from './icons';
import { useAppContext } from '../context/AppContext';
import { View } from '../types/index';

const AdminPortal: React.FC = () => {
    const { dispatch } = useAppContext();
    const [activeView, setActiveView] = useState<View>('dashboard');

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
        { id: 'studio', label: 'Agentic Studio', icon: <BrainCircuitIcon className="w-5 h-5" /> },
        { id: 'mission-command', label: 'Mission Command', icon: <CommandLineIcon className="w-5 h-5" /> },
        { id: 'agent-roster', label: 'Agent Roster', icon: <GroupIcon className="w-5 h-5" /> },
        { id: 'security-sentinel', label: 'Security Sentinel', icon: <ShieldCheckIcon className="w-5 h-5" /> },
        { id: 'gateway', label: 'Gateway Console', icon: <ServerStackIcon className="w-5 h-5" /> },
        { id: 'system-optimization', label: 'System Optimization', icon: <BoltIcon className="w-5 h-5" /> },
        { id: 'student-ui-builder', label: 'Student UI Builder', icon: <AcademicCapIcon className="w-5 h-5" /> },
    ];

    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard setActiveView={setActiveView} />;
            case 'studio':
                return <AgenticStudio />;
            case 'mission-command':
                return <MissionCommandView />;
            case 'agent-roster':
                return <AgentRoster setActiveView={setActiveView} />;
            case 'agent-detail':
                return <AgentDetailView setActiveView={setActiveView} />;
            case 'security-sentinel':
                return <SecuritySentinelView />;
            case 'gateway':
                return <GatewayView />;
            case 'system-optimization':
                return <SystemOptimizationView />;
            case 'student-ui-builder':
                return <StudentUIBuilderView />;
            default:
                return <Dashboard setActiveView={setActiveView} />;
        }
    };

    return (
        <div className="min-h-screen flex">
            <nav className="w-16 bg-brand-gray border-r border-brand-border flex flex-col items-center py-4 justify-between z-20">
                <div>
                    <div 
                        className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-sm cursor-pointer mb-6"
                        onClick={() => setActiveView('dashboard')}
                        title="AgentricAI University"
                    >
                        AAU
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id as View)}
                                className={`p-3 rounded-lg transition-colors duration-200 ${
                                    activeView === item.id 
                                    ? 'bg-brand-accent text-white' 
                                    : 'text-brand-text-secondary hover:bg-brand-light-gray hover:text-white'
                                }`}
                                title={item.label}
                            >
                                {item.icon}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <button onClick={handleLogout} className="p-3 rounded-lg text-brand-text-secondary hover:bg-red-800/50 hover:text-white" title="Logout">
                        <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                    </button>
                </div>
            </nav>
            <main className="flex-1 overflow-auto h-screen">
                 {renderView()}
            </main>
        </div>
    );
};

export default AdminPortal;