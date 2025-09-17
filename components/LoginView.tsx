import React, { useState, FormEvent } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, UserRole } from '../types/index';
import { EnvelopeIcon, LockClosedIcon, UserIcon, ArrowUturnLeftIcon, ShieldCheckIcon } from './icons';

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

// Simple hash simulation for the frontend.
// In a real app, this would be a one-way hash (like bcrypt) performed on a server.
const hashPassword = (password: string) => `hashed_${password}`;

const LoginView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [step, setStep] = useState<'roleSelect' | 'email' | 'setPassword' | 'enterPassword' | 'securityScan'>('roleSelect');
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const resetState = () => {
        setStep('roleSelect');
        setSelectedRole(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
    };

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setStep('email');
        setError('');
    };

    const handleEmailSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) {
            setError("Please enter a valid email.");
            return;
        }
        const userExists = state.users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
            setStep('enterPassword');
        } else {
            setStep('setPassword');
        }
    };

    const runSecurityScan = (callback: () => void) => {
        setStep('securityScan');
        setTimeout(callback, 1500);
    };
    
    const handleRegister = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 8) {
             setError("Password must be at least 8 characters long.");
             return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!selectedRole) {
            setError("No role selected. Please start over.");
            return;
        }

        runSecurityScan(() => {
            const newUser: User = {
                id: `${selectedRole}-${Date.now()}`,
                email: email,
                role: selectedRole,
                subscriptionPlan: selectedRole === 'admin' ? 'pro' : 'free',
                passwordHash: hashPassword(password),
            };
            dispatch({ type: 'REGISTER_USER', payload: newUser });
            // The reducer automatically logs in the new user and logs the registration event.
        });
    };

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        
        runSecurityScan(() => {
            const userInState = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (userInState && userInState.passwordHash === hashPassword(password)) {
                const userPayload: User = { ...userInState };
                // The LOGIN reducer will log the successful event
                dispatch({ type: 'LOGIN', payload: { user: userPayload, password } });
            } else {
                // Manually log the failed attempt
                dispatch({ type: 'LOG_SECURITY_EVENT', payload: { type: 'LOGIN_FAILURE', details: `Failed login attempt for email: ${email}` } });
                setError("Invalid email or password. Please try again.");
                setStep('enterPassword'); // Go back to the password screen
            }
        });
    };
    
    const renderStep = () => {
        switch (step) {
            case 'securityScan':
                return (
                    <div className="text-center animate-fade-in space-y-4 py-8">
                        <ShieldCheckIcon className="w-16 h-16 mx-auto text-brand-cyan animate-pulse"/>
                        <h2 className="text-xl font-bold text-white">Security Scan in Progress</h2>
                        <p className="text-sm text-brand-text-secondary">Security Sentinel 001 is verifying credentials...</p>
                    </div>
                );
            case 'email':
                return (
                    <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">Continue as {selectedRole && selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</h2>
                            <p className="text-sm text-brand-text-secondary">Enter your email to login or sign up.</p>
                        </div>
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                autoFocus
                                className="w-full bg-brand-gray border border-brand-border rounded-lg p-3 pl-10 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                        </div>
                        <button type="submit" className="w-full p-3 rounded-lg font-semibold bg-brand-primary text-white hover:bg-brand-accent">Continue</button>
                    </form>
                );
            case 'setPassword':
                return (
                    <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
                            <p className="text-sm text-brand-text-secondary">Set a secure password for <span className="font-semibold text-brand-text">{email}</span>.</p>
                        </div>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password (min 8 chars)" required autoFocus className="w-full bg-brand-gray border border-brand-border rounded-lg p-3 pl-10 text-sm text-brand-text"/>
                        </div>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required className="w-full bg-brand-gray border border-brand-border rounded-lg p-3 pl-10 text-sm text-brand-text"/>
                        </div>
                        <button type="submit" className="w-full p-3 rounded-lg font-semibold bg-brand-primary text-white hover:bg-brand-accent">Create Account & Login</button>
                    </form>
                );
            case 'enterPassword':
                return (
                     <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
                         <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
                            <p className="text-sm text-brand-text-secondary">Enter your password for <span className="font-semibold text-brand-text">{email}</span>.</p>
                        </div>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required autoFocus className="w-full bg-brand-gray border border-brand-border rounded-lg p-3 pl-10 text-sm text-brand-text"/>
                        </div>
                        <button type="submit" className="w-full p-3 rounded-lg font-semibold bg-brand-primary text-white hover:bg-brand-accent">Login</button>
                    </form>
                );
            case 'roleSelect':
            default:
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome to AgentricAI</h1>
                            <p className="text-brand-text-secondary">Please select your role to begin.</p>
                        </div>
                        <RoleButton onClick={() => handleRoleSelect('student')} text="I am a Student" />
                        <RoleButton onClick={() => handleRoleSelect('parent')} text="I am a Parent" />
                        <RoleButton onClick={() => handleRoleSelect('teacher')} text="I am a Teacher" />
                        <RoleButton onClick={() => handleRoleSelect('admin')} text="I am a Creator / Admin" primary />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
            <div className="w-full max-w-sm">
                {step !== 'roleSelect' && step !== 'securityScan' && (
                    <button onClick={resetState} className="flex items-center gap-2 text-sm text-brand-text-secondary hover:text-white mb-4">
                        <ArrowUturnLeftIcon className="w-4 h-4" />
                        Back to Role Selection
                    </button>
                )}
                <div className="p-8 space-y-6 bg-brand-light-gray rounded-xl shadow-2xl border border-brand-border">
                    {renderStep()}
                    {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginView;