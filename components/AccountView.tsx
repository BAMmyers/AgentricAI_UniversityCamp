import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CreditCardIcon, StarIcon, ShieldCheckIcon } from './icons';

const AccountView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { currentUser } = state;

    if (!currentUser) {
        return <div className="p-6">Not logged in.</div>
    }

    const handleUpgrade = () => {
        dispatch({ type: 'UPGRADE_PLAN' });
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'Successfully upgraded to Pro Plan!', type: 'success' } });
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <CreditCardIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Account & Billing</h1>
                    <p className="text-brand-text-secondary">Manage your subscription and review our ecosystem philosophy.</p>
                </div>
            </header>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subscription Plans */}
                <div className="space-y-6">
                    <div className={`p-6 rounded-lg border-2 ${currentUser.subscriptionPlan === 'free' ? 'border-brand-primary' : 'border-brand-border'} bg-brand-gray`}>
                        <h2 className="text-xl font-bold text-white">Free Plan</h2>
                        <p className="text-brand-text-secondary text-sm mt-1 mb-4">Core features for all users.</p>
                        <ul className="text-sm space-y-2 text-brand-text">
                            <li>✓ Access for 1 Student</li>
                            <li>✓ Standard AI Companion Agent</li>
                            <li>✓ Core Curriculum Activities</li>
                            <li>✓ Privacy-First Data Model</li>
                        </ul>
                         {currentUser.subscriptionPlan === 'free' && (
                            <button disabled className="w-full mt-6 bg-brand-primary text-white font-semibold py-2 rounded-md opacity-50">Current Plan</button>
                        )}
                    </div>
                    
                    <div className={`p-6 rounded-lg border-2 ${currentUser.subscriptionPlan === 'pro' ? 'border-yellow-400' : 'border-brand-border'} bg-brand-gray`}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Pro Plan</h2>
                            <span className="flex items-center gap-1 text-xs font-bold text-yellow-400"><StarIcon className="w-4 h-4"/> PREMIUM</span>
                        </div>
                        <p className="text-brand-text-secondary text-sm mt-1 mb-4">Unlock advanced AI and administrative features.</p>
                         <ul className="text-sm space-y-2 text-brand-text">
                            <li>✓ All features from Free Plan</li>
                            <li>✓ Access for up to 5 Students</li>
                            <li>✓ **Gemini 2.5 Flash** powered agents</li>
                            <li>✓ Advanced Administrative Tools</li>
                            <li>✓ Priority Support</li>
                        </ul>
                        {currentUser.subscriptionPlan === 'free' ? (
                            <button onClick={handleUpgrade} className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md">Upgrade to Pro</button>
                        ) : (
                            <button disabled className="w-full mt-6 bg-yellow-500 text-black font-semibold py-2 rounded-md opacity-50">Current Plan</button>
                        )}
                    </div>
                </div>

                {/* Ecosystem Philosophy */}
                <div className="bg-brand-gray border border-brand-border rounded-lg p-6">
                    <div className="flex items-center text-brand-cyan mb-3">
                        <ShieldCheckIcon className="w-6 h-6 mr-2" />
                        <h2 className="text-xl font-bold text-white">Our Ecosystem Philosophy</h2>
                    </div>
                    <div className="text-sm text-brand-text-secondary space-y-4 leading-relaxed">
                        <p>
                            AgentricAI University is built on a vision of creating a self-sustaining, collaborative educational platform. We believe in transparency and fair value exchange for the powerful AI technologies that make this possible.
                        </p>
                        <p>
                            Our freemium model is designed to support this vision. For premium services that utilize advanced, large-scale AI models from partners like Google, we have structured our revenue model to be both sustainable and equitable.
                        </p>
                        <p className="font-semibold text-brand-text p-3 bg-brand-dark rounded-md border border-brand-light-gray">
                            A <span className="text-brand-primary font-bold">90% majority</span> of the subscription fee is allocated directly to cover the computational costs and licensing of the advanced AI models. The remaining <span className="text-brand-primary font-bold">10%</span> serves as a royalty to support the ongoing development, maintenance, and innovation of the AgentricAI platform itself.
                        </p>
                        <p>
                            This structure ensures that the platform can continue to grow, innovate, and provide cutting-edge educational tools, while fairly compensating the foundational technologies it is built upon.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountView;
