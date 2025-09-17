import React, { useState, useCallback, useEffect, useRef } from 'react';
import { initialSystemAgents } from '../core/agentDefinitions';
import type { NodeData, Edge, DynamicNodeConfig, Point, Environment, LlmServiceConfig, ExecutionHistoryEntry, SavedWorkflow, ExecutionRuntime, AiMode, ContextMemory, Port } from '../types/index';
import { NODE_CONFIG, DEFAULT_NODE_WIDTH } from '../core/constants';
import CanvasComponent from './canvas/CanvasComponent';
import EchoApp from './echo/EchoApp';
import MechanicStatus from './mechanic/MechanicStatus';
import { llmService } from '../services/llmService';
import { databaseService } from '../services/databaseService';
import { mechanicService } from '../services/mechanicService';
import { staticNodeLogics } from '../nodes/nodeLogicRegistry';
import { execute as executeDynamicNode } from '../nodes/dynamicNode';
import { prelimNodes, prelimEdges } from '../core/prelim-test-data';
import Sidebar from './sidebar/Sidebar';
import DefineNodeModal from './modals/DefineNodeModal';
import { securityService } from '../services/securityService';

const createPortsFromDefinitions = (portDefs: DynamicNodeConfig['inputs'] | DynamicNodeConfig['outputs'], type: 'input' | 'output'): Port[] => {
  return portDefs.map((def: Omit<Port, 'type' | 'id'> & { id?: string }, index) => ({
    id: def.id || `${type}-${def.name.toLowerCase().replace(/\s+/g, '_')}-${index}`,
    name: def.name,
    type,
    dataType: def.dataType,
    exampleValue: def.exampleValue
  }));
};

const GEMINI_API_KEY = process.env.API_KEY;

