import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { UserRole, Student, SubscriptionPlan } from '../types/index';
import { EnvelopeIcon, LockClosedIcon, SparklesIcon, IdentificationIcon, LightBulbIcon } from './icons';

const hashPassword = (password: string) => `hashed_${password}`;

const EnrollmentView: React.FC = () => {
    const { dispatch } = useAppContext();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [preferences, setPreferences] = useState<Student['preferences']>({
        preferredTopics: [],
        learningStyle: 'visual',
    });
    const [newTopic, setNewTopic] = useState('');
    const [error, setError] = useState('');

    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError('');
        if (step === 1) {
             if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
                setError("Please fill in all credential fields.");
                return;
             }
             if (password.length < 8) {
                setError("Password must be at least 8 characters long.");
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
        }
        setStep(step + 1)
    };
    const handleBack = () => setStep(step - 1);

    const handleAddTopic = () => {
        if (newTopic.trim() && !preferences.preferredTopics.includes(newTopic.trim())) {
            setPreferences(prev => ({
                ...prev,
                preferredTopics: [...prev.preferredTopics, newTopic.trim()],
            }));
            setNewTopic('');
        }
    };

    const handleRemoveTopic = (topic: string) => {
        setPreferences(prev => ({
            ...prev,
            preferredTopics: prev.preferredTopics.filter(t => t !== topic),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (preferences.preferredTopics.length === 0) {
            setError("Please add at least one preferred topic to help your agent get started.");
            return;
        }
        
        const userPayload = {
            email: email.toLowerCase(),
            passwordHash: hashPassword(password),
            role: 'student' as UserRole,
            subscriptionPlan: 'free' as SubscriptionPlan,
            preferences
        };

        dispatch({ type: 'REGISTER_USER', payload: userPayload });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
            <div className="w-full max-w-lg bg-brand-light-gray rounded-xl shadow-2xl border border-brand-border flex flex-col">
                <header className="p-4 bg-brand-gray rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="w-8 h-8 text-brand-cyan" />
                        <div>
                            <h1 className="text-xl font-bold text-white">Companion Guide: Enrollment</h1>
                            <p className="text-sm text-brand-text-secondary">Let's get you set up for learning!</p>
                        </div>
                    </div>
                </header>
                
                <form onSubmit={handleSubmit} className="p-6">
                    {error && <p className="text-red-400 text-sm text-center mb-4 bg-red-900/50 border border-red-500 rounded p-2">{error}</p>}
                    
                    {step === 1 && (
                        <div className="animate-fade-in space-y-4">
                             <h2 className="text-lg font-semibold text-white flex items-center gap-2"><IdentificationIcon className="w-5 h-5"/> Student Credentials</h2>
                             <p className="text-sm text-brand-text-secondary">First, let's create your private and secure account.</p>
                             <div className="relative">
                                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required autoFocus className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 pl-10 text-brand-text"/>
                            </div>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password (min 8 chars)" required className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 pl-10 text-sm text-brand-text"/>
                            </div>
                            <div className="relative">
                                <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 pl-10 text-sm text-brand-text"/>
                            </div>
                        </div>
                    )}
                    
                    {step === 2 && (
                         <div className="animate-fade-in space-y-4">
                            <h2 className="text-lg font-semibold text-white flex items-center gap-2"><LightBulbIcon className="w-5 h-5"/> Learning Preferences</h2>
                            <p className="text-sm text-brand-text-secondary">Help your Companion Agent understand what you like to learn about.</p>
                            <div>
                                <label className="text-sm text-brand-text-secondary block mb-1">Preferred Topics</label>
                                <div className="flex gap-2">
                                    <input type="text" value={newTopic} onChange={e => setNewTopic(e.target.value)} placeholder="e.g., Dinosaurs, Space" className="flex-grow bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm"/>
                                    <button type="button" onClick={handleAddTopic} className="bg-brand-primary p-2 rounded text-white text-sm">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {preferences.preferredTopics.map(topic => (
                                        <div key={topic} className="bg-brand-cyan/20 text-brand-cyan text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-2">
                                            {topic}
                                            <button type="button" onClick={() => handleRemoveTopic(topic)} className="font-bold text-lg leading-none">&times;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="text-sm text-brand-text-secondary block mb-1">Primary Learning Style</label>
                                 <select value={preferences.learningStyle} onChange={e => setPreferences(prev => ({...prev, learningStyle: e.target.value as any}))} className="w-full bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm">
                                    <option value="visual">Visual (seeing)</option>
                                    <option value="auditory">Auditory (hearing)</option>
                                    <option value="kinesthetic">Kinesthetic (doing)</option>
                                </select>
                            </div>
                         </div>
                    )}

                    <div className="flex justify-between items-center mt-6">
                        <button type="button" onClick={() => dispatch({ type: 'CANCEL_ENROLLMENT' })} className="text-sm text-brand-text-secondary hover:text-white">Cancel</button>
                        <div className="flex items-center gap-2">
                            {step > 1 && <button type="button" onClick={handleBack} className="px-4 py-2 bg-brand-gray rounded-md text-sm font-semibold hover:bg-brand-border">Back</button>}
                            {step < 2 && <button onClick={handleNext} className="px-4 py-2 bg-brand-primary rounded-md text-sm font-semibold hover:bg-brand-accent text-white">Next</button>}
                            {step === 2 && <button type="submit" className="px-4 py-2 bg-green-600 rounded-md text-sm font-semibold hover:bg-green-700 text-white">Complete Enrollment</button>}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnrollmentView;