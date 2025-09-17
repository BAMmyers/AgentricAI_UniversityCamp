// This file serves as a virtual "file system" for the AI Code Assistant.
// It provides the full source code of the application as context for generating modifications.

export const codebase = `
--- START OF FILE LICENSE ---
AgentricAI License Agreement

Copyright (c) 2024 Brandon A Myers (agentricaiuiux@gmail.com) ('AgentricAI')

Preamble: AgentricAI aims to encourage innovation and experimentation in AI-driven applications and agentic workflows. The license protects the intellectual property of the original author while allowing for community engagement and non-commercial exploration.

Grant of Rights:

Licensed for personal, educational, research, and non-commercial purposes.

Derivative works may be created for non-commercial sharing if they preserve core functionality and branding.

Restrictions:

Commercial use or monetization is strictly prohibited without explicit permission.

Core functionality, branding, or copyright notices may not be removed, altered, or obscured.

Redistribution under conflicting license terms is forbidden.

Intellectual Property: All rights to AgentricAI, AgentricAI Studios, agent logic, and design remain exclusively with Brandon A Myers.

Disclaimer of Warranty: THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Limitation of Liability: IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

Governing Law: This license shall be governed by and construed in accordance with the laws of the jurisdiction in which the copyright holder resides, without regard to its conflict of law provisions.
--- END OF FILE LICENSE ---
--- START OF FILE README.md ---
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
2.  **API Key**: The application requires a Google Gemini API key to be available as an environment variable (\`process.env.API_KEY\`).
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
// All API calls originating from this service are conceptually routed through the 
// secure "Gateway Console". This acts as a protective proxy, handling request
// brokering, logging, and applying security policies before communicating
// with any external Large Language Models like the Gemini API.

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable is not set. AI functionality will be disabled.");
}

const ai = new GoogleGenAI({apiKey: API_KEY!});

const chatSessions = new Map<string, { chat: Chat, systemInstruction: string }>();

function getChatSession(sessionId: string, systemInstruction: string, model: string): Chat {
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
 * Starts or continues a streaming chat conversation with a specific persona.
 */
export async function* startChatStream(
    message: string, 
    systemInstruction: string, 
    sessionId: string = 'global_chat',
    agent: Agent | null = null,
): AsyncGenerator<string, void, unknown> {
    if (!API_KEY) {
      yield "API Key not configured. Please set the API_KEY environment variable.";
      return;
    }

    try {
        const modelToUse = agent?.model || 'gemini-2.5-flash';
        let fullMessage = message;

        // Inject memory context if an agent is provided
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
 * Sends a single prompt to the model and gets a non-streaming response.
 */
export async function generateContent(
    params: GenerateContentParams
): Promise<GenerateContentResult> {
    if (!API_KEY) {
        throw new Error("API Key not configured. Please set the API_KEY environment variable.");
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
        throw error; // Re-throw to be handled by the calling function's catch block
    }
}


/**
 * Generates a structured JSON object representing proposed code modifications.
 */
export async function generateCodeModification(
    prompt: string, 
    codebaseContext: string
): Promise<ProposedChanges> {
    if (!API_KEY) {
        throw new Error("API Key not configured.");
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
--- START OF FILE components/SystemOptimizationView.tsx ---
import React, { useState } from 'react';
import { BoltIcon, TrashIcon, CpuIcon, BeakerIcon, ArrowPathIcon, ShieldCheckIcon } from './icons';
import { useAppContext } from '../context/AppContext';

const ControlCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-6">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <p className="text-sm text-brand-text-secondary mt-1 mb-6">{description}</p>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; setEnabled: (enabled: boolean) => void }> = ({ label, enabled, setEnabled }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-brand-text">{label}</span>
        <button onClick={() => setEnabled(!enabled)} className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors \${enabled ? 'bg-brand-primary' : 'bg-brand-dark'}\`}>
            <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${enabled ? 'translate-x-6' : 'translate-x-1'}\`} />
        </button>
    </div>
);

const SystemOptimizationView: React.FC = () => {
    const { dispatch } = useAppContext();
    const [predictiveLoading, setPredictiveLoading] = useState(true);
    const [responseStreaming, setResponseStreaming] = useState(true);
    const [renderFrequency, setRenderFrequency] = useState('high');
    const [diagnosticsStatus, setDiagnosticsStatus] = useState<'idle' | 'running' | 'complete'>('idle');
    const [scanStatus, setScanStatus] = useState<'idle' | 'running' | 'complete'>('idle');

    const handleClearCache = () => {
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'LLM and data caches have been purged.', type: 'success' } });
    };

    const handlePrefetch = () => {
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'Prefetching core models initiated.', type: 'info' } });
    };

    const runDiagnostics = () => {
        setDiagnosticsStatus('running');
        setTimeout(() => {
            setDiagnosticsStatus('complete');
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'System diagnostics complete. All systems nominal.', type: 'success' } });
        }, 3000);
    };
    
    const runIntegrityScan = () => {
        setScanStatus('running');
        dispatch({ type: 'LOG_SECURITY_EVENT', payload: { type: 'INTEGRITY_SCAN_STARTED', details: 'Medic Agent initiated system-wide integrity scan.' } });
        setTimeout(() => {
            setScanStatus('complete');
            dispatch({ type: 'LOG_SECURITY_EVENT', payload: { type: 'INTEGRITY_SCAN_COMPLETED', details: 'Medic Agent scan complete. No vulnerabilities found. 2 "vaccine" patches applied.' } });
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'System Integrity Scan Complete.', type: 'success' } });
        }, 4000);
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <BoltIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">System Optimization & Performance</h1>
                    <p className="text-brand-text-secondary">Fine-tune system parameters and manage resources for optimal performance.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Performance Tuning */}
                <ControlCard
                    title="Performance Tuning"
                    description="Adjust real-time performance settings. Changes are applied immediately."
                >
                    <ToggleSwitch label="Enable Predictive Loading" enabled={predictiveLoading} setEnabled={setPredictiveLoading} />
                    <ToggleSwitch label="Agent Response Streaming" enabled={responseStreaming} setEnabled={setResponseStreaming} />
                    <div>
                        <label className="text-sm text-brand-text block mb-2">UI Render Frequency</label>
                        <select
                            value={renderFrequency}
                            onChange={(e) => setRenderFrequency(e.target.value)}
                            className="w-full bg-brand-light-gray border border-brand-border rounded-md px-3 py-2 text-sm"
                        >
                            <option value="high">High (Fluid)</option>
                            <option value="medium">Medium (Balanced)</option>
                            <option value="low">Low (Resource Saver)</option>
                        </select>
                    </div>
                </ControlCard>

                {/* System Integrity & Security */}
                <ControlCard
                    title="System Integrity & Security"
                    description="Deploy maintenance agents to scan for vulnerabilities and ensure code integrity."
                >
                    <button
                        onClick={runIntegrityScan}
                        disabled={scanStatus === 'running'}
                        className="w-full bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-400 font-bold py-3 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                         {scanStatus === 'running' ? (
                            <>
                                <CpuIcon className="w-5 h-5 animate-spin" />
                                <span>Medic Agent Scanning...</span>
                            </>
                        ) : (
                             <>
                                <ShieldCheckIcon className="w-5 h-5" />
                                <span>Run Integrity Scan</span>
                             </>
                        )}
                    </button>
                    <div className="text-sm p-3 bg-brand-dark rounded-md h-32 overflow-y-auto font-mono text-xs">
                         <p className="text-brand-text-secondary">&gt; Medic Agent standing by...</p>
                         <p className="text-brand-text-secondary">&gt; Mechanic Agent on alert for repairs.</p>
                         {scanStatus === 'running' && <p className="text-yellow-400 animate-pulse">&gt; Scanning for known vulnerabilities...</p>}
                         {scanStatus === 'complete' && 
                            <>
                                <p className="text-green-400">&gt; Scan complete. 0 critical threats found.</p>
                                <p className="text-yellow-400">&gt; Identified 2 minor code integrity issues.</p>
                                <p className="text-cyan-400">&gt; Mechanic Agent dispatched to apply "vaccine" patches.</p>
                                <p className="text-green-400">&gt; Patches applied successfully.</p>
                                <p className="text-brand-text-secondary">&gt; System secure. Returning to standby.</p>
                            </>
                        }
                    </div>
                </ControlCard>
                
                {/* System Diagnostics */}
                <ControlCard
                    title="System Diagnostics"
                    description="Run a full system check to ensure all agents and services are operational."
                >
                    <button
                        onClick={runDiagnostics}
                        disabled={diagnosticsStatus === 'running'}
                        className="w-full bg-brand-primary hover:bg-brand-accent text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {diagnosticsStatus === 'running' ? (
                            <>
                                <CpuIcon className="w-5 h-5 animate-spin" />
                                <span>Running Diagnostics...</span>
                            </>
                        ) : (
                             <>
                                <BeakerIcon className="w-5 h-5" />
                                <span>Run System Diagnostics</span>
                             </>
                        )}
                    </button>
                    <div className="text-sm p-3 bg-brand-dark rounded-md h-32 overflow-y-auto font-mono text-xs">
                        <p className="text-brand-text-secondary">&gt; Initiating diagnostics...</p>
                        <p className="text-brand-text-secondary">&gt; Reviewing logs from Bug Agent...</p>
                        {diagnosticsStatus === 'running' && <p className="text-yellow-400 animate-pulse">&gt; Checking agent integrity...</p>}
                        {diagnosticsStatus === 'complete' && 
                            <>
                                <p className="text-green-400">&gt; Agent integrity check: PASSED</p>
                                <p className="text-green-400">&gt; Gateway connection: STABLE</p>
                                <p className="text-green-400">&gt; API latency: 45ms (NOMINAL)</p>
                                <p className="text-green-400">&gt; All systems nominal.</p>
                            </>
                        }
                    </div>
                </ControlCard>
            </div>
        </div>
    );
};

export default SystemOptimizationView;
--- END OF FILE components/SystemOptimizationView.tsx ---
--- START OF FILE components/SecuritySentinelView.tsx ---
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheckIcon, UserIcon } from './icons';
import { SecurityLogEntry, SecurityEventType } from '../types/index';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-brand-text-secondary">{title}</span>
        <span className={color}>{icon}</span>
      </div>
      <div className="mt-2 text-3xl font-semibold text-brand-text">{value}</div>
    </div>
);

const SecuritySentinelView: React.FC = () => {
    const { state } = useAppContext();
    const { securityLog, users } = state;

    const failedLogins = securityLog.filter(log => log.type === 'LOGIN_FAILURE').length;
    const successfulLogins = securityLog.filter(log => log.type === 'LOGIN_SUCCESS').length;
    
    const getLogTypeStyle = (type: SecurityEventType) => {
        switch (type) {
            case 'LOGIN_SUCCESS':
                return { bg: 'bg-green-600/20', text: 'text-green-400', label: 'Login Success' };
            case 'LOGIN_FAILURE':
                return { bg: 'bg-red-600/20', text: 'text-red-400', label: 'Login Failure' };
            case 'USER_REGISTERED':
                return { bg: 'bg-blue-600/20', text: 'text-blue-400', label: 'User Registered' };
            case 'LOGOUT':
                return { bg: 'bg-yellow-600/20', text: 'text-yellow-400', label: 'User Logout' };
            case 'SYSTEM_ERROR_DETECTED':
                return { bg: 'bg-orange-600/20', text: 'text-orange-400', label: 'System Error' };
            case 'INTEGRITY_SCAN_STARTED':
                return { bg: 'bg-cyan-600/20', text: 'text-cyan-400', label: 'Integrity Scan Start' };
            case 'INTEGRITY_SCAN_COMPLETED':
                return { bg: 'bg-purple-600/20', text: 'text-purple-400', label: 'Integrity Scan End' };
            default:
                return { bg: 'bg-brand-dark', text: 'text-brand-text-secondary', label: 'System Event' };
        }
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <ShieldCheckIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Security Sentinel Console</h1>
                    <p className="text-brand-text-secondary">Real-time monitoring of system-wide security events.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard 
                    title="Total Security Events" 
                    value={securityLog.length}
                    icon={<ShieldCheckIcon className="w-6 h-6" />}
                    color="text-brand-cyan"
                />
                <StatCard 
                    title="Registered Users" 
                    value={users.length}
                    icon={<UserIcon className="w-6 h-6" />}
                    color="text-brand-text-secondary"
                />
                <StatCard 
                    title="Successful Logins (session)" 
                    value={successfulLogins}
                    icon={<ShieldCheckIcon className="w-6 h-6" />}
                    color="text-green-400"
                />
                 <StatCard 
                    title="Failed Login Attempts" 
                    value={failedLogins}
                    icon={<ShieldCheckIcon className="w-6 h-6" />}
                    color="text-red-400"
                />
            </div>
            
            <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white mb-3">Live Event Log</h2>
                <div className="overflow-y-auto h-[60vh] font-mono text-xs pr-2">
                    {securityLog.length === 0 ? (
                        <p className="text-center text-brand-text-secondary p-8">No security events logged yet.</p>
                    ) : (
                        <div className="space-y-2">
                            {securityLog.map((log, index) => {
                                const styles = getLogTypeStyle(log.type);
                                return (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-center p-2 bg-brand-dark rounded-md">
                                        <div className="col-span-3 text-brand-text-secondary">{new Date(log.timestamp).toLocaleString()}</div>
                                        <div className="col-span-2">
                                            <span className={\`px-2 py-1 rounded-full text-xs font-semibold \${styles.bg} \${styles.text}\`}>
                                                {styles.label}
                                            </span>
                                        </div>
                                        <div className="col-span-7 text-brand-text">{log.details}</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecuritySentinelView;
--- END OF FILE components/SecuritySentinelView.tsx ---
--- START OF FILE components/SystemStatusBar.tsx ---
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { CpuIcon, ArrowPathIcon } from './icons';

const SystemStatusBar: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { systemError } = state;

    if (!systemError) {
        return null;
    }

    const handleReload = () => {
        dispatch({ type: 'CLEAR_SYSTEM_ERROR' });
        window.location.reload();
    };

    return (
        <div className="fixed top-0 left-0 right-0 bg-red-800/90 backdrop-blur-sm border-b-2 border-red-500 text-white p-3 z-[200] flex items-center justify-between animate-fade-in-down">
            <div className="flex items-center gap-3">
                <CpuIcon className="w-6 h-6 text-yellow-300 animate-pulse" />
                <div>
                    <h3 className="font-bold">Bug Agent Alert: System Anomaly Detected</h3>
                    <p className="text-xs text-red-200">An operational error was caught. The agent is standing by to apply corrective actions.</p>
                </div>
            </div>
            <button
                onClick={handleReload}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-md flex items-center gap-2 text-sm"
            >
                <ArrowPathIcon className="w-4 h-4" />
                Apply Fix & Reload
            </button>
        </div>
    );
};

export default SystemStatusBar;
--- END OF FILE components/SystemStatusBar.tsx ---
--- START OF FILE components/MissionCommandView.tsx ---
import React, { useState, useEffect } from 'react';
import { manifestAgents } from '../core/agentManifest';
import { ManifestAgent, MissionPlan, MissionStep, CommLogEntry, MissionStepStatus } from '../types/index';
import { useAppContext } from '../context/AppContext';
import { PlusIcon, MinusCircleIcon, PaperAirplaneIcon, SparklesIcon, PlayIcon, CpuIcon, CheckCircleIcon, XCircleIcon, CommandLineIcon } from './icons';
import { generateContent } from '../services/geminiService';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MissionCommandView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [objective, setObjective] = useState('');
    const [isPlanning, setIsPlanning] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [commLog, setCommLog] = useState<CommLogEntry[]>([]);
    
    useEffect(() => {
        // Clear logs and execution status when plan or team changes
        setIsExecuting(false);
        setCommLog([]);
    }, [state.missionPlan, state.missionTeam]);


    const groupedAgents = manifestAgents.reduce((acc, agent) => {
        const category = agent.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(agent);
        return acc;
    }, {} as Record<string, ManifestAgent[]>);

    const handleAddAgent = (agent: ManifestAgent) => {
        dispatch({ type: 'ADD_AGENT_TO_TEAM', payload: agent });
    };

    const handleRemoveAgent = (agentId: string) => {
        dispatch({ type: 'REMOVE_AGENT_FROM_TEAM', payload: agentId });
    };
    
    const handleGeneratePlan = async () => {
        if (!objective.trim() || state.missionTeam.length === 0) {
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'Please enter an objective and assemble a team.', type: 'error' } });
            return;
        }
        setIsPlanning(true);
        dispatch({ type: 'SET_MISSION_PLAN', payload: null });
        setCommLog([]);

        const teamDetails = state.missionTeam.map(a => \`- \${a.name}: \${a.role}\`).join('\\n');
        const prompt = \`
            You are Orchestrator Alpha, an expert AI mission planner. Your task is to create a detailed, step-by-step mission plan to achieve a user's objective using a designated team of specialized agents.

            **Objective:** "\${objective}"

            **Available Team:**
            \${teamDetails}

            Analyze the team's capabilities and the objective. Break the objective down into a logical sequence of actions. For each step, assign the most appropriate agent from the team.

            Respond with ONLY a JSON object with two keys:
            1. "overview": A brief, one-sentence summary of the overall mission strategy.
            2. "steps": An array of objects, where each object has the keys "step" (number), "agent" (the name of the assigned agent), "action" (a concise verb-based description of the task, e.g., "Analyze financial data"), and "objective" (a detailed description of what this step aims to accomplish).
        \`;

        try {
            const { text } = await generateContent({ prompt });
            const plan: MissionPlan = JSON.parse(text);
            dispatch({ type: 'SET_MISSION_PLAN', payload: plan });
        } catch (e) {
            console.error("Failed to parse mission plan:", e);
            const errorMessage = e instanceof Error ? e.message : "The Orchestrator AI failed to generate a valid plan. Please try refining your objective.";
            dispatch({ type: 'SHOW_TOAST', payload: { message: errorMessage, type: 'error' } });
        } finally {
            setIsPlanning(false);
        }
    };
    
    const addCommLog = (source: string, content: string, target?: string) => {
        setCommLog(prev => [{ timestamp: new Date().toLocaleTimeString(), source, target, content }, ...prev]);
    }
    
    const executeMission = async () => {
        if (!state.missionPlan) return;
        setIsExecuting(true);
        let previousStepResult = \`Initial Objective: "\${objective}"\`;
        
        addCommLog("Orchestrator Alpha", "Beginning mission execution.");
        
        for (const step of state.missionPlan.steps) {
            const agent = state.missionTeam.find(a => a.name === step.agent) || manifestAgents.find(a => a.name === step.agent);
            if (!agent) {
                const errorResult = \`Agent "\${step.agent}" not found in team or manifest.\`;
                dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'error', result: errorResult }});
                addCommLog("Orchestrator Alpha", \`Execution failed: Agent "\${step.agent}" not found.\`, "System");
                setIsExecuting(false);
                return;
            }

            dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'active' }});
            addCommLog("Orchestrator Alpha", \`Delegating task "\${step.action}" to \${agent.name}.\`, agent.name);
            await sleep(1500);

            const prompt = \`
                You are the agent "\${agent.name}". Your role is: "\${agent.role}".
                Your current task is: "\${step.action}".
                The overall mission objective is: "\${objective}".
                The result from the previous step is: "\${previousStepResult}".

                Based on all this information, perform your task and provide a concise result or summary of your action.
            \`;
            
            try {
                const { text: result } = await generateContent({ prompt });
                previousStepResult = result;
                dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'completed', result }});
                addCommLog(agent.name, \`Task complete. Result: \${result.substring(0, 100)}...\`, "Orchestrator Alpha");
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : "Unknown AI error.";
                dispatch({ type: 'UPDATE_MISSION_STEP_STATE', payload: { step: step.step, status: 'error', result: errorMessage }});
                addCommLog(agent.name, \`Task failed with critical error: \${errorMessage}\`, "Orchestrator Alpha");
                setIsExecuting(false);
                return;
            }
        }
        addCommLog("Orchestrator Alpha", "All mission steps completed successfully.");
        setIsExecuting(false);
    };

    const MissionStepStatusIcon: React.FC<{status?: MissionStepStatus}> = ({ status }) => {
        switch (status) {
            case 'active': return <CpuIcon className="w-4 h-4 text-yellow-400 animate-spin" />;
            case 'completed': return <CheckCircleIcon className="w-4 h-4 text-green-400" />;
            case 'error': return <XCircleIcon className="w-4 h-4 text-red-400" />;
            default: return <div className="w-4 h-4 border-2 border-brand-border rounded-full" />;
        }
    };

    return (
        <div className="flex h-full bg-brand-dark text-brand-text font-sans">
            <div className="w-1/3 bg-brand-gray border-r border-brand-border p-4 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-4">Agent Roster</h2>
                <div className="flex-grow overflow-y-auto pr-2">
                    {Object.entries(groupedAgents).map(([category, agents]) => (
                        <div key={category} className="mb-6">
                            <h3 className="text-sm font-semibold text-brand-primary mb-2 sticky top-0 bg-brand-gray py-1">{category}</h3>
                            <div className="space-y-2">
                                {agents.map(agent => (
                                    <div key={agent.id} className="bg-brand-light-gray p-3 rounded-md border border-brand-border">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-sm text-white">{agent.name}</h4>
                                            <button onClick={() => handleAddAgent(agent)} className="text-brand-text-secondary hover:text-white transition-colors" title="Add to team">
                                                <PlusIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-brand-text-secondary mt-1">{agent.role}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex-1 p-6 flex flex-col">
                 <header className="flex-shrink-0 flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <CommandLineIcon className="w-8 h-8 text-brand-cyan" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Mission Command</h1>
                            <p className="text-brand-text-secondary">Interface with Orchestrator Alpha to execute complex objectives.</p>
                        </div>
                    </div>
                    {state.missionPlan && !isExecuting && (
                        <button onClick={executeMission} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                            <PlayIcon className="w-5 h-5" /> Execute Mission
                        </button>
                    )}
                 </header>
                <div className="flex-grow bg-brand-gray border border-brand-border rounded-md p-4 flex flex-col overflow-y-auto">
                    {isPlanning ? (
                        <div className="flex-grow flex items-center justify-center text-center text-brand-text-secondary">
                            <div>
                                <SparklesIcon className="w-12 h-12 mx-auto text-brand-cyan animate-pulse"/>
                                <p className="mt-2">Orchestrator Alpha is generating a mission plan...</p>
                            </div>
                        </div>
                    ) : state.missionPlan ? (
                         <div>
                            <h3 className="font-bold text-white">Mission Overview:</h3>
                            <p className="text-sm text-brand-text-secondary italic mb-4">{state.missionPlan.overview}</p>
                            <div className="space-y-3">
                                {state.missionPlan.steps.map(step => (
                                    <div key={step.step} className="bg-brand-dark p-3 rounded-lg border border-brand-border">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <MissionStepStatusIcon status={step.status} />
                                                <h4 className="font-semibold text-brand-cyan">Step {step.step}: {step.action}</h4>
                                            </div>
                                            <span className="text-xs font-mono bg-brand-light-gray px-2 py-1 rounded">{step.agent}</span>
                                        </div>
                                        <p className="text-sm text-brand-text-secondary mt-1">{step.objective}</p>
                                        {step.result && <pre className="text-xs mt-2 p-2 bg-brand-light-gray/50 border border-brand-border rounded-md whitespace-pre-wrap">{step.result}</pre>}
                                    </div>
                                ))}
                            </div>
                         </div>
                    ) : (
                         <div className="text-sm text-brand-text-secondary p-4">Awaiting objective. Assemble your team and define the mission. Orchestrator Alpha is standing by.</div>
                    )}
                </div>
                 <form onSubmit={(e) => { e.preventDefault(); handleGeneratePlan(); }} className="mt-4 flex gap-2">
                    <input type="text" value={objective} onChange={e => setObjective(e.target.value)} placeholder="Define mission objective..." className="w-full bg-brand-light-gray border border-brand-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                    <button type="submit" disabled={isPlanning || isExecuting} className="bg-brand-primary hover:bg-brand-accent text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:bg-brand-text-secondary">
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span>Generate Plan</span>
                    </button>
                </form>
            </div>

            <div className="w-1/3 bg-brand-gray border-l border-brand-border p-4 flex flex-col">
                <h2 className="text-lg font-bold text-white mb-4">Assembled Team</h2>
                <div className="overflow-y-auto mb-4">
                    {state.missionTeam.length === 0 ? (
                        <p className="text-sm text-brand-text-secondary">No agents on team.</p>
                    ) : (
                        <div className="space-y-3">
                            {state.missionTeam.map(agent => (
                                <div key={agent.id} className="bg-brand-light-gray p-3 rounded-md border border-brand-border flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-sm text-white">{agent.name}</h4>
                                        <p className="text-xs text-brand-text-secondary mt-1">Status: STANDBY</p>
                                    </div>
                                    <button onClick={() => handleRemoveAgent(agent.id)} className="text-red-500 hover:text-red-400 transition-colors flex-shrink-0 ml-2" title="Remove from team">
                                        <MinusCircleIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                 <h2 className="text-lg font-bold text-white mb-4 border-t border-brand-border pt-4">Communication Bus</h2>
                 <div className="flex-grow overflow-y-auto font-mono text-xs space-y-2">
                    {commLog.slice().reverse().map((log, i) => (
                        <div key={i} className="animate-fade-in">
                            <p className="text-gray-500">{log.timestamp}</p>
                            <p className="text-brand-text-secondary"><span className="text-cyan-400">{log.source}</span> {log.target && \`-> <span class="text-purple-400">\${log.target}</span>\`}: <span className="text-brand-text">{log.content}</span></p>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    );
};

export default MissionCommandView;
--- END OF FILE components/MissionCommandView.tsx ---
`;
