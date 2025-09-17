import { NodeData } from '../types/index';
import { LLMService } from '../services/llmService';

interface ExecutionResult {
    outputs?: Record<string, any>;
    error?: string;
}

export const execute = async (node: NodeData, llmService: LLMService, isSandbox: boolean): Promise<ExecutionResult> => {
    if (!node.executionLogicPrompt) {
        return { error: 'Dynamic node is missing execution logic prompt.' };
    }

    const inputValues = node.inputs.map(input => {
        const value = node.data?.[input.id] ?? input.exampleValue;
        return `- Input '${input.name}' (${input.id}): ${JSON.stringify(value)}`;
    }).join('\n');

    const outputSchema = node.outputs.map(output => {
        return `  "${output.id}": "${output.dataType}"`;
    }).join(',\n');

    const prompt = `
        You are an AI agent executor. Your task is to perform a function based on a set of instructions and inputs.
        
        **Function:** ${node.executionLogicPrompt}
        
        **Inputs:**
        ${inputValues}
        
        **Output Format:**
        You MUST respond with ONLY a raw JSON object. Do not include markdown formatting or any other text.
        The JSON object must have this exact structure, with keys matching the output port IDs:
        {
        ${outputSchema}
        }
    `;

    try {
        const resultJson = await llmService.generate(prompt, isSandbox);
        if (!resultJson) {
            return { error: 'LLM returned an empty response.' };
        }
        
        const outputs = JSON.parse(resultJson);
        return { outputs };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to execute dynamic node logic.";
        return { error: errorMessage };
    }
};
