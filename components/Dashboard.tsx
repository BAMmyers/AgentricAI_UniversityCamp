import React from 'react';
import { ChartLineIcon, CpuIcon, DatabaseIcon, GroupIcon, MessageIcon, UserGroupIcon, AcademicCapIcon, BoltIcon, ShieldCheckIcon } from './icons';
import { useAppContext } from '../context/AppContext';
// FIX: Changed import path for View type
import { View } from '../types/index';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, children }) => (
  <div className="bg-brand-gray border border-brand-border rounded-lg p-4 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start text-brand-text-secondary">
        <span className="text-sm font-medium">{title}</span>
        {icon}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-semibold text-brand-text">{value}</span>
        {change && <span className="ml-2 text-sm text-green-400">{change}</span>}
      </div>
      {children}
    </div>
  </div>
);

const ActionCard: React.FC<{ icon: React.ReactNode, title: string, description: string, onClick: () => void }> = ({icon, title, description, onClick}) => (
    <div onClick={onClick} className="bg-brand-gray border border-brand-border rounded-lg p-6 text-center hover:border-brand-primary transition-all duration-200 cursor-pointer">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-brand-text-secondary mt-1">{description}</p>
    </div>
);

interface DashboardProps {
  setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  const { state, dispatch } = useAppContext();
  const agentCount = state.agents.length;

  const handleAgentManagementClick = () => {
      if (state.agents.length > 0) {
          dispatch({ type: 'SET_ACTIVE_AGENT_ID', payload: state.agents[0].id });
      } else {
          dispatch({ type: 'SET_ACTIVE_AGENT_ID', payload: null });
      }
      setActiveView('agent-editor');
  }

  return (
    <div className="p-6 bg-brand-dark min-h-full">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Administrative Control Center</h1>
          <p className="text-brand-text-secondary">Monitor and manage the AgentricAI ecosystem, oversee student progress, and optimize learning experiences</p>
        </div>
      </header>
      
      <div className="bg-green-900/50 border border-green-400 text-green-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
        <strong className="font-bold">All Agents Operational. </strong>
        <span className="block sm:inline">The AgentricAI ecosystem is fully activated with all agents ready for task delegation and student support.</span>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
           <h2 className="text-xl font-semibold text-white">System Health Overview</h2>
           <span className="text-sm font-medium bg-green-800 text-green-200 px-2 py-1 rounded-full">EXCELLENT</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Agents" value={`${agentCount}/${agentCount}`} change="100% efficiency" icon={<GroupIcon className="w-6 h-6" />} />
          <StatCard title="Response Time" value="98ms" change="12 tasks/min" icon={<ChartLineIcon className="w-6 h-6" />} />
          <StatCard title="Memory Usage" value="48%" change="CPU: 25%" icon={<CpuIcon className="w-6 h-6" />} />
          <StatCard title="Active Students" value="1" change="0 need attention" icon={<AcademicCapIcon className="w-6 h-6" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Agent Status" value="" icon={<GroupIcon className="w-6 h-6"/>}>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Total Agents:</span> <span className="font-semibold text-brand-text">{agentCount}</span></div>
            <div className="flex justify-between"><span>Active:</span> <span className="font-semibold text-green-400">{agentCount}</span></div>
            <div className="flex justify-between"><span>Processing:</span> <span className="font-semibold text-yellow-400">0</span></div>
            <div className="flex justify-between"><span>Idle:</span> <span className="font-semibold text-brand-text-secondary">0</span></div>
          </div>
        </StatCard>
        <StatCard title="Communication" value="21" icon={<MessageIcon className="w-6 h-6" />} >
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Recent Messages:</span> <span className="font-semibold text-brand-text">21</span></div>
            <div className="flex justify-between"><span>Avg Response:</span> <span className="font-semibold text-green-400">98ms</span></div>
          </div>
        </StatCard>
        <StatCard title="Knowledge Base" value="62" icon={<DatabaseIcon className="w-6 h-6" />} >
           <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Total Entries:</span> <span className="font-semibold text-brand-text">62</span></div>
            <div className="flex justify-between"><span>Categories:</span> <span className="font-semibold text-brand-text">15</span></div>
          </div>
        </StatCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard 
            icon={<ShieldCheckIcon className="w-12 h-12 mx-auto text-brand-cyan mb-4" />}
            title="Agent Management"
            description="Configure, deploy, and monitor AI agents."
            onClick={handleAgentManagementClick}
        />
        <ActionCard 
            icon={<UserGroupIcon className="w-12 h-12 mx-auto text-brand-cyan mb-4" />}
            title="Student Monitoring"
            description="Track student progress and engagement."
            // FIX: Changed to a valid view for the admin portal.
            onClick={() => setActiveView('student-roster')}
        />
        <ActionCard 
            icon={<BoltIcon className="w-12 h-12 mx-auto text-brand-cyan mb-4" />}
            title="System Optimization"
            description="Adjust system parameters and performance."
            onClick={() => { /* Placeholder */}}
        />
      </div>
    </div>
  );
};

export default Dashboard;