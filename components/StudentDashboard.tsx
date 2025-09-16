import React, { useState } from 'react';
import { ArrowUturnLeftIcon, XMarkIcon, SparklesIcon, TrophyIcon, ArrowPathIcon } from './icons';
import { useAppContext } from '../context/AppContext';
import { Workflow, NodeData, ScheduleItem, ShowcasedProject } from '../types/index';
import { generateContent } from '../services/geminiService';
import { useCompanionAgentLogic } from '../hooks/useCompanionAgentLogic';

// --- MODAL FOR ACTIVITY ---
const ActivityModal: React.FC<{ item: ScheduleItem; content: any; onClose: () => void; isLoading: boolean; onShowcase: () => void; isShowcased: boolean; }> = ({ item, content, onClose, isLoading, onShowcase, isShowcased }) => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-brand-gray border border-brand-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <header className="flex justify-between items-center p-4 border-b border-brand-border">
                <h2 className="text-xl font-bold text-white">{item.title}</h2>
                <button onClick={onClose} className="text-brand-text-secondary hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
            </header>
            <main className="p-6 overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-48">
                        <SparklesIcon className="w-12 h-12 text-brand-cyan animate-pulse" />
                        <p className="mt-4 text-brand-text-secondary">Your agent is preparing the activity...</p>
                    </div>
                ) : (
                    <div>
                        {typeof content === 'string' ? (
                            <p className="text-brand-text whitespace-pre-wrap leading-relaxed">{content}</p>
                        ) : (
                            <pre className="text-xs text-green-300 bg-brand-dark p-2 rounded">{JSON.stringify(content, null, 2)}</pre>
                        )}
                        {item.review && (
                            <div className="mt-6 border-t border-brand-border pt-4">
                                <h3 className="font-bold text-brand-secondary mb-2">A Note from Your Tutor:</h3>
                                <p className="text-sm text-brand-text-secondary italic">"{item.review}"</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
            {!isLoading && content && (
                 <footer className="p-4 border-t border-brand-border">
                    {isShowcased ? (
                        <div className="text-center text-sm text-yellow-400 font-semibold">Project is on display in the Showcase!</div>
                    ) : (
                        <button 
                            onClick={onShowcase}
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                        >
                            <TrophyIcon className="w-5 h-5"/>
                            Showcase this Project
                        </button>
                    )}
                </footer>
            )}
        </div>
    </div>
);

// --- DASHBOARD COMPONENT ---
const StudentDashboard: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const activeStudent = state.students.find(s => s.id === state.activeStudentId) || null;
    const companionAgent = activeStudent ? state.agents.find(a => a.id === activeStudent.companionAgentId) || null : null;
    
    // The agent's "brain" is now encapsulated in this custom hook.
    useCompanionAgentLogic();
    
    const [activeModalItem, setActiveModalItem] = useState<ScheduleItem | null>(null);
    const [modalContent, setModalContent] = useState<any>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    
    const executeWorkflow = async (workflow: Workflow): Promise<any> => {
        const nodeOutputs: Record<string, any> = {};
        let processingQueue: NodeData[] = workflow.nodes.filter(n => n.inputs.length === 0);
        const processedNodeIds = new Set<string>();

        while (processingQueue.length > 0) {
            const node = processingQueue.shift()!;
            if (processedNodeIds.has(node.id)) continue;

            const inputs: Record<string, any> = {};
            for (const inputPort of node.inputs) {
                const conn = workflow.connections.find(c => c.toNodeId === node.id && c.toInput === inputPort.name);
                if (conn) {
                    const sourceNodeOutput = nodeOutputs[conn.fromNodeId];
                    inputs[inputPort.name] = sourceNodeOutput ? sourceNodeOutput[conn.fromOutput] : undefined;
                }
            }
            
            let output: any = {};
            if (node.type === 'textInput') {
                output = { text: node.content?.text };
            }
            if (node.type === 'storyGenerator') {
                const { text } = await generateContent({ prompt: inputs.prompt, systemInstruction: node.content?.systemInstruction });
                output = { story: text };
            }
            nodeOutputs[node.id] = output;
            processedNodeIds.add(node.id);
            
            workflow.connections
                .filter(c => c.fromNodeId === node.id)
                .forEach(c => {
                    const nextNode = workflow.nodes.find(n => n.id === c.toNodeId);
                    if(nextNode) {
                        const allInputsReady = nextNode.inputs.every(input => {
                            const inputConn = workflow.connections.find(con => con.toNodeId === nextNode.id && con.toInput === input.name);
                            return inputConn && processedNodeIds.has(inputConn.fromNodeId);
                        });
                        if (allInputsReady) {
                             processingQueue.push(nextNode);
                        }
                    }
                });
        }
        
        const outputNodes = workflow.nodes.filter(n => n.outputs.length > 0 && workflow.connections.every(c => c.fromNodeId !== n.id));
        const lastNode = outputNodes[0] || workflow.nodes[workflow.nodes.length-1];
        return lastNode && nodeOutputs[lastNode.id] ? Object.values(nodeOutputs[lastNode.id])[0] : "Workflow completed with no final output.";
    };

    const handleActivityClick = async (item: ScheduleItem) => {
        if (item.status === 'completed') {
            setActiveModalItem(item);
            setModalContent(`You've completed this activity! Great job.`);
            return;
        }

        const workflow = state.workflows.find(wf => wf.id === item.workflowId);
        if (!workflow) return;

        setIsExecuting(true);
        setActiveModalItem(item);
        setModalContent(null);

        try {
            const result = await executeWorkflow(workflow);
            setModalContent(result);

            const feedbackPrompt = `A student just completed an activity called "${item.title}" and the result was: "${String(result).substring(0, 200)}...". Write a single sentence of constructive, coach-like feedback. Be encouraging but also suggest one small area for improvement or a question to think about. For example: "Great story! Next time, could you try adding more detail about what the dragon's bakery smells like?"`;
            const { text: review } = await generateContent({ prompt: feedbackPrompt, systemInstruction: "You are a supportive and insightful educational coach." });

            dispatch({
                type: 'LOG_ACTIVITY_COMPLETION',
                payload: { studentId: activeStudent!.id, scheduleItemId: item.id, summary: `Completed the '${item.title}' activity.`, review }
            });

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred running this activity.";
            setModalContent(errorMessage);
            dispatch({ type: 'SHOW_TOAST', payload: { message: errorMessage, type: 'error' } });
            console.error("Workflow execution error:", error);
        } finally {
            setIsExecuting(false);
        }
    };
    
    const handleObserveAndAdapt = () => {
        if (!activeStudent) return;
        
        const currentPrefs = activeStudent.preferences.preferredTopics;
        const newPref = currentPrefs.includes('Music Composition') ? 'Creative Coding' : 'Music Composition';

        const newPreferences = {
            ...activeStudent.preferences,
            preferredTopics: [...currentPrefs, newPref]
        };
        dispatch({
            type: 'UPDATE_STUDENT_PROFILE',
            payload: { studentId: activeStudent.id, preferences: newPreferences }
        });
        dispatch({
            type: 'SHOW_TOAST',
            payload: { message: `Agent has "observed" a new interest in ${newPref}!`, type: 'info' }
        });
    }

    const handleShowcase = () => {
        if (!activeModalItem || !modalContent || !companionAgent) return;
        const project: ShowcasedProject = {
            id: activeModalItem.id, title: activeModalItem.title, content: modalContent, companionAgentId: companionAgent.id,
        };
        dispatch({ type: 'SHOWCASE_PROJECT', payload: project });
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'Project added to the showcase!', type: 'success' } });
        setActiveModalItem(null);
    };
    
    if (!activeStudent || !companionAgent) {
        return <div className="p-6 text-center"><p>Loading student data...</p></div>;
    }

    const currentModalItem = activeStudent.schedule.find(item => item.id === activeModalItem?.id);
    const isShowcased = activeModalItem ? state.showcasedProjects.some(p => p.id === activeModalItem.id) : false;

    return (
        <div className="p-6 bg-brand-dark min-h-full flex flex-col">
            {activeModalItem && <ActivityModal item={currentModalItem!} content={modalContent} onClose={() => setActiveModalItem(null)} isLoading={isExecuting} onShowcase={handleShowcase} isShowcased={isShowcased} />}
            <header className="flex justify-between items-center mb-8 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white">Hello! I'm {companionAgent.identity}</h1>
                    <p className="text-brand-text-secondary">Here is your plan for today. Let's learn something new!</p>
                </div>
                 <div className="flex items-center gap-4">
                    <button onClick={handleObserveAndAdapt} title="Simulate agent learning from interaction" className="flex items-center gap-2 bg-brand-light-gray px-4 py-2 rounded-lg text-brand-secondary hover:text-white transition-colors duration-200">
                        <ArrowPathIcon className="w-5 h-5"/>
                        <span className="text-sm">Agent: Observe & Adapt</span>
                    </button>
                </div>
            </header>
            
            <main className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6">
                {activeStudent.schedule.length === 0 && (
                    <div className="col-span-full flex items-center justify-center text-brand-text-secondary">
                        Your companion agent is preparing your first set of activities...
                    </div>
                )}
                {activeStudent.schedule.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => handleActivityClick(item)}
                        className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center text-white font-bold text-2xl p-4 text-center cursor-pointer transition-transform hover:scale-105 ${item.color} ${item.status === 'completed' ? 'opacity-50' : ''}`}
                    >
                        {item.status === 'completed' && <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center font-bold text-3xl">DONE!</div>}
                        <div className="transform scale-150">{item.icon}</div>
                        <span className="mt-4 text-xl">{item.title}</span>
                        {item.notes && <span className="absolute top-2 right-2 text-xs bg-black/50 px-2 py-0.5 rounded-full">{item.notes}</span>}
                    </div>
                ))}
            </main>
        </div>
    );
};

export default StudentDashboard;