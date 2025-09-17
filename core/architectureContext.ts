// This file provides the AI with a high-level overview of the application's architecture.

export const architectureContext = `
// --- ARCHITECTURE CONTEXT ---

// **1. Entry Point & Core Structure ('index.tsx', 'App.tsx')**
// The application initializes in 'index.tsx', wrapping the main 'App' component with the 'AppProvider' for global state.
// 'App.tsx' is the root component that handles routing between the main portals based on the current user's role. It also renders global components like the ChatWidget, ToastContainer, and SystemStatusBar.

// **2. Role-Based Portals**
// The application is divided into three primary user-facing portals:
//    - 'AdminPortal.tsx': The main interface for the Creator/Admin. It features a persistent sidebar navigation and a main content area that renders different "views" based on user selection.
//    - 'ParentTeacherPortal.tsx': A similar portal for Parents and Teachers, with a navigation sidebar tailored to their needs (e.g., Student Roster, Curriculum Manager).
//    - 'StudentPortal.tsx': A minimal, immersive portal for students. It has no complex navigation and directly renders the 'StudentDashboard', which acts as their interactive daily planner.

// **3. Key Component Responsibilities**
//    - 'LoginView.tsx': Manages the entire multi-step authentication flow for all user roles, including email verification and password setup/entry. It incorporates the "Security Sentinel" agent's presence.
//    - 'Dashboard.tsx': The admin's home screen, displaying system health metrics and providing quick navigation to other management views.
//    - 'Studio.tsx': A node-based visual workflow editor for creating and testing multi-agent processes.
//    - 'AgentEditor.tsx': The primary interface for creating, configuring, and testing individual AI agents.
//    - 'MissionCommandView.tsx': A high-level strategic interface where admins can define objectives and watch the "Orchestrator Alpha" agent generate and execute a live, multi-agent mission plan.
//    - 'SecuritySentinelView.tsx': Displays a real-time log of all security events (logins, registrations, errors) monitored by the system.
//    - 'StudentDashboard.tsx': The student's "Daily Planner," presenting tasks as interactive tiles. It is autonomously managed by the student's companion agent.
//    - 'CurriculumManagerView.tsx': A professional-grade tool for teachers to manage a central library of curriculum content, organized by core subjects.
//    - 'TeacherLectureView.tsx': A control panel for teachers to host live, privacy-preserving seminars and monitor attendance via anonymous agent IDs.
//    - 'ChatWidget.tsx': The primary interface for the AI assistant, with different personas for different user roles. For admins, it acts as the "Recursive Code Assistant" for modifying the application.
`;