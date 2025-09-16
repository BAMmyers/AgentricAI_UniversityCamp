import React from 'react';
import StudentDashboard from './StudentDashboard';
import { useAppContext } from '../context/AppContext';
import { ArrowRightOnRectangleIcon } from './icons';


const StudentPortal: React.FC = () => {
    const { dispatch } = useAppContext();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex justify-end p-2 bg-brand-dark flex-shrink-0">
                 <button 
                    onClick={handleLogout} 
                    className="p-2 rounded-lg text-brand-text-secondary hover:bg-brand-light-gray hover:text-white" 
                    title="Logout"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                </button>
            </header>
            <main className="flex-1 overflow-auto">
                {/* FIX: Removed the 'setActiveView' prop because the StudentDashboard component does not accept it. This resolves the type error. */}
                <StudentDashboard />
            </main>
        </div>
    );
};

export default StudentPortal;