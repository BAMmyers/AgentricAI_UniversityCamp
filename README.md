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
![Login Screen](./docs/screenshots/01-login.png)<img width="2560" height="1600" alt="Screenshot 2025-09-17 012159" src="https://github.com/user-attachments/assets/e77c9ccc-8b97-4f99-8e25-52cd061f188a" />


**Administrative Control Center**
![Administrative Dashboard](./docs/screenshots/02-dashboard.png)<img width="2560" height="1600" alt="Screenshot 2025-09-17 012454" src="https://github.com/user-attachments/assets/f2a6e273-d78a-48e0-b77b-432f64f84021" />


**Agent Roster & Mission Command**
![Mission Command View](./docs/screenshots/03-mission-command.png)<img width="2560" height="1600" alt="Screenshot 2025-09-17 012530" src="https://github.com/user-attachments/assets/53d7297e-1de3-469b-8583-0737215d58f2" />


**Security Sentinel Console**
![Security Sentinel Console](./docs/screenshots/04-security-console.png)<img width="2560" height="1600" alt="Screenshot 2025-09-17 012552" src="https://github.com/user-attachments/assets/2c153099-a472-4fa3-9ec4-9dbef4b5b66b" />


**Agent Editor**
![Agent Editor](./docs/screenshots/05-agent-editor.png)
<img width="2560" height="1600" alt="Screenshot 2025-09-17 012801" src="https://github.com/user-attachments/assets/12a79e11-3004-4236-aba1-94508cd6623f" />

**Gateway Console**
![Gateway Console](./docs/screenshots/06-gateway-console.png)<img width="2560" height="1600" alt="Screenshot 2025-09-17 012809" src="https://github.com/user-attachments/assets/0734cc31-c6c6-452e-ad6c-a15f6fd15295" />


**System Optimization & Performance**
![System Optimization View](./docs/screenshots/07-system-optimization.png)<img width="2560" height="1600" alt="Screenshot 2025-09-17 012830" src="https://github.com/user-attachments/assets/00e82f8f-6ef1-4046-a301-1fa7cc91924e" />


**Recursive Code Assistant**
![AI Code Assistant](./docs/screenshots/08-code-assistant.png)
<img width="548" height="945" alt="Screenshot 2025-09-16 165644" src="https://github.com/user-attachments/assets/f4837bb0-53da-4693-a241-5618f174f7f7" />

**AgentricAI University Hub**
![University Hub](./docs/screenshots/09-university-hub.png)
<img width="2560" height="1600" alt="Screenshot 2025-09-17 012909" src="https://github.com/user-attachments/assets/9bd2f051-01bf-4d9f-837b-025dfa225f0d" />

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
