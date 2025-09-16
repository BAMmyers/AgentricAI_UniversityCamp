import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserCircleIcon, SignalIcon } from './icons';

const StudentRoster: React.FC = () => {
    const { state } = useAppContext();
    const { students, agents } = state;

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <UserCircleIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Student Roster</h1>
                    <p className="text-brand-text-secondary">Monitor enrolled students and their companion agents.</p>
                </div>
            </header>

            {students.length === 0 ? (
                <div className="text-center p-10 bg-brand-gray rounded-lg border border-brand-border">
                    <p className="text-brand-text-secondary">No students have enrolled yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {students.map(student => {
                        const companionAgent = agents.find(a => a.id === student.companionAgentId);
                        if (!companionAgent) return null;

                        return (
                            <div key={student.id} className="bg-brand-gray border border-brand-border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="font-bold text-white truncate">{companionAgent.name}</h2>
                                        <p className="text-xs text-brand-text-secondary">{companionAgent.id}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-green-400">
                                        <SignalIcon className="w-4 h-4" />
                                        <span>Online</span>
                                    </div>
                                </div>
                                <div className="mt-4 border-t border-brand-border pt-3 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-brand-text-secondary">Status:</span>
                                        <span className="font-semibold text-brand-text">Active Learning</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-brand-text-secondary">Engagement:</span>
                                        <span className="font-semibold text-green-400">High</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-brand-text-secondary">Progress:</span>
                                        <div className="w-1/2 bg-brand-dark rounded-full h-2 mt-1.5">
                                            <div className="bg-brand-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentRoster;