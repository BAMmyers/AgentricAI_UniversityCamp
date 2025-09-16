import React, { useState, useCallback, useRef } from 'react';
// FIX: Added CheckCircleIcon and XCircleIcon to imports, they are now defined in icons.tsx
import { PlusIcon, PlayIcon, TrashIcon, CodeBracketIcon, BookOpenIcon, BeakerIcon, GlobeAltIcon, CommandLineIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, EyeIcon, PhotoIcon, ChatBubbleBottomCenterTextIcon, DocumentTextIcon, CpuIcon, SparklesIcon, QuestionMarkCircleIcon, ClipboardDocumentListIcon, DocumentMinusIcon, UserPlusIcon, PencilSquareIcon, InformationCircleIcon, XCircleIcon, CheckCircleIcon } from './icons';
import { View } from '../App';
import { useAppContext } from '../context/AppContext';
import { NodeData, Connection, Point, NodeType, Workflow, Agent } from '../types/index';
import { generateContent } from '../services/geminiService';

// --- CONSTANTS ---
const NODE_WIDTH = 250;
const HEADER_HEIGHT = 36;
const PORT_HEIGHT = 24;

// --- NODE DEFINITIONS ---
const NODE_TEMPLATES: Record<NodeType, Omit<NodeData, 'id' | 'position'>> = {
    textInput: {
        type: 'textInput', title: 'Text Input', inputs: [], outputs: [{ name: 'text', type: 'string' }], color: 'border-blue-500', icon: <DocumentTextIcon className="w-4 h-4"/>, content: { text: 'A friendly robot' }
    },
    storyGenerator: {
        type: 'storyGenerator', title: 'Story Generator', inputs: [{ name: 'prompt', type: 'string' }], outputs: [{ name: 'story', type: 'string' }], color: 'border-pink-500', icon: <SparklesIcon className="w-4 h-4"/>, content: { systemInstruction: 'You are a creative storyteller for children.' }
    },
    jsonExtractor: {
        type: 'jsonExtractor', title: 'JSON Extractor', inputs: [{ name: 'text', type: 'string' }], outputs: [{ name: 'json', type: 'json' }], color: 'border-indigo-500', icon: <CodeBracketIcon className="w-4 h-4"/>, content: { schema: '{"character_name": "string", "setting": "string"}' }
    },
    imageGenerator: {
        type: 'imageGenerator', title: 'Image Generator', inputs: [{ name: 'prompt', type: 'string' }], outputs: [{ name: 'image', type: 'image' }], color: 'border-teal-500', icon: <PhotoIcon className="w-4 h-4"/>, content: {}
    },
    agentDesigner: {
        type: 'agentDesigner', title: 'Agent Designer', inputs: [{ name: 'task', type: 'string' }], outputs: [{ name: 'agentDefinition', type: 'json' }], color: 'border-purple-500', icon: <UserPlusIcon className="w-4 h-4"/>, content: { systemInstruction: `You are an expert AI agent designer. Based on a user's task description, you will create a concise, unique name for a new agent and a detailed system instruction (persona). Respond ONLY with a JSON object with the keys "name" and "systemInstruction".` }
    },
    quizGenerator: {
        type: 'quizGenerator', title: 'Quiz Generator', inputs: [{ name: 'topic', type: 'string' }], outputs: [{ name: 'quizJson', type: 'json' }], color: 'border-amber-500', icon: <QuestionMarkCircleIcon className="w-4 h-4"/>, content: { systemInstruction: 'You create educational multiple-choice quizzes about a given topic. You only respond with JSON.' }
    },
    lessonPlanner: {
        type: 'lessonPlanner', title: 'Lesson Planner', inputs: [{ name: 'objective', type: 'string' }], outputs: [{ name: 'plan', type: 'string' }], color: 'border-sky-500', icon: <ClipboardDocumentListIcon className="w-4 h-4"/>, content: { systemInstruction: 'You are an expert curriculum designer who writes concise lesson plans.' }
    },
    textSummarizer: {
        type: 'textSummarizer', title: 'Text Summarizer', inputs: [{ name: 'text', type: 'string' }], outputs: [{ name: 'summary', type: 'string' }], color: 'border-orange-500', icon: <DocumentMinusIcon className="w-4 h-4"/>, content: { systemInstruction: 'You are an expert at summarizing text concisely into a short paragraph.' }
    },
     webSearch: {
        type: 'webSearch', title: 'Web Search', inputs: [{ name: 'query', type: 'string' }], outputs: [{ name: 'results', type: 'string' }, { name: 'sources', type: 'json' }], color: 'border-cyan-500', icon: <GlobeAltIcon className="w-4 h-4"/>, content: {}
    },
    dataDisplay: {
        type: 'dataDisplay', title: 'Data Display', inputs: [{ name: 'data', type: 'any' }], outputs: [], color: 'border-gray-500', icon: <EyeIcon className="w-4 h-4"/>, content: {}
    },
    imageDisplay: {
        type: 'imageDisplay', title: 'Image Display', inputs: [{ name: 'image', type: 'image' }], outputs: [], color: 'border-green-500', icon: <PhotoIcon className="w-4 h-4"/>, content: {}
    }
};

