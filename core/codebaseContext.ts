// This file serves as a virtual "file system" for the AI Code Assistant.
// It provides the full source code of the application as context for generating modifications.

export const codebase = `
--- START OF FILE LICENSE ---
AgentricAI License Agreement

Copyright (c) 2024 Brandon Anthony Myers (agentricaiuiux@gmail.com) ('AgentricAI')

Preamble: AgentricAI aims to encourage innovation and experimentation in AI-driven applications and agentic workflows. The license protects the intellectual property of the original author while allowing for community engagement and non-commercial exploration.

Grant of Rights:

Licensed for personal, educational, research, and non-commercial purposes.

Derivative works may be created for non-commercial sharing if they preserve core functionality and branding.

Restrictions:

Commercial use or monetization is strictly prohibited without explicit permission.

Core functionality, branding, or copyright notices may not be removed, altered, or obscured.

Redistribution under conflicting license terms is forbidden.

Intellectual Property: All rights to AgentricAI, AgentricAI Studios, agent logic, and design remain exclusively with Brandon Anthony Myers.

Disclaimer of Warranty: THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Limitation of Liability: IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
OF THE POSSIBILITY OF SUCH DAMAGE.

Governing Law: This license shall be governed by and construed in accordance with the laws of the jurisdiction in which the copyright holder resides, without regard to its conflict of law provisions.
--- END OF FILE LICENSE ---
--- START OF FILE README.md ---
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
![Login Screen](./docs/screenshots/01-login.png)

**Administrative Control Center**
![Administrative Dashboard](./docs/screenshots/02-dashboard.png)

**Agent Roster & Mission Command**
![Mission Command View](./docs/screenshots/03-mission-command.png)

**Security Sentinel Console**
![Security Sentinel Console](./docs/screenshots/04-security-console.png)

**Agent Editor**
![Agent Editor](./docs/screenshots/05-agent-editor.png)

**Gateway Console**
![Gateway Console](./docs/screenshots/06-gateway-console.png)

**System Optimization & Performance**
![System Optimization View](./docs/screenshots/07-system-optimization.png)

**Recursive Code Assistant**
![AI Code Assistant](./docs/screenshots/08-code-assistant.png)

**AgentricAI University Hub**
![University Hub](./docs/screenshots/09-university-hub.png)

## Key Features

-   **Role-Based Portals**: Separate, tailored interfaces for Administrators, Parents/Teachers, and Students.
-   **Agent-Driven Architecture**: Core operations like security, logging, error handling, and content generation are delegated to a roster of specialized AI agents (\`Security_Sentinel_001\`, \`Logger_001\`, \`Bug\`, \`Medic\`, etc.).
-   **Node-Based AI Studio**: A visual workflow builder for administrators to orchestrate teams of AI agents, creating complex logic flows without writing code.
-   **Companion Agents for Students**: Each student is paired with a dedicated AI companion that autonomously adapts their curriculum based on preferences, goals, and progress.
-   **Mission Command**: A high-level interface for administrators to define strategic objectives, which \`Orchestrator Alpha\` translates into live, multi-agent mission plans.
-   **Security Sentinel Console**: A real-time dashboard monitoring all security-related events, from login attempts to system integrity scans.
-   **Recursive Code Assistant**: An integrated AI chat assistant for the administrator that can analyze the application's source code and propose modifications in real-time.
-   **Resilient Error Handling**: A "Bug" agent and global \`ErrorBoundary\` ensure the application gracefully handles errors without crashing, maintaining a seamless user experience.

## Technology Stack

-   **Frontend**: React 19 with TypeScript
-   **Styling**: TailwindCSS
-   **State Management**: React Context API (useReducer)
-   **AI Integration**: Google Gemini API (\`@google/genai\`)
-   **Offline Capability**: Service Worker for basic caching.
-   **Project Build**: Vite (implicitly, via standard web-dev setup)

## Getting Started

1.  **Prerequisites**: A modern web browser with JavaScript enabled.
2.  **API Key (Optional for Pro Features)**: To use premium features, a Google Gemini API key must be available as an environment variable (\`process.env.API_KEY\`). The core application is functional without it.
3.  **Running the Application**: Serve the \`index.html\` file through a local web server. All modules are ES6 and are imported directly in the browser.

This project serves as a powerful demonstration of a deeply integrated, agent-driven application architecture designed for a new generation of intelligent, adaptive, and secure software.
--- END OF FILE README.md ---
--- START OF FILE ROADMAP.md ---
# AgentricAI University - Development Roadmap

This document outlines the conceptual development phases of the AgentricAI platform, from initial architecture to future vision.

---

### Phase 1: Foundation & Core Architecture (Complete)

*   **Objective:** Establish a robust, scalable foundation for the entire application.
*   **Key Milestones:**
    *   [x] **UI Framework:** Implement React with TypeScript for a type-safe, component-based architecture.
    *   [x] **Global State Management:** Set up a centralized \`AppContext\` using \`useReducer\` to manage all application state.
    *   [x] **Role-Based Portals:** Create the initial structures for Admin, Parent/Teacher, and Student portals.
    *   [x] **Initial Agent Manifest:** Define the initial roster of AI agents and their roles in \`agentManifest.ts\`.
    *   [x] **Visual Studio MVP:** Develop the core node-based workflow editor (\`Studio.tsx\`) with basic node creation and connection logic.

---

### Phase 2: Agent Activation & Core Logic (Complete)

*   **Objective:** Breathe life into the core agents and implement the primary user journeys.
*   **Key Milestones:**
    *   [x] **Secure Authentication:** Implement a universal, password-based login system for all roles, replacing the demo login.
    *   [x] **Security Sentinel Integration:** Activate the \`Security_Sentinel_001\` and \`Logger_001\` agents to monitor and log all authentication events. Create the **Security Sentinel Console** for admins.
    *   [x] **Companion Agent Logic:** Implement the \`useCompanionAgentLogic\` hook to give student companion agents autonomy in creating and adapting schedules.
    *   [x] **Live Mission Command:** Activate \`Orchestrator Alpha\` in the new **Mission Command** view, enabling live, multi-agent mission planning and execution based on admin objectives.
    *   [x] **Recursive Code Assistant:** Integrate the AI chat widget with the ability to read the app's codebase and propose live code modifications.

---

### Phase 3: Resilience, Polish & Finalization (Complete)

*   **Objective:** Harden the application against errors, refine the user experience, and finalize the core agent collaborations.
*   **Key Milestones:**
    *   [x] **"Bug" Agent Activation:** Implement the \`ErrorBoundary\` and \`SystemStatusBar\` to gracefully handle UI errors without crashing the application.
    *   [x] **"Medic" & "Mechanic" Agent Integration:** Add the System Integrity Scan to the \`SystemOptimizationView\`, allowing admins to command the \`Medic\` agent to perform security checks and log results to the Sentinel Console.
    *   [x] **Global Notification System:** Implement the "toast" notification system for non-intrusive user feedback.
    *   [x] **UI/UX Polish:** Refine visual feedback across the application, including enhanced execution logs and interactive elements.
    *   [x] **Project Documentation:** Create core project files (\`README.md\`, \`ROADMAP.md\`, \`.gitignore\`, etc.) to ensure project health and maintainability.

---

### Phase 4: Future Enhancements (Vision)

*   **Objective:** Expand the platform's capabilities to push the boundaries of AI-driven education.
*   **Planned Features:**
    *   [ ] **Advanced AAC Device Integration:** Deepen integration with hardware-level APIs for augmentative and alternative communication devices.
    *   [ ] **Real-time Collaboration in Studio:** Allow multiple administrators to build workflows together in the AI Studio.
    *   [ ] **Expanded Tool Library:** Integrate more external tools and APIs for agents to use (e.g., live data sources, code execution environments).
    *   [ ] **Quantum Agent Simulation:** Develop a dedicated view to simulate and visualize the theoretical workflows of the Quantum Studies agent roster.
    *   [ ] **Persistent Core Memory:** Implement a true database backend to allow agents to build and retain long-term memory across sessions.
--- END OF FILE ROADMAP.md ---
--- START OF FILE SERVER_LOG.md ---
# AgentricAI - Server & Architecture Development Log

This log tracks significant decisions and changes related to the backend, architecture, and core logic of the AgentricAI platform.

---

### 2024-10-28: Agent-Driven Architecture Finalization

**Entry by:** AI Assistant (on behalf of Creator)
**Component(s):** \`context/AppContext.tsx\`, \`services/geminiService.ts\`, \`hooks/useCompanionAgentLogic.ts\`

**Summary:**
Finalized the transition to a fully agent-driven architecture. The core principle is that user actions do not directly manipulate state, but rather provide intent to an agent (or a system emulating an agent) which then carries out the action.

1.  **Security Agent Integration:** Refactored the \`AppContext\` login and registration logic to be handled by the \`Security_Sentinel_001\`, \`Logger_001\`, and \`Gatekeeper_001\` agents. All authentication actions are now formally logged as security events.
2.  **Companion Agent Autonomy:** Extracted all student-facing logic (schedule creation, adaptation) into the \`useCompanionAgentLogic\` hook. This hook now serves as the "brain" for the companion agent, allowing it to operate autonomously based on changes to the student's profile (goals, curriculum, preferences).
3.  **Error Handling Agents:** Integrated the \`Bug\` and \`Medic\` agents. The \`ErrorBoundary\` now acts as the \`Bug\` agent's sensor, dispatching errors to the global state. The new System Integrity Scan in the UI acts as the command interface for the \`Medic\` agent. This makes system resilience an explicit feature of the agent ecosystem, not just a coding pattern.
4.  **Gateway Abstraction:** All calls to the Gemini API in \`geminiService.ts\` are now conceptually routed through a secure "Gateway Console". This provides a single point for future enhancements like request brokering, advanced logging, and API key management.

**Decision Rationale:**
This architectural shift moves the application from a traditional state-driven model to one that more accurately reflects the project's vision of an AI-powered ecosystem. It improves separation of concerns and makes the platform more scalable and maintainable.
--- END OF FILE SERVER_LOG.md ---
--- START OF FILE USER_LOG.md ---
# AgentricAI - User Interface & Experience Development Log

This log tracks significant decisions and changes related to the user-facing components, UI design, and overall user experience (UX) of the AgentricAI platform.

---

### 2024-10-28: Final UX Polish & Agent Visibility

**Entry by:** AI Assistant (on behalf of Creator)
**Component(s):** \`LoginView.tsx\`, \`MissionCommandView.tsx\`, \`SystemOptimizationView.tsx\`, \`StudentDashboard.tsx\`

**Summary:**
Conducted a final review of the entire user experience with a focus on making the presence and actions of the underlying AI agents more tangible and transparent to the user.

1.  **Agent-Aware Login:** The \`LoginView\` was redesigned to include a "Security Scan" step. This provides visual feedback that the \`Security_Sentinel_001\` agent is actively analyzing credentials, enhancing the user's perception of a secure system.
2.  **Tangible Mission Command:** The old, abstract \`CoreView\` was replaced with the highly interactive \`MissionCommandView\`. This new interface allows the administrator to see \`Orchestrator Alpha\` generate a plan in real-time and then watch as each agent executes its step. This makes the concept of multi-agent collaboration a visible, core feature.
3.  **Student Experience Enhancement:** The loading modal in the \`StudentDashboard\` was updated to explicitly name the agent responsible for the activity (e.g., "The 'Novelist' agent is preparing your story..."). This reinforces the idea of a supportive "faculty" of AI agents.
4.  **Maintenance Agent Interface:** Added the "System Integrity & Security" module to the \`SystemOptimizationView\`. This provides a direct command interface for the \`Medic\` and \`Mechanic\` agents, turning background maintenance tasks into visible, user-initiated actions that build confidence in the platform's stability.

**Decision Rationale:**
The core value of the platform is its agent-driven nature. These changes were critical to moving that concept from a backend architecture detail to a front-and-center feature of the user experience. Users, especially administrators, should feel like they are commanding an ecosystem, not just using a tool.
--- END OF FILE USER_LOG.md ---
--- START OF FILE TESTING_LOG.md ---
# AgentricAI University - Final Iterative Enhancement & Pre-Release Log

**Date:** 2024-10-28
**Objective:** Conduct a final, iterative, multi-stage review and enhancement of the entire application to ensure architectural soundness, UI/UX polish, and feature completeness. The goal is a flawless, production-ready demonstration of the project's vision, taking all core functionalities out of simulation.

---

## Final Enhancement Process

The finalization was conducted in four distinct, iterative stages, each building upon the last to create a deeply robust and polished application.

### Stage 1: State, Logic, & Resilience Hardening

**Goal:** Reinforce the application's "brain" and "nervous system" by making state management more robust, providing system-wide user feedback, and implementing the "Mechanic Agent" resilience protocol.

*   **Action 1.1: Global Notification System:** Implemented a non-intrusive "toast" notification system managed by the global \`AppContext\`. This provides immediate user feedback for key actions (e.g., "Agent Saved Successfully!").
    *   **Files Affected:** \`types/index.ts\`, \`context/AppContext.tsx\`, \`App.tsx\`, \`components/Toast.tsx\` (new).
*   **Action 1.2: "Mechanic Agent" Protocol (UI Resilience):** Implemented a global \`ErrorBoundary\` component. If any UI component encounters a critical render error, the app no longer crashes. Instead, a graceful "System Anomaly" screen is displayed, informing the user that the "Mechanic Agent" has been dispatched.
    *   **Files Affected:** \`App.tsx\` (wrapped), \`components/ErrorBoundary.tsx\` (new), \`types/index.ts\`, \`context/AppContext.tsx\`.
*   **Action 1.3: Service Resilience:** Hardened the \`geminiService\` with robust \`try...catch\` blocks around all external API calls. This prevents network or API failures from crashing the application and ensures errors are handled gracefully.
    *   **Files Affected:** \`services/geminiService.ts\`.

**Outcome:** The application is significantly more resilient. It provides better user feedback, handles both UI and service errors gracefully, and embodies the self-healing philosophy of the core agent roster.

---

### Stage 2: UI/UX Polish & Refinement

**Goal:** Elevate the user experience from functional to fluid and professional by refining visual feedback and interaction details.

*   **Action 2.1: Enhanced Studio Execution Log:** The workflow execution log in the \`Studio\` was upgraded from a simple text list to a structured, detailed feed with timestamps and status icons for each step.
    *   **Files Affected:** \`components/Studio.tsx\`.
*   **Action 2.2: Consistent Feedback Integration:** Integrated the new notification system into key user workflows.
    *   **Files Affected:** \`components/AgentEditor.tsx\` (now provides a "Saved!" notification), \`components/CoreView.tsx\`.

**Outcome:** The application feels more polished, professional, and responsive. Users receive clearer, more detailed feedback on system processes.

---

### Stage 3: Architectural Refactoring

**Goal:** Improve the long-term health and clarity of the codebase by implementing best-practice architectural patterns.

*   **Action 3.1: Companion Agent Hook Implementation:** The complex, autonomous logic within the \`StudentDashboard\` was fully extracted into a new \`useCompanionAgentLogic\` custom hook.
    *   **Files Affected:** \`components/StudentDashboard.tsx\` (now significantly simplified), \`hooks/useCompanionAgentLogic.ts\` (new).
*   **Action 3.2: Code Clarity & Comments:** Performed a full-codebase review, adding comments to complex sections (especially within the new hook and \`CoreView\` AI logic) to clarify intent for future developers.

**Outcome:** The codebase is now cleaner, more modular, and easier to maintain. The separation of concerns between logic (hooks) and presentation (components) is much stronger.

---

### Stage 4: Advanced Feature Finalization - Live Multi-Agent Orchestration

**Goal:** Take the \`Core OS\` out of simulation and implement a fully functional, AI-powered mission planning and execution center.

*   **Action 4.1: Live Mission Execution:** The \`CoreView\`'s "Mission Control" panel was transformed from a static plan display into a live orchestrator. An "Execute Mission" button now triggers a real-time, step-by-step execution of the plan.
    *   **Files Affected:** \`components/CoreView.tsx\`, \`types/index.ts\`, \`context/AppContext.tsx\`.
*   **Action 4.2: Inter-Agent Communication & Collaboration:** The execution logic now programmatically takes the output (\`result\`) from one agent's completed step and uses it as the input for the next agent's task. This creates a true, functional multi-agent collaboration, fulfilling the core requirement. The UI updates in real-time to show the status (\`ACTIVE\`, \`COMPLETED\`, \`ERROR\`) of each agent.
*   **Action 4.3: Adaptive Re-planning (Simulation):** Added a simulation for adaptive re-planning. If an agent's task results in a simulated "error," a "Coordinator" agent persona will dynamically re-plan the mission, demonstrating advanced autonomous problem-solving.

**Outcome:** This feature provides a stunning, fully functional demonstration of the platform's core value proposition: the ability to intelligently orchestrate teams of specialized AI agents to solve complex problems. It serves as the capstone feature for the pre-release demo.

---

## Final Verification

A final pass of all user journeys, including the new Creator login flow and the live mission execution, confirmed that the application is operating in a seamless, fluid, and robust state. The iterative enhancements have resulted in a significantly more polished and feature-complete platform. All systems are go.

**The AgentricAI University application is now ready for its pre-release demo.**
--- END OF FILE TESTING_LOG.md ---
--- START OF FILE App.tsx ---
import React from 'react';
import { useAppContext } from './context/AppContext';
import LoginView from './components/LoginView';
import StudentPortal from './components/StudentPortal';
import ParentTeacherPortal from './components/ParentTeacherPortal';
import AdminPortal from './components/AdminPortal';
import ToastContainer from './components/Toast';
import { ChatWidget } from './components/ChatWidget';
import ErrorBoundary from './components/ErrorBoundary';
import SystemStatusBar from './components/SystemStatusBar';

const App: React.FC = () => {
  const { state } = useAppContext();
  const { currentUser, systemError } = state;

  const renderPortal = () => {
    if (!currentUser) {
      return <LoginView />;
    }

    switch (currentUser.role) {
      case 'student':
        return <StudentPortal />;
      case 'parent':
      case 'teacher':
        return <ParentTeacherPortal />;
      case 'admin':
        return <AdminPortal />;
      default:
        return <LoginView />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-brand-text font-sans">
      <SystemStatusBar />
      <ErrorBoundary>
        {renderPortal()}
      </ErrorBoundary>
      {currentUser && !systemError && <ChatWidget currentUserRole={currentUser.role} />}
      <ToastContainer />
    </div>
  );
};

export default App;
--- END OF FILE App.tsx ---
--- START OF FILE components/AccountView.tsx ---
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CreditCardIcon, StarIcon, ShieldCheckIcon } from './icons';

const AccountView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { currentUser } = state;

    if (!currentUser) {
        return <div className="p-6">Not logged in.</div>
    }

    const handleUpgrade = () => {
        dispatch({ type: 'UPGRADE_PLAN' });
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'Successfully upgraded to Pro Plan!', type: 'success' } });
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <CreditCardIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Account & Billing</h1>
                    <p className="text-brand-text-secondary">Manage your subscription and review our ecosystem philosophy.</p>
                </div>
            </header>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subscription Plans */}
                <div className="space-y-6">
                    <div className={\`p-6 rounded-lg border-2 \${currentUser.subscriptionPlan === 'free' ? 'border-brand-primary' : 'border-brand-border'} bg-brand-gray\`}>
                        <h2 className="text-xl font-bold text-white">Free Plan</h2>
                        <p className="text-brand-text-secondary text-sm mt-1 mb-4">Core features for all users.</p>
                        <ul className="text-sm space-y-2 text-brand-text">
                            <li>✓ Access for 1 Student</li>
                            <li>✓ Standard AI Companion Agent</li>
                            <li>✓ Core Curriculum Activities</li>
                            <li>✓ Privacy-First Data Model</li>
                        </ul>
                         {currentUser.subscriptionPlan === 'free' && (
                            <button disabled className="w-full mt-6 bg-brand-primary text-white font-semibold py-2 rounded-md opacity-50">Current Plan</button>
                        )}
                    </div>
                    
                    <div className={\`p-6 rounded-lg border-2 \${currentUser.subscriptionPlan === 'pro' ? 'border-yellow-400' : 'border-brand-border'} bg-brand-gray\`}>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">Pro Plan</h2>
                            <span className="flex items-center gap-1 text-xs font-bold text-yellow-400"><StarIcon className="w-4 h-4"/> PREMIUM</span>
                        </div>
                        <p className="text-brand-text-secondary text-sm mt-1 mb-4">Unlock advanced AI and administrative features.</p>
                         <ul className="text-sm space-y-2 text-brand-text">
                            <li>✓ All features from Free Plan</li>
                            <li>✓ Access for up to 5 Students</li>
                            <li>✓ **Gemini 2.5 Flash** powered agents</li>
                            <li>✓ Advanced Administrative Tools</li>
                            <li>✓ Priority Support</li>
                        </ul>
                        {currentUser.subscriptionPlan === 'free' ? (
                            <button onClick={handleUpgrade} className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md">Upgrade to Pro</button>
                        ) : (
                            <button disabled className="w-full mt-6 bg-yellow-500 text-black font-semibold py-2 rounded-md opacity-50">Current Plan</button>
                        )}
                    </div>
                </div>

                {/* Ecosystem Philosophy */}
                <div className="bg-brand-gray border border-brand-border rounded-lg p-6">
                    <div className="flex items-center text-brand-cyan mb-3">
                        <ShieldCheckIcon className="w-6 h-6 mr-2" />
                        <h2 className="text-xl font-bold text-white">Our Ecosystem Philosophy</h2>
                    </div>
                    <div className="text-sm text-brand-text-secondary space-y-4 leading-relaxed">
                        <p>
                            AgentricAI University is built on a vision of creating a self-sustaining, collaborative educational platform. We believe in transparency and fair value exchange for the powerful AI technologies that make this possible.
                        </p>
                        <p>
                            Our freemium model is designed to support this vision. For premium services that utilize advanced, large-scale AI models from partners like Google, we have structured our revenue model to be both sustainable and equitable.
                        </p>
                        <p className="font-semibold text-brand-text p-3 bg-brand-dark rounded-md border border-brand-light-gray">
                            A <span className="text-brand-primary font-bold">90% majority</span> of the subscription fee is allocated directly to cover the computational costs and licensing of the advanced AI models. The remaining <span className="text-brand-primary font-bold">10%</span> serves as a royalty to support the ongoing development, maintenance, and innovation of the AgentricAI platform itself.
                        </p>
                        <p>
                            This structure ensures that the platform can continue to grow, innovate, and provide cutting-edge educational tools, while fairly compensating the foundational technologies it is built upon.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountView;
--- END OF FILE components/AccountView.tsx ---
--- START OF FILE components/AdminPortal.tsx ---
import React, { useState } from 'react';
import Dashboard from './Dashboard';
import Studio from './Studio';
import AgentEditor from './AgentEditor';
import StudentView from './StudentView';
import StudentDashboard from './StudentDashboard';
import GatewayView from './GatewayView';
import StudentRoster from './StudentRoster';
import ParentTeacherConsole from './ParentTeacherConsole';
import ShowcaseView from './ShowcaseView';
import AccountView from './AccountView';
import SystemOptimizationView from './SystemOptimizationView';
import SecuritySentinelView from './SecuritySentinelView';
import MissionCommandView from './MissionCommandView';
import { BrainCircuitIcon, LayoutDashboardIcon, Cog8ToothIcon, AcademicCapIcon, ServerStackIcon, UserGroupIcon, TrophyIcon, ArrowRightOnRectangleIcon, UserIcon, CreditCardIcon, BoltIcon, ShieldCheckIcon, CommandLineIcon } from './icons';
import { useAppContext } from '../context/AppContext';
// FIX: Import the centralized View type
import { View } from '../types/index';

// FIX: Removed local AdminView type in favor of centralized View type
const AdminPortal: React.FC = () => {
  const { dispatch, state } = useAppContext();
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [activeStudentIdForConsole, setActiveStudentIdForConsole] = useState<string | null>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { id: 'student-roster', label: 'Agent Roster', icon: <UserGroupIcon className="w-5 h-5" /> },
    { id: 'showcase', label: 'Project Showcase', icon: <TrophyIcon className="w-5 h-5" /> },
    { id: 'mission-command', label: 'Mission Command', icon: <CommandLineIcon className="w-5 h-5" /> },
    { id: 'security-sentinel', label: 'Security Sentinel', icon: <ShieldCheckIcon className="w-5 h-5" /> },
    { id: 'studio', label: 'Studio', icon: <BrainCircuitIcon className="w-5 h-5" /> },
    { id: 'agent-editor', label: 'Agent Editor', icon: <Cog8ToothIcon className="w-5 h-5" /> },
    { id: 'gateway', label: 'Gateway', icon: <ServerStackIcon className="w-5 h-5" /> },
    { id: 'system-optimization', label: 'Optimization', icon: <BoltIcon className="w-5 h-5" /> },
  ];

  const bottomNavItems = [
     { id: 'account', label: 'Account & Billing', icon: <CreditCardIcon className="w-5 h-5" /> },
     { id: 'university', label: 'University Hub', icon: <AcademicCapIcon className="w-5 h-5" /> },
  ];

  const navigateToConsole = (studentId: string) => {
    setActiveStudentIdForConsole(studentId);
    setActiveView('parent-teacher-console');
  }
  
  const handleLogout = () => {
      dispatch({ type: 'LOGOUT' });
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'studio':
        return <Studio setActiveView={setActiveView} />;
      case 'agent-editor':
        return <AgentEditor />;
      case 'mission-command':
        return <MissionCommandView />;
      case 'security-sentinel':
        return <SecuritySentinelView />;
      case 'gateway':
        return <GatewayView />;
      case 'system-optimization':
        return <SystemOptimizationView />;
      case 'student-roster':
        return <StudentRoster navigateToConsole={navigateToConsole} />;
      case 'parent-teacher-console':
        return activeStudentIdForConsole ? <ParentTeacherConsole studentId={activeStudentIdForConsole} setActiveView={setActiveView} /> : <StudentRoster navigateToConsole={navigateToConsole} />;
      case 'showcase':
        return <ShowcaseView />;
      case 'account':
        return <AccountView />;
       case 'university':
        return <StudentView setActiveView={setActiveView} />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen flex">
      <nav className="w-16 bg-brand-gray border-r border-brand-border flex flex-col items-center py-4 justify-between z-20">
        <div>
          <div 
            className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-sm cursor-pointer mb-6"
            onClick={() => setActiveView('dashboard')}
            title="AgentricAI University"
          >
            AAU
          </div>
          <div className="flex flex-col items-center space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={\`p-3 rounded-lg transition-colors duration-200 \${
                  activeView === item.id || (activeView === 'parent-teacher-console' && item.id === 'student-roster')
                    ? 'bg-brand-accent text-white' 
                    : 'text-brand-text-secondary hover:bg-brand-light-gray hover:text-white'
                }\`}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
            {bottomNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as View)}
                className={\`p-3 rounded-lg transition-colors duration-200 \${
                  activeView === item.id ? 'bg-brand-accent text-white' : 'text-brand-text-secondary hover:bg-brand-light-gray hover:text-white'
                }\`}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}
            <button onClick={handleLogout} className="p-3 rounded-lg text-brand-text-secondary hover:bg-red-800/50 hover:text-white" title="Logout">
                <ArrowRightOnRectangleIcon className="w-5 h-5"/>
            </button>
        </div>
      </nav>

      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default AdminPortal;
--- END OF FILE components/AdminPortal.tsx ---
--- START OF FILE components/AgentEditor.tsx ---
import React, { useState, useEffect, useRef } from 'react';
import { 
    PlusIcon, BellIcon, VariableIcon, Squares2X2Icon, PlusCircleIcon,
    ArrowUpOnSquareIcon, UserCircleIcon, InformationCircleIcon,
    IdentificationIcon, LightBulbIcon, DocumentMagnifyingGlassIcon,
    ArrowPathIcon, CommandLineIcon, BookOpenIcon, GlobeAltIcon, PaperAirplaneIcon, BeakerIcon, XMarkIcon, Cog6ToothIcon, SparklesIcon, StarIcon
} from './icons';
import { useAppContext } from '../context/AppContext';
import { Agent, ChatMessage, ToolConfig, SubscriptionPlan } from '../types/index';
import { startChatStream, generateContent } from '../services/logicBroker';
import { AVAILABLE_TOOLS } from '../core/tools';

const SectionHeader: React.FC<{ title: string; children?: React.ReactNode; }> = ({ title, children }) => (
    <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-bold uppercase text-brand-text-secondary tracking-wider">{title}</h3>
        {children}
    </div>
);

const FormField: React.FC<{ label: string; children: React.ReactNode; }> = ({ label, children }) => (
    <div className="mb-4">
        <label className="text-sm text-brand-text-secondary block mb-1">{label}</label>
        {children}
    </div>
);

const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  const formatText = (text: string) => {
    // Escape HTML to prevent injection before applying markdown
    const escapedText = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const formattedText = escapedText
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-brand-secondary">$1</strong>') // Bold
      .replace(/\\*(.*?)\\*/g, '<em>$1</em>'); // Italic
      
    return { __html: formattedText.replace(/\\n/g, '<br />') }; // Also handle newlines
  };

  return <div className="p-3 text-sm bg-brand-dark border border-brand-border rounded-md prose prose-sm prose-invert h-[192px] overflow-y-auto whitespace-pre-wrap" dangerouslySetInnerHTML={formatText(content)} />;
};

const AgentEditor: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const activeAgent = state.agents.find(a => a.id === state.activeAgentId);
    const subscriptionPlan = state.currentUser?.subscriptionPlan || 'free';
    const brokerParams = { isPremium: subscriptionPlan === 'pro' };
    
    const [agentData, setAgentData] = useState<Partial<Agent>>(activeAgent || { model: 'gemini-standard', name: 'New Agent', tools: [], coreMemory: [], personality: { tone: 'professional', creativity: 'medium', verbosity: 'balanced' } });
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isLoadingChat, setIsLoadingChat] = useState(false);
    const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);
    const [isToolSelectorOpen, setIsToolSelectorOpen] = useState(false);
    const [instructionMode, setInstructionMode] = useState<'edit' | 'preview'>('edit');
    const [expandedTool, setExpandedTool] = useState<string | null>(null);
    const toolSelectorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const agentToLoad = activeAgent || { 
            model: 'gemini-standard', 
            name: 'New Agent', 
            id: \`agent-\${Date.now()}\`,
            tools: [],
            coreMemory: [],
            systemInstruction: '',
            identity: '',
            personality: { tone: 'professional', creativity: 'medium', verbosity: 'balanced' },
        };
        setAgentData(agentToLoad);
        setChatMessages([]);
    }, [state.activeAgentId, activeAgent]);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (toolSelectorRef.current && !toolSelectorRef.current.contains(event.target as Node)) {
                setIsToolSelectorOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [toolSelectorRef]);


    const handleSave = () => {
        if (agentData.id && agentData.name) {
            const actionType = state.agents.some(a => a.id === agentData.id) ? 'UPDATE_AGENT' : 'ADD_AGENT';
            dispatch({ type: actionType, payload: agentData as Agent });
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'Agent saved successfully!', type: 'success' } });
        }
    };
    
    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedModel = e.target.value;
        if (selectedModel === 'gemini-2.5-flash' && !brokerParams.isPremium) {
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'Upgrade to Pro to use premium models!', type: 'info' } });
            return;
        }
        setAgentData({ ...agentData, model: selectedModel });
    };

    const handleGeneratePersona = async () => {
        setIsGeneratingPersona(true);
        const p = agentData.personality;
        const prompt = \`
            Generate a detailed system instruction (persona) for an AI agent based on the following high-level traits. The instruction should be comprehensive, written in the second person (e.g., "You are..."), and encapsulate the desired behavior.

            - Tone: \${p?.tone}
            - Creativity Level: \${p?.creativity}
            - Verbosity: \${p?.verbosity}

            Based on these traits, write a detailed persona.
        \`;
        try {
            const { text } = await generateContent({ prompt }, brokerParams);
            setAgentData({ ...agentData, systemInstruction: text });
        } catch (error) {
             const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
             dispatch({ type: 'SHOW_TOAST', payload: { message: errorMessage, type: 'error' } });
        } finally {
            setIsGeneratingPersona(false);
        }
    };

    const handleChatSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isLoadingChat || !agentData.systemInstruction) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: chatInput, timestamp: new Date().toLocaleTimeString() };
        setChatMessages(prev => [...prev, userMessage]);
        const currentInput = chatInput;
        setChatInput('');
        setIsLoadingChat(true);

        const botMessageId = (Date.now() + 1).toString();
        setChatMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: '', timestamp: new Date().toLocaleTimeString() }]);

        try {
            const stream = await startChatStream(currentInput, agentData.systemInstruction, brokerParams, agentData.id);
            let responseText = '';
            for await (const chunk of stream) {
                responseText += chunk;
                setChatMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: responseText } : msg));
            }
        } catch (error) {
            console.error(error);
            setChatMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, text: 'An error occurred.' } : msg));
        } finally {
            setIsLoadingChat(false);
        }
    };
    
    const handleAddTool = (toolId: string) => {
        const existingTools = agentData.tools || [];
        if (!existingTools.some(t => t.toolId === toolId)) {
            const toolDef = AVAILABLE_TOOLS.find(t => t.id === toolId);
            const defaultSettings = (toolDef?.settings || []).reduce((acc, setting) => {
                acc[setting.key] = setting.defaultValue;
                return acc;
            }, {} as Record<string, any>);
            
            const newTool: ToolConfig = { toolId, settings: defaultSettings };
            setAgentData({ ...agentData, tools: [...existingTools, newTool] });
        }
        setIsToolSelectorOpen(false);
    };

    const handleRemoveTool = (toolId: string) => {
        setAgentData({ ...agentData, tools: (agentData.tools || []).filter(t => t.toolId !== toolId) });
    };
    
    const handleToolSettingChange = (toolId: string, settingKey: string, value: string | number | boolean) => {
        setAgentData(prev => ({
            ...prev,
            tools: (prev.tools || []).map(tool => {
                if (tool.toolId === toolId) {
                    return {
                        ...tool,
                        settings: {
                            ...tool.settings,
                            [settingKey]: value
                        }
                    };
                }
                return tool;
            })
        }));
    };


    if (!agentData) {
        return <div className="p-4">No Agent Selected or New Agent not Initialized.</div>
    }
    
    const availableToolsToAdd = AVAILABLE_TOOLS.filter(tool => !(agentData.tools || []).some(t => t.toolId === tool.id));

    return (
        <div className="flex flex-col h-full bg-brand-dark text-brand-text">
          <header className="flex-shrink-0 bg-brand-gray border-b border-brand-border px-4 py-2 flex justify-between items-center">
            <h1 className="text-lg font-bold text-white">{agentData.name || 'New Agent'}</h1>
            <div className="flex items-center gap-4">
                <button onClick={handleSave} className="bg-brand-primary hover:bg-brand-accent text-white px-3 py-1 rounded-md text-sm">Save Agent</button>
            </div>
          </header>
          
          <div className="flex-1 flex overflow-hidden">
            <aside className="w-[350px] bg-brand-gray border-r border-brand-border p-4 flex flex-col overflow-y-auto">
                <SectionHeader title="Agent Settings" />
                <FormField label="Name">
                    <input type="text" value={agentData.name || ''} onChange={e => setAgentData({...agentData, name: e.target.value})} className="w-full bg-brand-light-gray border border-brand-border rounded-md px-2 py-1.5 text-sm" />
                </FormField>
                <FormField label="Identity">
                    <input type="text" value={agentData.identity || ''} onChange={e => setAgentData({...agentData, identity: e.target.value})} className="w-full bg-brand-light-gray border border-brand-border rounded-md px-2 py-1.5 text-sm" />
                </FormField>
                <FormField label="Model">
                    <select value={agentData.model} onChange={handleModelChange} className="w-full bg-brand-light-gray border border-brand-border rounded-md px-2 py-1.5 text-sm appearance-none">
                        <option value="gemini-standard">Standard (Free)</option>
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash (Premium)</option>
                    </select>
                </FormField>
                <div className="border-t border-brand-border my-4"></div>
                <SectionHeader title="Reasoning" />

                <div className="bg-brand-dark border border-brand-border rounded-md p-3 mb-4">
                    <h4 className="font-semibold text-sm mb-3">Personality</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                            <label className="text-brand-text-secondary block mb-1">Tone</label>
                            <select value={agentData.personality?.tone} onChange={e => setAgentData({...agentData, personality: {...agentData.personality!, tone: e.target.value as any}})} className="w-full bg-brand-light-gray border border-brand-border rounded px-2 py-1">
                                <option>professional</option><option>casual</option><option>playful</option><option>formal</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-brand-text-secondary block mb-1">Creativity</label>
                            <select value={agentData.personality?.creativity} onChange={e => setAgentData({...agentData, personality: {...agentData.personality!, creativity: e.target.value as any}})} className="w-full bg-brand-light-gray border border-brand-border rounded px-2 py-1">
                                <option>low</option><option>medium</option><option>high</option><option>maximum</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-brand-text-secondary block mb-1">Verbosity</label>
                            <select value={agentData.personality?.verbosity} onChange={e => setAgentData({...agentData, personality: {...agentData.personality!, verbosity: e.target.value as any}})} className="w-full bg-brand-light-gray border border-brand-border rounded px-2 py-1">
                                <option>concise</option><option>balanced</option><option>detailed</option>
                            </select>
                        </div>
                    </div>
                    <button onClick={handleGeneratePersona} disabled={isGeneratingPersona} className="w-full mt-3 bg-brand-secondary/20 hover:bg-brand-secondary/40 text-brand-secondary text-xs font-semibold py-1.5 rounded flex items-center justify-center gap-1 disabled:opacity-50">
                        {isGeneratingPersona ? <SparklesIcon className="w-4 h-4 animate-pulse"/> : <SparklesIcon className="w-4 h-4"/>}
                        {isGeneratingPersona ? 'Generating...' : 'Generate System Instruction'}
                    </button>
                </div>

                 <div>
                    <div className="flex border-b border-brand-border text-sm mb-2">
                        <button onClick={() => setInstructionMode('edit')} className={\`px-3 py-1 \${instructionMode === 'edit' ? 'text-white border-b-2 border-brand-primary' : 'text-brand-text-secondary'}\`}>Edit</button>
                        <button onClick={() => setInstructionMode('preview')} className={\`px-3 py-1 \${instructionMode === 'preview' ? 'text-white border-b-2 border-brand-primary' : 'text-brand-text-secondary'}\`}>Preview</button>
                    </div>
                     {instructionMode === 'edit' ? (
                        <textarea value={agentData.systemInstruction || ''} onChange={e => setAgentData({...agentData, systemInstruction: e.target.value})} rows={8} className="w-full bg-brand-light-gray border border-brand-border rounded-md p-2 text-sm resize-none" />
                     ) : (
                        <MarkdownPreview content={agentData.systemInstruction || ''} />
                     )}
                </div>
            </aside>

            <main className="flex-1 flex flex-col bg-brand-dark">
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {chatMessages.map(msg => (
                         <div key={msg.id} className={\`flex items-start gap-3 \${msg.sender === 'user' ? 'justify-end' : ''}\`}>
                            {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-brand-light-gray flex items-center justify-center font-bold text-sm flex-shrink-0">{agentData?.identity?.charAt(0) || 'A'}</div>}
                            <div className={\`max-w-md px-4 py-2 rounded-2xl \${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-brand-gray text-brand-text rounded-bl-none'}\`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text || '...'}</p>
                            </div>
                         </div>
                    ))}
                </div>
                <div className="p-4 border-t border-brand-border bg-brand-dark">
                    <form onSubmit={handleChatSend} className="relative">
                        <textarea placeholder="Test your agent..." rows={2} value={chatInput} onChange={e => setChatInput(e.target.value)} className="w-full bg-brand-light-gray border border-brand-border rounded-md p-2 pr-12 text-sm resize-none"></textarea>
                        <button type="submit" disabled={isLoadingChat} className="absolute right-2 bottom-2 p-2 bg-brand-primary rounded-md text-white disabled:bg-brand-text-secondary">
                           <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </main>

            <aside className="w-[350px] bg-brand-gray border-l border-brand-border p-4 flex flex-col overflow-y-auto">
                <SectionHeader title="Context Window" />
                <div className="relative mb-4">
                    <div className="w-full bg-brand-dark rounded-full h-2.5"><div className="bg-brand-primary h-2.5 rounded-full" style={{width: "15%"}}></div></div>
                    <div className="text-xs text-center text-brand-text-secondary mt-1">Estimated tokens</div>
                </div>
                <div className="border-t border-brand-border my-4"></div>
                <SectionHeader title="Core Memory" />
                 <p className="text-xs text-brand-text-secondary mb-4 flex items-center gap-2">
                    <InformationCircleIcon className="w-4 h-4"/>
                    <span>Memory is not yet implemented.</span>
                </p>
                <div className="border-t border-brand-border my-4"></div>
                <SectionHeader title="Tools">
                    <div className="relative" ref={toolSelectorRef}>
                         <button onClick={() => setIsToolSelectorOpen(!isToolSelectorOpen)} className="flex items-center gap-1 text-xs text-brand-secondary hover:text-white"><PlusCircleIcon className="w-4 h-4" /> Add Tool</button>
                         {isToolSelectorOpen && (
                            <div className="absolute right-0 mt-2 w-60 bg-brand-light-gray border border-brand-border rounded-md shadow-lg z-10">
                                {availableToolsToAdd.length > 0 ? (
                                    <ul>
                                        {availableToolsToAdd.map(tool => (
                                            <li key={tool.id} onClick={() => handleAddTool(tool.id)} className="flex items-center gap-3 p-2 text-sm hover:bg-brand-accent cursor-pointer">
                                                <span className="text-brand-text-secondary">{tool.icon}</span>
                                                <span>{tool.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="p-2 text-sm text-brand-text-secondary">No more tools to add.</p>
                                )}
                            </div>
                         )}
                    </div>
                </SectionHeader>
                 <div className="space-y-2 mt-2">
                    {(agentData.tools || []).map(toolConfig => {
                        const toolDef = AVAILABLE_TOOLS.find(t => t.id === toolConfig.toolId);
                        if (!toolDef) return null;
                        return (
                             <div key={toolConfig.toolId} className="rounded-md bg-brand-dark border border-brand-border">
                                <div className="flex items-center justify-between p-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-brand-text-secondary">{toolDef.icon}</span>
                                        <span className="text-sm">{toolDef.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {toolDef.settings && toolDef.settings.length > 0 && (
                                            <button onClick={() => setExpandedTool(expandedTool === toolDef.id ? null : toolDef.id)} className="text-brand-text-secondary hover:text-white">
                                                <Cog6ToothIcon className={\`w-4 h-4 transition-transform \${expandedTool === toolDef.id ? 'rotate-90' : ''}\`} />
                                            </button>
                                        )}
                                        <button onClick={() => handleRemoveTool(toolDef.id)} className="text-red-500 hover:text-red-400">
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                {expandedTool === toolDef.id && toolDef.settings && (
                                    <div className="p-3 border-t border-brand-border space-y-3">
                                        {toolDef.settings.map(setting => (
                                            <div key={setting.key}>
                                                {setting.type === 'boolean' ? (
                                                    <label className="flex items-center gap-2 text-xs text-brand-text-secondary cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={toolConfig.settings[setting.key] ?? setting.defaultValue}
                                                            onChange={e => handleToolSettingChange(toolDef.id, setting.key, e.target.checked)}
                                                            className="bg-brand-light-gray border-brand-border rounded text-brand-primary focus:ring-brand-primary focus:ring-offset-brand-gray"
                                                        />
                                                        <span>{setting.label}</span>
                                                    </label>
                                                ) : (
                                                    <>
                                                        <label className="text-xs text-brand-text-secondary block mb-1">{setting.label}</label>
                                                        <input
                                                            type={setting.type}
                                                            value={toolConfig.settings[setting.key] ?? setting.defaultValue}
                                                            onChange={e => handleToolSettingChange(toolDef.id, setting.key, setting.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
                                                            className="w-full bg-brand-light-gray border border-brand-border rounded-md px-2 py-1 text-xs"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                 </div>
            </aside>
          </div>
        </div>
    );
};

export default AgentEditor;
--- END OF FILE components/AgentEditor.tsx ---
--- START OF FILE components/ChatWidget.tsx ---
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserRole, ProposedChanges } from '../types/index';
import { generateCodeModification, startChatStream } from '../services/logicBroker';
import { PaperAirplaneIcon, XMarkIcon, ArrowsPointingOutIcon, SparklesIcon } from './icons';
import { codebase } from '../core/codebaseContext';
import DiffViewModal from './DiffViewModal';
import { useAppContext } from '../context/AppContext';

interface ChatWidgetProps {
  currentUserRole: UserRole;
}

const getPersonaForRole = (role: UserRole): { instruction: string; greeting: string; title: string } => {
    switch (role) {
        case 'parent':
        case 'teacher':
            return {
                title: 'Platform Guide',
                instruction: "You are a friendly and helpful guide for the AgentricAI University platform. Your audience is parents and teachers who are not technical. Explain concepts simply, guide them on how to set goals for their student's agent, and help them understand the privacy-first model. Be patient and supportive.",
                greeting: "Hello! I'm your guide to AgentricAI University. I can help you understand how to set goals for your student or navigate the platform. How can I assist you today?"
            };
        case 'admin':
            return {
                title: 'Recursive Code Assistant',
                instruction: "You are a specialized AI assistant for the Creator of AgentricAI. Your purpose is to modify the application's source code based on natural language requests. You are equipped with a \`code_editor\` tool. Always analyze the full codebase context before proposing changes. Adhere to the mandatory confirmation protocol. If you detect a derailment or cannot fulfill a request safely, you must report to the 'Mechanic Agent' for diagnostics.",
                greeting: "Creator access confirmed. I am ready to modify the application's source code based on your directives. How can I assist you?"
            };
        case 'student':
        default:
             return {
                title: 'Analytics Specialist',
                instruction: 'You are a helpful and concise data analytics specialist for a company called AgentricAI. Provide insights on system performance, student analytics, and agent status. Keep your answers brief and to the point.',
                greeting: 'Hello, I am your data analytics specialist. I can provide insights on system performance, student analytics, agent status, and much more. What would you like to analyze?',
            };
    }
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({ currentUserRole }) => {
    const { state } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [proposedChanges, setProposedChanges] = useState<ProposedChanges | null>(null);
    const [isDiffModalOpen, setIsDiffModalOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const persona = getPersonaForRole(currentUserRole);
    const brokerParams = { isPremium: state.currentUser?.subscriptionPlan === 'pro' };

    useEffect(() => {
        if (isOpen) {
            setMessages([
                {
                    id: '1',
                    sender: 'bot',
                    text: persona.greeting,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } else {
            setMessages([]);
        }
    }, [isOpen, currentUserRole]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        // --- CREATOR CODE PATH (Premium Only) ---
        if (currentUserRole === 'admin') {
            try {
                const changes = await generateCodeModification(currentInput, codebase, brokerParams);
                if (changes.changes.length === 0) {
                     setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: \`Request processed, but no code changes were generated. Reason: \${changes.summary}\`, timestamp: new Date().toLocaleTimeString() }]);
                } else {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        sender: 'bot',
                        text: \`I have analyzed your request and prepared the following changes.\`,
                        timestamp: new Date().toLocaleTimeString(),
                        mode: 'confirmation',
                        proposedChanges: changes,
                    }]);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
                const derailmentMessage = \`DERAILMENT DETECTED: An error occurred while generating code modifications. \\n\\nError: \${errorMessage}\\n\\nReporting to Mechanic Agent for diagnostics. Please try refining your request.\`;
                setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', text: derailmentMessage, timestamp: new Date().toLocaleTimeString() }]);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // --- STANDARD USER PATH (Freemium) ---
        const botMessageId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, {
            id: botMessageId,
            sender: 'bot',
            text: '',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        try {
            const stream = await startChatStream(currentInput, persona.instruction, brokerParams);
            let responseText = '';
            for await (const chunk of stream) {
                responseText += chunk;
                setMessages(prev => prev.map(msg => 
                    msg.id === botMessageId ? { ...msg, text: responseText } : msg
                ));
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => prev.map(msg => 
                msg.id === botMessageId ? { ...msg, text: 'Sorry, I encountered an error.' } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleConfirmChanges = (changes: ProposedChanges) => {
        setProposedChanges(changes);
        setIsDiffModalOpen(true);
    };

    const handleApproveChanges = () => {
        setIsDiffModalOpen(false);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'bot',
            text: \`Changes approved. (Simulation: Applying changes to the codebase now.)\`,
            timestamp: new Date().toLocaleTimeString()
        }]);
        setProposedChanges(null);
    };


    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-gradient-to-br from-brand-cyan to-brand-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50"
            >
                <SparklesIcon className="w-8 h-8"/>
            </button>
        );
    }

    return (
        <>
            <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-brand-light-gray rounded-xl shadow-2xl flex flex-col border border-brand-border z-50">
                <header className="bg-brand-gray p-3 flex justify-between items-center rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-brand-cyan to-brand-primary rounded-full flex items-center justify-center font-bold text-white text-xs">
                            AI
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">AgentricAI</h3>
                            <p className="text-xs text-brand-text-secondary">{persona.title}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-brand-text-secondary">
                        <button className="hover:text-white"><ArrowsPointingOutIcon className="w-4 h-4" /></button>
                        <button onClick={() => setIsOpen(false)} className="hover:text-white"><XMarkIcon className="w-5 h-5" /></button>
                    </div>
                </header>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={\`flex flex-col \${msg.sender === 'user' ? 'items-end' : 'items-start'}\`}>
                            <div className={\`max-w-xs px-4 py-2 rounded-2xl \${msg.sender === 'user' ? 'bg-brand-primary text-white rounded-br-none' : 'bg-brand-gray text-brand-text rounded-bl-none'}\`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text || '...'}</p>
                                {msg.mode === 'confirmation' && msg.proposedChanges && (
                                    <div className="mt-2">
                                        <p className="text-sm italic text-brand-text-secondary mb-2">{msg.proposedChanges.summary}</p>
                                        <button
                                            onClick={() => handleConfirmChanges(msg.proposedChanges!)}
                                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg text-sm"
                                        >
                                            View & Confirm Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-brand-text-secondary mt-1">{msg.timestamp}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="p-3 border-t border-brand-border">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-brand-gray border border-brand-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            disabled={isLoading}
                        />
                        <button type="submit" className="p-2 bg-brand-primary rounded-lg text-white disabled:bg-brand-text-secondary" disabled={isLoading}>
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </footer>
            </div>
            <DiffViewModal 
                isOpen={isDiffModalOpen}
                onClose={() => setIsDiffModalOpen(false)}
                onApprove={handleApproveChanges}
                changes={proposedChanges}
            />
        </>
    );
};
--- END OF FILE components/ChatWidget.tsx ---
--- START OF FILE components/Dashboard.tsx ---
import React from 'react';
import { ChartLineIcon, CpuIcon, DatabaseIcon, GroupIcon, MessageIcon, UserGroupIcon, AcademicCapIcon, BoltIcon, ShieldCheckIcon } from './icons';
import { useAppContext } from '../context/AppContext';
// FIX: Changed import path for View type
import { View } from '../types/index';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, children }) => (
  <div className="bg-brand-gray border border-brand-border rounded-lg p-4 flex flex-col justify-between">
    <div>
      <div className="flex justify-between items-start text-brand-text-secondary">
        <span className="text-sm font-medium">{title}</span>
        {icon}
      </div>
      <div className="mt-2">
        <span className="text-2xl font-semibold text-brand-text">{value}</span>
        {change && <span className="ml-2 text-sm text-green-400">{change}</span>}
      </div>
      {children}
    </div>
  </div>
);

const ActionCard: React.FC<{ icon: React.ReactNode, title: string, description: string, onClick: () => void }> = ({icon, title, description, onClick}) => (
    <div onClick={onClick} className="bg-brand-gray border border-brand-border rounded-lg p-6 text-center hover:border-brand-primary transition-all duration-200 cursor-pointer">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-brand-text-secondary mt-1">{description}</p>
    </div>
);

interface DashboardProps {
  setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
  const { state, dispatch } = useAppContext();
  const agentCount = state.agents.length;

  const handleAgentManagementClick = () => {
      if (state.agents.length > 0) {
          dispatch({ type: 'SET_ACTIVE_AGENT_ID', payload: state.agents[0].id });
      } else {
          dispatch({ type: 'SET_ACTIVE_AGENT_ID', payload: null });
      }
      setActiveView('agent-editor');
  }

  return (
    <div className="p-6 bg-brand-dark min-h-full">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Administrative Control Center</h1>
          <p className="text-brand-text-secondary">Monitor and manage the AgentricAI ecosystem, oversee student progress, and optimize learning experiences</p>
        </div>
      </header>
      
      <div className="bg-green-900/50 border border-green-400 text-green-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
        <strong className="font-bold">All Agents Operational. </strong>
        <span className="block sm:inline">The AgentricAI ecosystem is fully activated with all agents ready for task delegation and student support.</span>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
           <h2 className="text-xl font-semibold text-white">System Health Overview</h2>
           <span className="text-sm font-medium bg-green-800 text-green-200 px-2 py-1 rounded-full">EXCELLENT</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Agents" value={\`\${agentCount}/\${agentCount}\`} change="100% efficiency" icon={<GroupIcon className="w-6 h-6" />} />
          <StatCard title="Response Time" value="98ms" change="12 tasks/min" icon={<ChartLineIcon className="w-6 h-6" />} />
          <StatCard title="Memory Usage" value="48%" change="CPU: 25%" icon={<CpuIcon className="w-6 h-6" />} />
          <StatCard title="Active Students" value="1" change="0 need attention" icon={<AcademicCapIcon className="w-6 h-6" />} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Agent Status" value="" icon={<GroupIcon className="w-6 h-6"/>}>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Total Agents:</span> <span className="font-semibold text-brand-text">{agentCount}</span></div>
            <div className="flex justify-between"><span>Active:</span> <span className="font-semibold text-green-400">{agentCount}</span></div>
            <div className="flex justify-between"><span>Processing:</span> <span className="font-semibold text-yellow-400">0</span></div>
            <div className="flex justify-between"><span>Idle:</span> <span className="font-semibold text-brand-text-secondary">0</span></div>
          </div>
        </StatCard>
        <StatCard title="Communication" value="21" icon={<MessageIcon className="w-6 h-6" />} >
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Recent Messages:</span> <span className="font-semibold text-brand-text">21</span></div>
            <div className="flex justify-between"><span>Avg Response:</span> <span className="font-semibold text-green-400">98ms</span></div>
          </div>
        </StatCard>
        <StatCard title="Knowledge Base" value="62" icon={<DatabaseIcon className="w-6 h-6" />} >
           <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Total Entries:</span> <span className="font-semibold text-brand-text">62</span></div>
            <div className="flex justify-between"><span>Categories:</span> <span className="font-semibold text-brand-text">15</span></div>
          </div>
        </StatCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard 
            icon={<ShieldCheckIcon className="w-12 h-12 mx-auto text-brand-cyan mb-4" />}
            title="Agent Management"
            description="Configure, deploy, and monitor AI agents."
            onClick={handleAgentManagementClick}
        />
        <ActionCard 
            icon={<UserGroupIcon className="w-12 h-12 mx-auto text-brand-cyan mb-4" />}
            title="Student Monitoring"
            description="Track student progress and engagement."
            // FIX: Changed to a valid view for the admin portal.
            onClick={() => setActiveView('student-roster')}
        />
        <ActionCard 
            icon={<BoltIcon className="w-12 h-12 mx-auto text-brand-cyan mb-4" />}
            title="System Optimization"
            description="Adjust system parameters and performance."
            onClick={() => setActiveView('system-optimization')}
        />
      </div>
    </div>
  );
};

export default Dashboard;
--- END OF FILE components/Dashboard.tsx ---
--- START OF FILE components/DiffViewModal.tsx ---
import React from 'react';
import { ProposedChanges } from '../types/index';
import { XMarkIcon } from './icons';

interface DiffViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  changes: ProposedChanges | null;
}

const DiffViewModal: React.FC<DiffViewModalProps> = ({ isOpen, onClose, onApprove, changes }) => {
  if (!isOpen || !changes) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
      <div className="bg-brand-gray border border-brand-border rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b border-brand-border">
          <div>
            <h2 className="text-xl font-bold text-white">Review Code Changes</h2>
            <p className="text-sm text-brand-text-secondary">{changes.summary}</p>
          </div>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
        </header>
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {changes.changes.map((change, index) => (
            <div key={index} className="border border-brand-border rounded-lg overflow-hidden">
              <div className="bg-brand-light-gray p-2 font-mono text-sm text-brand-cyan">{change.filePath}</div>
              <div className="p-4 bg-brand-dark">
                <pre className="text-xs text-brand-text whitespace-pre-wrap font-mono">{change.modifiedContent}</pre>
              </div>
            </div>
          ))}
        </main>
        <footer className="p-4 border-t border-brand-border flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 bg-brand-light-gray rounded-md text-sm font-semibold hover:bg-brand-border">Cancel</button>
            <button onClick={onApprove} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold">Approve & Apply Changes</button>
        </footer>
      </div>
    </div>
  );
};

export default DiffViewModal;
--- END OF FILE components/DiffViewModal.tsx ---
--- START OF FILE components/ErrorBoundary.tsx ---
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AppContext } from '../context/AppContext';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Dispatch the error to the global context
    this.context.dispatch({ type: 'SET_SYSTEM_ERROR', payload: { error, errorInfo } });
  }

  public render() {
    // The actual fallback UI is rendered in App.tsx based on the global state.
    // This component's role is just to catch the error and update the state.
    // We don't render the children if there's an error to prevent a render loop.
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
--- END OF FILE components/ErrorBoundary.tsx ---
--- START OF FILE components/GatewayView.tsx ---
import React, { useState, useEffect } from 'react';
import { ServerStackIcon, ShieldCheckIcon, SignalIcon, CpuIcon } from './icons';

interface LogEntry {
  id: number;
  timestamp: string;
  direction: 'IN' | 'OUT';
  source: string;
  destination: string;
  status: 'Success' | 'Denied';
  details: string;
}

const sources = ['Studio (WF-1)', 'Chat Widget', 'Core OS (Mission)', 'Agent Editor'];
const destinations = ['Gemini API', 'Internal Cache', 'AgentricAI API'];
const details = ['Text Generation', 'Data Retrieval', 'Agent Coordination', 'Tool Execution'];

const generateRandomLog = (id: number): LogEntry => ({
  id,
  timestamp: new Date().toLocaleTimeString(),
  direction: Math.random() > 0.5 ? 'IN' : 'OUT',
  source: sources[Math.floor(Math.random() * sources.length)],
  destination: destinations[Math.floor(Math.random() * destinations.length)],
  status: Math.random() > 0.1 ? 'Success' : 'Denied',
  details: details[Math.floor(Math.random() * details.length)],
});


const StatCard: React.FC<{ title: string; value: string | React.ReactNode; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
      <div className="flex justify-between items-start text-brand-text-secondary">
        <span className="text-sm font-medium">{title}</span>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-semibold text-brand-text">{value}</div>
    </div>
);


const GatewayView: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isEncrypted, setIsEncrypted] = useState(true);
    const [isIdsActive, setIsIdsActive] = useState(true);

    useEffect(() => {
        const initialLogs = Array.from({ length: 5 }, (_, i) => generateRandomLog(i));
        setLogs(initialLogs);

        const interval = setInterval(() => {
            setLogs(prevLogs => {
                const newLog = generateRandomLog(prevLogs.length > 0 ? prevLogs[0].id + 1 : 1);
                const updatedLogs = [newLog, ...prevLogs];
                if (updatedLogs.length > 100) {
                    updatedLogs.pop();
                }
                return updatedLogs;
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <ServerStackIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Gateway Console</h1>
                    <p className="text-brand-text-secondary">Manage and monitor the secure proxy for all AgentricAI services.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                 <StatCard 
                    title="Connection Status" 
                    value={<span className="text-green-400">Connected</span>}
                    icon={<SignalIcon className="w-6 h-6" />} 
                />
                <StatCard title="Uptime" value="99.98%" icon={<ShieldCheckIcon className="w-6 h-6" />} />
                <StatCard title="Avg. Latency" value="45ms" icon={<SignalIcon className="w-6 h-6" />} />
                <StatCard title="CPU Load" value="15%" icon={<CpuIcon className="w-6 h-6" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic Log */}
                <div className="lg:col-span-2 bg-brand-gray border border-brand-border rounded-lg p-4 flex flex-col">
                    <h2 className="text-lg font-semibold text-white mb-3">Live Traffic Log</h2>
                    <div className="flex-grow overflow-y-auto h-96 font-mono text-xs pr-2">
                        <div className="grid grid-cols-6 gap-2 text-brand-text-secondary sticky top-0 bg-brand-gray pb-2">
                            <div>Timestamp</div>
                            <div>Direction</div>
                            <div>Source</div>
                            <div>Destination</div>
                            <div>Status</div>
                            <div className="col-span-2">Details</div>
                        </div>
                        <div className="space-y-1">
                            {logs.map(log => (
                                <div key={log.id} className="grid grid-cols-6 gap-2 p-1 rounded bg-brand-dark/50 animate-fade-in">
                                    <div className="text-brand-text-secondary">{log.timestamp}</div>
                                    <div>
                                        <span className={\`px-1.5 py-0.5 rounded text-white text-[10px] \${log.direction === 'IN' ? 'bg-blue-600' : 'bg-purple-600'}\`}>{log.direction}</span>
                                    </div>
                                    <div>{log.source}</div>
                                    <div>{log.destination}</div>
                                    <div>
                                        <span className={log.status === 'Success' ? 'text-green-400' : 'text-red-400'}>{log.status}</span>
                                    </div>
                                    <div className="col-span-2 text-brand-text-secondary truncate">{log.details}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Security & Settings */}
                <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
                     <h2 className="text-lg font-semibold text-white mb-4">Security Configuration</h2>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-brand-light-gray rounded-lg">
                            <div>
                                <h3 className="font-semibold text-white">End-to-End Encryption</h3>
                                <p className="text-xs text-brand-text-secondary">Enforce TLS 1.3+ on all connections.</p>
                            </div>
                            <button onClick={() => setIsEncrypted(!isEncrypted)} className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${isEncrypted ? 'bg-brand-primary' : 'bg-brand-dark'}\`}>
                                <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${isEncrypted ? 'translate-x-6' : 'translate-x-1'}\`} />
                            </button>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-brand-light-gray rounded-lg">
                            <div>
                                <h3 className="font-semibold text-white">Intrusion Detection (IDS)</h3>
                                <p className="text-xs text-brand-text-secondary">Monitor for malicious patterns.</p>
                            </div>
                             <button onClick={() => setIsIdsActive(!isIdsActive)} className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${isIdsActive ? 'bg-brand-primary' : 'bg-brand-dark'}\`}>
                                <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${isIdsActive ? 'translate-x-6' : 'translate-x-1'}\`} />
                            </button>
                        </div>
                         <div className="p-3 bg-brand-light-gray rounded-lg">
                            <h3 className="font-semibold text-white">API Call Brokering</h3>
                            <p className="text-xs text-brand-text-secondary mt-1">The intelligent gateway analyzes incoming requests. Simple, internal tasks are routed to the private AgentricAI API to conserve resources. Complex or knowledge-intensive requests are securely proxied to external LLMs.</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default GatewayView;
--- END OF FILE components/GatewayView.tsx ---
--- START OF FILE components/LoginView.tsx ---
import React, { useState, FormEvent } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, UserRole } from '../types/index';
import { EnvelopeIcon, LockClosedIcon, UserIcon, ArrowUturnLeftIcon, ShieldCheckIcon } from './icons';

const RoleButton: React.FC<{ onClick: () => void, text: string, primary?: boolean }> = ({ onClick, text, primary }) => {
    const baseClasses = "w-full flex items-center justify-center p-3 rounded-lg font-semibold transition-colors duration-200";
    const primaryClasses = "bg-brand-primary text-white hover:bg-brand-accent";
    const secondaryClasses = "bg-brand-gray border border-brand-border text-brand-text hover:bg-brand-light-gray";

    return (
        <button onClick={onClick} className={\`\${baseClasses} \${primary ? primaryClasses : secondaryClasses}\`}>
            {text}
        </button>
    )
};

// Simple hash simulation for the frontend.
// In a real app, this would be a one-way hash (like bcrypt) performed on a server.
const hashPassword = (password: string) => \`hashed_\${password}\`;

const LoginView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [step, setStep] = useState<'roleSelect' | 'email' | 'setPassword' | 'enterPassword' | 'securityScan'>('roleSelect');
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const resetState = () => {
        setStep('roleSelect');
        setSelectedRole(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
    };

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setStep('email');
        setError('');
    };

    const handleEmailSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email.trim()) {
            setError("Please enter a valid email.");
            return;
        }
        const userExists = state.users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) {
            setStep('enterPassword');
        } else {
            setStep('setPassword');
        }
    };

    const runSecurityScan = (callback: () => void) => {
        setStep('securityScan');
        setTimeout(callback, 1500);
    };
    
    const handleRegister = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (password.length < 8) {
             setError("Password must be at least 8 characters long.");
             return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!selectedRole) {
            setError("No role selected. Please start over.");
            return;
        }

        runSecurityScan(() => {
            const newUser: User = {
                id: \`\${selectedRole}-\${Date.now()}\`,
                email: email,
                role: selectedRole,
                subscriptionPlan: selectedRole === 'admin' ? 'pro' : 'free',
                passwordHash: hashPassword(password),
            };
            dispatch({ type: 'REGISTER_USER', payload: newUser });
            // The reducer automatically logs in the new user and logs the registration event.
        });
    };

    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        setError('');
        
        runSecurityScan(() => {
            const userInState = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (userInState && userInState.passwordHash === hashPassword(password)) {
                const userPayload: User = { ...userInState };
                // The LOGIN reducer will log the successful event
                dispatch({ type: 'LOGIN', payload: { user: userPayload, password } });
            } else {
                // Manually log the failed attempt
                dispatch({ type: 'LOG_SECURITY_EVENT', payload: { type: 'LOGIN_FAILURE', details: \`Failed login attempt for email: \${email}\` } });
                setError("Invalid email or password. Please try again.");
                setStep('enterPassword'); // Go back to the password screen
            }
        });
    };
    
    const renderStep = () => {
        switch (step) {
            case 'securityScan':
                return (
                    <div className="text-center animate-fade-in space-y-4 py-8">
                        <ShieldCheckIcon className="w-16 h-16 mx-auto text-brand-cyan animate-pulse"/>
                        <h2 className="text-xl font-bold text-white">Security Scan in Progress</h2>
                        <p className="text-sm text-brand-text-secondary">Security Sentinel 001 is verifying credentials...</p>
                    </div>
                );
            case 'email':
                return (
                    <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">Continue as {selectedRole && selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</h2>
                            <p className="text-sm text-brand-text-secondary">Enter your email to login or sign up.</p>
                        </div>
                        <div className="relative">
                            <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                autoFocus
                                className="w-full bg-brand-gray border border-brand-border rounded-lg p-3 pl-10 text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            />
                        </div>
                        <button type="submit" className="w-full p-3 rounded-lg font-semibold bg-brand-primary text-white hover:bg-brand-accent">Continue</button>
                    </form>
                );
            case 'setPassword':
                return (
                    <form onSubmit={handleRegister} className="space-y-4 animate-fade-in">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
                            <p className="text-sm text-brand-text-secondary">Set a secure password for <span className="font-semibold text-brand-text">{email}</span>.</p>
                        </div>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="New password (min 8 chars)" required autoFocus className="w-full bg-brand-gray border border-brand-border rounded-lg p-3 pl-10 text-sm text-brand-text"/>
                        </div>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" required className="w-full bg-brand-gray border border-brand-border rounded-lg p-3 pl-10 text-sm text-brand-text"/>
                        </div>
                        <button type="submit" className="w-full p-3 rounded-lg font-semibold bg-brand-primary text-white hover:bg-brand-accent">Create Account & Login</button>
                    </form>
                );
            case 'enterPassword':
                return (
                     <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
                         <div className="text-center">
                            <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
                            <p className="text-sm text-brand-text-secondary">Enter your password for <span className="font-semibold text-brand-text">{email}</span>.</p>
                        </div>
                        <div className="relative">
                            <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-secondary" />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required autoFocus className="w-full bg-brand-gray border border-brand-border rounded-lg p-3 pl-10 text-sm text-brand-text"/>
                        </div>
                        <button type="submit" className="w-full p-3 rounded-lg font-semibold bg-brand-primary text-white hover:bg-brand-accent">Login</button>
                    </form>
                );
            case 'roleSelect':
            default:
                return (
                    <div className="space-y-4 animate-fade-in">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome to AgentricAI University</h1>
                            <p className="text-brand-text-secondary">Please select your role to begin.</p>
                        </div>
                        <RoleButton onClick={() => handleRoleSelect('student')} text="I am a Student" />
                        <RoleButton onClick={() => handleRoleSelect('parent')} text="I am a Parent" />
                        <RoleButton onClick={() => handleRoleSelect('teacher')} text="I am a Teacher" />
                        <RoleButton onClick={() => handleRoleSelect('admin')} text="I am a Creator / Admin" primary />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
            <div className="w-full max-w-sm">
                {step !== 'roleSelect' && step !== 'securityScan' && (
                    <button onClick={resetState} className="flex items-center gap-2 text-sm text-brand-text-secondary hover:text-white mb-4">
                        <ArrowUturnLeftIcon className="w-4 h-4" />
                        Back to Role Selection
                    </button>
                )}
                <div className="p-8 space-y-6 bg-brand-light-gray rounded-xl shadow-2xl border border-brand-border">
                    {renderStep()}
                    {error && <p className="text-red-400 text-sm text-center pt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default LoginView;
--- END OF FILE components/LoginView.tsx ---
`;
