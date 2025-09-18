import React from 'react';
import { useAppContext } from '../context/AppContext';
import { View } from '../types/index';
import {
    BrainCircuitIcon,
    CommandLineIcon,
    GroupIcon,
    ShieldCheckIcon,
    ServerStackIcon,
    BoltIcon,
    AcademicCapIcon,
    CpuIcon,
    DatabaseIcon,
    UserGroupIcon
} from './icons';

interface DashboardProps {
    setActiveView: (view: View) => void;
}

const StatCard: React.FC<{ title: string; value: string | number | React.ReactNode; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
        <div className="flex justify-between items-start text-brand-text-secondary">
            <span className="text-sm font-medium">{title}</span>
            {icon}
        </div>
        <div className="mt-2 text-3xl font-semibold text-brand-text">{value}</div>
    </div>
);

const QuickLinkCard: React.FC<{ title: string; description: string; icon: React.ReactNode; onClick: () => void }> = ({ title, description, icon, onClick }) => (
    <div
        onClick={onClick}
        className="bg-brand-gray border border-brand-border rounded-lg p-6 cursor-pointer hover:border-brand-primary hover:bg-brand-light-gray transition-colors group"
    >
        <div className="flex items-center gap-4">
            <div className="bg-brand-light-gray p-3 rounded-lg text-brand-cyan group-hover:bg-brand-primary group-hover:text-white transition-colors">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="text-sm text-brand-text-secondary">{description}</p>
            </div>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const { state } = useAppContext();
    const { agents, students, users } = state;

    const quickLinks = [
        { view: 'studio', title: 'Agentic Studio', description: 'Design and test multi-agent workflows.', icon: <BrainCircuitIcon className="w-6 h-6" /> },
        { view: 'mission-command', title: 'Mission Command', description: 'Execute complex objectives with agent teams.', icon: <CommandLineIcon className="w-6 h-6" /> },
        { view: 'agent-roster', title: 'Agent Roster', description: 'Browse and manage all system agents.', icon: <GroupIcon className="w-6 h-6" /> },
        { view: 'security-sentinel', title: 'Security Sentinel', description: 'Monitor system-wide security events.', icon: <ShieldCheckIcon className="w-6 h-6" /> },
        { view: 'gateway', title: 'Gateway Console', description: 'Monitor the secure proxy for AI services.', icon: <ServerStackIcon className="w-6 h-6" /> },
        { view: 'system-optimization', title: 'System Optimization', description: 'Fine-tune performance and run diagnostics.', icon: <BoltIcon className="w-6 h-6" /> },
        { view: 'student-ui-builder', title: 'Student UI Builder', description: 'Preview and build the student experience.', icon: <AcademicCapIcon className="w-6 h-6" /> },
    ];

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-white">Administrator Dashboard</h1>
                <p className="text-brand-text-secondary">Welcome, Creator. System status is nominal.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard title="Total Agents" value={agents.length} icon={<CpuIcon className="w-6 h-6" />} />
                <StatCard title="Enrolled Students" value={students.length} icon={<UserGroupIcon className="w-6 h-6" />} />
                <StatCard title="Registered Users" value={users.length} icon={<DatabaseIcon className="w-6 h-6" />} />
                <StatCard title="System Health" value={<span className="text-green-400">Online</span>} icon={<ShieldCheckIcon className="w-6 h-6" />} />
            </div>

            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickLinks.map(link => (
                        <QuickLinkCard
                            key={link.view}
                            title={link.title}
                            description={link.description}
                            icon={link.icon}
                            onClick={() => setActiveView(link.view as View)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;