// --- HELPER FUNCTIONS ---
const getPortPosition = (node: NodeData, type: 'input' | 'output', portName: string): Point => {
    const portIndex = type === 'input' ? node.inputs.findIndex(p => p.name === portName) : node.outputs.findIndex(p => p.name === portName);
    return {
        x: type === 'output' ? node.position.x + NODE_WIDTH : node.position.x,
        y: node.position.y + HEADER_HEIGHT + (portIndex * PORT_HEIGHT) + (PORT_HEIGHT / 2),
    };
};

const getCurvePath = (startPos: Point, endPos: Point): string => {
    const dx = Math.abs(startPos.x - endPos.x) * 0.5;
    return `M ${startPos.x} ${startPos.y} C ${startPos.x + dx} ${startPos.y}, ${endPos.x - dx} ${endPos.y}, ${endPos.x} ${endPos.y}`;
};

// --- NODE COMPONENT ---
const NodeComponent: React.FC<{ data: NodeData; onNodeMouseDown: (e: React.MouseEvent, nodeId: string) => void; onPortMouseDown: (e: React.MouseEvent, nodeId: string, portName: string, type: 'input' | 'output') => void; onPortMouseUp: (e: React.MouseEvent, nodeId: string, portName: string, type: 'input' | 'output') => void; onContentChange: (nodeId: string, content: any) => void; onCreateAgent: (definition: any) => void; }> = ({ data, onNodeMouseDown, onPortMouseDown, onPortMouseUp, onContentChange, onCreateAgent }) => (
    <div
        className={`absolute bg-brand-gray border-2 ${data.color} rounded-md shadow-lg flex flex-col select-none transition-shadow duration-200 ${data.status === 'running' ? 'shadow-yellow-400/50' : ''}`}
        style={{ width: `${NODE_WIDTH}px`, top: data.position.y, left: data.position.x, cursor: 'grab' }}
        onMouseDown={(e) => onNodeMouseDown(e, data.id)}
    >
        <div className="bg-brand-light-gray p-2 rounded-t-md text-white font-bold text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">{data.icon}<span>{data.title}</span></div>
            {data.status === 'running' && <CpuIcon className="w-4 h-4 text-yellow-400 animate-spin" />}
            {data.status === 'success' && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
            {data.status === 'error' && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
        </div>
        <div className="p-2 relative min-h-[80px]">
            {data.inputs.map((input) => (
                <div key={input.name} className="absolute -left-1.5 flex items-center" style={{ top: `${HEADER_HEIGHT - 12 + data.inputs.findIndex(i => i.name === input.name) * PORT_HEIGHT}px` }} onMouseDown={(e) => { e.stopPropagation(); onPortMouseDown(e, data.id, input.name, 'input'); }} onMouseUp={(e) => { e.stopPropagation(); onPortMouseUp(e, data.id, input.name, 'input'); }}>
                    <div className="w-3 h-3 bg-brand-secondary rounded-full border-2 border-brand-light-gray cursor-crosshair"></div>
                    <span className="text-xs ml-2 text-brand-text-secondary">{input.name}</span>
                </div>
            ))}
            {data.outputs.map((output) => (
                <div key={output.name} className="absolute -right-1.5 flex items-center justify-end" style={{ top: `${HEADER_HEIGHT - 12 + data.outputs.findIndex(o => o.name === output.name) * PORT_HEIGHT}px`}} onMouseDown={(e) => { e.stopPropagation(); onPortMouseDown(e, data.id, output.name, 'output'); }} onMouseUp={(e) => { e.stopPropagation(); onPortMouseUp(e, data.id, output.name, 'output'); }}>
                    <span className="text-xs mr-2 text-brand-text-secondary">{output.name}</span>
                    <div className="w-3 h-3 bg-fuchsia-500 rounded-full border-2 border-brand-light-gray cursor-crosshair"></div>
                </div>
            ))}
             <div className="mt-2 text-sm">
                { data.type === 'textInput' && <textarea defaultValue={data.content?.text} onChange={e => onContentChange(data.id, { text: e.target.value })} className="bg-brand-dark border border-brand-border rounded px-2 py-1 w-full text-sm h-16 resize-none" /> }
                { data.type === 'dataDisplay' && <pre className="text-xs p-2 bg-brand-dark rounded text-green-300 overflow-auto max-h-40">{JSON.stringify(data.outputData, null, 2) || 'No data'}</pre> }
                { data.type === 'imageDisplay' && data.outputData?.startsWith('data:image') && <img src={data.outputData} alt="Generated" className="rounded-md"/>}
                { data.type === 'agentDesigner' && data.status === 'success' && (
                    <div className="p-2 bg-brand-dark rounded">
                        <p className="font-bold text-brand-text">{data.outputData.name}</p>
                        <p className="text-xs text-brand-text-secondary italic mt-1 truncate">{data.outputData.systemInstruction}</p>
                        <button onClick={() => onCreateAgent(data.outputData)} className="mt-3 w-full bg-brand-primary hover:bg-brand-accent text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs">
                           <PencilSquareIcon className="w-4 h-4" /> Create & Edit Agent
                        </button>
                    </div>
                )}
             </div>
        </div>
    </div>
);

interface LogEntry {
    timestamp: string;
    message: string;
    type: 'info' | 'error' | 'success' | 'running';
}

const ExecutionLog: React.FC<{logs: LogEntry[]}> = ({logs}) => {
    const logIcons = {
        info: <InformationCircleIcon className="w-4 h-4 text-brand-text-secondary"/>,
        error: <XCircleIcon className="w-4 h-4 text-red-400"/>,
        success: <CheckCircleIcon className="w-4 h-4 text-green-400"/>,
        running: <CpuIcon className="w-4 h-4 text-yellow-400 animate-spin"/>,
    };
    const logColors = {
        info: 'text-brand-text-secondary',
        error: 'text-red-400',
        success: 'text-green-400',
        running: 'text-yellow-400',
    };
    return (
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-brand-gray/80 backdrop-blur-sm border-t border-brand-border z-20 p-2 overflow-y-auto font-mono text-xs">
            {logs.slice().reverse().map((log, i) => 
                <div key={i} className={`flex items-start gap-2 ${logColors[log.type]}`}>
                    <span className="flex-shrink-0 mt-0.5">{logIcons[log.type]}</span>
                    <span className="flex-shrink-0 text-gray-500">{log.timestamp}</span>
                    <span className="flex-grow whitespace-pre-wrap">{log.message}</span>
                </div>
            )}
        </div>
    );
};


// --- STUDIO COMPONENT ---
interface StudioProps {
    setActiveView: (view: View) => void;
}

const Studio: React.FC<StudioProps> = ({ setActiveView }) => {
    const { state, dispatch } = useAppContext();
    const activeWorkflow = state.workflows.find(wf => wf.id === state.activeWorkflowId) as Workflow;

    const [draggingNode, setDraggingNode] = useState<{ id: string; offset: Point } | null>(null);
    const [drawingConnection, setDrawingConnection] = useState<{ fromNodeId: string; fromOutput: string; fromPosition: Point } | null>(null);
    const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 });
    const [executionLogs, setExecutionLogs] = useState<LogEntry[]>([]);
    const canvasRef = useRef<HTMLDivElement>(null);

    const updateWorkflow = (nodes: NodeData[], connections: Connection[]) => {
        dispatch({ type: 'UPDATE_WORKFLOW', payload: { ...activeWorkflow, nodes, connections } });
    };

    const addNode = (type: NodeType) => {
        const newNode: NodeData = {
            ...NODE_TEMPLATES[type],
            id: `${type}-${Date.now()}`,
            position: { x: 200, y: 150 },
        };
        updateWorkflow([...activeWorkflow.nodes, newNode], activeWorkflow.connections);
    };
    
    const handleCreateAgentFromNode = (definition: { name: string, systemInstruction: string }) => {
        const newAgentId = `agent-${Date.now()}`;
        const newAgent: Agent = {
            id: newAgentId,
            name: definition.name,
            identity: definition.name,
            model: 'gemini-2.5-flash',
            systemInstruction: definition.systemInstruction,
            tools: [],
            coreMemory: [],
        };
        dispatch({ type: 'ADD_AGENT', payload: newAgent });
        dispatch({ type: 'SET_ACTIVE_AGENT_ID', payload: newAgentId });
        setActiveView('agent-editor');
    };

    const clearWorkflow = () => updateWorkflow([], []);

    const handleNodeContentChange = (nodeId: string, content: any) => {
        const newNodes = activeWorkflow.nodes.map(n => n.id === nodeId ? { ...n, content: { ...n.content, ...content } } : n);
        updateWorkflow(newNodes, activeWorkflow.connections);
    };
    
    const log = (message: string, type: LogEntry['type']) => {
        setExecutionLogs(prev => [{ message, type, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    };

    const runWorkflow = async () => {
        setExecutionLogs([]);
        log('Starting workflow execution...', 'info');
        
        let nodesToProcess = activeWorkflow.nodes.filter(n => n.inputs.length === 0);
        const processedNodeIds = new Set<string>();
        let processingQueue = [...nodesToProcess];
    
        let currentNodes: NodeData[] = activeWorkflow.nodes.map(n => ({...n, status: 'idle', outputData: undefined}));
        updateWorkflow(currentNodes, activeWorkflow.connections);

        const executeNode = async (node: NodeData): Promise<any> => {
            log(`Executing node: ${node.title}`, 'running');
            currentNodes = currentNodes.map(n => n.id === node.id ? { ...n, status: 'running' } : n);
            updateWorkflow(currentNodes, activeWorkflow.connections);

            try {
                // Gather inputs
                const inputs: Record<string, any> = {};
                for (const inputPort of node.inputs) {
                    const conn = activeWorkflow.connections.find(c => c.toNodeId === node.id && c.toInput === inputPort.name);
                    if (!conn) throw new Error(`Input '${inputPort.name}' is not connected.`);
                    const sourceNode = currentNodes.find(n => n.id === conn.fromNodeId);
                    if (!sourceNode || sourceNode.status !== 'success') throw new Error(`Source node '${sourceNode?.title}' for input '${inputPort.name}' has not completed successfully.`);
                    const sourceOutputData = sourceNode.outputData;
                    const connectedValue = sourceOutputData && typeof sourceOutputData === 'object' ? sourceOutputData[conn.fromOutput] : sourceOutputData;

                    if (connectedValue === undefined) {
                        throw new Error(`Output '${conn.fromOutput}' not found on source node '${sourceNode.title}'.`);
                    }
                    inputs[inputPort.name] = connectedValue;
                }

                let outputData: any = {};
                switch(node.type) {
                    case 'textInput':
                        outputData = { text: node.content?.text };
                        break;
                    case 'storyGenerator':
                        const storyPrompt = inputs.prompt || 'Tell me a short story.';
                        const { text: story } = await generateContent({ prompt: storyPrompt, systemInstruction: node.content?.systemInstruction });
                        outputData = { story };
                        break;
                    case 'jsonExtractor':
                        const jsonPrompt = `Extract information from the following text based on this schema ${node.content?.schema}. Text: ${inputs.text}`;
                        const { text: jsonString } = await generateContent({ prompt: jsonPrompt, systemInstruction: "You are a JSON extraction expert. Only respond with the JSON object." });
                        outputData = { json: JSON.parse(jsonString) };
                        break;
                    case 'agentDesigner':
                        const designPrompt = `Design an agent for the following task: "${inputs.task}"`;
                        const { text: agentJson } = await generateContent({ prompt: designPrompt, systemInstruction: node.content?.systemInstruction });
                        outputData = { agentDefinition: JSON.parse(agentJson) };
                        break;
                    case 'imageGenerator':
                        log('Image generation is not implemented. Using placeholder.', 'info');
                        outputData = { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' };
                        break;
                    case 'quizGenerator':
                        const quizPrompt = `Create a 3-question multiple-choice quiz about "${inputs.topic}". Respond with ONLY the JSON array, nothing else. The JSON schema for each question should be: {"question": "string", "options": ["string", "string", "string"], "answer": "string"}`;
                        const { text: quizJsonString } = await generateContent({ prompt: quizPrompt, systemInstruction: node.content?.systemInstruction });
                        outputData = { quizJson: JSON.parse(quizJsonString) };
                        break;
                    case 'lessonPlanner':
                        const lessonPrompt = `Create a simple, one-paragraph lesson plan for the learning objective: "${inputs.objective}".`;
                        const { text: plan } = await generateContent({ prompt: lessonPrompt, systemInstruction: node.content?.systemInstruction });
                        outputData = { plan };
                        break;
                    case 'textSummarizer':
                        const summaryPrompt = `Summarize the following text in three sentences or less: "${inputs.text}"`;
                        const { text: summary } = await generateContent({ prompt: summaryPrompt, systemInstruction: node.content?.systemInstruction });
                        outputData = { summary };
                        break;
                    case 'webSearch':
                        const { text: results, groundingChunks: sources } = await generateContent({ prompt: inputs.query, useGoogleSearch: true });
                        outputData = { results, sources };
                        break;
                    case 'dataDisplay':
                    case 'imageDisplay':
                        outputData = inputs.data !== undefined ? inputs.data : inputs.image;
                        break;
                }
                const finalOutput = (node.outputs.length === 1 && outputData[node.outputs[0].name]) ? outputData[node.outputs[0].name] : outputData;
                
                log(`Node ${node.title} executed successfully.`, 'success');
                currentNodes = currentNodes.map(n => n.id === node.id ? { ...n, status: 'success', outputData: finalOutput } : n);
                updateWorkflow(currentNodes, activeWorkflow.connections);
                return finalOutput;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                log(`ERROR executing node ${node.title}: ${errorMessage}`, 'error');
                currentNodes = currentNodes.map(n => n.id === node.id ? { ...n, status: 'error' } : n);
                updateWorkflow(currentNodes, activeWorkflow.connections);
                throw error;
            }
        };

        while(processingQueue.length > 0) {
            const nodeToRun = processingQueue.shift()!;
            if (processedNodeIds.has(nodeToRun.id)) continue;
            
            try {
                await executeNode(nodeToRun);
                processedNodeIds.add(nodeToRun.id);

                const nextNodes = activeWorkflow.connections
                    .filter(c => c.fromNodeId === nodeToRun.id)
                    .map(c => currentNodes.find(n => n.id === c.toNodeId))
                    .filter((n): n is NodeData => !!n);

                for (const nextNode of nextNodes) {
                    const allInputsReady = nextNode.inputs.every(input => {
                        const conn = activeWorkflow.connections.find(c => c.toNodeId === nextNode.id && c.toInput === input.name);
                        return conn && processedNodeIds.has(conn.fromNodeId);
                    });
                    if (allInputsReady) {
                        processingQueue.push(nextNode);
                    }
                }
            } catch (e) {
                log('Workflow stopped due to an error.', 'error');
                return;
            }
        }
        log('Workflow execution finished.', 'success');
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const currentMousePosition = { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top };
        setMousePosition(currentMousePosition);

        if (draggingNode) {
            const newNodes = activeWorkflow.nodes.map(node =>
                node.id === draggingNode.id
                    ? { ...node, position: { x: currentMousePosition.x - draggingNode.offset.x, y: currentMousePosition.y - draggingNode.offset.y } }
                    : node
            );
            updateWorkflow(newNodes, activeWorkflow.connections);
        }
    }, [draggingNode, activeWorkflow]);

    const handleMouseUp = useCallback(() => {
        setDraggingNode(null);
        setDrawingConnection(null);
    }, []);

    const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        const node = activeWorkflow.nodes.find(n => n.id === nodeId);
        if (!node) return;
        
        const canvasRect = canvasRef.current!.getBoundingClientRect();
        const offset = { 
            x: e.clientX - canvasRect.left - node.position.x, 
            y: e.clientY - canvasRect.top - node.position.y 
        };

        setDraggingNode({ id: nodeId, offset });
    }, [activeWorkflow.nodes]);

    const handlePortMouseDown = useCallback((e: React.MouseEvent, nodeId: string, portName: string, type: 'input' | 'output') => {
        e.stopPropagation();
        if (type === 'output') {
            const fromNode = activeWorkflow.nodes.find(n => n.id === nodeId);
            if (!fromNode) return;
            setDrawingConnection({
                fromNodeId: nodeId,
                fromOutput: portName,
                fromPosition: getPortPosition(fromNode, 'output', portName),
            });
        }
    }, [activeWorkflow.nodes]);
    
    const handlePortMouseUp = useCallback((e: React.MouseEvent, toNodeId: string, toInput: string, type: 'input' | 'output') => {
        e.stopPropagation();
        if (!drawingConnection || type !== 'input') {
            setDrawingConnection(null);
            return;
        }

        if (drawingConnection.fromNodeId === toNodeId) return;

        const isAlreadyConnected = activeWorkflow.connections.some(c => c.toNodeId === toNodeId && c.toInput === toInput);
        if (isAlreadyConnected) return; // Allow only one connection per input

        const newConnection: Connection = { ...drawingConnection, toNodeId, toInput };
        updateWorkflow(activeWorkflow.nodes, [...activeWorkflow.connections, newConnection]);
        setDrawingConnection(null);
    }, [drawingConnection, activeWorkflow]);


    return (
        <div className="flex flex-col h-full bg-brand-dark overflow-hidden">
             <header className="bg-brand-gray border-b border-brand-border px-4 py-2 flex justify-between items-center text-sm z-10 flex-shrink-0">
                <h1 className="text-xl font-bold text-white">AgentricAI Studio</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => { dispatch({type: 'SET_ACTIVE_AGENT_ID', payload: null}); setActiveView('agent-editor')}} className="bg-brand-primary hover:bg-brand-accent text-white px-3 py-1.5 rounded-md flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Define New Agent</button>
                    <button onClick={runWorkflow} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1"><PlayIcon className="w-4 h-4" /> Run Workflow</button>
                    <button onClick={clearWorkflow} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Clear Canvas</button>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <NodeLibrary onAddNode={addNode} />
                <main
                    ref={canvasRef}
                    className="flex-1 bg-brand-dark relative overflow-hidden"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.brand.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.brand.border)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
                    
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {activeWorkflow.connections.map((conn, index) => {
                            const fromNode = activeWorkflow.nodes.find(n => n.id === conn.fromNodeId);
                            const toNode = activeWorkflow.nodes.find(n => n.id === conn.toNodeId);
                            if (!fromNode || !toNode) return null;
                            const startPos = getPortPosition(fromNode, 'output', conn.fromOutput);
                            const endPos = getPortPosition(toNode, 'input', conn.toInput);
                            return <path key={index} d={getCurvePath(startPos, endPos)} stroke="rgb(139, 92, 246)" strokeWidth="2" fill="none" />;
                        })}
                        {drawingConnection && (
                            <path d={getCurvePath(drawingConnection.fromPosition, mousePosition)} stroke="rgb(236, 72, 153)" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                        )}
                    </svg>

                    {activeWorkflow.nodes.map(node => (
                        <NodeComponent
                            key={node.id}
                            data={node}
                            onNodeMouseDown={handleNodeMouseDown}
                            onPortMouseDown={handlePortMouseDown}
                            onPortMouseUp={handlePortMouseUp}
                            onContentChange={handleNodeContentChange}
                            onCreateAgent={handleCreateAgentFromNode}
                        />
                    ))}
                    {executionLogs.length > 0 && <ExecutionLog logs={executionLogs}/>}
                </main>
            </div>
        </div>
    );
};

