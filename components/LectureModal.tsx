import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { XMarkIcon } from './icons';

interface LectureModalProps {
    onClose: () => void;
}

const LectureModal: React.FC<LectureModalProps> = ({ onClose }) => {
    const { state, dispatch } = useAppContext();
    const activeStudent = state.students.find(s => s.id === state.activeStudentId);

    useEffect(() => {
        if (activeStudent) {
            dispatch({ type: 'JOIN_LECTURE', payload: activeStudent.companionAgentId });
        }

        return () => {
            if (activeStudent) {
                dispatch({ type: 'LEAVE_LECTURE', payload: activeStudent.companionAgentId });
            }
        };
    }, [dispatch, activeStudent]);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-brand-gray border border-brand-border rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-brand-border">
                    <h2 className="text-xl font-bold text-white">Live Teacher Seminar</h2>
                    <button onClick={onClose} className="text-brand-text-secondary hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </header>
                <main className="p-6 overflow-y-auto bg-brand-dark flex-grow flex items-center justify-center">
                    <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center relative">
                        <p className="text-brand-text-secondary">Teacher's Video Feed</p>
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-red-500 font-bold text-sm">LIVE</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LectureModal;