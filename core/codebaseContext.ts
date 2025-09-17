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

Limitation of Liability: IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

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
--- START OF FILE types/index.ts ---
import React from 'react';

// Centralized View type for navigation state.
export type View =
  | 'dashboard'
  | 'studio'
  | 'agent-editor'
  | 'university'
  | 'gateway'
  | 'student-roster'
  | 'parent-teacher-console'
  | 'showcase'
  | 'account'
  | 'student-dashboard'
  | 'system-optimization'
  | 'security-sentinel'
  | 'mission-command';

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';
export type SubscriptionPlan = 'free' | 'pro';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    subscriptionPlan: SubscriptionPlan;
    passwordHash?: string;
}

export interface CodeChange {
  filePath: string;
  modifiedContent: string;
}

export interface ProposedChanges {
  summary: string;
  changes: CodeChange[];
}


export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  mode?: 'confirmation';
  proposedChanges?: ProposedChanges;
}

export interface ManifestAgent {
  id:string;
  name: string;
  category: string;
  role: string;
}

export interface Point {
  x: number;
  y: number;
}

export type NodeType = 
  | 'textInput' 
  | 'storyGenerator' 
  | 'jsonExtractor' 
  | 'imageGenerator' 
  | 'dataDisplay' 
  | 'imageDisplay'
  | 'quizGenerator'
  | 'lessonPlanner'
  | 'textSummarizer'
  | 'webSearch'
  | 'agentDesigner';

export interface NodeData {
  id: string;
  type: NodeType;
  title: string;
  position: Point;
  inputs: { name: string; type: string; }[];
  outputs: { name: string; type: string; }[];
  content?: Record<string, any>;
  status?: 'idle' | 'running' | 'success' | 'error';
  outputData?: any;
  error?: string;
  color: string;
  icon?: React.ReactNode;
}

export interface Connection {
  fromNodeId: string;
  fromOutput: string;
  toNodeId: string;
  toInput: string;
}

export interface Workflow {
    id: string;
    name: string;
    nodes: NodeData[];
    connections: Connection[];
    ownerAgentId?: string;
}

export interface ToolSettingDefinition {
    key: string;
    label: string;
    type: 'string' | 'number' | 'boolean';
    defaultValue: string | number | boolean;
}

export interface ToolDefinition {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    settings?: ToolSettingDefinition[];
}

export interface ToolConfig {
    toolId: string;
    settings: Record<string, any>;
}

export interface MemoryBlock {
    id: string;
    title: string;
    description: string;
    content: string;
}

export interface Agent {
    id: string;
    name: string;
    model: string;
    identity: string;
    systemInstruction: string;
    personality: {
        tone: 'formal' | 'casual' | 'playful' | 'professional';
        creativity: 'low' | 'medium' | 'high' | 'maximum';
        verbosity: 'concise' | 'balanced' | 'detailed';
    };
    tools: ToolConfig[];
    coreMemory: MemoryBlock[];
    type?: 'General' | 'Companion';
    studentId?: string;
}

export interface ScheduleItem {
    id: string;
    title: string;
    workflowId: string;
    icon: React.ReactNode;
    color: string;
    status: 'pending' | 'in-progress' | 'completed';
    notes?: string;
    review?: string;
}

export interface ActivityLogEntry {
    timestamp: string;
    summary: string;
    scheduleItemId: string;
}

export interface Student {
    id: string;
    companionAgentId: string;
    schedule: ScheduleItem[];
    preferences: {
        preferredTopics: string[];
        learningStyle: 'visual' | 'auditory' | 'kinesthetic';
    };
    parentGoals: string[];
    teacherCurriculum: string[];
    activityLog: ActivityLogEntry[];
}

export interface UpdateStudentGoalsPayload {
    studentId: string;
    parentGoals: string[];
    teacherCurriculum: string[];
}

export interface UpdateStudentProfilePayload {
    studentId: string;
    preferences: Student['preferences'];
    learningGoals?: string[];
}


