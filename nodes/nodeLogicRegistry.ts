import { NodeData } from '../types/index';
import { LLMService } from '../services/llmService';

type NodeExecutionResult = {
    outputs?: Record<string, any>;
    error?: string;
};

type NodeExecutionLogic = (node: NodeData, llmService: LLMService, isSandbox?: boolean) => Promise<NodeExecutionResult>;

const textInputLogic: NodeExecutionLogic = async (node) => {
    return { outputs: { 'text-output': node.data?.text } };
};

const dataDisplayLogic: NodeExecutionLogic = async (node) => {
    return { outputs: {} }; // Display nodes don't have outputs
};

const imageDisplayLogic: NodeExecutionLogic = async (node) => {
    return { outputs: {} }; // Display nodes don't have outputs
};


// The staticNodeLogics map contains the execution logic for built-in, non-dynamic nodes.
export const staticNodeLogics: Record<string, NodeExecutionLogic> = {
    'textInput': textInputLogic,
    'dataDisplay': dataDisplayLogic,
    'imageDisplay': imageDisplayLogic,
};
