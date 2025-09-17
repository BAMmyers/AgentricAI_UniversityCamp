import React, { useState, useEffect } from 'react';
import { manifestAgents } from '../core/agentManifest';
import { ManifestAgent, MissionPlan, CommLogEntry, MissionStepStatus, Action } from '../types/index';
import { useAppContext } from '../context/AppContext';
import { PlusIcon, MinusCircleIcon, PaperAirplaneIcon, SparklesIcon, PlayIcon, CpuIcon, CheckCircleIcon, XCircleIcon, CommandLineIcon } from './icons';
import { generateContent } from '../services/logicBroker';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MissionCommandView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [objective, setObjective] = useState('');
    const [isPlanning, setIsPlanning] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [commLog, setCommLog] = useState<CommLogEntry[]>([]);
    const brokerParams = {
        isPremium: state.currentUser?.subscriptionPlan === 'pro',
        isOnline: !state.isOfflineMode,
        dispatch: dispatch as React.Dispatch<Action>
    };
    
    useEffect(() => {
        // Clear logs and execution status when plan or team changes
        setIsExecuting(false);
        setCommLog([]);
    }, [state.missionPlan, state.missionTeam]);


    const groupedAgents = manifestAgents.reduce((acc, agent) => {
        const category = agent.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(agent);
        return acc;
    }, {} as Record<string, ManifestAgent[]>);

    const handleAddAgent = (agent: ManifestAgent) => {
        dispatch({ type: 'ADD_AGENT_TO_TEAM', payload: agent });
    };

    const handleRemoveAgent = (agentId: string) => {
        dispatch({ type: 'REMOVE_AGENT_FROM_TEAM', payload: agentId });
    };
    
    const handleGeneratePlan = async () => {
        if (!objective.trim() || state.missionTeam.length === 0) {
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'Please enter an objective and assemble a team.', type: 'error' } });
            return;
        }
        setIsPlanning(true);
        dispatch({ type: 'SET_MISSION_PLAN', payload: null });
        setCommLog([]);

        const teamDetails = state.missionTeam.map(a => `- ${a.name} (${a.id}): ${a.role}`).join('\n');
        const prompt = `
            You are Orchestrator Alpha, an expert AI mission planner. Your sole function is to create a detailed, step-by-step mission plan based on an objective and an available team of agents.

            **Objective:** "${objective}"

            **Available Team:**
            ${teamDetails}

            Analyze the objective and the team's capabilities. Decompose the objective into a logical sequence of actions. Assign the most appropriate agent from the team to each step.

            Your response MUST be a single, raw JSON object and nothing else. Do not use markdown formatting (e.g., \`\`\`json).
            The JSON object must adhere strictly to this schema:
            {
              "overview": "string",
              "steps": [
                {
                  "step": number,
                  "agent": "string (must be an exact name from the team list)",
                  "action": "string",
                  "objective": "string"
                }
              ]
            }
        `;

        try {
            const { text } = await generateContent({ prompt }, brokerParams);
            const plan: MissionPlan = JSON.parse(text);
            dispatch({ type: 'SET_MISSION_PLAN', payload: plan });
        } catch (e) {
            console.error("Failed to parse mission plan:", e);
            const errorMessage = e instanceof Error ? e.message : "The Orchestrator AI failed to generate a valid plan. Please try refining your objective.";
            dispatch({ type: 'SHOW_TOAST', payload: { message: errorMessage, type: 'error' } });
        } finally {
            setIsPlanning(false);
        }
    };
    
    const addCommLog = (source: string, content: string, target?: string) => {
        setCommLog(prev => [{ timestamp: new Date().toLocaleTimeString(), source, target, content }, ...prev]);
    }
    
    const executeMission = async () => {
        if (!state.missionPlan) return;
        setIsExecuting(true);
        let previousStepResult = `Initial Objective: "${objective}"`;
        
        addCommLog("Orchestrator Alpha", "Beginning mission execution.");
        
        for (const step of state.missionPlan.steps) {
            const agent = state.missionTeam.find(a => a.name === step.agent) || manifestAgents.find(a => a.name === step.agent);
            if (!agent) {
                const errorResult = `Agent "${step.agent}" not found in team or manifest.`;
                dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'error', result: errorResult }});
                addCommLog("Orchestrator Alpha", `Execution failed: Agent "${step.agent}" not found.`, "System");
                setIsExecuting(false);
                return;
            }

            dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'active' }});
            addCommLog("Orchestrator Alpha", `Delegating task "${step.action}" to ${agent.name}.`, agent.name);
            await sleep(1500);

            const prompt = `
                You are the agent "${agent.name}". Your role is: "${agent.role}".
                Your current task is: "${step.action}".
                The overall mission objective is: "${objective}".
                The result from the previous step is: "${previousStepResult}".

                Based on all this information, perform your task and provide a concise result or summary of your action.
            `;
            
            try {
                const { text: result } = await generateContent({ prompt }, brokerParams);
                previousStepResult = result;
                dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'completed', result }});
                addCommLog(agent.name, `Task complete. Result: ${result.substring(0, 100)}...`, "Orchestrator Alpha");
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : "Unknown AI error.";
                dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'error', result: errorMessage }});
                addCommLog(agent.name, `Task failed with critical error: ${errorMessage}`, "Orchestrator Alpha");
                setIsExecuting(false);
                return;
            }
        }
        addCommLog("Orchestrator Alpha", "All mission steps completed successfully.");
        setIsExecuting(false);
    };

    const MissionStepStatusIcon: React.FC<{status?: MissionStepStatus}> = ({ status }) => {
        switch (status) {
            case 'active': return <CpuIcon className="w-4 h-4 text-yellow-400 animate-spin" />;
            case 'completed': return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
            case 'error': return <XCircleIcon className="w-4 h-4 text-red-400" />;
            default: return <div className="w-4 h-4 border-2 border-brand-border rounded-full" />;
        }
    };

    return (
        <div className="flex h-full bg-brand-dark text-brand-text font-sans">
            <div className="w-1/3 bg-brand-gray border-r border-brand-border p-4 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-4">Agent Roster</h2>
                <div className="flex-grow overflow-y-auto pr-2">
                    {Object.entries(groupedAgents).map(([category, agents]) => (
                        <div key={category} className="mb-6">
                            <h3 className="text-sm font-semibold text-brand-primary mb-2 sticky top-0 bg-brand-gray py-1">{category}</h3>
                            <div className="space-y-2">
                                {agents.map(agent => (
                                    <div key={agent.id} className="bg-brand-light-gray p-3 rounded-md border border-brand-border">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-sm text-white">{agent.name}</h4>
                                            <button onClick={() => handleAddAgent(agent)} className="text-brand-text-secondary hover:text-white transition-colors" title="Add to team">
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-brand-text-secondary mt-1">{agent.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col">
                 <header className="flex-shrink-0 flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <CommandLineIcon className="w-8 h-8 text-brand-cyan" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Mission Command</h1>
                            <p className="text-brand-text-secondary">Interface with Orchestrator Alpha to execute complex objectives.</p>
                        </div>
                    </div>
                    {state.missionPlan && !isExecuting && (
                        <button onClick={executeMission} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <PlayIcon className="w-5 h-5" /> Execute Mission
                        </button>
                    )}
                 </header>
                <div className="flex-grow bg-brand-gray border border-brand-border rounded-md p-4 flex flex-col overflow-y-auto">
                    {isPlanning ? (
                        <div className="flex-grow flex items-center justify-center text-center text-brand-text-secondary">
                            <div>
                                <SparklesIcon className="w-12 h-12 mx-auto text-brand-cyan animate-pulse"/>
                                <p className="mt-2">Orchestrator Alpha is generating a mission plan...</p>
                            </div>
                        </div>
                    ) : state.missionPlan ? (
                         <div>
                            <h3 className="font-bold text-white">Mission Overview:</h3>
                            <p className="text-sm text-brand-text-secondary italic mb-4">{state.missionPlan.overview}</p>
                            <div className="space-y-3">
                                {state.missionPlan.steps.map(step => (
                                    <div key={step.step} className="bg-brand-dark p-3 rounded-lg border border-brand-border">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <MissionStepStatusIcon status={step.status} />
                                                <h4 className="font-semibold text-brand-cyan">Step {step.step}: {step.action}</h4>
                                            </div>
                                            <span className="text-xs font-mono bg-brand-light-gray px-2 py-1 rounded">{step.agent}</span>
                                        </div>
                                        <p className="text-sm text-brand-text-secondary mt-1">{step.objective}</p>
                                        {step.result && <pre className="text-xs mt-2 p-2 bg-brand-light-gray/50 border border-brand-border rounded-md whitespace-pre-wrap">{step.result}</pre>}
                                    </div>
                                ))}
                            </div>
                         </div>
                    ) : (
                         <div className="text-sm text-brand-text-secondary p-4">Awaiting objective. Assemble your team and define the mission. Orchestrator Alpha is standing by.</div>
                    )}
                </div>
                 <form onSubmit={(e) => { e.preventDefault(); handleGeneratePlan(); }} className="mt-4 flex gap-2">
                    <input type="text" value={objective} onChange={e => setObjective(e.target.value)} placeholder="Define mission objective..." className="w-full bg-brand-light-gray border border-brand-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    <button type="submit" disabled={isPlanning || isExecuting} className="bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:bg-brand-text-secondary">
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span>Generate Plan</span>
                    </button>
                </form>
            </div>

            <div className="w-1/3 bg-brand-gray border-l border-brand-border p-4 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-4">Assembled Team</h2>
                <div className="overflow-y-auto mb-4">
                    {state.missionTeam.length === 0 ? (
                        <p className="text-sm text-brand-text-secondary">No agents on team.</p>
                    ) : (
                        <div className="space-y-3">
                            {state.missionTeam.map(agent => (
                                <div key={agent.id} className="bg-brand-light-gray p-3 rounded-md border border-brand-border flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{agent.name}</h4>
                                        <p className="text-xs text-brand-text-secondary mt-1">Status: STANDBY</p>
                                    </div>
                                    <button onClick={() => handleRemoveAgent(agent.id)} className="text-red-500 hover:text-red-400 transition-colors flex-shrink-0 ml-2" title="Remove from team">
                                        <MinusCircleIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                 <h2 className="text-lg font-bold text-white mb-4 border-t border-brand-border pt-4">Communication Bus</h2>
                 <div className="flex-grow overflow-y-auto font-mono text-xs space-y-2">
                    {commLog.slice().reverse().map((log, i) => (
                        <div key={i} className="animate-fade-in">
                            <p className="text-gray-500">{log.timestamp}</p>
                            <p className="text-brand-text-secondary"><span className="text-cyan-400">{log.source}</span> {log.target && `-> <span class="text-purple-400">${log.target}</span>`}: <span className="text-brand-text">{log.content}</span></p>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default MissionCommandView;