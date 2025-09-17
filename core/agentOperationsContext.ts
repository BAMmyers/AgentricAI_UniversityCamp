// This file provides the AI with context on the AI agent ecosystem and its operational logic.

export const agentOperationsContext = `
// --- AGENT & AI OPERATIONS CONTEXT ---

// **1. Freemium Architecture ('services/logicBroker.ts')**
// All AI-related service calls are routed through a central 'logicBroker.ts'. This is the core of the freemium model.
//    - The broker inspects the user's subscription plan ('isPremium' flag).
//    - **Premium Users:** Requests are forwarded to 'services/geminiService.ts', which makes live calls to the Google Gemini API using a server-side 'API_KEY'.
//    - **Free Users:** Requests are forwarded to 'services/localAgentProcessor.ts', which uses simple, local, template-based logic to provide basic functionality without any API calls. This ensures the core experience is always functional.

// **2. Key Data Structures ('types/index.ts')**
//    - 'Agent': Represents a configurable AI agent with a name, model, system instruction (persona), personality traits, tools, and core memory. Can be a 'General' or 'Companion' type.
//    - 'Workflow': Represents a multi-agent process created in the Studio. It contains an array of 'NodeData' (the visual blocks) and 'Connection' objects that define the data flow between them.
//    - 'Student': Represents a student user, containing their unique ID, their assigned 'companionAgentId', their 'schedule' of activities, learning preferences, and goals set by parents/teachers.
//    - 'ScheduleItem': An activity or event in a student's planner. It links to a 'workflowId' that will be executed when the student interacts with it.
//    - 'CurriculumItem': An educational lesson plan created by a teacher, stored centrally and organized by 'CoreSubject'.

// **3. Agent-Centric Interfaces**
//    - 'Studio.tsx': A visual editor where admins orchestrate agent teams by connecting nodes. Each node represents a specialized agent's function (e.g., "The Novelist," "The Visualizer").
//    - 'AgentEditor.tsx': A detailed interface for creating and configuring the properties of a single 'Agent'.
//    - 'MissionCommandView.tsx': A strategic UI for admins to command the "Orchestrator Alpha" agent to generate and execute complex, multi-step plans using a team of other agents.
//    - 'AgentRoster.tsx' & 'AgentDetailView.tsx': Allows admins to browse, filter, and inspect the configuration of every agent in the system.

// **4. Autonomous Companion Agent ('hooks/useCompanionAgentLogic.ts')**
// The logic for a student's companion agent is encapsulated in this custom React hook.
//    - It runs automatically when a student is active.
//    - It monitors the student's state for new goals or curriculum added by parents/teachers.
//    - When new inputs are detected, it synthesizes them, calls the AI (via the logic broker) to generate a new, personalized learning activity, creates a new 'Workflow' and 'ScheduleItem', and adds it to the student's planner.
`;