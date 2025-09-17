import { GenerateContentResult } from './geminiService';

// ARCHITECTURE NOTE:
// This service acts as the "local brain" for the freemium tier.
// It uses deterministic logic and a simulated RAG (Retrieval-Augmented Generation)
// process to provide helpful answers without requiring an API key. It is the "bedrock"
// processor and must gracefully handle complex prompts it cannot fulfill.

/**
 * Generates a simple, template-based story.
 */
function generateLocalStory(prompt: string): string {
    const topicMatch = prompt.match(/story about a (.*)/i);
    const topic = topicMatch ? topicMatch[1] : 'a friendly robot';
    return `Once upon a time, in a land of shimmering data streams, there lived ${topic}. It loved to explore the digital mountains and swim in the rivers of code. Every day was a new adventure, learning new things and helping its friends. The end.`;
}

// --- RAG-BASED LOCAL CHAT LOGIC ---

const KNOWLEDGE_BASE = {
    'privacy': "The Echo Project is our core privacy model. It ensures student interactions are completely private. Only the AI companion sees the direct interaction. It then generates high-level progress reports for parents and teachers without ever sharing the raw data. This protects the student's personal learning space.",
    'studio': "The AgentricAI Studio is a powerful visual tool for admins on the Pro plan. It's like a whiteboard where you can connect different AI agents together to create new, custom workflows for complex tasks. It's the heart of the system's customization.",
    'agents': "Agents are specialized AIs, each with a specific job. Think of them as a faculty of digital experts. For example, the 'Novelist' agent writes stories, and the 'Security Sentinel' agent monitors for threats. Each student gets their own 'Companion Agent' to help them learn.",
    'companion agent': "Every student is paired with a dedicated Companion Agent. This AI acts as a personal tutor that designs the student's daily schedule. It creates new activities based on goals from parents, curriculum from teachers, and the student's own interests. It's designed to be kind, patient, and encouraging.",
    'goals': "Parents and teachers can set goals and add curriculum topics from the 'Parent & Teacher Console'. You just write what you want the student to learn or focus on in plain language (e.g., 'Practice multiplication' or 'Learn about the solar system'). The student's Companion Agent will then automatically create new activities based on your input.",
    'curriculum': "The Curriculum Manager is a tool for teachers. It lets them create a central library of lessons on different subjects. The Companion Agents can then use these official lessons when creating activities for students, ensuring everything aligns with educational goals.",
    'mission command': "Mission Command is an advanced interface for admins on the Pro plan. It allows them to give a high-level objective to a team of agents. The 'Orchestrator Alpha' agent then creates a step-by-step plan and manages the other agents to complete the mission. It's used for very complex, multi-step problems.",
    'pro plan': "The Pro plan unlocks the full power of the platform. It gives you access to the most advanced AI models like Google's Gemini for more creative and intelligent agent behavior, the full Studio for building custom workflows, and Mission Command for orchestrating agent teams. It's designed for creators, admins, and power users.",
    'orchestrator alpha': "Orchestrator Alpha (agent-20) is a core system agent available on the Pro plan. It acts as the mission planner in Mission Command. When an admin gives a complex objective, the Orchestrator breaks it down into a sequence of smaller, manageable sub-tasks and assigns them to other agents, creating a detailed mission plan for execution.",
    'security sentinel': "The Security Sentinel (agent-4) is a core system agent that acts as a silent guardian. It monitors system-wide activity for intrusions, logs all security events (like logins and errors), and reports incidents in real-time on the Security Sentinel Console. It's a key part of our secure-by-design philosophy.",
    'mechanic agent': "The Mechanic Agent (agent-45) is a recursive, administrative agent with full access to the system. It's tasked with the constant upkeep of all other agents. It works with the security team to check for bugs and errors. In the System Optimization view, the 'Integrity Scan' is performed by its partner, the 'Medic Agent', which can then dispatch the Mechanic Agent to apply patches.",
    'bug agent': "The Bug Agent (agent-49) is an always-active, intuitive agent that works with the application's Error Boundary. When a UI crash is about to happen, the Bug Agent catches it, contains it, and displays the 'System Anomaly' screen, preventing data loss and providing a one-click fix. This makes the system self-healing."
};


const INTENT_TRIGGERS = {
    greeting: ['hello', 'hi', 'hey'],
    farewell: ['bye', 'goodbye']
};

async function* streamSimpleResponse(text: string) {
    const words = text.split(' ');
    for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 40));
    }
}

async function* streamRAGResponse(answer: string, topic: string | null) {
    const thinking = topic ? `One moment please, searching my knowledge base for "${topic}"...` : 'One moment please...';
    yield thinking;
    await new Promise(r => setTimeout(r, 1200)); // Simulate retrieval
    
    // Signal to clear the message before streaming the real answer
    yield '\f'; 
    
    const words = answer.split(' ');
    for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}


/**
 * A more sophisticated, simulated conversational agent for the free tier.
 */
