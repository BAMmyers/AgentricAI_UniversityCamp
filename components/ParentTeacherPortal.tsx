import React, { useState } from 'react';
import AgentRoster from './AgentRoster';
import ParentTeacherConsole from './ParentTeacherConsole';
import ShowcaseView from './ShowcaseView';
import AccountView from './AccountView';
import TeacherLectureView from './TeacherLectureView';
import CurriculumManagerView from './CurriculumManagerView';
import AgenticStudio from './AgenticStudio';
import MissionCommandView from './MissionCommandView';
import AgentDetailView from './AgentDetailView';
import { UserGroupIcon, TrophyIcon, ArrowRightOnRectangleIcon, CreditCardIcon, StarIcon, BookOpenIcon, BrainCircuitIcon, CommandLineIcon } from './icons';
import { useAppContext } from '../context/AppContext';
import { View } from '../types/index';

const ParentTeacherPortal: React.FC = () => {
    const { dispatch, state } = useAppContext();
    const [activeView, setActiveView] = useState<View>('student-roster');
    const [activeStudentId, setActiveStudentId] = useState<string | null>(null);

    const navItems = [
        { id: 'student-roster', label: 'Student Roster', icon: <UserGroupIcon className="w-5 h-5" /> },
        { id: 'studio', label: 'Agentic Studio', icon: <BrainCircuitIcon className="w-5 h-5" /> },
        { id: 'mission-command', label: 'Mission Command', icon: <CommandLineIcon className="w-5 h-5" /> },
        { id: 'curriculum-manager', label: 'Curriculum Manager', icon: <BookOpenIcon className="w-5 h-5" /> },
        { id: 'teacher-lecture', label: 'Live Lecture Hall', icon: <StarIcon className="w-5 h-5" /> },
        { id: 'showcase', label: 'Project Showcase', icon: <TrophyIcon className="w-5 h-5" /> },
        { id: 'account', label: 'Account & Billing', icon: <CreditCardIcon className="w-5 h-5" /> },
    ];

    const navigateToConsole = (studentId: string) => {
        setActiveStudentId(studentId);
        setActiveView('parent-teacher-console');
    }
    
    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const renderView = () => {
        switch (activeView) {
            case 'student-roster':
                return <AgentRoster setActiveView={setActiveView} navigateToConsole={navigateToConsole} />;
            case 'parent-teacher-console':
                return activeStudentId ? <ParentTeacherConsole studentId={activeStudentId} setActiveView={setActiveView} /> : <AgentRoster setActiveView={setActiveView} navigateToConsole={navigateToConsole} />;
            case 'studio':
                return <AgenticStudio />;
            case 'mission-command':
                return <MissionCommandView />;
            case 'agent-detail':
                 return <AgentDetailView setActiveView={setActiveView} />;
            case 'curriculum-manager':
                return <CurriculumManagerView />;
            case 'teacher-lecture':
                return <TeacherLectureView />;
            case 'showcase':
                return <ShowcaseView />;
            case 'account':
                return <AccountView />;
            default:
                return <AgentRoster setActiveView={setActiveView} navigateToConsole={navigateToConsole} />;
        }
    };

    return (
        <div className="min-h-screen flex">
            <nav className="w-16 bg-brand-gray border-r border-brand-border flex flex-col items-center py-4 justify-between z-20">
                <div>
                    <div 
                        className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-sm cursor-pointer mb-6"
                        onClick={() => setActiveView('student-roster')}
                        title="AgentricAI University"
                    >
                        AAU
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id as View)}
                                className={`relative p-3 rounded-lg transition-colors duration-200 ${
                                    activeView === item.id || (activeView === 'parent-teacher-console' && item.id === 'student-roster')
                                    ? 'bg-brand-accent text-white' 
                                    : 'text-brand-text-secondary hover:bg-brand-light-gray hover:text-white'
                                }`}
                                title={item.label}
                            >
                                {item.icon}
                                {item.id === 'teacher-lecture' && state.liveLectureSession?.isActive && (
                                    <span className="absolute top-1 right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                )}
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
            <main className="flex-1 overflow-auto">
                {renderView()}
            </main>
        </div>
    );
};

export default ParentTeacherPortal;