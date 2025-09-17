import { GoogleGenAI, Type } from "@google/genai";
import { LlmServiceConfig, DynamicNodeConfig } from '../types/index';

const DEFAULT_CONFIG: LlmServiceConfig = {
    service: 'gemini',
    apiKey: process.env.API_KEY || '',
    ollamaHost: 'http://localhost:11434',
    ollamaModel: 'gemma:latest',
};

class LLMService {
    private config: LlmServiceConfig;
    private ai: GoogleGenAI | null = null;

    constructor() {
        this.config = { ...DEFAULT_CONFIG };
        this.initializeGemini();
    }

    private initializeGemini() {
        if (this.config.apiKey) {
            this.ai = new GoogleGenAI({ apiKey: this.config.apiKey });
        } else {
            this.ai = null;
        }
    }

    setConfiguration(newConfig: Partial<LlmServiceConfig>) {
        this.config = { ...this.config, ...newConfig };
        if (this.config.service === 'gemini') {
            this.initializeGemini();
        }
    }

    getConfiguration(): LlmServiceConfig {
        return { ...this.config };
    }

    async generate(prompt: string, isSandbox: boolean): Promise<string> {
        if (this.config.service === 'gemini' && this.ai) {
            const response = await this.ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text;
        } else { // OpenAI-compatible / Local
            const response = await fetch(`${this.config.ollamaHost}/v1/chat/completions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: this.config.ollamaModel,
                    messages: [{ role: 'user', content: prompt }],
                    stream: false,
                }),
            });
            if (!response.ok) throw new Error(`Local LLM API error: ${response.statusText}`);
            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        }
    }

    async defineNodeFromPrompt(description: string, isSandbox: boolean): Promise<DynamicNodeConfig | null> {
        const prompt = `
            Analyze the following user request to define a new AI agent node.
            Request: "${description}"
            Based on the request, generate a JSON object with the following structure:
            {
              "name": "A short, descriptive name for the agent (e.g., 'Text Summarizer').",
              "description": "A one-sentence description of what the agent does.",
              "inputs": [{ "name": "Input Name", "dataType": "string|number|boolean|json|image|any", "id": "input_id" }],
              "outputs": [{ "name": "Output Name", "dataType": "string|number|boolean|json|image|any", "id": "output_id" }],
              "executionLogicPrompt": "A detailed, second-person instruction for an LLM to execute this node's logic. (e.g., 'You are a text summarizer. Take the input text and...')"
            }
            Respond with ONLY the raw JSON object. Do not include markdown formatting.
            - dataType must be one of: string, number, boolean, json, image, any.
            - Ensure 'id' for inputs/outputs is a unique, lowercase, snake_case string.
        `;
        try {
            const responseJson = await this.generate(prompt, isSandbox);
            const parsed = JSON.parse(responseJson.replace(/```json\n?|\n?```/g, ''));
            return {
                ...parsed,
                color: 'border-yellow-400',
                icon: '💡',
                isDynamic: true,
                category: isSandbox ? 'Sandbox Creations' : 'Custom Agents',
            };
        } catch (error) {
            console.error("Failed to define node from prompt:", error);
            return null;
        }
    }
}

export const llmService = new LLMService();
export type { LLMService };