async function* getLocalChatResponseStream(message: string): AsyncGenerator<string, void, unknown> {
    const lowerMessage = message.toLowerCase().replace(/[^\w\s]/gi, '');
    
    // 1. Check for simple intents first
    if (INTENT_TRIGGERS.greeting.some(trigger => lowerMessage.startsWith(trigger))) {
        yield* streamSimpleResponse("Hello! I'm the Platform Guide. I can explain how the system works, from setting student goals to understanding our privacy model. What would you like to know?");
        return;
    }
    if (INTENT_TRIGGERS.farewell.some(trigger => lowerMessage.startsWith(trigger))) {
        yield* streamSimpleResponse("Goodbye! Feel free to ask if you have more questions later.");
        return;
    }

    // 2. If not a simple intent, treat as a knowledge query and perform RAG
    let foundTopic: string | null = null;
    let foundAnswer: string | null = null;

    // A simple retrieval mechanism
    for (const topic of Object.keys(KNOWLEDGE_BASE)) {
        if (lowerMessage.includes(topic)) {
            foundTopic = topic;
            foundAnswer = KNOWLEDGE_BASE[topic as keyof typeof KNOWLEDGE_BASE];
            break;
        }
    }
    
    // Guide for "how-to" questions
    if (lowerMessage.includes('how do i') || lowerMessage.includes('how can i')) {
        if (lowerMessage.includes('goal') || lowerMessage.includes('curriculum')) {
             foundTopic = "setting goals";
             foundAnswer = "To set goals or add curriculum, you can:\n1. Log in as a Parent or Teacher.\n2. Navigate to the 'Student Roster' from the sidebar.\n3. Select a student to open their 'Parent & Teacher Console'.\n4. From there, you can add goals and curriculum items in plain text!";
        } else if (lowerMessage.includes('new agent')) {
             foundTopic = "creating agents";
             foundAnswer = "Creating new agents is a core feature of the Pro plan, available to admins in the 'Agent Editor'. You can define an agent's name, its core instructions (its persona), and even equip it with special tools.";
        }
    }


    if (foundAnswer) {
        yield* streamRAGResponse(foundAnswer, foundTopic);
    } else {
         const notFoundMessage = `I searched my knowledge base but couldn't find specific information on that. I can provide details on core platform features like 'privacy', 'agents', 'studio', 'mission command', and the 'pro plan'. How can I help?`;
         yield* streamRAGResponse(notFoundMessage, "your question");
    }
}

/**
 * The main entry point for non-premium, non-streaming content generation.
 */
export function generateLocalContent(params: { prompt: string; useGoogleSearch?: boolean; }): GenerateContentResult {
    const { prompt } = params;

    // Gracefully handle requests for premium features
    if (params.useGoogleSearch) {
        return { text: "Web Search is a premium feature. The Web Crawler agent requires a Pro plan and an active connection." };
    }
    if (prompt.includes("Extract information from the following text based on this schema")) {
        return { text: JSON.stringify({ error: "Extracting data with a custom JSON schema is a premium feature that requires the Gemini-powered Data Extractor agent." }) };
    }
    if (prompt.toLowerCase().includes('mission plan')) {
        return { text: JSON.stringify({ overview: "Local Plan", steps: [{ step: 1, agent: "Local Agent", action: "Acknowledge Request", objective: "Inform user that mission planning is a premium feature."}] })};
    }

    // Handle bedrock tasks
    if (prompt.includes("Design an agent for the following task:")) {
         return { text: JSON.stringify({ name: "Locally Designed Agent", systemInstruction: "This is a basic agent persona generated by the local bedrock model. Upgrade to Pro for advanced agent design." }) };
    }
    if (prompt.includes('story')) {
        return { text: generateLocalStory(prompt) };
    }
    if (prompt.includes('quiz')) {
        const cannedQuiz = [
            { question: `What is the largest planet in our solar system?`, options: ["Earth", "Jupiter", "Mars"], answer: "Jupiter" },
            { question: `Is the sun a planet or a star?`, options: ["Planet", "Star", "Moon"], answer: "Star" },
            { question: `Which planet is known as the Red Planet?`, options: ["Venus", "Mars", "Saturn"], answer: "Mars" },
        ];
        return { text: JSON.stringify(cannedQuiz) };
    }
    if (prompt.includes('lesson plan')) {
        const lessonTopicMatch = prompt.match(/objective: "(.*?)"/);
        const lessonTopic = lessonTopicMatch ? lessonTopicMatch[1] : 'the water cycle';
        return { text: `**Lesson Plan: Introduction to ${lessonTopic}**\n\nObjective: Students will be able to describe the basic stages of the water cycle (evaporation, condensation, precipitation). \n\nActivity: Watch a short video on the water cycle, then draw a picture showing the sun, clouds, rain, and an ocean, labeling each part.` };
    }
    if (prompt.includes("JSON")) { // Generic JSON catch-all
        return { text: JSON.stringify({ error: "Generating custom JSON structures is a premium feature. Please upgrade to the Pro plan." }) };
    }

    // Default response for other prompts that are not explicitly handled
    return { text: `This is a response from the local bedrock agent. The prompt was: "${prompt.substring(0, 100)}...". For more advanced generation, a Pro plan is required.` };
}


/**
 * The main entry point for non-premium, streaming content generation.
 */
export function startLocalChatStream(message: string): AsyncGenerator<string, void, unknown> {
    return getLocalChatResponseStream(message);
}