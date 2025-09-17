import { NodeData, Edge, Port } from '../types/index';
import { NODE_CONFIG } from './constants';

const createNode = (type: keyof typeof NODE_CONFIG, id: string, x: number, y: number, data?: any): NodeData => {
    const config = NODE_CONFIG[type];
    const baseNode: Omit<NodeData, 'inputs' | 'outputs'> = {
        id,
        type,
        title: config.description,
        name: type,
        x, y,
        position: { x, y },
        data: data || {},
        isDynamic: false,
        color: config.color,
        icon: config.icon,
        category: config.category,
        status: 'idle',
        description: config.description,
        currentWidth: 250,
    };
    return {
        ...baseNode,
        // FIX: The 'type' property is required for Port objects.
        inputs: config.inputs.map((p, i) => ({ ...p, type: 'input', id: p.id || `${type}-input-${i}`}) as Port),
        outputs: config.outputs.map((p, i) => ({ ...p, type: 'output', id: p.id || `${type}-output-${i}`}) as Port),
    };
};

export const prelimNodes: NodeData[] = [
    createNode('textInput', 'text-input-1', 50, 200, { text: 'A friendly robot' }),
    createNode('storyGenerator', 'novelist-1', 400, 100, {}),
    // FIX: Corrected typo from 'contentSummarizer' to 'textSummarizer'
    createNode('textSummarizer', 'summarizer-1', 400, 300, {}),
    createNode('agentDesigner', 'agent-designer-1', 800, 200, {}),
    createNode('jsonExtractor', 'data-extractor-1', 50, 550, {}),
    createNode('lessonPlanner', 'curriculum-designer-1', 1200, 300, {}),
    createNode('quizGenerator', 'tutor-1', 1200, 100, {}),
    createNode('dataDisplay', 'data-display-1', 1600, 200, {}),
    createNode('imageDisplay', 'image-display-1', 800, 600, {}),
];

export const prelimEdges: Edge[] = [
    { id: 'e1', sourceNodeId: 'text-input-1', sourceOutputId: 'text-output', targetNodeId: 'novelist-1', targetInputId: 'prompt-input' },
    { id: 'e2', sourceNodeId: 'novelist-1', sourceOutputId: 'story-output', targetNodeId: 'summarizer-1', targetInputId: 'text-input' },
    { id: 'e3', sourceNodeId: 'novelist-1', sourceOutputId: 'story-output', targetNodeId: 'agent-designer-1', targetInputId: 'task-input' },
    { id: 'e4', sourceNodeId: 'summarizer-1', sourceOutputId: 'summary-output', targetNodeId: 'tutor-1', targetInputId: 'topic-input' },
    { id: 'e5', sourceNodeId: 'agent-designer-1', sourceOutputId: 'agentDefinition-output', targetNodeId: 'curriculum-designer-1', targetInputId: 'objective-input' },
    { id: 'e6', sourceNodeId: 'curriculum-designer-1', sourceOutputId: 'plan-output', targetNodeId: 'data-display-1', targetInputId: 'data-input' },
    { id: 'e7', sourceNodeId: 'tutor-1', sourceOutputId: 'quizJson-output', targetNodeId: 'data-display-1', targetInputId: 'data-input' },
    { id: 'e8', sourceNodeId: 'data-extractor-1', sourceOutputId: 'json-output', targetNodeId: 'image-display-1', targetInputId: 'image-input' },
];
