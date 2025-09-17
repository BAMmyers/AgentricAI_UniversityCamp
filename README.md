# AgentricAI University

This repository contains the source code for the AgentricAI Admin Studio, a sophisticated administrative interface for building and managing AI agent workflows, and the associated Student & Parent/Teacher Portals for an AI-powered education system.

## Core Philosophy

The AgentricAI ecosystem is built on a vision of creating a self-sustaining, collaborative educational platform powered by a faculty of specialized AI agents. Every interaction is designed to be an interface with an expert agent responsible for that domain, from security to curriculum generation.

A cornerstone of the platform is the **Echo Project Privacy Model**: Student interactions are completely private and ephemeral, seen only by the AI. Parents and teachers receive AI-generated progress reports without accessing direct student interactions, protecting the student's right to a private, unobserved learning space.

## Creator & Original Designer

This platform was conceived, designed, and created by **Brandon Anthony Myers**, founder of AgentricAI.

-   **Contact:** [agentricaiuiux@gmail.com](mailto:agentricaiuiux@gmail.com)

## Platform Showcase

**Login & Role Selection**
![Login Screen](./docs/screenshots/01-login.png)<img width="2560" height="1600" alt="Screenshot 2025-09-16 165232" src="https://github.com/user-attachments/assets/15ffec31-bffb-4b8c-9d79-8d17750e61be" />


**Administrative Control Center**
![Administrative Dashboard](./docs/screenshots/02-dashboard.png)<img width="2560" height="1600" alt="Screenshot 2025-09-16 165331" src="https://github.com/user-attachments/assets/ba4440ee-b25a-4fb5-b996-600b505621f0" />


**Agent Roster & Mission Command**
![Mission Command View](./docs/screenshots/03-mission-command.png)<img width="2560" height="1600" alt="Screenshot 2025-09-16 165348" src="https://github.com/user-attachments/assets/68ef3b1a-390b-4a02-a91d-dbeda75390e6" />


**Security Sentinel Console**
![Security Sentinel Console](./docs/screenshots/04-security-console.png)<img width="2560" height="1600" alt="Screenshot 2025-09-16 165401" src="https://github.com/user-attachments/assets/5d1e170e-2df0-4225-91e8-77479fd9f552" />


**Agent Editor**
![Agent Editor](./docs/screenshots/05-agent-editor.png)<img width="2560" height="1600" alt="Screenshot 2025-09-16 165539" src="https://github.com/user-attachments/assets/9fc3c2d3-9d02-42ba-a153-b82b16833889" />


**Gateway Console**
![Gateway Console](./docs/screenshots/06-gateway-console.png)<img width="2560" height="1600" alt="Screenshot 2025-09-16 165611" src="https://github.com/user-attachments/assets/ba74ccd3-d239-4ad7-b9ec-ec8e7d711ea8" />


**System Optimization & Performance**
![System Optimization View](./docs/screenshots/07-system-optimization.png)<img width="2560" height="1600" alt="Screenshot 2025-09-16 165629" src="https://github.com/user-attachments/assets/ed8d4ea9-72a8-401e-b51d-f7f99818a49a" />


**Recursive Code Assistant**
![AI Code Assistant](./docs/screenshots/08-code-assistant.png)<img width="548" height="945" alt="Screenshot 2025-09-16 165644" src="https://github.com/user-attachments/assets/3aa38608-3b9c-4817-8702-e487f6e943ee" />


**AgentricAI University Hub**
![University Hub](./docs/screenshots/09-university-hub.png)<img width="2560" height="1600" alt="Screenshot 2025-09-16 165831" src="https://github.com/user-attachments/assets/a9815cf6-0b49-4ff0-b392-9a87c59db855" />


## Key Features

-   **Role-Based Portals**: Separate, tailored interfaces for Administrators, Parents/Teachers, and Students.
-   **Agent-Driven Architecture**: Core operations like security, logging, error handling, and content generation are delegated to a roster of specialized AI agents (`Security_Sentinel_001`, `Logger_001`, `Bug`, `Medic`, etc.).
-   **Node-Based AI Studio**: A visual workflow builder for administrators to orchestrate teams of AI agents, creating complex logic flows without writing code.
-   **Companion Agents for Students**: Each student is paired with a dedicated AI companion that autonomously adapts their curriculum based on preferences, goals, and progress.
-   **Mission Command**: A high-level interface for administrators to define strategic objectives, which `Orchestrator Alpha` translates into live, multi-agent mission plans.
-   **Security Sentinel Console**: A real-time dashboard monitoring all security-related events, from login attempts to system integrity scans.
-   **Recursive Code Assistant**: An integrated AI chat assistant for the administrator that can analyze the application's source code and propose modifications in real-time.
-   **Resilient Error Handling**: A "Bug" agent and global `ErrorBoundary` ensure the application gracefully handles errors without crashing, maintaining a seamless user experience.

## Technology Stack

-   **Frontend**: React 19 with TypeScript
-   **Styling**: TailwindCSS
-   **State Management**: React Context API (useReducer)
-   **AI Integration**: Google Gemini API (`@google/genai`)
-   **Offline Capability**: Service Worker for basic caching.
-   **Project Build**: Vite (implicitly, via standard web-dev setup)

## Getting Started

1.  **Prerequisites**: A modern web browser with JavaScript enabled.
2.  **API Key (Optional for Pro Features)**: To use premium features, a Google Gemini API key must be available as an environment variable (`process.env.API_KEY`). The core application is functional without it.
3.  **Running the Application**: Serve the `index.html` file through a local web server. All modules are ES6 and are imported directly in the browser.

This project serves as a powerful demonstration of a deeply integrated, agent-driven application architecture designed for a new generation of intelligent, adaptive, and secure software.