export interface LogActivityPayload {
    studentId: string;
    scheduleItemId: string;
    summary: string;
    review: string;
}

export interface ShowcasedProject {
    id: string;
    title: string;
    content: any;
    companionAgentId: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type MissionStepStatus = 'pending' | 'active' | 'completed' | 'error';

export interface MissionStep {
    step: number;
    agent: string;
    action: string;
    objective: string;
    status?: MissionStepStatus;
    result?: string;
}

export interface MissionPlan {
    overview: string;
    steps: MissionStep[];
}

export interface CommLogEntry {
    timestamp: string;
    source: string;
    target?: string;
    content: string;
}

export interface SystemError {
    error: Error;
    errorInfo: React.ErrorInfo;
}

export type SecurityEventType = 
  | 'LOGIN_SUCCESS' 
  | 'LOGIN_FAILURE' 
  | 'LOGOUT' 
  | 'USER_REGISTERED' 
  | 'SYSTEM_ERROR_DETECTED'
  | 'INTEGRITY_SCAN_STARTED'
  | 'INTEGRITY_SCAN_COMPLETED';

export interface SecurityLogEntry {
    timestamp: string;
    type: SecurityEventType;
    details: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  agents: Agent[];
  workflows: Workflow[];
  students: Student[];
  showcasedProjects: ShowcasedProject[];
  toasts: Toast[];
  systemError: SystemError | null;
  activeAgentId: string | null;
  activeWorkflowId: string | null;
  activeStudentId: string | null;
  missionTeam: ManifestAgent[];
  missionPlan: MissionPlan | null;
  securityLog: SecurityLogEntry[];
}
--- END OF FILE types/index.ts ---
--- START OF FILE context/AppContext.tsx ---
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Agent, Workflow, ManifestAgent, AppState, Student, ScheduleItem, UpdateStudentGoalsPayload, LogActivityPayload, ShowcasedProject, UpdateStudentProfilePayload, Toast, MissionPlan, User, UserRole, SubscriptionPlan, SystemError, MissionStep, SecurityLogEntry } from '../types/index';
import { BookOpenIcon, PaintBrushIcon } from '../components/icons';

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'LOGIN'; payload: { user: User, password?: string } }
  | { type: 'REGISTER_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPGRADE_PLAN' }
  | { type: 'UPDATE_AGENT'; payload: Agent }
  | { type: 'ADD_AGENT'; payload: Agent }
  | { type: 'SET_ACTIVE_AGENT_ID'; payload: string | null }
  | { type: 'UPDATE_WORKFLOW'; payload: Workflow }
  | { type: 'SET_ACTIVE_WORKFLOW_ID'; payload: string | null }
  | { type: 'ADD_AGENT_TO_TEAM'; payload: ManifestAgent }
  | { type: 'REMOVE_AGENT_FROM_TEAM'; payload: string }
  | { type: 'ENROLL_STUDENT' }
  | { type: 'SET_ACTIVE_STUDENT_ID'; payload: string | null }
  | { type: 'ADD_WORKFLOW'; payload: Workflow }
  | { type: 'UPDATE_STUDENT_SCHEDULE'; payload: { studentId: string; schedule: ScheduleItem[] } }
  | { type: 'UPDATE_STUDENT_GOALS_AND_CURRICULUM'; payload: UpdateStudentGoalsPayload }
  | { type: 'UPDATE_STUDENT_PROFILE'; payload: UpdateStudentProfilePayload }
  | { type: 'LOG_ACTIVITY_COMPLETION'; payload: LogActivityPayload }
  | { type: 'SHOWCASE_PROJECT'; payload: ShowcasedProject }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: Toast['type'] } }
  | { type: 'HIDE_TOAST'; payload: number }
  | { type: 'SET_MISSION_PLAN'; payload: MissionPlan | null }
  | { type: 'UPDATE_MISSION_STEP_STATE'; payload: { step: number; status: MissionStep['status']; result?: string } }
  | { type: 'SET_SYSTEM_ERROR', payload: SystemError | null }
  | { type: 'CLEAR_SYSTEM_ERROR' }
  | { type: 'LOG_SECURITY_EVENT'; payload: Omit<SecurityLogEntry, 'timestamp'> };

