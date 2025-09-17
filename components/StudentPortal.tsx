import React from 'react';
import EchoApp from './echo/EchoApp';
import { useAppContext } from '../context/AppContext';
import { ArrowRightOnRectangleIcon } from './icons';


const StudentPortal: React.FC = () => {
    const { dispatch } = useAppContext();

    const handleLogout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-black">
            <header className="flex justify-end p-2 bg-neutral-950 flex-shrink-0 border-b-4 border-dotted border-neutral-800">
                 <button 
                    onClick={handleLogout} 
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white" 
                    title="Logout"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5"/>
                </button>
            </header>
            <main className="flex-1 overflow-auto">
                <EchoApp />
            </main>
        </div>
    );
};

export default StudentPortal;