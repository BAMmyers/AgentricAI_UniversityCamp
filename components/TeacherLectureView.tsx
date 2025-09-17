import React from 'react';
import { useAppContext } from '../context/AppContext';
import { StarIcon, UserGroupIcon } from './icons';

const TeacherLectureView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { liveLectureSession } = state;

    const handleStartLecture = () => {
        dispatch({ type: 'START_LECTURE' });
    };

    const handleEndLecture = () => {
        dispatch({ type: 'END_LECTURE' });
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <StarIcon className="w-8 h-8 mr-3 text-yellow-400" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Live Lecture Hall</h1>
                    <p className="text-brand-text-secondary">Manage your live seminars and monitor student attendance privately.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-brand-gray border border-brand-border rounded-lg p-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-4">Session Control</h2>
                        {liveLectureSession?.isActive ? (
                            <button onClick={handleEndLecture} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md">
                                End Live Lecture
                            </button>
                        ) : (
                            <button onClick={handleStartLecture} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md">
                                Start Live Lecture
                            </button>
                        )}
                    </div>
                    <div className="mt-4 text-center">
                        {liveLectureSession?.isActive ? (
                             <div className="border-2 border-green-500 rounded-lg p-4 text-center">
                                <p className="text-4xl font-extrabold text-green-400 animate-pulse tracking-widest">LIVE</p>
                                <p className="text-sm text-brand-text-secondary mt-1">Students can now join the seminar.</p>
                             </div>
                        ) : (
                             <div className="border-2 border-red-500 rounded-lg p-4 text-center">
                                <p className="text-4xl font-extrabold text-red-400 tracking-widest">OFFLINE</p>
                                <p className="text-sm text-brand-text-secondary mt-1">The lecture has not started.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-brand-gray border border-brand-border rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5"/>
                        Live Attendance Roster ({liveLectureSession?.attendeeAgentIds.length || 0})
                    </h2>
                    <div className="h-96 overflow-y-auto bg-brand-dark rounded-md p-2 space-y-2">
                        {liveLectureSession?.isActive ? (
                            liveLectureSession.attendeeAgentIds.length > 0 ? (
                                liveLectureSession.attendeeAgentIds.map(agentId => (
                                    <div key={agentId} className="p-2 bg-brand-light-gray rounded-md font-mono text-sm text-brand-cyan animate-fade-in">
                                        {agentId}
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-brand-text-secondary text-center p-4">Waiting for students to join the live lecture...</p>
                                </div>
                            )
                        ) : (
                             <div className="flex items-center justify-center h-full">
                                <p className="text-brand-text-secondary text-center p-4">Start the lecture session to begin tracking attendance.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherLectureView;