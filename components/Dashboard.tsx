import React from 'react';
import { View } from '../types/index';
import { ChartLineIcon, CpuIcon, DatabaseIcon, GroupIcon, LayoutDashboardIcon } from './icons';
import { useAppContext } from '../context/AppContext';

interface DashboardProps {
    setActiveView: (view: View) => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; onClick?: () => void; }> = ({ title, value, icon, color, onClick }) => (
    <div
        className={`bg-brand-gray border border-brand-border rounded-lg p-4 transition-colors ${onClick ? 'cursor-pointer hover:border-brand-primary' : ''}`}
        onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-brand-text-secondary">{title}</span>
        <span className={color}>{icon}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold text-brand-text">{value}</div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const { state } = useAppContext();
    const { agents, students, users, missionPlan } = state;

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <LayoutDashboardIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Administrative Dashboard</h1>
                    <p className="text-brand-text-secondary">System-wide overview and operational status.</p>
                </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Active Agents" 
                    value={agents.length} 
                    icon={<CpuIcon className="w-6 h-6"/>} 
                    color="text-brand-cyan" 
                    onClick={() => setActiveView('agent-roster')}
                />
                <StatCard 
                    title="Enrolled Students" 
                    value={students.length} 
                    icon={<GroupIcon className="w-6 h-6"/>} 
                    color="text-green-400" 
                />
                 <StatCard 
                    title="Total Users" 
                    value={users.length} 
                    icon={<GroupIcon className="w-6 h-6"/>} 
                    color="text-purple-400"
                />
                 <StatCard 
                    title="Active Mission" 
                    value={missionPlan ? 'Yes' : 'No'} 
                    icon={<ChartLineIcon className="w-6 h-6"/>} 
                    color={missionPlan ? "text-yellow-400" : "text-brand-text-secondary"}
                    onClick={() => setActiveView('mission-command')}
                />
            </div>
            <div className="mt-8 bg-brand-gray border border-brand-border rounded-lg p-6">
                 <h2 className="text-lg font-semibold text-white mb-3">Welcome to the AgentricAI University Camp</h2>
                <p className="text-brand-text-secondary">This is the central control center for the entire AI ecosystem. From here, you can design, manage, and deploy teams of specialized AI agents to power the educational experiences for students.</p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-brand-text-secondary">
                    <li>Use the <b className="text-white">Agentic Studio</b> to visually build and test complex workflows.</li>
                    <li>Launch strategic objectives from <b className="text-white">Mission Command</b>.</li>
                    <li>Monitor system health and security from the <b className="text-white">Sentinel</b> and <b className="text-white">Gateway</b> consoles.</li>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
