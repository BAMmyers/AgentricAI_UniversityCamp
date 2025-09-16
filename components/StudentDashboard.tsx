import React, { useEffect, useState } from 'react';
import { View } from '../App';
import { BookOpenIcon, BeakerIcon, MusicalNoteIcon, PaintBrushIcon, ArrowUturnLeftIcon, XMarkIcon } from './icons';
import { useAppContext } from '../context/AppContext';
import { Agent, Student, Workflow, NodeData, Connection, ScheduleItem } from '../types/index';
import { generateContent } from '../services/geminiService';

// --- MODAL FOR ACTIVITY ---
const ActivityModal: React.FC<{ content: any; title: string; onClose: () => void }> = ({ content, title, onClose }) => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        <div className="bg-brand-gray border border-brand-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <header className="flex justify-between items-center p-4 border-b border-brand-border">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <button onClick={onClose} className="text-brand-text-secondary hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
            </header>
            <main className="p-6 overflow-y-auto">
                {typeof content === 'string' ? (
                    <p className="text-brand-text whitespace-pre-wrap">{content}</p>
                ) : (
                    <pre className="text-xs text-green-300 bg-brand-dark p-2 rounded">{JSON.stringify(content, null, 2)}</pre>
                )}
            </main>
        </div>
    </div>
);

