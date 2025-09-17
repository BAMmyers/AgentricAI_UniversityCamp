import React from 'react';
import { View } from '../types/index';
import { ShieldCheckIcon, BrainCircuitIcon, BoltIcon, UserGroupIcon, IdentificationIcon, LockClosedIcon } from './icons';
import { useAppContext } from '../context/AppContext';

interface StudentViewProps {
    setActiveView: (view: View) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-6">
        <div className="flex items-center text-brand-cyan mb-3">
            {icon}
            <h3 className="ml-3 text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-brand-text-secondary leading-relaxed">{children}</p>
    </div>
);

const InterfaceCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; buttonText: string; buttonColor: string; onClick?: () => void; }> = ({ icon, title, children, buttonText, buttonColor, onClick }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-6 flex flex-col">
        <div className="flex items-center mb-3">
            <span className="text-brand-cyan">{icon}</span>
            <h3 className="ml-3 text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-sm text-brand-text-secondary flex-grow mb-6">{children}</p>
        <button onClick={onClick} className={`w-full py-2 rounded-md font-semibold text-white transition-transform duration-200 hover:scale-105 ${buttonColor}`}>
            {buttonText}
        </button>
    </div>
);

const StudentView: React.FC<StudentViewProps> = ({ setActiveView }) => {
    const { dispatch } = useAppContext();

    const handleEnroll = () => {
        dispatch({ type: 'ENROLL_STUDENT' });
        setActiveView('student-roster');
    };

    return (
        <div className="p-4 md:p-8 bg-brand-dark min-h-full">
            <header className="flex justify-between items-center mb-10">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-sm mr-4">
                        AAU
                    </div>
                    <h1 className="text-2xl font-bold text-white">AgentricAI University</h1>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-sm text-green-400 font-semibold">Ecosystem Active</span>
                </div>
            </header>
            
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-secondary">
                    Revolutionary AI-Powered Education
                </h2>
                <p className="text-md md:text-lg text-brand-text-secondary max-w-3xl mx-auto">
                    Empowering neurodiverse learners through adaptive AI agents and personalized educational experiences
                </p>
                <p className="text-xs text-brand-text-secondary mt-2">A Brandon Anthony Myers Project • Privacy-by-Design • Echo Project Architecture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <FeatureCard icon={<ShieldCheckIcon className="w-8 h-8"/>} title="Stealth Agent System">
                    Self-evolving AI agents that adapt to individual learning patterns and provide personalized support.
                </FeatureCard>
                <FeatureCard icon={<BrainCircuitIcon className="w-8 h-8"/>} title="Neurodiverse Optimization">
                    Specially designed for neurodiverse learners with sensory-friendly interfaces and adaptive content.
                </FeatureCard>
                <FeatureCard icon={<BoltIcon className="w-8 h-8"/>} title="Real-time Adaptation">
                    Dynamic content adjustment based on learning progress, engagement levels, and individual preferences.
                </FeatureCard>
            </div>

            <div className="bg-brand-gray border border-brand-border rounded-lg p-6 mb-16 flex items-center">
                <LockClosedIcon className="w-8 h-8 text-yellow-400 mr-4 flex-shrink-0"/>
                <div>
                    <h4 className="font-bold text-white">Echo Project Privacy Model</h4>
                    <p className="text-sm text-brand-text-secondary">
                        Student interactions are completely private - only the AI sees them. Parents and teachers receive AI-generated progress reports without accessing direct student interactions. This revolutionary approach protects the student's right to a private, unobserved learning space while providing meaningful insights to caregivers.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <InterfaceCard 
                    icon={<UserGroupIcon className="w-8 h-8" />} 
                    title="Student Interface" 
                    buttonText="Enroll & Begin Learning"
                    buttonColor="bg-green-600 hover:bg-green-700"
                    onClick={handleEnroll}
                >
                    <b>Echo Mode</b> - The private student learning space with symbol-based communication, large touch-friendly buttons, and offline functionality. Designed specifically for AAC devices and neurodiverse learners.
                </InterfaceCard>
                <InterfaceCard 
                    icon={<IdentificationIcon className="w-8 h-8" />} 
                    title="Parent/Teacher Interface" 
                    buttonText="Try Admin Interface"
                    buttonColor="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveView('dashboard')}
                >
                    <b>Studio Mode</b> - Set learning goals in natural language, review AI-generated progress reports, and manage curriculum without accessing private student interactions.
                </InterfaceCard>
                <InterfaceCard 
                    icon={<BrainCircuitIcon className="w-8 h-8" />} 
                    title="Agent Network" 
                    buttonText="View Agent Status"
                    buttonColor="bg-brand-primary hover:bg-brand-accent"
                    onClick={() => setActiveView('dashboard')}
                >
                    View the complete faculty of AI agents including The Guardian (ethical oversight), Echo Orchestrator (adaptive learning), and specialized educational agents.
                </InterfaceCard>
            </div>
        </div>
    );
};

export default StudentView;