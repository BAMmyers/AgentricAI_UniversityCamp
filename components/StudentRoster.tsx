import React from 'react';
import { useAppContext } from '../context/AppContext';
import { UserCircleIcon } from './icons';

interface StudentRosterProps {
  navigateToConsole?: (studentId: string) => void;
}

const StudentRoster: React.FC<StudentRosterProps> = ({ navigateToConsole }) => {
    const { state } = useAppContext();
    const { students, agents } = state;

    // In a real app, this would be filtered to only show students associated with the logged-in parent/teacher.
    // For this demonstration, we show all enrolled students.
    const studentAgents = students.map(student => {
        const agent = agents.find(a => a.id === student.companionAgentId && a.type === 'Companion');
        return {
            studentId: student.id,
            agentName: agent?.name || 'Companion Agent',
            agentId: agent?.id || 'N/A'
        };
    }).filter(sa => sa.agentId !== 'N/A'); // Only show students with an assigned companion agent.

    const handleClick = (studentId: string) => {
        if (navigateToConsole) {
            navigateToConsole(studentId);
        }
    }

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <UserCircleIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Student Roster</h1>
                    <p className="text-brand-text-secondary">Select a student to manage their companion agent's curriculum.</p>
                </div>
            </header>

            {studentAgents.length === 0 ? (
                <div className="text-center p-10 bg-brand-gray rounded-lg border border-brand-border">
                    <p className="text-brand-text-secondary">No students have been enrolled yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {studentAgents.map(sa => (
                        <div 
                            key={sa.studentId} 
                            onClick={() => handleClick(sa.studentId)}
                            className={`bg-brand-gray border border-brand-border rounded-lg p-4 group transition-colors ${navigateToConsole ? 'cursor-pointer hover:border-brand-primary' : ''}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-bold text-white truncate">{sa.agentName}</h2>
                                    <p className="text-xs text-brand-text-secondary">Student ID: {sa.studentId.slice(-6)}</p>
                                </div>
                            </div>
                            <div className="mt-4 border-t border-brand-border pt-3">
                               {navigateToConsole && <p className="text-brand-text-secondary text-sm">Click to manage goals and curriculum.</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentRoster;
