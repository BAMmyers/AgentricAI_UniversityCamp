import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Studio from './components/Studio';
import AgentEditor from './components/AgentEditor';
import StudentView from './components/StudentView';
import StudentDashboard from './components/StudentDashboard';
import CoreView from './components/CoreView';
import GatewayView from './components/GatewayView';
import StudentRoster from './components/StudentRoster';
import ParentTeacherConsole from './components/ParentTeacherConsole';
import ShowcaseView from './components/ShowcaseView';
import { ChatWidget } from './components/ChatWidget';
import { BrainCircuitIcon, LayoutDashboardIcon, Cog8ToothIcon, AcademicCapIcon, CubeTransparentIcon, ServerStackIcon, UserGroupIcon, TrophyIcon } from './components/icons';

export type View = 'dashboard' | 'studio' | 'agent-editor' | 'university' | 'student-dashboard' | 'core' | 'gateway' | 'student-roster' | 'parent-teacher-console' | 'showcase';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('university');
  const [activeStudentIdForConsole, setActiveStudentIdForConsole] = useState<string | null>(null);


  const navItems = [
    { id: 'university', label: 'University', icon: <AcademicCapIcon className="w-5 h-5" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { id: 'student-roster', label: 'Companion Agent Roster', icon: <UserGroupIcon className="w-5 h-5" /> },
    { id: 'showcase', label: 'Project Showcase', icon: <TrophyIcon className="w-5 h-5" /> },
    { id: 'core', label: 'Core OS', icon: <CubeTransparentIcon className="w-5 h-5" /> },
    { id: 'studio', label: 'Studio', icon: <BrainCircuitIcon className="w-5 h-5" /> },
    { id: 'agent-editor', label: 'Agent Editor', icon: <Cog8ToothIcon className="w-5 h-5" /> },
    { id: 'gateway', label: 'Gateway Console', icon: <ServerStackIcon className="w-5 h-5" /> },
  ];

  const navigateToConsole = (studentId: string) => {
    setActiveStudentIdForConsole(studentId);
    setActiveView('parent-teacher-console');
  }

  const renderView = () => {
    switch (activeView) {
      case 'university':
        return <StudentView setActiveView={setActiveView} />;
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'studio':
        return <Studio setActiveView={setActiveView} />;
      case 'agent-editor':
        return <AgentEditor setActiveView={setActiveView} />;
      case 'student-dashboard':
        return <StudentDashboard setActiveView={setActiveView} />;
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
      default:
        return <StudentView setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text flex font-sans">
      <nav className="w-16 bg-brand-gray border-r border-brand-border flex flex-col items-center py-4 space-y-6 z-20">
        <div 
          className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-sm cursor-pointer"
          onClick={() => setActiveView('university')}
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
      </nav>

      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>

      <ChatWidget />
    </div>
  );
};

export default App;