// --- DASHBOARD COMPONENT ---
const StudentDashboard: React.FC<{ setActiveView: (view: View) => void }> = ({ setActiveView }) => {
    const { state, dispatch } = useAppContext();
    const [activeStudent, setActiveStudent] = useState<Student | null>(null);
    const [companionAgent, setCompanionAgent] = useState<Agent | null>(null);
    const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<any>(null);
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        const student = state.students.find(s => s.id === state.activeStudentId);
        if (student) {
            setActiveStudent(student);
            const agent = state.agents.find(a => a.id === student.companionAgentId);
            setCompanionAgent(agent || null);
        }
    }, [state.activeStudentId, state.students, state.agents]);

    // AUTONOMOUS AGENT BEHAVIOR: Generate schedule if it doesn't exist
    useEffect(() => {
        if (activeStudent && companionAgent && activeStudent.schedule.length === 0) {
            console.log(`Companion Agent [${companionAgent.name}] is creating a schedule for Student [${activeStudent.id}]...`);
            
            // 1. Agent autonomously creates workflows
            const readingWorkflow: Workflow = {
                id: `wf-reading-${activeStudent.id}`, name: "Daily Story Generation", ownerAgentId: companionAgent.id,
                nodes: [
                    { id: 'n1', type: 'textInput', title: 'Story Topic', position: { x: 50, y: 100 }, inputs: [], outputs: [{ name: 'text', type: 'string' }], color: 'border-blue-500', content: { text: 'a friendly dragon who loves to bake' } },
                    { id: 'n2', type: 'storyGenerator', title: 'Generate Story', position: { x: 350, y: 100 }, inputs: [{ name: 'prompt', type: 'string' }], outputs: [{ name: 'story', type: 'string' }], color: 'border-pink-500', content: { systemInstruction: 'You write very short, simple, happy stories for a 5-year-old.' } }
                ],
                connections: [{ fromNodeId: 'n1', fromOutput: 'text', toNodeId: 'n2', toInput: 'prompt' }]
            };
             const artWorkflow: Workflow = {
                id: `wf-art-${activeStudent.id}`, name: "Art Idea Generation", ownerAgentId: companionAgent.id,
                nodes: [
                    { id: 'n1', type: 'textInput', title: 'Art Prompt', position: { x: 50, y: 100 }, inputs: [], outputs: [{ name: 'text', type: 'string' }], color: 'border-blue-500', content: { text: 'a simple drawing idea' } },
                    { id: 'n2', type: 'storyGenerator', title: 'Get Idea', position: { x: 350, y: 100 }, inputs: [{ name: 'prompt', type: 'string' }], outputs: [{ name: 'story', type: 'string' }], color: 'border-pink-500', content: { systemInstruction: 'Describe a fun and simple thing to draw in one sentence.' } }
                ],
                connections: [{ fromNodeId: 'n1', fromOutput: 'text', toNodeId: 'n2', toInput: 'prompt' }]
            };
            dispatch({ type: 'ADD_WORKFLOW', payload: readingWorkflow });
            dispatch({ type: 'ADD_WORKFLOW', payload: artWorkflow });

            // 2. Agent creates a schedule linking to these workflows
            const newSchedule: ScheduleItem[] = [
                { id: 'sched-1', title: "Today's Story", workflowId: readingWorkflow.id, status: 'pending', icon: <BookOpenIcon className="w-16 h-16"/>, color: 'bg-gradient-to-br from-blue-500 to-blue-700' },
                { id: 'sched-2', title: "Art Studio", workflowId: artWorkflow.id, status: 'pending', icon: <PaintBrushIcon className="w-16 h-16"/>, color: 'bg-gradient-to-br from-pink-500 to-pink-700' },
                { id: 'sched-3', title: "Science Lab", workflowId: '', status: 'pending', icon: <BeakerIcon className="w-16 h-16"/>, color: 'bg-gradient-to-br from-green-500 to-green-700' },
                { id: 'sched-4', title: "Music Time", workflowId: '', status: 'pending', icon: <MusicalNoteIcon className="w-16 h-16"/>, color: 'bg-gradient-to-br from-purple-500 to-purple-700' }
            ];
            dispatch({ type: 'UPDATE_STUDENT_SCHEDULE', payload: { studentId: activeStudent.id, schedule: newSchedule } });
        }
    }, [activeStudent, companionAgent, dispatch]);

    const handleActivityClick = async (item: ScheduleItem) => {
        if (!item.workflowId) {
            alert("This activity is not yet configured by your Companion Agent.");
            return;
        }

        const workflow = state.workflows.find(wf => wf.id === item.workflowId);
        if (!workflow) {
            alert("Could not find the associated activity workflow.");
            return;
        }

        setModalTitle(`Loading ${item.title}...`);
        setModalContent("Your companion agent is preparing your activity...");
        setIsActivityModalOpen(true);

        // Simplified workflow execution
        try {
            const inputNode = workflow.nodes.find(n => n.type === 'textInput');
            const prompt = inputNode?.content?.text || 'default prompt';
            const generatorNode = workflow.nodes.find(n => n.type === 'storyGenerator');
            const systemInstruction = generatorNode?.content?.systemInstruction;

            const { text: result } = await generateContent({ prompt, systemInstruction });
            setModalContent(result);
            setModalTitle(item.title);
        } catch (error) {
            setModalContent("Sorry, there was an error running this activity.");
        }
    };
    
    if (!activeStudent || !companionAgent) {
        return (
            <div className="p-6 text-center">
                <p>Loading student data...</p>
                <button onClick={() => setActiveView('university')} className="mt-4 text-brand-secondary">Go Back</button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-brand-dark min-h-full flex flex-col">
            {isActivityModalOpen && <ActivityModal content={modalContent} title={modalTitle} onClose={() => setIsActivityModalOpen(false)} />}
            <header className="flex justify-between items-center mb-8 flex-shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-white">Hello! I'm {companionAgent.identity}</h1>
                    <p className="text-brand-text-secondary">Here is your plan for today. What would you like to do?</p>
                </div>
                <button onClick={() => setActiveView('university')} className="flex items-center gap-2 bg-brand-gray px-4 py-2 rounded-lg hover:bg-brand-light-gray">
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                    <span className="text-sm">Exit</span>
                </button>
            </header>
            
            <main className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-6">
                {activeStudent.schedule.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => handleActivityClick(item)}
                        className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-white font-bold text-2xl p-4 text-center cursor-pointer transition-transform hover:scale-105 ${item.color}`}
                    >
                        {item.icon}
                        <span className="mt-4">{item.title}</span>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default StudentDashboard;