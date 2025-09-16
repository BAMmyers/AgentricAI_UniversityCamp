import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, UserRole } from '../types/index';
import { EnvelopeIcon } from './icons';

const RoleButton: React.FC<{ onClick: () => void, text: string, primary?: boolean }> = ({ onClick, text, primary }) => {
    const baseClasses = "w-full flex items-center justify-center p-3 rounded-lg font-semibold transition-colors duration-200";
    const primaryClasses = "bg-brand-primary text-white hover:bg-brand-accent";
    const secondaryClasses = "bg-brand-gray border border-brand-border text-brand-text hover:bg-brand-light-gray";

    return (
        <button onClick={onClick} className={`${baseClasses} ${primary ? primaryClasses : secondaryClasses}`}>
            {text}
        </button>
    )
};

const LoginView: React.FC = () => {
    const { dispatch } = useAppContext();
    const [email, setEmail] = useState('');
    const [showCreatorPanel, setShowCreatorPanel] = useState(false);

    const CREATOR_EMAIL = "agentricaiuiux@gmail.com";

    useEffect(() => {
        if (email.toLowerCase() === CREATOR_EMAIL) {
            setShowCreatorPanel(true);
        } else {
            setShowCreatorPanel(false);
        }
    }, [email]);

    const handleLogin = (role: UserRole) => {
        const user: User = {
            id: `${role}-${Date.now()}`,
            email: role === 'admin' ? CREATOR_EMAIL : `${role}@aau.edu`,
            role: role,
            subscriptionPlan: role === 'admin' ? 'pro' : 'free'
        };
        dispatch({ type: 'LOGIN', payload: user });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark">
            <div className="w-full max-w-sm p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Log into your account</h1>
                </div>

                <div className="relative">
                    <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Login with email"
                        className="w-full bg-brand-gray border border-brand-border rounded-lg p-3 pl-10 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                </div>
                
                {showCreatorPanel && (
                    <div className="p-4 bg-brand-gray border-2 border-brand-primary rounded-lg space-y-3 animate-fade-in">
                        <h3 className="text-center font-bold text-brand-primary">Creator Access Unlocked</h3>
                        <p className="text-center text-xs text-brand-text-secondary -mt-2 mb-4">Select a role to assume for testing.</p>
                        <RoleButton onClick={() => handleLogin('student')} text="Login as Student" />
                        <RoleButton onClick={() => handleLogin('parent')} text="Login as Parent" />
                        <RoleButton onClick={() => handleLogin('teacher')} text="Login as Teacher" />
                        <RoleButton onClick={() => handleLogin('admin')} text="Login as Admin (Creator)" primary />
                    </div>
                )}
                
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-brand-border"></div>
                    <span className="flex-shrink mx-4 text-xs text-brand-text-secondary">OR</span>
                    <div className="flex-grow border-t border-brand-border"></div>
                </div>

                <div className="space-y-3">
                     <button className="w-full flex items-center justify-center p-3 rounded-lg font-semibold transition-colors duration-200 bg-brand-gray border border-brand-border text-brand-text hover:bg-brand-light-gray">Login with Google</button>
                     <button className="w-full flex items-center justify-center p-3 rounded-lg font-semibold transition-colors duration-200 bg-brand-gray border border-brand-border text-brand-text hover:bg-brand-light-gray">Login with Apple</button>
                </div>
                
                <div className="text-center text-sm text-brand-text-secondary">
                    <p>Don't have an account? <a href="#" className="font-semibold text-brand-secondary hover:underline">Sign up</a></p>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
