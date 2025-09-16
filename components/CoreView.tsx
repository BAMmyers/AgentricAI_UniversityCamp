import React, { useState, useEffect } from 'react';
import { manifestAgents } from '../core/agentManifest';
import { ManifestAgent, MissionPlan, MissionStep, CommLogEntry, MissionStepStatus } from '../types/index';
import { useAppContext } from '../context/AppContext';
import { PlusIcon, MinusCircleIcon, PaperAirplaneIcon, SparklesIcon, PlayIcon, CpuIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from './icons';
import { generateContent } from '../services/geminiService';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const CoreView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [objective, setObjective] = useState('');
    const [isPlanning, setIsPlanning] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [commLog, setCommLog] = useState<CommLogEntry[]>([]);
    
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

        const teamDetails = state.missionTeam.map(a => `- ${a.name}: ${a.role}`).join('\n');
        const prompt = `
            You are Orchestrator Alpha, an expert AI mission planner. Your task is to create a detailed, step-by-step mission plan to achieve a user's objective using a designated team of specialized agents.

            **Objective:** "${objective}"

            **Available Team:**
            ${teamDetails}

            Analyze the team's capabilities and the objective. Break the objective down into a logical sequence of actions. For each step, assign the most appropriate agent from the team.

            Respond with ONLY a JSON object with two keys:
            1. "overview": A brief, one-sentence summary of the overall mission strategy.
            2. "steps": An array of objects, where each object has the keys "step" (number), "agent" (the name of the assigned agent), "action" (a concise verb-based description of the task, e.g., "Analyze financial data"), and "objective" (a detailed description of what this step aims to accomplish).
        `;

        try {
            const { text } = await generateContent({ prompt });
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
        let currentPlan = state.missionPlan;

        addCommLog("Orchestrator", "Beginning mission execution.");
        
        for (let i = 0; i < currentPlan.steps.length; i++) {
            const step = currentPlan.steps[i];
            const agent = state.missionTeam.find(a => a.name === step.agent) || manifestAgents.find(a => a.name === step.agent);
            if (!agent) {
                dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'error', result: `Agent "${step.agent}" not found in team or manifest.` }});
                addCommLog("Orchestrator", `Execution failed: Agent "${step.agent}" not found.`, "System");
                setIsExecuting(false);
                return;
            }

            dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'active' }});
            addCommLog("Orchestrator", `Delegating task "${step.action}" to ${agent.name}.`, agent.name);
            await sleep(1500);

            const prompt = `
                You are the agent "${agent.name}". Your role is: "${agent.role}".
                Your current task is: "${step.action}".
                The overall mission objective is: "${objective}".
                The result from the previous step is: "${previousStepResult}".

                Based on all this information, perform your task and provide a concise result or summary of your action.
            `;
            
            try {
                const { text: result } = await generateContent({ prompt });
                
                // SIMULATION of adaptive re-planning
                if (agent.name.includes("Coder") && Math.random() < 0.4) { // 40% chance for Coder to "fail"
                    const errorResult = "Error: Code compilation failed due to a syntax error in the generated function.";
                    dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'error', result: errorResult }});
                    addCommLog(agent.name, `Task failed. ${errorResult}`, "Orchestrator");
                    
                    // Re-planning logic
                    addCommLog("Orchestrator", "Step failed. Re-evaluating mission plan...", "Coordinator");
                    await sleep(1000);
                    const newStep: MissionStep = { step: step.step + 0.5, agent: 'Bug', action: 'Debug Failing Code', objective: `Analyze the error message "${errorResult}" and the previous code to identify and fix the bug.`};
                    const updatedSteps = [...currentPlan.steps];
                    updatedSteps.splice(i + 1, 0, newStep);
                    // FIX: Use 'as const' to ensure 'pending' is treated as a literal type assignable to MissionStepStatus.
                    const newPlan = {...currentPlan, steps: updatedSteps.map((s, idx) => ({...s, step: idx + 1, status: 'pending' as const})) };
                    dispatch({ type: 'SET_MISSION_PLAN', payload: newPlan });
                    addCommLog("Coordinator", "Plan adapted. Injecting 'Bug' agent to debug the code before retrying.", "Orchestrator");
                    currentPlan = newPlan;
                    previousStepResult = errorResult; // Pass the error as context to the debugger
                    continue; // Restart the loop with the new plan
                }
                
                previousStepResult = result;
                dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'completed', result }});
                addCommLog(agent.name, `Task complete. Result: ${result.substring(0, 100)}...`, "Orchestrator");
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : "Unknown AI error.";
                dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'error', result: errorMessage }});
                addCommLog(agent.name, `Task failed with critical error: ${errorMessage}`, "Orchestrator");
                setIsExecuting(false);
                return;
            }
        }
        addCommLog("Orchestrator", "All mission steps completed successfully.");
        setIsExecuting(false);
    };

    const MissionStepStatusIcon: React.FC<{status?: MissionStepStatus}> = ({ status }) => {
        switch (status) {
            case 'active': return <CpuIcon className="w-4 h-4 text-yellow-400 animate-spin" />;
            case 'completed': return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
            case 'error': return <XCircleIcon className="w-4 h-4 text-red-400" />;
            default: return <div className="w-4 h-4" />;
        }
    };

    return (
        <div className="flex h-full bg-brand-dark text-brand-text font-sans">
            {/* Left Panel: Agent Roster */}
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

            {/* Middle Panel: Mission Control */}
            <div className="flex-1 p-6 flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-white">Mission Control</h2>
                    {state.missionPlan && !isExecuting && (
                        <button onClick={executeMission} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <PlayIcon className="w-5 h-5" /> Execute Crew Mission
                        </button>
                    )}
                 </div>
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
                                            <div className="flex items-center gap-2">
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
                         <div className="text-sm text-brand-text-secondary">AgentricAI Core OS Initialized. Assemble your team and define your mission objective.</div>
                    )}
                </div>
                 <form onSubmit={(e) => { e.preventDefault(); handleGeneratePlan(); }} className="mt-4 flex gap-2">
                    <input type="text" value={objective} onChange={e => setObjective(e.target.value)} placeholder="Enter mission objective..." className="w-full bg-brand-light-gray border border-brand-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    <button type="submit" disabled={isPlanning || isExecuting} className="bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:bg-brand-text-secondary">
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span>Plan</span>
                    </button>
                </form>
            </div>

            {/* Right Panel: Team Status & Comm Log */}
            <div className="w-1/3 bg-brand-gray border-l border-brand-border p-4 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-4">Team Status</h2>
                <div className="overflow-y-auto mb-4">
                    {state.missionTeam.length === 0 ? (
                        <p className="text-sm text-brand-text-secondary">No agents on team.</p>
                    ) : (
                        <div className="space-y-3">
                            {state.missionTeam.map(agent => (
                                <div key={agent.id} className="bg-brand-light-gray p-3 rounded-md border border-brand-border flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{agent.name}</h4>
                                        <p className="text-xs text-brand-text-secondary mt-1">Status: Idle</p>
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
                    {commLog.map((log, i) => (
                        <div key={i}>
                            <p className="text-brand-text-secondary">{log.timestamp}</p>
                            <p><span className="text-cyan-400">{log.source}</span> {log.target && `-> <span class="text-purple-400">${log.target}</span>`}: {log.content}</p>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default CoreView;