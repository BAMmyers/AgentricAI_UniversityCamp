import { GenerateContentResult } from './geminiService';

// ARCHITECTURE NOTE:
// This service acts as the "local brain" for the freemium tier.
// It uses simple, deterministic logic to mimic AI behavior for basic tasks.
// This ensures the application is functional and engaging without requiring an API key.

/**
 * Generates a simple, template-based story.
 */
function generateLocalStory(prompt: string): string {
    const topicMatch = prompt.match(/story about a (.*)/i);
    const topic = topicMatch ? topicMatch[1] : 'a friendly robot';
    return `Once upon a time, in a land of shimmering data streams, there lived ${topic}. It loved to explore the digital mountains and swim in the rivers of code. Every day was a new adventure, learning new things and helping its friends. The end.`;
}

/**
 * Generates a basic, canned response for the free-tier chat widget.
 */
async function* getLocalChatResponseStream(message: string): AsyncGenerator<string, void, unknown> {
    const lowerMessage = message.toLowerCase();
    let response = "I'm the Platform Guide for the free tier. I can answer basic questions about AgentricAI. For advanced, conversational AI, please upgrade to a Pro plan.";

    if (lowerMessage.includes('privacy') || lowerMessage.includes('echo project')) {
        response = "The Echo Project is our privacy model. It ensures student interactions are private. Only the AI sees the direct interaction, and it generates progress reports for parents/teachers without sharing the raw data. This protects the student's learning space.";
    } else if (lowerMessage.includes('goal') || lowerMessage.includes('set up')) {
        response = "Parents and teachers can set goals or add curriculum items in the 'Parent & Teacher Console'. The student's AI companion will then use this information to create new, personalized activities for the student.";
    } else if (lowerMessage.includes('studio')) {
        response = "The AgentricAI Studio is an advanced feature for administrators on the Pro plan. It's a powerful node-based editor for creating custom AI workflows and orchestrating teams of specialized agents.";
    }

    // Simulate a streaming response
    const words = response.split(' ');
    for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

/**
 * The main entry point for non-premium, non-streaming content generation.
 */
export function generateLocalContent(prompt: string): GenerateContentResult {
    if (prompt.includes('story')) {
        return { text: generateLocalStory(prompt) };
    }
    
    if (prompt.includes('Respond with ONLY a JSON object')) {
        // Return a structured error for JSON requests
        return { text: JSON.stringify({ error: "Local model cannot generate complex JSON. Please upgrade to Pro." }) };
    }

    // Default response for other prompts
    return { text: `This is a response from the local agent. The prompt was: "${prompt.substring(0, 100)}...". For advanced generation, a Pro plan is required.` };
}


/**
 * The main entry point for non-premium, streaming content generation.
 */
export function startLocalChatStream(message: string): AsyncGenerator<string, void, unknown> {
    return getLocalChatResponseStream(message);
}
