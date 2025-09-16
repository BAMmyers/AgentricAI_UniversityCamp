import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Studio from './Studio';
import AgentEditor from './AgentEditor';
import StudentView from './StudentView';
import StudentDashboard from './StudentDashboard';
import CoreView from './CoreView';
import GatewayView from './GatewayView';
import StudentRoster from './StudentRoster';
import ParentTeacherConsole from './ParentTeacherConsole';
import ShowcaseView from './ShowcaseView';
import AccountView from './AccountView';
import { BrainCircuitIcon, LayoutDashboardIcon, Cog8ToothIcon, AcademicCapIcon, CubeTransparentIcon, ServerStackIcon, UserGroupIcon, TrophyIcon, ArrowRightOnRectangleIcon, UserIcon, CreditCardIcon } from './icons';
import { useAppContext } from '../context/AppContext';
// FIX: Import the centralized View type
import { View } from '../types/index';

// FIX: Removed local AdminView type in favor of centralized View type
const AdminPortal: React.FC = () => {
  const { dispatch, state } = useAppContext();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [activeStudentIdForConsole, setActiveStudentIdForConsole] = useState<string | null>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { id: 'student-roster', label: 'Agent Roster', icon: <UserGroupIcon className="w-5 h-5" /> },
    { id: 'showcase', label: 'Project Showcase', icon: <TrophyIcon className="w-5 h-5" /> },
    { id: 'core', label: 'Core OS', icon: <CubeTransparentIcon className="w-5 h-5" /> },
    { id: 'studio', label: 'Studio', icon: <BrainCircuitIcon className="w-5 h-5" /> },
    { id: 'agent-editor', label: 'Agent Editor', icon: <Cog8ToothIcon className="w-5 h-5" /> },
    { id: 'gateway', label: 'Gateway', icon: <ServerStackIcon className="w-5 h-5" /> },
  ];

  const bottomNavItems = [
     { id: 'account', label: 'Account & Billing', icon: <CreditCardIcon className="w-5 h-5" /> },
     { id: 'university', label: 'University Hub', icon: <AcademicCapIcon className="w-5 h-5" /> },
  ];

  const navigateToConsole = (studentId: string) => {
    setActiveStudentIdForConsole(studentId);
    setActiveView('parent-teacher-console');
  }
  
  const handleLogout = () => {
      dispatch({ type: 'LOGOUT' });
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'studio':
        return <Studio setActiveView={setActiveView} />;
      case 'agent-editor':
        return <AgentEditor />;
      case 'core':
        return <CoreView />;
      case 'gateway':
        return <GatewayView />;
      case 'student-roster':
        return <StudentRoster navigateToConsole={navigateToConsole} />;
      case 'parent-teacher-console':
        return activeStudentIdForConsole ? <ParentTeacherConsole studentId={activeStudentIdForConsole} setActiveView={setActiveView} /> : <StudentRoster navigateToConsole={navigateToConsole} />;
      case 'showcase':
        return <ShowcaseView />;
      case 'account':
        return <AccountView />;
       case 'university':
        return <StudentView setActiveView={setActiveView} />;
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
                  activeView === item.id || (activeView === 'parent-teacher-console' && item.id === 'student-roster')
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
        <div className="flex flex-col items-center space-y-4">
            {bottomNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={`p-3 rounded-lg transition-colors duration-200 ${
                  activeView === item.id ? 'bg-brand-accent text-white' : 'text-brand-text-secondary hover:bg-brand-light-gray hover:text-white'
                }`}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}
            <button onClick={handleLogout} className="p-3 rounded-lg text-brand-text-secondary hover:bg-red-800/50 hover:text-white" title="Logout">
                <ArrowRightOnRectangleIcon className="w-5 h-5"/>
            </button>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default AdminPortal;