const initialState: AppState = {
  currentUser: null,
  users: [],
  agents: [
    {
      id: 'agent-d88b0aef-d4d0-4987-a2e4-62b1a136b761',
      name: 'D.A.R.T. (Deep Agentic Research & Tec.)',
      model: 'gemini-standard', // Default to standard model
      identity: 'DART',
      type: 'General',
      systemInstruction: "You are D.A.R.T, the latest version of Lennan Corporation's digital companion... Be precise, cite sources when possible, and structure complex information clearly.",
      personality: {
        tone: 'professional',
        creativity: 'medium',
        verbosity: 'balanced',
      },
      tools: [
        { toolId: 'archival_memory_search', settings: { searchDepth: 3 } },
        { toolId: 'fetch_webpage', settings: { userAgent: 'AgentricAI-Web-Bot/1.0', allowRedirects: true } }
      ],
      coreMemory: [],
    },
  ],
  workflows: [
    {
        id: 'wf-default-storybook',
        name: 'Default Storybook Workflow',
        nodes: [],
        connections: []
    }
  ],
  students: [],
  showcasedProjects: [],
  toasts: [],
  systemError: null,
  activeAgentId: null,
  activeWorkflowId: 'wf-default-storybook',
  activeStudentId: null,
  missionTeam: [],
  missionPlan: null,
  securityLog: [],
};

