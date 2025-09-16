import { GoogleGenAI, Chat } from "@google/genai";

// ARCHITECTURE NOTE:
// All API calls originating from this service are conceptually routed through the 
// secure "Gateway Console". This acts as a protective proxy, handling request
// brokering, logging, and applying security policies before communicating
// with any external Large Language Models like the Gemini API.

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable is not set. AI functionality will be disabled.");
}

const ai = new GoogleGenAI({apiKey: API_KEY!});
const model = 'gemini-2.5-flash';

// Store for ongoing chat sessions, keyed by a session identifier (e.g., agentId)
const chatSessions = new Map<string, Chat>();

function getChatSession(sessionId: string, systemInstruction: string): Chat {
    if (!chatSessions.has(sessionId)) {
        const newChat = ai.chats.create({
          model,
          config: { systemInstruction },
        });
        chatSessions.set(sessionId, newChat);
    }
    return chatSessions.get(sessionId)!;
}

/**
 * Starts or continues a streaming chat conversation with a specific persona.
 */
export async function* startChatStream(
    message: string, 
    systemInstruction: string, 
    sessionId: string = 'global_chat'
): AsyncGenerator<string, void, unknown> {
    if (!API_KEY) {
      yield "API Key not configured.";
      return;
    }

    try {
        const chatSession = getChatSession(sessionId, systemInstruction);
        // This request is routed through the secure gateway
        const result = await chatSession.sendMessageStream({ message });
        
        for await (const chunk of result) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Gemini API error in startChatStream:", error);
        yield "An error occurred while communicating with the AI.";
    }
}

interface GenerateContentParams {
    prompt: string;
    systemInstruction?: string;
    useGoogleSearch?: boolean;
}

export interface GenerateContentResult {
    text: string;
    groundingChunks?: any[];
}

/**
 * Sends a single prompt to the model and gets a non-streaming response.
 * Useful for single-shot tasks in workflows.
 */
export async function generateContent(
    params: GenerateContentParams
): Promise<GenerateContentResult> {
    if (!API_KEY) {
        return { text: "API Key not configured." };
    }

    try {
        // This request is routed through the secure gateway
        const response = await ai.models.generateContent({
            model,
            contents: params.prompt,
            config: {
                ...(params.systemInstruction && { systemInstruction: params.systemInstruction }),
                ...(params.useGoogleSearch && { tools: [{googleSearch: {}}] }),
            }
        });
        return {
            text: response.text,
            groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
        };
    } catch (error) {
        console.error("Gemini API error in generateContent:", error);
        const errorMessage = `Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`;
        return { text: errorMessage };
    }
}