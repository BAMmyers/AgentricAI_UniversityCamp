import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View } from '../App';
import { BookOpenIcon, BeakerIcon, MusicalNoteIcon, PaintBrushIcon, ArrowUturnLeftIcon, XMarkIcon, SparklesIcon, LightBulbIcon, TrophyIcon, ArrowPathIcon } from './icons';
import { useAppContext } from '../context/AppContext';
import { Agent, Student, Workflow, NodeData, Connection, ScheduleItem, ShowcasedProject } from '../types/index';
import { generateContent } from '../services/geminiService';

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
const StudentDashboard: React.FC<{ setActiveView: (view: View) => void }> = ({ setActiveView }) => {
    const { state, dispatch } = useAppContext();
    const activeStudent = state.students.find(s => s.id === state.activeStudentId) || null;
    const companionAgent = activeStudent ? state.agents.find(a => a.id === activeStudent.companionAgentId) || null : null;
    
    const [activeModalItem, setActiveModalItem] = useState<ScheduleItem | null>(null);
    const [modalContent, setModalContent] = useState<any>(null);
    const [isExecuting, setIsExecuting] = useState(false);
    
    const scheduleEvolvedForGoals = useRef<string[]>([]);
    
    const evolveSchedule = useCallback(async (student: Student, agent: Agent) => {
        const goalsToProcess = [...student.parentGoals, ...student.teacherCurriculum, ...student.preferences.preferredTopics];
        if (goalsToProcess.length === 0) return;
        
        const newGoals = goalsToProcess.filter(g => !scheduleEvolvedForGoals.current.includes(g));
        if (newGoals.length === 0) return;

        console.log(`Companion Agent [${agent.name}] is evolving the schedule for Student [${student.id}] based on new stakeholder input...`);
        
        const prompt = `
            An AI tutor needs to create a new learning activity for a student. Synthesize the following data points to propose a new, engaging activity.
            
            - Student's Preferences: [${student.preferences.preferredTopics.join(', ')}]
            - New Goals/Curriculum to Address: [${newGoals.join(', ')}]
            
            Based on ALL of the above, devise a single, creative activity. For example, if a parent wants less gaming, a teacher adds a 'game dev' course, and the student likes dinosaurs, you could suggest "Design a Dinosaur-themed Game Level".
            
            Respond with ONLY a JSON object with three keys:
            1. "title": A short, fun title for the activity (e.g., "Dino Game Design").
            2. "topic": A concise prompt for another AI to generate the activity's content (e.g., "a simple level design document for a 2D platformer game featuring a friendly T-Rex").
            3. "summary": A one-sentence summary for the parent/teacher log explaining why you created this activity (e.g., "Created a 'Dino Game Design' activity to channel the student's interest in gaming towards the teacher's new game development curriculum.").
        `;
        
        const { text: result } = await generateContent({ prompt, systemInstruction: "You are an expert educational strategist who designs personalized learning plans." });

        try {
            const newActivity = JSON.parse(result);
            const newWorkflow: Workflow = {
                id: `wf-custom-${student.id}-${Date.now()}`, name: newActivity.title, ownerAgentId: agent.id,
                nodes: [
                    { id: 'n1', type: 'textInput', title: 'Topic Input', position: { x: 50, y: 100 }, inputs: [], outputs: [{ name: 'text', type: 'string' }], color: 'border-blue-500', content: { text: newActivity.topic } },
                    { id: 'n2', type: 'storyGenerator', title: 'Generate Content', position: { x: 350, y: 100 }, inputs: [{ name: 'prompt', type: 'string' }], outputs: [{ name: 'story', type: 'string' }], color: 'border-pink-500', content: { systemInstruction: 'You create short, simple, happy educational content for a young learner based on a specific topic.' } }
                ],
                connections: [{ fromNodeId: 'n1', fromOutput: 'text', toNodeId: 'n2', toInput: 'prompt' }]
            };
            dispatch({ type: 'ADD_WORKFLOW', payload: newWorkflow });

            const newScheduleItem: ScheduleItem = {
                id: `sched-custom-${Date.now()}`, title: newActivity.title, workflowId: newWorkflow.id, status: 'pending',
                icon: <SparklesIcon className="w-16 h-16"/>, color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
                notes: `Suggested for you!`
            };
            
            const currentSchedule = state.students.find(s => s.id === student.id)?.schedule || [];
            dispatch({ type: 'UPDATE_STUDENT_SCHEDULE', payload: { studentId: student.id, schedule: [...currentSchedule, newScheduleItem] } });
            scheduleEvolvedForGoals.current.push(...newGoals);
        } catch (error) {
            console.error("Failed to parse AI response for schedule evolution:", error, "Response was:", result);
        }
    }, [dispatch, state.students]);

    // This effect runs when the student data changes (e.g., from the parent console or adaptation)
    useEffect(() => {
        if (activeStudent && companionAgent) {
            if (activeStudent.schedule.length === 0) { // DAY ONE Experience
                console.log(`Companion Agent [${companionAgent.name}] is generating the initial "Day One" schedule.`);
                const storyWorkflow: Workflow = {
                    id: `wf-story-${activeStudent.id}`, name: "Daily Story Generation", ownerAgentId: companionAgent.id,
                    nodes: [
                        { id: 'n1', type: 'textInput', title: 'Topic', position: { x: 50, y: 100 }, inputs: [], outputs: [{name: 'text', type: 'string'}], color: 'border-blue-500', content: {text: `a short, happy story about a ${activeStudent.preferences.preferredTopics[0] || 'friendly robot'}`}},
                        { id: 'n2', type: 'storyGenerator', title: 'Write Story', position: { x: 350, y: 100 }, inputs: [{name: 'prompt', type: 'string'}], outputs: [{name: 'story', type: 'string'}], color: 'border-pink-500', content: {systemInstruction: 'You write very short, happy stories (2-3 paragraphs) for young children.'}}
                    ],
                    connections: [{ fromNodeId: 'n1', fromOutput: 'text', toNodeId: 'n2', toInput: 'prompt' }]
                };
                const artWorkflow: Workflow = {
                    id: `wf-art-${activeStudent.id}`, name: "Art Idea Generation", ownerAgentId: companionAgent.id,
                     nodes: [
                        { id: 'n1', type: 'textInput', title: 'Topic', position: { x: 50, y: 100 }, inputs: [], outputs: [{name: 'text', type: 'string'}], color: 'border-blue-500', content: {text: `a fun, simple drawing idea involving ${activeStudent.preferences.preferredTopics[1] || 'stars and planets'}`}},
                        { id: 'n2', type: 'storyGenerator', title: 'Generate Idea', position: { x: 350, y: 100 }, inputs: [{name: 'prompt', type: 'string'}], outputs: [{name: 'story', type: 'string'}], color: 'border-teal-500', content: {systemInstruction: 'You give a single, simple, fun drawing prompt for a child.'}}
                    ],
                    connections: [{ fromNodeId: 'n1', fromOutput: 'text', toNodeId: 'n2', toInput: 'prompt' }]
                };
                dispatch({ type: 'ADD_WORKFLOW', payload: storyWorkflow });
                dispatch({ type: 'ADD_WORKFLOW', payload: artWorkflow });
                const initialSchedule: ScheduleItem[] = [
                    { id: 'sched1', title: "Today's Story", workflowId: storyWorkflow.id, status: 'pending', icon: <BookOpenIcon className="w-16 h-16" />, color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
                    { id: 'sched2', title: 'Art Idea', workflowId: artWorkflow.id, status: 'pending', icon: <PaintBrushIcon className="w-16 h-16" />, color: 'bg-gradient-to-br from-red-500 to-orange-500' },
                ];
                dispatch({ type: 'UPDATE_STUDENT_SCHEDULE', payload: { studentId: activeStudent.id, schedule: initialSchedule } });
            } else { // Evolve schedule based on goals
                evolveSchedule(activeStudent, companionAgent);
            }
        }
    }, [activeStudent, companionAgent, dispatch, evolveSchedule]);

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
            const workflow = state.workflows.find(wf => wf.id === item.workflowId);
             // For completed items, we don't have the last output stored. A real app would store this.
             // For the demo, we'll show a generic completion message.
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
            setModalContent("Sorry, there was an error running this activity.");
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
        alert(`Agent has "observed" a new interest in ${newPref} and will adapt the schedule!`);
    }

    const handleShowcase = () => {
        if (!activeModalItem || !modalContent || !companionAgent) return;
        const project: ShowcasedProject = {
            id: activeModalItem.id, title: activeModalItem.title, content: modalContent, companionAgentId: companionAgent.id,
        };
        dispatch({ type: 'SHOWCASE_PROJECT', payload: project });
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
                    <button onClick={handleObserveAndAdapt} title="Simulate agent learning from interaction" className="flex items-center gap-2 bg-brand-light-gray px-4 py-2 rounded-lg text-brand-secondary hover:text-white">
                        <ArrowPathIcon className="w-5 h-5"/>
                        <span className="text-sm">Agent: Observe & Adapt</span>
                    </button>
                    <button onClick={() => setActiveView('university')} className="flex items-center gap-2 bg-brand-gray px-4 py-2 rounded-lg hover:bg-brand-light-gray">
                        <ArrowUturnLeftIcon className="w-5 h-5" />
                        <span className="text-sm">Exit</span>
                    </button>
                </div>
            </header>
            
            <main className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6">
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