// Simple hash simulation for the frontend.
// In a real app, this would be a one-way hash (like bcrypt) performed on a server.
const hashPassword = (password: string) => \`hashed_\${password}\`;

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
        const loadedState = action.payload;
        // Ensure all keys are present to prevent runtime errors
        return {
            ...initialState,
            ...loadedState,
            users: loadedState.users || [],
            currentUser: loadedState.currentUser || null, // Persist user session
            students: loadedState.students || [],
            activeStudentId: loadedState.activeStudentId || null,
            showcasedProjects: loadedState.showcasedProjects || [],
            securityLog: loadedState.securityLog || [],
            toasts: [], // Do not persist toasts
            missionPlan: null, // Do not persist mission plans
            systemError: null, // Do not persist errors
        };
    case 'REGISTER_USER': {
        const userExists = state.users.some(u => u.email.toLowerCase() === action.payload.email.toLowerCase());
        if (userExists) return state; // Should not happen with UI flow

        const newUser = action.payload;

        let newState: AppState = {
            ...state,
            users: [...state.users, newUser],
            currentUser: newUser,
            securityLog: [
                { type: 'USER_REGISTERED', details: \`New user registered: \${newUser.email} (Role: \${newUser.role})\`, timestamp: new Date().toISOString() },
                ...state.securityLog
            ],
        };

        // If the new user is a student, create their companion agent and student profile.
        if (newUser.role === 'student') {
            const studentId = newUser.id;
            const companionAgentId = \`agent-companion-\${studentId.slice(-6)}\`;
            const newCompanionAgent: Agent = {
                id: companionAgentId,
                name: \`Companion Agent \${studentId.slice(-4)}\`,
                identity: 'Tutor',
                model: 'gemini-standard',
                type: 'Companion',
                studentId: studentId,
                systemInstruction: 'You are a kind, patient, and encouraging tutor for a young, neurodiverse learner...',
                personality: { tone: 'playful', creativity: 'high', verbosity: 'concise' },
                tools: [],
                coreMemory: [],
            };
            const newStudent: Student = {
                id: studentId,
                companionAgentId: companionAgentId,
                schedule: [],
                preferences: { preferredTopics: ['dinosaurs', 'space'], learningStyle: 'visual' },
                parentGoals: [],
                teacherCurriculum: [],
                activityLog: [],
            };
            newState = {
                ...newState,
                students: [...newState.students, newStudent],
                agents: [...newState.agents, newCompanionAgent],
                activeStudentId: studentId,
            }
        }
        return newState;
    }
    case 'LOGIN': {
        const { user } = action.payload; // Password validation now happens in the component.
        const userInDb = state.users.find(u => u.email.toLowerCase() === user.email.toLowerCase());

        if (!userInDb) return state; // Should not happen with UI flow.

        // Successful login
        let activeStudentId = state.activeStudentId;
        if (userInDb.role === 'student') {
            activeStudentId = userInDb.id;
        } else if (userInDb.role !== 'admin') {
            activeStudentId = null; 
        }

        return { 
            ...state, 
            currentUser: userInDb, 
            activeStudentId,
            securityLog: [
                { type: 'LOGIN_SUCCESS', details: \`User logged in: \${userInDb.email}\`, timestamp: new Date().toISOString() },
                ...state.securityLog
            ]
        };
    }
    case 'LOG_SECURITY_EVENT': {
        return {
            ...state,
            securityLog: [
                { ...action.payload, timestamp: new Date().toISOString() },
                ...state.securityLog,
            ],
        };
    }
    case 'LOGOUT':
        const userEmail = state.currentUser?.email || 'Unknown';
        return { 
            ...state, 
            currentUser: null, 
            activeStudentId: null,
            securityLog: [
                { type: 'LOGOUT', details: \`User logged out: \${userEmail}\`, timestamp: new Date().toISOString() },
                ...state.securityLog
            ]
        };
    case 'UPGRADE_PLAN':
        if (!state.currentUser) return state;
        return {
            ...state,
            currentUser: { ...state.currentUser, subscriptionPlan: 'pro' }
        };
    case 'ADD_AGENT':
        return { ...state, agents: [...state.agents, action.payload] };
    case 'UPDATE_AGENT':
      return {
        ...state,
        agents: state.agents.map((agent) =>
          agent.id === action.payload.id ? action.payload : agent
        ),
      };
    case 'SET_ACTIVE_AGENT_ID':
        return { ...state, activeAgentId: action.payload };
    case 'ADD_WORKFLOW':
        // Prevent duplicate workflows
        if (state.workflows.some(wf => wf.id === action.payload.id)) return state;
        return { ...state, workflows: [...state.workflows, action.payload] };
    case 'UPDATE_WORKFLOW':
        return {
            ...state,
            workflows: state.workflows.map(wf => wf.id === action.payload.id ? action.payload : wf)
        };
    case 'SET_ACTIVE_WORKFLOW_ID':
        return { ...state, activeWorkflowId: action.payload };
    case 'ADD_AGENT_TO_TEAM':
        if (state.missionTeam.some(agent => agent.id === action.payload.id)) return state;
        return { ...state, missionTeam: [...state.missionTeam, action.payload] };
    case 'REMOVE_AGENT_FROM_TEAM':
        return {
            ...state,
            missionTeam: state.missionTeam.filter(agent => agent.id !== action.payload)
        };
    case 'ENROLL_STUDENT': {
        // This action is now for an admin/parent enrolling a new student, not for initial signup.
        const studentId = \`student-\${Date.now()}\`;
        const companionAgentId = \`agent-companion-\${Date.now()}\`;

        const newCompanionAgent: Agent = {
            id: companionAgentId,
            name: \`Companion Agent \${studentId.slice(-4)}\`,
            identity: 'Tutor',
            model: 'gemini-standard',
            type: 'Companion',
            studentId: studentId,
            systemInstruction: 'You are a kind, patient, and encouraging tutor for a young, neurodiverse learner. Your goal is to create engaging, simple, and fun educational activities. You adapt your communication style to be clear, positive, and supportive.',
            personality: { tone: 'playful', creativity: 'high', verbosity: 'concise' },
            tools: [],
            coreMemory: [],
        };

        const newStudent: Student = {
            id: studentId,
            companionAgentId: companionAgentId,
            schedule: [],
            preferences: {
                preferredTopics: ['dinosaurs', 'space travel'],
                learningStyle: 'visual',
            },
            parentGoals: [],
            teacherCurriculum: [],
            activityLog: [],
        };
        
        return {
            ...state,
            students: [...state.students, newStudent],
            agents: [...state.agents, newCompanionAgent],
        };
    }
    case 'SET_ACTIVE_STUDENT_ID':
        return { ...state, activeStudentId: action.payload };
    case 'UPDATE_STUDENT_SCHEDULE':
        return {
            ...state,
            students: state.students.map(s => 
                s.id === action.payload.studentId ? { ...s, schedule: action.payload.schedule } : s
            )
        };
    case 'UPDATE_STUDENT_GOALS_AND_CURRICULUM':
        return {
            ...state,
            students: state.students.map(s => 
                s.id === action.payload.studentId 
                    ? { 
                        ...s, 
                        parentGoals: action.payload.parentGoals,
                        teacherCurriculum: action.payload.teacherCurriculum,
                      } 
                    : s
            )
        };
     case 'UPDATE_STUDENT_PROFILE':
        return {
            ...state,
            students: state.students.map(s => 
                s.id === action.payload.studentId 
                    ? { ...s, preferences: action.payload.preferences }
                    : s
            )
        };
    case 'LOG_ACTIVITY_COMPLETION':
        return {
            ...state,
            students: state.students.map(s => {
                if (s.id !== action.payload.studentId) return s;
                return {
                    ...s,
                    schedule: s.schedule.map(item => 
                        item.id === action.payload.scheduleItemId 
                            ? { ...item, status: 'completed', review: action.payload.review } 
                            : item
                    ),
                    activityLog: [
                        ...s.activityLog,
                        {
                            timestamp: new Date().toISOString(),
                            summary: action.payload.summary,
                            scheduleItemId: action.payload.scheduleItemId,
                        }
                    ]
                };
            })
        };
    case 'SHOWCASE_PROJECT':
      if (state.showcasedProjects.some(p => p.id === action.payload.id)) {
        return state; // Avoid duplicates
      }
      return {
        ...state,
        showcasedProjects: [...state.showcasedProjects, action.payload],
      };
    case 'SHOW_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, { ...action.payload, id: Date.now() }],
      };
    case 'HIDE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };
    case 'SET_MISSION_PLAN':
      if (action.payload) {
        // Initialize status for each step when a new plan is set
        const planWithStatus = {
          ...action.payload,
          steps: action.payload.steps.map(step => ({...step, status: 'pending' as const}))
        };
        return { ...state, missionPlan: planWithStatus };
      }
      return { ...state, missionPlan: null };
    case 'UPDATE_MISSION_STEP_STATE':
        if (!state.missionPlan) return state;
        return {
            ...state,
            missionPlan: {
                ...state.missionPlan,
                steps: state.missionPlan.steps.map(step => 
                    step.step === action.payload.step 
                        ? { ...step, status: action.payload.status, result: action.payload.result } 
                        : step
                )
            }
        };
    case 'SET_SYSTEM_ERROR':
        const errorMessage = action.payload.error.message;
        return { 
            ...state, 
            systemError: action.payload,
            securityLog: [
                { type: 'SYSTEM_ERROR_DETECTED', details: \`Bug Agent caught error: \${errorMessage}\`, timestamp: new Date().toISOString() },
                 ...state.securityLog,
            ]
        };
    case 'CLEAR_SYSTEM_ERROR':
        return { ...state, systemError: null };
    default:
      return state;
  }
};

// FIX: Export AppContext so it can be used by class components like ErrorBoundary.
export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const LOCAL_STORAGE_KEY = 'agentricai-app-state-v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        dispatch({ type: 'SET_STATE', payload: JSON.parse(savedState) });
      }
    } catch (error) {
        console.error("Failed to load state from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error("Failed to save state to localStorage", error);
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
--- END OF FILE context/AppContext.tsx ---
--- START OF FILE services/geminiService.ts ---
import { GoogleGenAI, Chat } from "@google/genai";
import { ProposedChanges, Agent } from '../types/index';

// ARCHITECTURE NOTE:
// This service now exclusively handles premium, API-key-dependent AI computations.
// It assumes any call it receives has already been authorized by the logicBroker.
// It is still responsible for handling the case where the API key is not configured on the server.

const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({apiKey: API_KEY}) : null;

const chatSessions = new Map<string, { chat: Chat, systemInstruction: string }>();

function getChatSession(sessionId: string, systemInstruction: string, model: string): Chat {
    if (!ai) throw new Error("API Key not configured on server.");
    
    const sessionData = chatSessions.get(sessionId);

    if (!sessionData || sessionData.systemInstruction !== systemInstruction) {
        const newChat = ai.chats.create({
          model,
          config: { systemInstruction },
        });
        chatSessions.set(sessionId, { chat: newChat, systemInstruction });
        return newChat;
    }
    
    return sessionData.chat;
}

/**
 * Starts or continues a streaming chat conversation with a specific persona. (Premium Only)
 */
export async function* startChatStream(
    message: string, 
    systemInstruction: string, 
    sessionId: string = 'global_chat',
    agent: Agent | null = null,
): AsyncGenerator<string, void, unknown> {
    if (!ai) {
      yield "API Key not configured. Pro features are enabled, but the server is missing its API Key configuration. Please contact the administrator.";
      return;
    }

    try {
        const modelToUse = agent?.model || 'gemini-2.5-flash';
        let fullMessage = message;

        if (agent && agent.coreMemory.length > 0) {
            const memoryContext = agent.coreMemory
                .map(mem => \`[\${mem.title}]: \${mem.content}\`)
                .join('\\n');
            fullMessage = \`--- PERSISTENT MEMORY ---\\n\${memoryContext}\\n\\n--- USER QUERY ---\\n\${message}\`;
        }
        
        const chatSession = getChatSession(sessionId, systemInstruction, modelToUse);
        const result = await chatSession.sendMessageStream({ message: fullMessage });
        
        for await (const chunk of result) {
            yield chunk.text;
        }
    } catch (error) {
        console.error("Gemini API error in startChatStream:", error);
        const errorMessage = error instanceof Error ? \`Error: \${error.message}\` : "An error occurred while communicating with the AI.";
        yield errorMessage;
    }
}

interface GenerateContentParams {
    prompt: string;
    systemInstruction?: string;
    useGoogleSearch?: boolean;
    model?: string;
}

export interface GenerateContentResult {
    text: string;
    groundingChunks?: any[];
}

/**
 * Sends a single prompt to the model and gets a non-streaming response. (Premium Only)
 */
export async function generateContent(
    params: GenerateContentParams
): Promise<GenerateContentResult> {
    if (!ai) {
        throw new Error("Pro features are enabled, but the API Key is not configured on the server. Please contact the administrator.");
    }

    try {
        const response = await ai.models.generateContent({
            model: params.model || 'gemini-2.5-flash',
            contents: params.prompt,
            config: {
                ...(params.systemInstruction && { systemInstruction: params.systemInstruction }),
                ...(params.useGoogleSearch && { tools: [{googleSearch: {}}] }),
                responseMimeType: params.prompt.includes("Respond with ONLY a JSON object") ? "application/json" : "text/plain",
            }
        });
        return {
            text: response.text,
            groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks,
        };
    } catch (error) {
        console.error("Gemini API error in generateContent:", error);
        throw error;
    }
}

/**
 * Generates a structured JSON object representing proposed code modifications. (Premium Only)
 */
export async function generateCodeModification(
    prompt: string, 
    codebaseContext: string,
): Promise<ProposedChanges> {
    if (!ai) {
        throw new Error("Pro features are enabled, but the API Key is not configured on the server. Please contact the administrator.");
    }

    const systemInstruction = \`
        You are an expert AI developer assistant integrated into a web-based IDE. Your task is to modify the application's source code based on user requests.
        You will be given the full source code of the relevant application files. You MUST analyze the request and the provided code.
        You MUST generate the complete, modified content for each file that needs to change.
        You MUST respond ONLY with a single, valid JSON object. Do not include any other text, markdown, or explanations.
        The JSON object must have this structure:
        {
          "summary": "A brief, one-sentence summary of the changes you are proposing.",
          "changes": [
            {
              "filePath": "full_path_of_the_file_to_modify",
              "modifiedContent": "The complete, new content of the file, including all original code that was not changed."
            }
          ]
        }
        If the request is unclear, dangerous, or you cannot fulfill it, respond with a JSON object where the "changes" array is empty and the "summary" explains why.
    \`;

    try {
        const fullPrompt = \`User Request: "\${prompt}"\\n\\nFull Codebase Context:\\n---\\n\${codebaseContext}\\n---\`;
        const { text } = await generateContent({ prompt: fullPrompt, systemInstruction });
        const parsedResult = JSON.parse(text);

        if (!parsedResult.summary || !Array.isArray(parsedResult.changes)) {
            throw new Error("AI response is not in the expected format.");
        }
        return parsedResult as ProposedChanges;

    } catch (error) {
        console.error("Gemini API error in generateCodeModification:", error);
        throw new Error(\`AI failed to generate a valid code modification. \${error instanceof Error ? error.message : ''}\`);
    }
}
--- END OF FILE services/geminiService.ts ---
--- START OF FILE services/localAgentProcessor.ts ---
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
    return \`Once upon a time, in a land of shimmering data streams, there lived \${topic}. It loved to explore the digital mountains and swim in the rivers of code. Every day was a new adventure, learning new things and helping its friends. The end.\`;
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
    return { text: \`This is a response from the local agent. The prompt was: "\${prompt.substring(0, 100)}...". For advanced generation, a Pro plan is required.\` };
}


/**
 * The main entry point for non-premium, streaming content generation.
 */
export function startLocalChatStream(message: string): AsyncGenerator<string, void, unknown> {
    return getLocalChatResponseStream(message);
}
--- END OF FILE services/localAgentProcessor.ts ---
--- START OF FILE services/logicBroker.ts ---
import * as geminiService from './geminiService';
import * as localAgentProcessor from './localAgentProcessor';
import { Agent, ProposedChanges } from '../types/index';

// ARCHITECTURE NOTE:
// This broker is the single point of entry for all AI-related logic in the application.
// It is responsible for routing requests to either the premium, API-key-dependent
// \`geminiService\` or the free-tier \`localAgentProcessor\` based on the user's
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
        return localAgentProcessor.generateLocalContent(params.prompt);
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
--- END OF FILE services/logicBroker.ts ---
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
--- START OF FILE components/StudentView.tsx ---
import React from 'react';
// FIX: Changed import path for View type
import { View } from '../types/index';
import { ShieldCheckIcon, BrainCircuitIcon, BoltIcon, UserGroupIcon, IdentificationIcon, LockClosedIcon } from './icons';
import { useAppContext } from '../context/AppContext';

interface StudentViewProps {
    setActiveView: (view: View) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-6">
        <div className="flex items-center text-brand-cyan mb-3">
            {icon}
            <h3 className="ml-3 text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-sm text-brand-text-secondary leading-relaxed">{children}</p>
    </div>
);

const InterfaceCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; buttonText: string; buttonColor: string; onClick?: () => void; }> = ({ icon, title, children, buttonText, buttonColor, onClick }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-6 flex flex-col">
        <div className="flex items-center mb-3">
            <span className="text-brand-cyan">{icon}</span>
            <h3 className="ml-3 text-xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-sm text-brand-text-secondary flex-grow mb-6">{children}</p>
        <button onClick={onClick} className={\`w-full py-2 rounded-md font-semibold text-white transition-transform duration-200 hover:scale-105 \${buttonColor}\`}>
            {buttonText}
        </button>
    </div>
);

const StudentView: React.FC<StudentViewProps> = ({ setActiveView }) => {
    const { dispatch } = useAppContext();

    const handleEnroll = () => {
        dispatch({ type: 'ENROLL_STUDENT' });
        // FIX: Changed to a valid view for the admin portal.
        setActiveView('student-roster');
    };

    return (
        <div className="p-4 md:p-8 bg-brand-dark min-h-full">
            <header className="flex justify-between items-center mb-10">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-brand-cyan to-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-sm mr-4">
                        AAU
                    </div>
                    <h1 className="text-2xl font-bold text-white">AgentricAI University</h1>
                </div>
                <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    <span className="text-sm text-green-400 font-semibold">Ecosystem Active</span>
                </div>
            </header>
            
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-secondary">
                    Revolutionary AI-Powered Education
                </h2>
                <p className="text-md md:text-lg text-brand-text-secondary max-w-3xl mx-auto">
                    Empowering neurodiverse learners through adaptive AI agents and personalized educational experiences
                </p>
                <p className="text-xs text-brand-text-secondary mt-2">A Brandon Anthony Myers Project • Privacy-by-Design • Echo Project Architecture</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <FeatureCard icon={<ShieldCheckIcon className="w-8 h-8"/>} title="Stealth Agent System">
                    Self-evolving AI agents that adapt to individual learning patterns and provide personalized support.
                </FeatureCard>
                <FeatureCard icon={<BrainCircuitIcon className="w-8 h-8"/>} title="Neurodiverse Optimization">
                    Specially designed for neurodiverse learners with sensory-friendly interfaces and adaptive content.
                </FeatureCard>
                <FeatureCard icon={<BoltIcon className="w-8 h-8"/>} title="Real-time Adaptation">
                    Dynamic content adjustment based on learning progress, engagement levels, and individual preferences.
                </FeatureCard>
            </div>

            <div className="bg-brand-gray border border-brand-border rounded-lg p-6 mb-16 flex items-center">
                <LockClosedIcon className="w-8 h-8 text-yellow-400 mr-4 flex-shrink-0"/>
                <div>
                    <h4 className="font-bold text-white">Echo Project Privacy Model</h4>
                    <p className="text-sm text-brand-text-secondary">
                        Student interactions are completely private - only the AI sees them. Parents and teachers receive AI-generated progress reports without accessing direct student interactions. This revolutionary approach protects the student's right to a private, unobserved learning space while providing meaningful insights to caregivers.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <InterfaceCard 
                    icon={<UserGroupIcon className="w-8 h-8" />} 
                    title="Student Interface" 
                    buttonText="Enroll & Begin Learning"
                    buttonColor="bg-green-600 hover:bg-green-700"
                    onClick={handleEnroll}
                >
                    <b>Echo Mode</b> - The private student learning space with symbol-based communication, large touch-friendly buttons, and offline functionality. Designed specifically for AAC devices and neurodiverse learners.
                </InterfaceCard>
                <InterfaceCard 
                    icon={<IdentificationIcon className="w-8 h-8" />} 
                    title="Parent/Teacher Interface" 
                    buttonText="Try Admin Interface"
                    buttonColor="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveView('dashboard')}
                >
                    <b>Studio Mode</b> - Set learning goals in natural language, review AI-generated progress reports, and manage curriculum without accessing private student interactions.
                </InterfaceCard>
                <InterfaceCard 
                    icon={<BrainCircuitIcon className="w-8 h-8" />} 
                    title="Agent Network" 
                    buttonText="View Agent Status"
                    buttonColor="bg-brand-primary hover:bg-brand-accent"
                    onClick={() => setActiveView('dashboard')}
                >
                    View the complete faculty of AI agents including The Guardian (ethical oversight), Echo Orchestrator (adaptive learning), and specialized educational agents.
                </InterfaceCard>
            </div>
        </div>
    );
};

export default StudentView;
--- END OF FILE components/StudentView.tsx ---
`;