const AgenticStudio: React.FC = () => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [availableAgents, setAvailableAgents] = useState<DynamicNodeConfig[]>([]);
  
  const [showDefineNodeModal, setShowDefineNodeModal] = useState(false);
  const [environment, setEnvironment] = useState<Environment>('studio');
  const [executionRuntime, setExecutionRuntime] = useState<ExecutionRuntime>('native');
  const [aiMode, setAiMode] = useState<AiMode>('agent');
  const [contextMemory, setContextMemory] = useState<ContextMemory>('full');
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [activeDrawingToolNodeId, setActiveDrawingToolNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<{ nodes: NodeData[], edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [executionHistory, setExecutionHistory] = useState<ExecutionHistoryEntry[]>([]);
  const [savedWorkflows, setSavedWorkflows] = useState<Record<string, SavedWorkflow>>({});
  const [currentWorkflowName, setCurrentWorkflowName] = useState('Untitled Workflow');
  const [llmConfig, setLlmConfig] = useState<LlmServiceConfig>(llmService.getConfiguration());
  
  const isInitialMount = useRef(true);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const pushToHistory = useCallback((currentNodes: NodeData[], currentEdges: Edge[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ nodes: JSON.parse(JSON.stringify(currentNodes)), edges: JSON.parse(JSON.stringify(currentEdges)) });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      setNodes(JSON.parse(JSON.stringify(history[newIndex].nodes)));
      setEdges(JSON.parse(JSON.stringify(history[newIndex].edges)));
      setHistoryIndex(newIndex);
    }
  }, [canUndo, history, historyIndex]);

  const redo = useCallback(() => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      setNodes(JSON.parse(JSON.stringify(history[newIndex].nodes)));
      setEdges(JSON.parse(JSON.stringify(history[newIndex].edges)));
      setHistoryIndex(newIndex);
    }
  }, [canRedo, history, historyIndex]);

  useEffect(() => {
    const initializeApp = async () => {
        await mechanicService.init();
        await databaseService.init();
        
        const storedWorkflows = await databaseService.loadWorkflows();
        if(storedWorkflows) { setSavedWorkflows(storedWorkflows); }

        const autosaved = await databaseService.loadWorkflow('__autosave');
        const initialNodes = (autosaved && autosaved.nodes.length > 0) ? autosaved.nodes : prelimNodes;
        const initialEdges = (autosaved && autosaved.nodes.length > 0) ? autosaved.edges : prelimEdges;
        setNodes(initialNodes);
        setEdges(initialEdges);
        setHistory([{ nodes: initialNodes, edges: initialEdges }]);
        setHistoryIndex(0);
        
        const staticAgents = Object.entries(NODE_CONFIG).map(([key, config]) => ({ ...config, name: key, isDynamic: false }));
        const customAgents = await databaseService.loadCustomAgents();
        setAvailableAgents([...staticAgents, ...initialSystemAgents, ...customAgents]);
    };
    initializeApp().catch(e => mechanicService.logBug(e as Error, "App Init Failed"));
  }, []);

  useEffect(() => {
    if (isInitialMount.current) { isInitialMount.current = false; return; }
    const handler = setTimeout(() => databaseService.saveWorkflow('__autosave', nodes, edges), 1000);
    return () => clearTimeout(handler);
  }, [nodes, edges]);

  useEffect(() => {
    if (isInitialMount.current) return;
    databaseService.saveCustomAgents(availableAgents.filter(a => a.category === 'Custom Agents'));
  }, [availableAgents]);
  
  const handleNodeDrag = useCallback((nodeId: string, x: number, y: number) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, x, y, position: {x,y} } : n));
  }, []);

  const onAddNode = useCallback((agentConfig: DynamicNodeConfig, worldPoint: Point) => {
    const newNode: NodeData = {
      id: `${agentConfig.name.replace(/\s+/g, '_')}-${Date.now()}`,
      type: agentConfig.name as any,
      title: agentConfig.name,
      position: { x: worldPoint.x, y: worldPoint.y },
      inputs: createPortsFromDefinitions(agentConfig.inputs, 'input'),
      outputs: createPortsFromDefinitions(agentConfig.outputs, 'output'),
      data: agentConfig.inputs.reduce((acc, i) => i.id ? {...acc, [i.id]: i.exampleValue} : acc, {}),
      isDynamic: !!agentConfig.isDynamic,
      color: agentConfig.color,
      icon: agentConfig.icon,
      requiresWebSearch: !!agentConfig.requiresWebSearch,
      category: agentConfig.category,
      status: 'idle',
      currentWidth: agentConfig.currentWidth || DEFAULT_NODE_WIDTH,
      currentHeight: agentConfig.defaultHeight || 100,
      executionLogicPrompt: agentConfig.executionLogicPrompt,
      isImmutable: agentConfig.isImmutable,
      description: agentConfig.description,
      name: agentConfig.name,
      x: worldPoint.x,
      y: worldPoint.y,
    };
    setNodes(prev => [...prev, newNode]);
    pushToHistory([...nodes, newNode], edges);
  }, [nodes, edges, pushToHistory]);

  const onRemoveNode = useCallback((nodeId: string) => {
    const newNodes = nodes.filter(n => n.id !== nodeId);
    const newEdges = edges.filter(e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId);
    setNodes(newNodes);
    setEdges(newEdges);
    pushToHistory(newNodes, newEdges);
  }, [nodes, edges, pushToHistory]);

  const updateNodeInternalState = useCallback((nodeId: string, dataChanges: any, status?: NodeData['status'], error?: string | null, executionTime?: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? {
      ...n,
      data: { ...n.data, ...dataChanges },
      status: status ?? n.status,
      error: error === undefined ? n.error : error,
      executionTime: executionTime ?? n.executionTime,
    } : n));
  }, []);
  
  const handleRemoveEdge = useCallback((edgeId: string) => {
    setEdges(prev => {
        const newEdges = prev.filter(e => e.id !== edgeId);
        pushToHistory(nodes, newEdges);
        return newEdges;
    });
  }, [nodes, pushToHistory]);

  const onAddEdge = useCallback((newEdge: Edge) => {
    setEdges(prev => {
        const filtered = prev.filter(e => !(e.targetNodeId === newEdge.targetNodeId && e.targetInputId === newEdge.targetInputId));
        const newEdges = [...filtered, newEdge];
        pushToHistory(nodes, newEdges);
        return newEdges;
    });
  }, [nodes, pushToHistory]);

  const handleInteractionEnd = useCallback(() => pushToHistory(nodes, edges), [nodes, edges, pushToHistory]);

  const executeNode = useCallback(async (nodeId: string): Promise<NodeData['status']> => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return 'error';

    setHighlightedNodeId(nodeId);
    updateNodeInternalState(nodeId, {}, 'running', null, '...');
    const startTime = performance.now();
    let finalStatus: NodeData['status'] = 'error', errorMessage: string | null = null, execTime = '...';

    try {
        const execFn = staticNodeLogics[node.type] ?? (node.isDynamic ? executeDynamicNode : null);
        if (!execFn) throw new Error(`Execution logic not found for type: ${node.type}`);
        
        // FIX: The third argument to execFn must be a boolean indicating if it's a sandbox environment.
        const result = await execFn(node, llmService, environment === 'sandbox');
        execTime = `${((performance.now() - startTime) / 1000).toFixed(2)}s`;

        if (result.error) {
            errorMessage = result.error;
            finalStatus = 'error';
        } else {
            updateNodeInternalState(nodeId, result.outputs || {});
            finalStatus = 'success';
            edges.filter(e => e.sourceNodeId === nodeId).forEach(edge => {
                updateNodeInternalState(edge.targetNodeId, { [edge.targetInputId]: result.outputs?.[edge.sourceOutputId] });
            });
        }
    } catch (e) {
        execTime = `${((performance.now() - startTime) / 1000).toFixed(2)}s`;
        errorMessage = e instanceof Error ? e.message : String(e);
        finalStatus = 'error';
    } finally {
        updateNodeInternalState(nodeId, {}, finalStatus, errorMessage, execTime);
        if (!isWorkflowRunning) setHighlightedNodeId(null);
        // FIX: The status for ExecutionHistoryEntry must be 'success' or 'error'.
        // Create a new variable with the correct type to satisfy TypeScript.
        const historyEntryStatus: 'success' | 'error' = finalStatus === 'success' ? 'success' : 'error';
        setExecutionHistory(prev => [{ id: `${nodeId}-${Date.now()}`, nodeName: node.name || 'Unknown', nodeIcon: node.icon || '⚙️', status: historyEntryStatus, timestamp: new Date().toISOString(), executionTime: execTime, error: errorMessage }, ...prev]);
    }
    return finalStatus;
  }, [nodes, edges, updateNodeInternalState, isWorkflowRunning, environment]);

  const runFullWorkflow = async () => {
    setIsWorkflowRunning(true);
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const inDegree = new Map(nodes.map(n => [n.id, 0]));
    const adj = new Map(nodes.map(n => [n.id, [] as string[]]));
    edges.forEach(e => {
        adj.get(e.sourceNodeId)?.push(e.targetNodeId);
        inDegree.set(e.targetNodeId, (inDegree.get(e.targetNodeId) || 0) + 1);
    });
    const queue = nodes.filter(n => inDegree.get(n.id) === 0).map(n => n.id);
    for (const nodeId of queue) {
        if ((await executeNode(nodeId)) === 'error') break;
    }
    setIsWorkflowRunning(false);
    setHighlightedNodeId(null);
  };
  
  const handleDefineNode = useCallback(async (desc: string): Promise<{ success: boolean; error?: string }> => {
    const newAgent = await llmService.defineNodeFromPrompt(desc, environment === 'sandbox');
    if (!newAgent) return { success: false, error: "AI failed to define node." };
    const review = await securityService.reviewAgent(newAgent);
    if (!review.approved) return { success: false, error: `Review denied: ${review.reason}` };
    setAvailableAgents(prev => [...prev, { ...newAgent, isDynamic: true, category: 'Custom Agents' }]);
    return { success: true };
  }, [environment]);

  const handleSaveWorkflow = async () => {
    await databaseService.saveWorkflow(currentWorkflowName, nodes, edges);
    setSavedWorkflows(await databaseService.loadWorkflows());
  };
  
  const handleLoadWorkflow = async (name: string) => {
    const wf = await databaseService.loadWorkflow(name);
    if (wf) { setNodes(wf.nodes); setEdges(wf.edges); setCurrentWorkflowName(name); pushToHistory(wf.nodes, wf.edges); }
  };

  const handleDeleteWorkflow = async (name: string) => {
    await databaseService.deleteWorkflow(name);
    setSavedWorkflows(await databaseService.loadWorkflows());
  };

  const handleSaveLlmSettings = (config: LlmServiceConfig) => {
    llmService.setConfiguration(config);
    setLlmConfig(llmService.getConfiguration());
  };

  return (
    <div className={`flex flex-col h-full bg-gray-900 text-gray-300 ${environment === 'sandbox' ? 'sandbox-mode' : ''}`}>
      <main className="flex-grow flex relative overflow-hidden">
        <Sidebar 
          availableAgents={availableAgents} executionHistory={executionHistory} setExecutionHistory={setExecutionHistory}
          savedWorkflows={savedWorkflows} currentWorkflowName={currentWorkflowName} setCurrentWorkflowName={setCurrentWorkflowName}
          onSave={handleSaveWorkflow} onLoad={handleLoadWorkflow} onDelete={handleDeleteWorkflow}
          llmConfig={llmConfig} onLlmSettingsSave={handleSaveLlmSettings} hasApiKey={!!GEMINI_API_KEY}
          environment={environment} setEnvironment={setEnvironment} executionRuntime={executionRuntime} setExecutionRuntime={setExecutionRuntime}
          aiMode={aiMode} setAiMode={setAiMode} contextMemory={contextMemory} setContextMemory={setContextMemory}
          onDefineAgent={() => setShowDefineNodeModal(true)} onClearCanvas={() => { setNodes([]); setEdges([]); pushToHistory([], []); }}
          onRunWorkflow={runFullWorkflow} isWorkflowRunning={isWorkflowRunning}
        />
        <div className="flex-grow h-full relative">
            <CanvasComponent
              ref={canvasRef} nodes={nodes} edges={edges} onNodeDrag={handleNodeDrag}
              setNodes={setNodes} onAddEdge={onAddEdge} executeNode={executeNode}
              updateNodeInternalState={updateNodeInternalState} onRemoveNode={onRemoveNode}
              onRemoveEdge={handleRemoveEdge} onViewTransformChange={() => {}} 
              highlightedNodeId={highlightedNodeId} activeDrawingToolNodeId={activeDrawingToolNodeId} 
              setActiveDrawingToolNodeId={setActiveDrawingToolNodeId} isWorkflowRunning={isWorkflowRunning}
              onInteractionEnd={handleInteractionEnd} onAddNode={onAddNode} appMode={environment}
              // FIX: Provide a function that matches the expected signature (nodeId: string) => Promise<void>.
              onRequestReview={async (nodeId: string) => {}}
            />
        </div>
      </main>
      <MechanicStatus />
      {showDefineNodeModal && <DefineNodeModal isOpen={showDefineNodeModal} onClose={() => setShowDefineNodeModal(false)} onDefine={handleDefineNode} isSandbox={environment === 'sandbox'} />}
    </div>
  );
};

export default AgenticStudio;
