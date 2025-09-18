import React, { useEffect } from 'react';
import EchoApp from './echo/EchoApp';
import { useAppContext } from '../context/AppContext';
import { SparklesIcon, UserPlusIcon } from './icons';

const StudentUIBuilderView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { students, activeStudentId } = state;

    // On mount, ensure an active student is set for the preview.
    // This allows the EchoApp and its hooks to function correctly.
    useEffect(() => {
        // If there are no students, create one for the preview.
        if (students.length === 0) {
            handleEnrollStudent();
        } else if (!students.some(s => s.id === activeStudentId)) {
            // If students exist but none are active, set the first as active.
            dispatch({ type: 'SET_ACTIVE_STUDENT_ID', payload: students[0].id });
        }
    }, [students, activeStudentId, dispatch]);

    const handleEnrollStudent = () => {
        dispatch({ type: 'ENROLL_STUDENT' });
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'New sample student enrolled for preview.', type: 'info' } });
    }

    return (
        <div className="bg-brand-dark min-h-full flex flex-col">
            <header className="flex-shrink-0 p-6 bg-brand-gray border-b border-brand-border">
                <div className="flex items-center">
                    <SparklesIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Student UI Builder</h1>
                        <p className="text-brand-text-secondary">A live, interactive preview of the student's daily planner experience.</p>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow overflow-auto relative bg-black">
                {students.length > 0 && activeStudentId ? (
                     <EchoApp />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-10">
                        <h2 className="text-xl font-bold text-white">No Students Enrolled</h2>
                        <p className="text-brand-text-secondary mt-2 mb-4 max-w-md">
                            The Student UI requires at least one enrolled student to generate a preview schedule. Please enroll a sample student to continue.
                        </p>
                        <button 
                            onClick={handleEnrollStudent}
                            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-accent text-white font-semibold px-4 py-2 rounded-md"
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            Enroll a Sample Student
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentUIBuilderView;