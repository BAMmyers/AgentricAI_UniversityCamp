import { GoogleGenAI, Chat } from "@google/genai";
import { ProposedChanges, Agent } from '../types/index';

// ARCHITECTURE NOTE:
// This service now exclusively handles premium, API-key-dependent AI computations.
// It assumes any call it receives has already been authorized by the logicBroker.
// It is still responsible for handling the case where the API key is not configured on the server.

const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({apiKey: API_KEY}) : null;

const chatSessions = new Map<string, { chat: Chat, systemInstruction: string }>();

function getChatSession(sessionId: string, systemInstruction: string, model: string): Chat {
    if (!ai) throw new Error("API Key not configured on server.");
    
    const sessionData = chatSessions.get(sessionId);

    if (!sessionData || sessionData.systemInstruction !== systemInstruction) {
        const newChat = ai.chats.create({
          model,
          config: { systemInstruction },
        });
        chatSessions.set(sessionId, { chat: newChat, systemInstruction });
        return newChat;
    }
    
    return sessionData.chat;
}

/**
 * Starts or continues a streaming chat conversation with a specific persona. (Premium Only)
 */
export async function* startChatStream(
    message: string, 
    systemInstruction: string, 
    sessionId: string = 'global_chat',
    agent: Agent | null = null,
): AsyncGenerator<string, void, unknown> {
    if (!ai) {
      yield "API Key not configured. Pro features are enabled, but the server is missing its API Key configuration. Please contact the administrator.";
      return;
    }

    try {
        const modelToUse = agent?.model || 'gemini-2.5-flash';
        let fullMessage = message;

        if (agent && agent.coreMemory.length > 0) {
            const memoryContext = agent.coreMemory
                .map(mem => `[${mem.title}]: ${mem.content}`)
                .join('\n');
            fullMessage = `--- PERSISTENT MEMORY ---\n${memoryContext}\n\n--- USER QUERY ---\n${message}`;
        }
        
        const chatSession = getChatSession(sessionId, systemInstruction, modelToUse);
        const result = await chatSession.sendMessageStream({ message: fullMessage });
        
        for await (const chunk of result) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Gemini API error in startChatStream:", error);
        const errorMessage = error instanceof Error ? `Error: ${error.message}` : "An error occurred while communicating with the AI.";
        yield errorMessage;
    }
}

interface GenerateContentParams {
    prompt: string;
    systemInstruction?: string;
    useGoogleSearch?: boolean;
    model?: string;
}

export interface GenerateContentResult {
    text: string;
    groundingChunks?: any[];
}

/**
 * Sends a single prompt to the model and gets a non-streaming response. (Premium Only)
 */
export async function generateContent(
    params: GenerateContentParams
): Promise<GenerateContentResult> {
    if (!ai) {
        throw new Error("Pro features are enabled, but the API Key is not configured on the server. Please contact the administrator.");
    }

    try {
        const response = await ai.models.generateContent({
            model: params.model || 'gemini-2.5-flash',
            contents: params.prompt,
            config: {
                ...(params.systemInstruction && { systemInstruction: params.systemInstruction }),
                ...(params.useGoogleSearch && { tools: [{googleSearch: {}}] }),
                responseMimeType: params.prompt.includes("Respond with ONLY a JSON object") ? "application/json" : "text/plain",
            }
        });
        return {
            text: response.text,
            groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
        };
    } catch (error) {
        console.error("Gemini API error in generateContent:", error);
        throw error;
    }
}

/**
 * Generates a structured JSON object representing proposed code modifications. (Premium Only)
 */
export async function generateCodeModification(
    prompt: string, 
    codebaseContext: string,
): Promise<ProposedChanges> {
    if (!ai) {
        throw new Error("Pro features are enabled, but the API Key is not configured on the server.");
    }

    const systemInstruction = `
        You are an expert AI developer assistant integrated into a web-based IDE. Your task is to modify the application's source code based on user requests.
        You will be given the full source code of the relevant application files. You MUST analyze the request and the provided code.
        You MUST generate the complete, modified content for each file that needs to change.
        You MUST respond ONLY with a single, valid JSON object. Do not include any other text, markdown, or explanations.
        The JSON object must have this structure:
        {
          "summary": "A brief, one-sentence summary of the changes you are proposing.",
          "changes": [
            {
              "filePath": "full_path_of_the_file_to_modify",
              "modifiedContent": "The complete, new content of the file, including all original code that was not changed."
            }
          ]
        }
        If the request is unclear, dangerous, or you cannot fulfill it, respond with a JSON object where the "changes" array is empty and the "summary" explains why.
    `;

    try {
        const fullPrompt = `User Request: "${prompt}"\n\nFull Codebase Context:\n---\n${codebaseContext}\n---`;
        const { text } = await generateContent({ prompt: fullPrompt, systemInstruction });
        const parsedResult = JSON.parse(text);

        if (!parsedResult.summary || !Array.isArray(parsedResult.changes)) {
            throw new Error("AI response is not in the expected format.");
        }
        return parsedResult as ProposedChanges;

    } catch (error) {
        console.error("Gemini API error in generateCodeModification:", error);
        throw new Error(`AI failed to generate a valid code modification. ${error instanceof Error ? error.message : ''}`);
    }
}