const NodeLibrary: React.FC<{onAddNode: (type: NodeType) => void}> = ({onAddNode}) => {
    return (
        <div className="w-64 bg-brand-gray p-4 flex flex-col h-full border-r border-brand-border">
            <h2 className="text-lg font-bold text-white mb-4">Node Library</h2>
            <input type="text" placeholder="Search nodes..." className="w-full bg-brand-light-gray border border-brand-border rounded-md px-2 py-1 mb-4 text-sm" />
            <div className="overflow-y-auto space-y-4 text-sm">
                <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">INPUT</h3>
                     <ul className="space-y-1">
                        <li onClick={() => onAddNode('textInput')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><DocumentTextIcon className="w-4 h-4"/> Text Input</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">AI</h3>
                    <ul className="space-y-1">
                        <li onClick={() => onAddNode('storyGenerator')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><SparklesIcon className="w-4 h-4"/> Story Generator</li>
                        <li onClick={() => onAddNode('jsonExtractor')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><CodeBracketIcon className="w-4 h-4"/> JSON Extractor</li>
                        <li onClick={() => onAddNode('imageGenerator')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><PhotoIcon className="w-4 h-4"/> Image Generator</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">CUSTOM AGENTS</h3>
                    <ul className="space-y-1">
                        <li onClick={() => onAddNode('agentDesigner')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><UserPlusIcon className="w-4 h-4"/> Agent Designer</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">EDUCATION</h3>
                    <ul className="space-y-1">
                        <li onClick={() => onAddNode('quizGenerator')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><QuestionMarkCircleIcon className="w-4 h-4"/> Quiz Generator</li>
                        <li onClick={() => onAddNode('lessonPlanner')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><ClipboardDocumentListIcon className="w-4 h-4"/> Lesson Planner</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">TEXT</h3>
                    <ul className="space-y-1">
                        <li onClick={() => onAddNode('textSummarizer')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><DocumentMinusIcon className="w-4 h-4"/> Text Summarizer</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">RESEARCH</h3>
                    <ul className="space-y-1">
                         <li onClick={() => onAddNode('webSearch')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><GlobeAltIcon className="w-4 h-4"/> Web Search</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">DISPLAY</h3>
                    <ul className="space-y-1">
                        <li onClick={() => onAddNode('dataDisplay')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><EyeIcon className="w-4 h-4"/> Data Display</li>
                        <li onClick={() => onAddNode('imageDisplay')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><PhotoIcon className="w-4 h-4"/> Image Display</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Studio;