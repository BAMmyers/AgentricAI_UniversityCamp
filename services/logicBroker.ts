import * as geminiService from './geminiService';
import * as localAgentProcessor from './localAgentProcessor';
import { Agent, ProposedChanges } from '../types/index';

// ARCHITECTURE NOTE:
// This broker is the single point of entry for all AI-related logic in the application.
// It is responsible for routing requests to either the premium, API-key-dependent
// `geminiService` or the free-tier `localAgentProcessor` based on the user's
// subscription plan. This enforces the freemium model at a foundational level.

interface BrokerParams {
    isPremium: boolean;
}

/**
 * Routes a streaming chat request to the appropriate service.
 */
export function startChatStream(
    message: string,
    systemInstruction: string,
    { isPremium }: BrokerParams,
    sessionId: string = 'global_chat',
    agent: Agent | null = null,
): AsyncGenerator<string, void, unknown> {
    if (isPremium) {
        return geminiService.startChatStream(message, systemInstruction, sessionId, agent);
    } else {
        return localAgentProcessor.startLocalChatStream(message);
    }
}

/**
 * Routes a non-streaming content generation request to the appropriate service.
 */
export async function generateContent(
    params: {
        prompt: string;
        systemInstruction?: string;
        useGoogleSearch?: boolean;
        model?: string;
    },
    { isPremium }: BrokerParams
): Promise<geminiService.GenerateContentResult> {
    if (isPremium) {
        return geminiService.generateContent(params);
    } else {
        // Pass the full params object so the local processor can check for premium features like useGoogleSearch
        return localAgentProcessor.generateLocalContent(params);
    }
}

/**
 * Routes a code modification request. This is a premium-only feature.
 */
export async function generateCodeModification(
    prompt: string,
    codebaseContext: string,
    { isPremium }: BrokerParams
): Promise<ProposedChanges> {
    if (isPremium) {
        return geminiService.generateCodeModification(prompt, codebaseContext);
    } else {
        return {
            summary: "Code modification is a premium feature. Please upgrade to a Pro plan.",
            changes: [],
        };
    }
}