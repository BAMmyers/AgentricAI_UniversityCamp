# AgentricAI Admin Studio & University Platform

This repository contains the source code for the AgentricAI Admin Studio, a sophisticated administrative interface for building and managing AI agent workflows, and the associated Student & Parent/Teacher Portals for an AI-powered education system.

## Core Philosophy

The AgentricAI ecosystem is built on a vision of creating a self-sustaining, collaborative educational platform powered by a faculty of specialized AI agents. Every interaction is designed to be an interface with an expert agent responsible for that domain, from security to curriculum generation.

A cornerstone of the platform is the **Echo Project Privacy Model**: Student interactions are completely private and ephemeral, seen only by the AI. Parents and teachers receive AI-generated progress reports without accessing direct student interactions, protecting the student's right to a private, unobserved learning space.

## Creator & Original Designer

This platform was designed and created by **Brandon A Myers**.

-   **Contact:** [agentricaiuiux@gmail.com](mailto:agentricaiuiux@gmail.com)

## Key Features

-   **Role-Based Portals**: Separate, tailored interfaces for Administrators, Parents/Teachers, and Students.
-   **Agent-Driven Architecture**: Core operations like security, logging, error handling, and content generation are delegated to a roster of specialized AI agents (`Security_Sentinel_001`, `Logger_001`, `Bug`, `Medic`, etc.).
-   **Node-Based AI Studio**: A visual workflow builder for administrators to orchestrate teams of AI agents, creating complex logic flows without writing code.
-   **Companion Agents for Students**: Each student is paired with a dedicated AI companion that autonomously adapts their curriculum based on preferences, goals, and progress.
-   **Mission Command**: A high-level interface for administrators to define strategic objectives, which `Orchestrator Alpha` translates into live, multi-agent mission plans.
-   **Security Sentinel Console**: A real-time dashboard monitoring all security-related events, from login attempts to system integrity scans.
-   **Recursive Code Assistant**: An integrated AI chat assistant for the administrator that can analyze the application's source code and propose modifications in real-time.
-   **Resilient Error Handling**: A "Bug" agent and global `ErrorBoundary` ensure the application gracefully handles errors without crashing, maintaining a seamless user experience.

<img width="2560" height="1600" alt="Screenshot 2025-09-16 165831" src="https://github.com/user-attachments/assets/3740b54c-1e11-46a3-908a-d99bab2b0c91" />
<img width="548" height="945" alt="Screenshot 2025-09-16 165644" src="https://github.com/user-attachments/assets/41673081-e704-42f5-b5db-d0e44c4ae955" />
<img width="2560" height="1600" alt="Screenshot 2025-09-16 165629" src="https://github.com/user-attachments/assets/f4258ff7-aab0-488f-8723-6a4c5c703439" />
<img width="2560" height="1600" alt="Screenshot 2025-09-16 165611" src="https://github.com/user-attachments/assets/3f1342be-19fa-4b69-ad17-09a1b4207e6e" />
<img width="2560" height="1600" alt="Screenshot 2025-09-16 165539" src="https://github.com/user-attachments/assets/25730fa8-d2d6-4134-a3a8-aa3bca11cead" />
<img width="2560" height="1600" alt="Screenshot 2025-09-16 165401" src="https://github.com/user-attachments/assets/5dc2bebc-f7f6-4602-9593-51ac17c57dda" />
<img width="2560" height="1600" alt="Screenshot 2025-09-16 165348" src="https://github.com/user-attachments/assets/0f59a2eb-fae2-43b5-a58d-5d910f259436" />
<img width="2560" height="1600" alt="Screenshot 2025-09-16 165331" src="https://github.com/user-attachments/assets/d6836a23-d3f0-4d9b-9d57-38f4aa49f129" />
<img width="2560" height="1600" alt="Screenshot 2025-09-16 165232" src="https://github.com/user-attachments/assets/773bbff4-16f3-4d29-9d0d-83fc60dadf35" />


## Technology Stack

-   **Frontend**: React 19 with TypeScript
-   **Styling**: TailwindCSS
-   **State Management**: React Context API (useReducer)
-   **AI Integration**: Google Gemini API (`@google/genai`)
-   **Offline Capability**: Service Worker for basic caching.
-   **Project Build**: Vite (implicitly, via standard web-dev setup)

## Getting Started

1.  **Prerequisites**: A modern web browser with JavaScript enabled.
2.  **API Key**: The application requires a Google Gemini API key to be available as an environment variable (`process.env.API_KEY`).
3.  **Running the Application**: Serve the `index.html` file through a local web server. All modules are ES6 and are imported directly in the browser.

This project serves as a powerful demonstration of a deeply integrated, agent-driven application architecture designed for a new generation of intelligent, adaptive, and secure software.
