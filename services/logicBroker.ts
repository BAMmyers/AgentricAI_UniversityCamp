import * as geminiService from './geminiService';
import * as localAgentProcessor from './localAgentProcessor';
import { Agent, ProposedChanges, Action } from '../types/index';

// ARCHITECTURE NOTE:
// This broker is the single point of entry for all AI-related logic in the application.
// It embodies the "API Gateway" agent's logic: it defaults to the local "bedrock" RAG
// processor for simple tasks and only routes "heavy-lifting" tasks to the premium
// `geminiService` for Pro users, conserving resources and ensuring the app is always functional.

interface BrokerParams {
    isPremium: boolean;
    isOnline: boolean;
    dispatch: React.Dispatch<Action>;
}

const isNetworkError = (error: unknown): boolean => {
    if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        return msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('offline');
    }
    return false;
};

/**
 * Determines if a task requires the advanced capabilities of the Gemini model.
 * @param params The content generation parameters.
 * @returns True if the task is complex, false otherwise.
 */
function isHeavyLiftingTask(params: { prompt: string; systemInstruction?: string; useGoogleSearch?: boolean; }): boolean {
    if (params.useGoogleSearch) return true;
    if (params.prompt.toLowerCase().includes('mission plan')) return true;
    if (params.systemInstruction && (params.systemInstruction.toLowerCase().includes('expert') || params.systemInstruction.toLowerCase().includes('specialized'))) return true;
    if (params.prompt.toLowerCase().includes('refactor') || params.prompt.toLowerCase().includes('analyze this code')) return true;

    // Check for nodes that are designated as premium/complex
    const complexNodePrompts = [
        "Design an agent for the following task:", // agentDesigner
        "Extract information from the following text based on this schema" // jsonExtractor
    ];

    if (complexNodePrompts.some(p => params.prompt.includes(p))) {
        return true;
    }
    
    return false;
}

/**
 * Routes a streaming chat request to the appropriate service, with automatic rollback.
 * Chat is stateful, so a session is either Gemini (Pro) or Local (Free/Offline).
 */
export function startChatStream(
    message: string,
    systemInstruction: string,
    { isPremium, isOnline, dispatch }: BrokerParams,
    sessionId: string = 'global_chat',
    agent: Agent | null = null,
): AsyncGenerator<string, void, unknown> {
    if (isPremium && isOnline) {
        // Wrap the premium service in a generator that can handle errors and roll back.
        async function* premiumStreamWrapper(): AsyncGenerator<string, void, unknown> {
            try {
                const stream = geminiService.startChatStream(message, systemInstruction, sessionId, agent);
                for await (const chunk of stream) {
                    yield chunk;
                }
            } catch (error) {
                if (isNetworkError(error)) {
                    dispatch({ type: 'SET_OFFLINE_MODE' });
                    dispatch({ 
                        type: 'SHOW_TOAST', 
                        payload: { 
                            message: 'Connection issue detected. Finishing request with local RAG agent.', 
                            type: 'info' 
                        } 
                    });
                    // Fallback to local stream
                    yield* localAgentProcessor.startLocalChatStream(message);
                } else {
                    // For non-network errors, just yield the error message
                    console.error("Gemini stream error:", error);
                    const errorMessage = error instanceof Error ? `Error: ${error.message}` : "An error occurred while communicating with the AI.";
                    yield errorMessage;
                }
            }
        }
        return premiumStreamWrapper();
    } else {
        return localAgentProcessor.startLocalChatStream(message);
    }
}

/**
 * Routes a non-streaming content generation request based on task complexity.
 * Implements the "RAG-first" architecture.
 */
export async function generateContent(
    params: {
        prompt: string;
        systemInstruction?: string;
        useGoogleSearch?: boolean;
        model?: string;
    },
    { isPremium, isOnline, dispatch }: BrokerParams
): Promise<geminiService.GenerateContentResult> {
    // If it's not a heavy-lifting task, use the bedrock local agent, even for Pro users.
    if (!isHeavyLiftingTask(params)) {
        return localAgentProcessor.generateLocalContent(params);
    }

    // If it IS a heavy-lifting task, then use Gemini for Pro users.
    if (isPremium && isOnline) {
        try {
            return await geminiService.generateContent(params);
        } catch (error) {
            if (isNetworkError(error)) {
                dispatch({ type: 'SET_OFFLINE_MODE' });
                dispatch({ 
                    type: 'SHOW_TOAST', 
                    payload: { 
                        message: 'Connection issue. Using local agent for complex task.', 
                        type: 'info' 
                    } 
                });
                // Fall through to local processor
            } else {
                throw error;
            }
        }
    }

    // If heavy-lifting but not Pro/Online, the local agent will provide a graceful fallback.
    return localAgentProcessor.generateLocalContent(params);
}


/**
 * Routes a code modification request. This is a premium-only feature and requires a connection.
 */
export async function generateCodeModification(
    prompt: string,
    codebaseContext: string,
    { isPremium, isOnline, dispatch }: BrokerParams
): Promise<ProposedChanges> {
     if (isPremium && isOnline) {
        try {
            return await geminiService.generateCodeModification(prompt, codebaseContext);
        } catch (error) {
            if (isNetworkError(error)) {
                 dispatch({ type: 'SET_OFFLINE_MODE' });
                 dispatch({ type: 'SHOW_TOAST', payload: { message: 'Connection lost. Cannot generate code changes while offline.', type: 'error' } });
                 return {
                    summary: "Connection to the premium AI service was lost. Code modification is unavailable in offline mode.",
                    changes: [],
                };
            }
            // Re-throw non-network errors
            throw error;
        }
    } else {
         return {
            summary: "Code modification is a premium feature and requires an active internet connection. Please upgrade or check your connection.",
            changes: [],
        };
    }
}