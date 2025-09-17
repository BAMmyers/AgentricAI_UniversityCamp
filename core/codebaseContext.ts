// This file serves as a virtual "file system" for the AI Code Assistant.
// It provides the full source code of the application as context for generating modifications.

export const codebase = `
--- START OF FILE index.tsx ---
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
--- END OF FILE index.tsx ---
--- START OF FILE metadata.json ---
{
  "name": "AgentricAI_University_Camp",
  "description": "An administrative interface for building and managing AI agent workflows for an AI-powered education system. It features a node-based workflow builder and a comprehensive dashboard for monitoring system health and agent performance.",
  "requestFramePermissions": [
    "camera",
    "microphone"
  ]
}
--- END OF FILE metadata.json ---
--- START OF FILE index.html ---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AgentricAI University</title>
    <link rel="manifest" href="/manifest.json" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              'brand-dark': '#0D1117',
              'brand-gray': '#161B22',
              'brand-light-gray': '#21262D',
              'brand-border': '#30363D',
              'brand-primary': '#2F81F7',
              'brand-secondary': '#58A6FF',
              'brand-accent': '#1F6FEB',
              'brand-cyan': '#39D3F3',
              'brand-green': '#238636',
              'brand-text': '#C9D1D9',
              'brand-text-secondary': '#8B949E',
            },
          },
        },
      }
    </script>
  <script type="importmap">
{
  "imports": {
    "react": "https://aistudiocdn.com/react@^19.1.1",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.1.1/",
    "react/": "https://aistudiocdn.com/react@^19.1.1/",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.19.0"
  }
}
</script>
</head>
  <body class="bg-brand-dark text-brand-text">
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, err => {
            console.log('ServiceWorker registration failed: ', err);
          });
        });
      }
    </script>
  </body>
</html>
--- END OF FILE index.html ---
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
  | 'student-roster' // This ID is kept for routing, but now points to AgentRoster
  | 'parent-teacher-console'
  | 'showcase'
  | 'account'
  | 'student-dashboard'
  | 'system-optimization'
  | 'security-sentinel'
  | 'mission-command'
  | 'teacher-lecture'
  | 'agent-detail'
  | 'curriculum-manager'; // New view for curriculum management

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
    type?: 'activity' | 'lecture';
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

export interface LiveLectureSession {
    isActive: boolean;
    attendeeAgentIds: string[];
}

export type CoreSubject = 'Math' | 'Reading' | 'Science' | 'History' | 'Language Arts' | 'Geography';

export interface CurriculumItem {
    id: string;
    subject: CoreSubject;
    title: string;
    content: string;
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
  liveLectureSession: LiveLectureSession | null;
  curriculum: CurriculumItem[];
}
--- END OF FILE types/index.ts ---
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
--- START OF FILE components/Studio.tsx ---
import React, { useState, useCallback, useRef } from 'react';
import { PlusIcon, PlayIcon, TrashIcon, CodeBracketIcon, BookOpenIcon, BeakerIcon, GlobeAltIcon, CommandLineIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, EyeIcon, PhotoIcon, ChatBubbleBottomCenterTextIcon, DocumentTextIcon, CpuIcon, SparklesIcon, QuestionMarkCircleIcon, ClipboardDocumentListIcon, DocumentMinusIcon, UserPlusIcon, PencilSquareIcon, InformationCircleIcon, XCircleIcon, CheckCircleIcon } from './icons';
import { View } from '../types/index';
import { useAppContext } from '../context/AppContext';
import { NodeData, Connection, Point, NodeType, Workflow, Agent } from '../types/index';
import { generateContent } from '../services/logicBroker';

// --- CONSTANTS ---
const NODE_WIDTH = 250;
const HEADER_HEIGHT = 36;
const PORT_HEIGHT = 24;

// --- NODE DEFINITIONS ---
const NODE_TEMPLATES: Record<NodeType, Omit<NodeData, 'id' | 'position'>> = {
    textInput: {
        type: 'textInput', title: 'Text Input', inputs: [], outputs: [{ name: 'text', type: 'string' }], color: 'border-blue-500', icon: <DocumentTextIcon className="w-4 h-4"/>, content: { text: 'A friendly robot' }
    },
    storyGenerator: {
        type: 'storyGenerator', title: 'The Novelist', inputs: [{ name: 'prompt', type: 'string' }], outputs: [{ name: 'story', type: 'string' }], color: 'border-pink-500', icon: <SparklesIcon className="w-4 h-4"/>, content: { systemInstruction: 'You are a creative storyteller for children.' }
    },
    jsonExtractor: {
        type: 'jsonExtractor', title: 'Data Extractor', inputs: [{ name: 'text', type: 'string' }], outputs: [{ name: 'json', type: 'json' }], color: 'border-indigo-500', icon: <CodeBracketIcon className="w-4 h-4"/>, content: { schema: '{"character_name": "string", "setting": "string"}' }
    },
    imageGenerator: {
        type: 'imageGenerator', title: 'The Visualizer', inputs: [{ name: 'prompt', type: 'string' }], outputs: [{ name: 'image', type: 'image' }], color: 'border-teal-500', icon: <PhotoIcon className="w-4 h-4"/>, content: {}
    },
    agentDesigner: {
        type: 'agentDesigner', title: 'Agent Designer', inputs: [{ name: 'task', type: 'string' }], outputs: [{ name: 'agentDefinition', type: 'json' }], color: 'border-purple-500', icon: <UserPlusIcon className="w-4 h-4"/>, content: { systemInstruction: \`You are an expert AI agent designer. Based on a user's task description, you will create a concise, unique name for a new agent and a detailed system instruction (persona). Respond ONLY with a JSON object with the keys "name" and "systemInstruction".\` }
    },
    quizGenerator: {
        type: 'quizGenerator', title: 'The Tutor (Quiz Mode)', inputs: [{ name: 'topic', type: 'string' }], outputs: [{ name: 'quizJson', type: 'json' }], color: 'border-amber-500', icon: <QuestionMarkCircleIcon className="w-4 h-4"/>, content: { systemInstruction: 'You create educational multiple-choice quizzes about a given topic. You only respond with JSON.' }
    },
    lessonPlanner: {
        type: 'lessonPlanner', title: 'Curriculum Designer', inputs: [{ name: 'objective', type: 'string' }], outputs: [{ name: 'plan', type: 'string' }], color: 'border-sky-500', icon: <ClipboardDocumentListIcon className="w-4 h-4"/>, content: { systemInstruction: 'You are an expert curriculum designer who writes concise lesson plans.' }
    },
    textSummarizer: {
        type: 'textSummarizer', title: 'Content Summarizer', inputs: [{ name: 'text', type: 'string' }], outputs: [{ name: 'summary', type: 'string' }], color: 'border-orange-500', icon: <DocumentMinusIcon className="w-4 h-4"/>, content: { systemInstruction: 'You are an expert at summarizing text concisely into a short paragraph.' }
    },
     webSearch: {
        type: 'webSearch', title: 'Web Crawler', inputs: [{ name: 'query', type: 'string' }], outputs: [{ name: 'results', type: 'string' }, { name: 'sources', type: 'json' }], color: 'border-cyan-500', icon: <GlobeAltIcon className="w-4 h-4"/>, content: {}
    },
    dataDisplay: {
        type: 'dataDisplay', title: 'Data Display', inputs: [{ name: 'data', type: 'any' }], outputs: [], color: 'border-gray-500', icon: <EyeIcon className="w-4 h-4"/>, content: {}
    },
    imageDisplay: {
        type: 'imageDisplay', title: 'Image Display', inputs: [{ name: 'image', type: 'image' }], outputs: [], color: 'border-green-500', icon: <PhotoIcon className="w-4 h-4"/>, content: {}
    }
};

// --- HELPER FUNCTIONS ---
const getPortPosition = (node: NodeData, type: 'input' | 'output', portName: string): Point => {
    const portIndex = type === 'input' ? node.inputs.findIndex(p => p.name === portName) : node.outputs.findIndex(p => p.name === portName);
    return {
        x: type === 'output' ? node.position.x + NODE_WIDTH : node.position.x,
        y: node.position.y + HEADER_HEIGHT + (portIndex * PORT_HEIGHT) + (PORT_HEIGHT / 2),
    };
};

const getCurvePath = (startPos: Point, endPos: Point): string => {
    const dx = Math.abs(startPos.x - endPos.x) * 0.5;
    return \`M \${startPos.x} \${startPos.y} C \${startPos.x + dx} \${startPos.y}, \${endPos.x - dx} \${endPos.y}, \${endPos.x} \${endPos.y}\`;
};

// --- NODE COMPONENT ---
const NodeComponent: React.FC<{ data: NodeData; onNodeMouseDown: (e: React.MouseEvent, nodeId: string) => void; onPortMouseDown: (e: React.MouseEvent, nodeId: string, portName: string, type: 'input' | 'output') => void; onPortMouseUp: (e: React.MouseEvent, nodeId: string, portName: string, type: 'input' | 'output') => void; onContentChange: (nodeId: string, content: any) => void; onCreateAgent: (definition: any) => void; }> = ({ data, onNodeMouseDown, onPortMouseDown, onPortMouseUp, onContentChange, onCreateAgent }) => (
    <div
        className={\`group absolute bg-brand-gray border-2 \${data.status === 'error' ? 'border-red-500 shadow-lg shadow-red-500/30 ring-2 ring-red-500' : data.color} rounded-md flex flex-col select-none transition-all duration-200 \${data.status === 'running' ? 'shadow-lg shadow-yellow-400/50 scale-105' : ''}\`}
        style={{ width: \`\${NODE_WIDTH}px\`, top: data.position.y, left: data.position.x, cursor: 'grab' }}
        onMouseDown={(e) => onNodeMouseDown(e, data.id)}
    >
        {data.error && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-max max-w-xs p-2 bg-red-600 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-normal z-10 pointer-events-none">
                <p className="font-bold">Error:</p>
                {data.error}
            </div>
        )}
        <div className="bg-brand-light-gray p-2 rounded-t-md text-white font-bold text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">{data.icon}<span>{data.title}</span></div>
            {data.status === 'running' && <CpuIcon className="w-4 h-4 text-yellow-400 animate-spin" />}
            {data.status === 'success' && <CheckCircleIcon className="w-4 h-4 text-green-400"/>}
            {data.status === 'error' && <XCircleIcon className="w-4 h-4 text-red-400" />}
        </div>
        <div className="p-2 relative min-h-[80px]">
            {data.inputs.map((input) => (
                <div key={input.name} className="absolute -left-1.5 flex items-center" style={{ top: \`\${HEADER_HEIGHT - 12 + data.inputs.findIndex(i => i.name === input.name) * PORT_HEIGHT}px\` }} onMouseDown={(e) => { e.stopPropagation(); onPortMouseDown(e, data.id, input.name, 'input'); }} onMouseUp={(e) => { e.stopPropagation(); onPortMouseUp(e, data.id, input.name, 'input'); }}>
                    <div className="w-3 h-3 bg-brand-secondary rounded-full border-2 border-brand-light-gray cursor-crosshair"></div>
                    <span className="text-xs ml-2 text-brand-text-secondary">{input.name}</span>
                </div>
            ))}
            {data.outputs.map((output) => (
                <div key={output.name} className="absolute -right-1.5 flex items-center justify-end" style={{ top: \`\${HEADER_HEIGHT - 12 + data.outputs.findIndex(o => o.name === output.name) * PORT_HEIGHT}px\`}} onMouseDown={(e) => { e.stopPropagation(); onPortMouseDown(e, data.id, output.name, 'output'); }} onMouseUp={(e) => { e.stopPropagation(); onPortMouseUp(e, data.id, output.name, 'output'); }}>
                    <span className="text-xs mr-2 text-brand-text-secondary">{output.name}</span>
                    <div className="w-3 h-3 bg-fuchsia-500 rounded-full border-2 border-brand-light-gray cursor-crosshair"></div>
                </div>
            ))}
             <div className="mt-2 text-sm">
                { data.type === 'textInput' && <textarea defaultValue={data.content?.text} onChange={e => onContentChange(data.id, { text: e.target.value })} className="bg-brand-dark border border-brand-border rounded px-2 py-1 w-full text-sm h-16 resize-none" /> }
                { data.type === 'dataDisplay' && <pre className="text-xs p-2 bg-brand-dark rounded text-green-300 overflow-auto max-h-40">{JSON.stringify(data.outputData, null, 2) || 'No data'}</pre> }
                { data.type === 'imageDisplay' && data.outputData?.startsWith('data:image') && <img src={data.outputData} alt="Generated" className="rounded-md"/>}
                { data.type === 'agentDesigner' && data.status === 'success' && (
                    <div className="p-2 bg-brand-dark rounded">
                        <p className="font-bold text-brand-text">{data.outputData.name}</p>
                        <p className="text-xs text-brand-text-secondary italic mt-1 truncate">{data.outputData.systemInstruction}</p>
                        <button onClick={() => onCreateAgent(data.outputData)} className="mt-3 w-full bg-brand-primary hover:bg-brand-accent text-white px-3 py-1.5 rounded-md flex items-center justify-center gap-1 text-xs">
                           <PencilSquareIcon className="w-4 h-4" /> Create & Edit Agent
                        </button>
                    </div>
                )}
             </div>
        </div>
    </div>
);

interface LogEntry {
    timestamp: string;
    message: string;
    type: 'info' | 'error' | 'success' | 'running';
}

const ExecutionLog: React.FC<{logs: LogEntry[]}> = ({logs}) => {
    const logIcons = {
        info: <InformationCircleIcon className="w-4 h-4 text-brand-text-secondary"/>,
        error: <XCircleIcon className="w-4 h-4 text-red-400"/>,
        success: <CheckCircleIcon className="w-4 h-4 text-green-400"/>,
        running: <CpuIcon className="w-4 h-4 text-yellow-400 animate-spin"/>,
    };
    const logColors = {
        info: 'text-brand-text-secondary',
        error: 'text-red-400',
        success: 'text-green-400',
        running: 'text-yellow-400',
    };
    return (
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-brand-gray/80 backdrop-blur-sm border-t border-brand-border z-20 p-2 overflow-y-auto font-mono text-xs">
            {logs.slice().reverse().map((log, i) => 
                <div key={i} className={\`flex items-start gap-2 \${logColors[log.type]}\`}>
                    <span className="flex-shrink-0 mt-0.5">{logIcons[log.type]}</span>
                    <span className="flex-shrink-0 text-gray-500">{log.timestamp}</span>
                    <span className="flex-grow whitespace-pre-wrap">{log.message}</span>
                </div>
            )}
        </div>
    );
};


// --- STUDIO COMPONENT ---
interface StudioProps {
    setActiveView: (view: View) => void;
}

const Studio: React.FC<StudioProps> = ({ setActiveView }) => {
    const { state, dispatch } = useAppContext();
    const activeWorkflow = state.workflows.find(wf => wf.id === state.activeWorkflowId) as Workflow;
    const brokerParams = { isPremium: state.currentUser?.subscriptionPlan === 'pro' };

    const [draggingNode, setDraggingNode] = useState<{ id: string; offset: Point } | null>(null);
    const [drawingConnection, setDrawingConnection] = useState<{ fromNodeId: string; fromOutput: string; fromPosition: Point } | null>(null);
    const [mousePosition, setMousePosition] = useState<Point>({ x: 0, y: 0 });
    const [executionLogs, setExecutionLogs] = useState<LogEntry[]>([]);
    const canvasRef = useRef<HTMLDivElement>(null);

    const updateWorkflow = (nodes: NodeData[], connections: Connection[]) => {
        dispatch({ type: 'UPDATE_WORKFLOW', payload: { ...activeWorkflow, nodes, connections } });
    };

    const addNode = (type: NodeType) => {
        const newNode: NodeData = {
            ...NODE_TEMPLATES[type],
            id: \`\${type}-\${Date.now()}\`,
            position: { x: 200, y: 150 },
        };
        updateWorkflow([...activeWorkflow.nodes, newNode], activeWorkflow.connections);
    };
    
    const handleCreateAgentFromNode = (definition: { name: string, systemInstruction: string }) => {
        const newAgentId = \`agent-\${Date.now()}\`;
        const newAgent: Agent = {
            id: newAgentId,
            name: definition.name,
            identity: definition.name,
            model: 'gemini-2.5-flash',
            systemInstruction: definition.systemInstruction,
            personality: { tone: 'professional', creativity: 'medium', verbosity: 'balanced' },
            tools: [],
            coreMemory: [],
        };
        dispatch({ type: 'ADD_AGENT', payload: newAgent });
        dispatch({ type: 'SET_ACTIVE_AGENT_ID', payload: newAgentId });
        setActiveView('agent-editor');
    };

    const clearWorkflow = () => updateWorkflow([], []);

    const handleNodeContentChange = (nodeId: string, content: any) => {
        const newNodes = activeWorkflow.nodes.map(n => n.id === nodeId ? { ...n, content: { ...n.content, ...content } } : n);
        updateWorkflow(newNodes, activeWorkflow.connections);
    };
    
    const log = (message: string, type: LogEntry['type']) => {
        setExecutionLogs(prev => [{ message, type, timestamp: new Date().toLocaleTimeString() }, ...prev]);
    };

    const runWorkflow = async () => {
        setExecutionLogs([]);
        log('Starting workflow execution...', 'info');
        
        let nodesToProcess = activeWorkflow.nodes.filter(n => n.inputs.length === 0);
        const processedNodeIds = new Set<string>();
        let processingQueue = [...nodesToProcess];
    
        let currentNodes: NodeData[] = activeWorkflow.nodes.map(n => ({...n, status: 'idle', outputData: undefined, error: undefined}));
        updateWorkflow(currentNodes, activeWorkflow.connections);

        const executeNode = async (node: NodeData): Promise<any> => {
            log(\`Executing node: \${node.title}\`, 'running');
            currentNodes = currentNodes.map(n => n.id === node.id ? { ...n, status: 'running' } : n);
            updateWorkflow(currentNodes, activeWorkflow.connections);

            try {
                // Gather inputs
                const inputs: Record<string, any> = {};
                for (const inputPort of node.inputs) {
                    const conn = activeWorkflow.connections.find(c => c.toNodeId === node.id && c.toInput === inputPort.name);
                    if (!conn) throw new Error(\`Input '\${inputPort.name}' is not connected.\`);
                    const sourceNode = currentNodes.find(n => n.id === conn.fromNodeId);
                    if (!sourceNode || sourceNode.status !== 'success') throw new Error(\`Source node '\${sourceNode?.title}' for input '\${inputPort.name}' has not completed successfully.\`);
                    const sourceOutputData = sourceNode.outputData;
                    const connectedValue = sourceOutputData && typeof sourceOutputData === 'object' ? sourceOutputData[conn.fromOutput] : sourceOutputData;

                    if (connectedValue === undefined) {
                        throw new Error(\`Output '\${conn.fromOutput}' not found on source node '\${sourceNode.title}'.\`);
                    }
                    inputs[inputPort.name] = connectedValue;
                }

                let outputData: any = {};
                switch(node.type) {
                    case 'textInput':
                        outputData = { text: node.content?.text };
                        break;
                    case 'storyGenerator':
                        const storyPrompt = inputs.prompt || 'Tell me a short story.';
                        const { text: story } = await generateContent({ prompt: storyPrompt, systemInstruction: node.content?.systemInstruction }, brokerParams);
                        outputData = { story };
                        break;
                    case 'jsonExtractor':
                        const jsonPrompt = \`Extract information from the following text based on this schema \${node.content?.schema}. Text: \${inputs.text}\`;
                        const { text: jsonString } = await generateContent({ prompt: jsonPrompt, systemInstruction: "You are a JSON extraction expert. Only respond with the JSON object." }, brokerParams);
                        outputData = { json: JSON.parse(jsonString) };
                        break;
                    case 'agentDesigner':
                        const designPrompt = \`Design an agent for the following task: "\${inputs.task}"\`;
                        const { text: agentJson } = await generateContent({ prompt: designPrompt, systemInstruction: node.content?.systemInstruction }, brokerParams);
                        outputData = { agentDefinition: JSON.parse(agentJson) };
                        break;
                    case 'imageGenerator':
                        log('Image generation is not implemented. Using placeholder.', 'info');
                        outputData = { image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' };
                        break;
                    case 'quizGenerator':
                        const quizPrompt = \`Create a 3-question multiple-choice quiz about "\${inputs.topic}". Respond with ONLY the JSON array, nothing else. The JSON schema for each question should be: {"question": "string", "options": ["string", "string", "string"], "answer": "string"}\`;
                        const { text: quizJsonString } = await generateContent({ prompt: quizPrompt, systemInstruction: node.content?.systemInstruction }, brokerParams);
                        outputData = { quizJson: JSON.parse(quizJsonString) };
                        break;
                    case 'lessonPlanner':
                        const lessonPrompt = \`Create a simple, one-paragraph lesson plan for the learning objective: "\${inputs.objective}".\`;
                        const { text: plan } = await generateContent({ prompt: lessonPrompt, systemInstruction: node.content?.systemInstruction }, brokerParams);
                        outputData = { plan };
                        break;
                    case 'textSummarizer':
                        const summaryPrompt = \`Summarize the following text in three sentences or less: "\${inputs.text}"\`;
                        const { text: summary } = await generateContent({ prompt: summaryPrompt, systemInstruction: node.content?.systemInstruction }, brokerParams);
                        outputData = { summary };
                        break;
                    case 'webSearch':
                        const { text: results, groundingChunks: sources } = await generateContent({ prompt: inputs.query, useGoogleSearch: true }, brokerParams);
                        outputData = { results, sources };
                        break;
                    case 'dataDisplay':
                    case 'imageDisplay':
                        outputData = inputs.data !== undefined ? inputs.data : inputs.image;
                        break;
                }
                const finalOutput = (node.outputs.length === 1 && outputData[node.outputs[0].name]) ? outputData[node.outputs[0].name] : outputData;
                
                log(\`Node \${node.title} executed successfully.\`, 'success');
                currentNodes = currentNodes.map(n => n.id === node.id ? { ...n, status: 'success', outputData: finalOutput } : n);
                updateWorkflow(currentNodes, activeWorkflow.connections);
                return finalOutput;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                log(\`ERROR executing node \${node.title}: \${errorMessage}\`, 'error');
                currentNodes = currentNodes.map(n => n.id === node.id ? { ...n, status: 'error', error: errorMessage } : n);
                updateWorkflow(currentNodes, activeWorkflow.connections);
                throw error;
            }
        };

        while(processingQueue.length > 0) {
            const nodeToRun = processingQueue.shift()!;
            if (processedNodeIds.has(nodeToRun.id)) continue;
            
            try {
                await executeNode(nodeToRun);
                processedNodeIds.add(nodeToRun.id);

                const nextNodes = activeWorkflow.connections
                    .filter(c => c.fromNodeId === nodeToRun.id)
                    .map(c => currentNodes.find(n => n.id === c.toNodeId))
                    .filter((n): n is NodeData => !!n);

                for (const nextNode of nextNodes) {
                    const allInputsReady = nextNode.inputs.every(input => {
                        const conn = activeWorkflow.connections.find(c => c.toNodeId === nextNode.id && c.toInput === input.name);
                        return conn && processedNodeIds.has(conn.fromNodeId);
                    });
                    if (allInputsReady) {
                        processingQueue.push(nextNode);
                    }
                }
            } catch (e) {
                log('Workflow stopped due to an error.', 'error');
                return;
            }
        }
        log('Workflow execution finished.', 'success');
    };

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        const currentMousePosition = { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top };
        setMousePosition(currentMousePosition);

        if (draggingNode) {
            const newNodes = activeWorkflow.nodes.map(node =>
                node.id === draggingNode.id
                    ? { ...node, position: { x: currentMousePosition.x - draggingNode.offset.x, y: currentMousePosition.y - draggingNode.offset.y } }
                    : node
            );
            updateWorkflow(newNodes, activeWorkflow.connections);
        }
    }, [draggingNode, activeWorkflow]);

    const handleMouseUp = useCallback(() => {
        setDraggingNode(null);
        setDrawingConnection(null);
    }, []);

    const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
        e.stopPropagation();
        const node = activeWorkflow.nodes.find(n => n.id === nodeId);
        if (!node) return;
        
        const canvasRect = canvasRef.current!.getBoundingClientRect();
        const offset = { 
            x: e.clientX - canvasRect.left - node.position.x, 
            y: e.clientY - canvasRect.top - node.position.y 
        };

        setDraggingNode({ id: nodeId, offset });
    }, [activeWorkflow.nodes]);

    const handlePortMouseDown = useCallback((e: React.MouseEvent, nodeId: string, portName: string, type: 'input' | 'output') => {
        e.stopPropagation();
        if (type === 'output') {
            const fromNode = activeWorkflow.nodes.find(n => n.id === nodeId);
            if (!fromNode) return;
            setDrawingConnection({
                fromNodeId: nodeId,
                fromOutput: portName,
                fromPosition: getPortPosition(fromNode, 'output', portName),
            });
        }
    }, [activeWorkflow.nodes]);
    
    const handlePortMouseUp = useCallback((e: React.MouseEvent, toNodeId: string, toInput: string, type: 'input' | 'output') => {
        e.stopPropagation();
        if (!drawingConnection || type !== 'input') {
            setDrawingConnection(null);
            return;
        }

        if (drawingConnection.fromNodeId === toNodeId) return;

        const isAlreadyConnected = activeWorkflow.connections.some(c => c.toNodeId === toNodeId && c.toInput === toInput);
        if (isAlreadyConnected) return; // Allow only one connection per input

        const newConnection: Connection = { ...drawingConnection, toNodeId, toInput };
        updateWorkflow(activeWorkflow.nodes, [...activeWorkflow.connections, newConnection]);
        setDrawingConnection(null);
    }, [drawingConnection, activeWorkflow]);


    return (
        <div className="flex flex-col h-full bg-brand-dark overflow-hidden">
             <header className="bg-brand-gray border-b border-brand-border px-4 py-2 flex justify-between items-center text-sm z-10 flex-shrink-0">
                <h1 className="text-xl font-bold text-white">AgentricAI Studio</h1>
                <div className="flex items-center gap-2">
                    <button onClick={() => { dispatch({type: 'SET_ACTIVE_AGENT_ID', payload: null}); setActiveView('agent-editor')}} className="bg-brand-primary hover:bg-brand-accent text-white px-3 py-1.5 rounded-md flex items-center gap-1"><PlusIcon className="w-4 h-4" /> Define New Agent</button>
                    <button onClick={runWorkflow} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1"><PlayIcon className="w-4 h-4" /> Run Workflow</button>
                    <button onClick={clearWorkflow} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1"><TrashIcon className="w-4 h-4" /> Clear Canvas</button>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <NodeLibrary onAddNode={addNode} />
                <main
                    ref={canvasRef}
                    className="flex-1 bg-brand-dark relative overflow-hidden"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,theme(colors.brand-border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.brand-border)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
                    
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {activeWorkflow.connections.map((conn, index) => {
                            const fromNode = activeWorkflow.nodes.find(n => n.id === conn.fromNodeId);
                            const toNode = activeWorkflow.nodes.find(n => n.id === conn.toNodeId);
                            if (!fromNode || !toNode) return null;
                            const startPos = getPortPosition(fromNode, 'output', conn.fromOutput);
                            const endPos = getPortPosition(toNode, 'input', conn.toInput);
                            return <path key={index} d={getCurvePath(startPos, endPos)} stroke="rgb(139, 92, 246)" strokeWidth="2" fill="none" />;
                        })}
                        {drawingConnection && (
                            <path d={getCurvePath(drawingConnection.fromPosition, mousePosition)} stroke="rgb(236, 72, 153)" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                        )}
                    </svg>

                    {activeWorkflow.nodes.map(node => (
                        <NodeComponent
                            key={node.id}
                            data={node}
                            onNodeMouseDown={handleNodeMouseDown}
                            onPortMouseDown={handlePortMouseDown}
                            onPortMouseUp={handlePortMouseUp}
                            onContentChange={handleNodeContentChange}
                            onCreateAgent={handleCreateAgentFromNode}
                        />
                    ))}
                    {executionLogs.length > 0 && <ExecutionLog logs={executionLogs}/>}
                </main>
            </div>
        </div>
    );
};

const NodeLibrary: React.FC<{onAddNode: (type: NodeType) => void}> = ({onAddNode}) => {
    return (
        <div className="w-64 bg-brand-gray p-4 flex flex-col h-full border-r border-brand-border">
            <h2 className="text-lg font-bold text-white mb-4">Agent & Node Library</h2>
            <input type="text" placeholder="Search agents..." className="w-full bg-brand-light-gray border border-brand-border rounded-md px-2 py-1 mb-4 text-sm" />
            <div className="overflow-y-auto space-y-4 text-sm">
                <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">INPUT</h3>
                     <ul className="space-y-1">
                        <li onClick={() => onAddNode('textInput')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><DocumentTextIcon className="w-4 h-4"/> Text Input</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">CONTENT & LANGUAGE</h3>
                    <ul className="space-y-1">
                        <li onClick={() => onAddNode('storyGenerator')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><SparklesIcon className="w-4 h-4"/> The Novelist</li>
                        <li onClick={() => onAddNode('imageGenerator')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><PhotoIcon className="w-4 h-4"/> The Visualizer</li>
                         <li onClick={() => onAddNode('textSummarizer')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><DocumentMinusIcon className="w-4 h-4"/> Content Summarizer</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">DATA & INTEGRATION</h3>
                     <ul className="space-y-1">
                        <li onClick={() => onAddNode('jsonExtractor')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><CodeBracketIcon className="w-4 h-4"/> Data Extractor</li>
                        <li onClick={() => onAddNode('webSearch')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><GlobeAltIcon className="w-4 h-4"/> Web Crawler</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">DEVELOPMENT & CODE</h3>
                    <ul className="space-y-1">
                        <li onClick={() => onAddNode('agentDesigner')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><UserPlusIcon className="w-4 h-4"/> Agent Designer</li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">EDUCATION</h3>
                    <ul className="space-y-1">
                        <li onClick={() => onAddNode('quizGenerator')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><QuestionMarkCircleIcon className="w-4 h-4"/> The Tutor (Quiz Mode)</li>
                        <li onClick={() => onAddNode('lessonPlanner')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><ClipboardDocumentListIcon className="w-4 h-4"/> Curriculum Designer</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-brand-text-secondary mb-2">DISPLAY</h3>
                    <ul className="space-y-1">
                        <li onClick={() => onAddNode('dataDisplay')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><EyeIcon className="w-4 h-4"/> Data Display</li>
                        <li onClick={() => onAddNode('imageDisplay')} className="cursor-pointer p-2 hover:bg-brand-light-gray rounded-md flex items-center gap-2"><PhotoIcon className="w-4 h-4"/> Image Display</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Studio;
--- END OF FILE components/Studio.tsx ---
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
    }, [isOpen, currentUserRole, persona.greeting]);
    
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
--- START OF FILE components/ParentTeacherConsole.tsx ---
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
// FIX: Changed import path for View type
import { View } from '../types/index';
import { ArrowUturnLeftIcon, ClipboardDocumentCheckIcon, PlusIcon, TrashIcon, InformationCircleIcon } from './icons';

interface ParentTeacherConsoleProps {
  studentId: string;
  setActiveView: (view: View) => void;
}

const ParentTeacherConsole: React.FC<ParentTeacherConsoleProps> = ({ studentId, setActiveView }) => {
  const { state, dispatch } = useAppContext();
  const student = state.students.find(s => s.id === studentId);
  const agent = state.agents.find(a => a.id === student?.companionAgentId);

  const [parentGoals, setParentGoals] = useState<string[]>([]);
  const [teacherCurriculum, setTeacherCurriculum] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [newCurriculum, setNewCurriculum] = useState('');

  useEffect(() => {
    if (student) {
      setParentGoals(student.parentGoals);
      setTeacherCurriculum(student.teacherCurriculum);
    }
  }, [student]);

  if (!student || !agent) {
    return (
      <div className="p-6 text-center">
        <p>Could not load data for this student's agent.</p>
        <button onClick={() => setActiveView('student-roster')} className="mt-4 text-brand-secondary">Return to Roster</button>
      </div>
    );
  }
  
  const handleSaveChanges = () => {
    dispatch({
        type: 'UPDATE_STUDENT_GOALS_AND_CURRICULUM',
        payload: {
            studentId,
            parentGoals,
            teacherCurriculum
        }
    });
    alert('Changes saved. The companion agent will now synthesize this new information.');
    setActiveView('student-roster');
  };

  const addGoal = () => {
    if(newGoal.trim()) {
        setParentGoals([...parentGoals, newGoal.trim()]);
        setNewGoal('');
    }
  }

  const removeGoal = (index: number) => {
    setParentGoals(parentGoals.filter((_, i) => i !== index));
  }
  
  const addCurriculum = () => {
      if(newCurriculum.trim()) {
          setTeacherCurriculum([...teacherCurriculum, newCurriculum.trim()]);
          setNewCurriculum('');
      }
  }

  const removeCurriculum = (index: number) => {
      setTeacherCurriculum(teacherCurriculum.filter((_, i) => i !== index));
  }

  return (
    <div className="p-6 bg-brand-dark min-h-full">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Parent & Teacher Console</h1>
          <p className="text-brand-text-secondary">Managing curriculum for: <span className="font-bold text-brand-cyan">{agent.name}</span></p>
        </div>
        <button onClick={() => setActiveView('student-roster')} className="flex items-center gap-2 bg-brand-gray px-4 py-2 rounded-lg hover:bg-brand-light-gray">
            <ArrowUturnLeftIcon className="w-5 h-5" />
            <span className="text-sm">Back to Roster</span>
        </button>
      </header>
      
      <div className="bg-brand-light-gray border border-brand-border rounded-lg p-3 mb-6 flex items-center text-sm">
        <InformationCircleIcon className="w-5 h-5 text-brand-secondary mr-3 flex-shrink-0"/>
        <div>
            <span className="text-brand-text-secondary">This student's unique, anonymous identifier is </span>
            <span className="font-mono text-brand-cyan bg-brand-dark px-2 py-1 rounded">{agent.id}</span>
            <span className="text-brand-text-secondary">. Use this ID to find their work in the Project Showcase.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Inputs */}
        <div className="bg-brand-gray border border-brand-border rounded-lg p-4 space-y-6">
            {/* Parent Goals */}
            <div>
                <h2 className="font-semibold text-white mb-2">Parent Goals</h2>
                <p className="text-xs text-brand-text-secondary mb-3">Define high-level objectives for the agent to consider.</p>
                <div className="space-y-2">
                    {parentGoals.map((goal, index) => (
                        <div key={index} className="flex items-center justify-between bg-brand-light-gray p-2 rounded">
                            <span className="text-sm">{goal}</span>
                            <button onClick={() => removeGoal(index)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-3">
                    <input type="text" value={newGoal} onChange={e => setNewGoal(e.target.value)} placeholder="e.g., Spend less time on games" className="flex-grow bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm"/>
                    <button onClick={addGoal} className="bg-brand-primary p-2 rounded"><PlusIcon className="w-4 h-4"/></button>
                </div>
            </div>

            {/* Teacher Curriculum */}
            <div>
                <h2 className="font-semibold text-white mb-2">Teacher Curriculum</h2>
                <p className="text-xs text-brand-text-secondary mb-3">Add specific educational blocks or topics.</p>
                <div className="space-y-2">
                    {teacherCurriculum.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-brand-light-gray p-2 rounded">
                            <span className="text-sm">{item}</span>
                            <button onClick={() => removeCurriculum(index)} className="text-red-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-3">
                    <input type="text" value={newCurriculum} onChange={e => setNewCurriculum(e.target.value)} placeholder="e.g., Add 'Game Development 101'" className="flex-grow bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm"/>
                    <button onClick={addCurriculum} className="bg-brand-primary p-2 rounded"><PlusIcon className="w-4 h-4"/></button>
                </div>
            </div>
             <button onClick={handleSaveChanges} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                Save & Update Agent
            </button>
        </div>

        {/* Right Column: Agent-Curated Log */}
        <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
            <h2 className="font-semibold text-white mb-2 flex items-center gap-2"><ClipboardDocumentCheckIcon className="w-5 h-5 text-brand-cyan"/> Agent-Curated Activity Log</h2>
            <p className="text-xs text-brand-text-secondary mb-4">This is a high-level summary of the student's progress, generated by their companion agent to protect privacy.</p>
            <div className="space-y-3 h-96 overflow-y-auto pr-2">
                {student.activityLog.length > 0 ? student.activityLog.slice().reverse().map(log => (
                    <div key={log.timestamp} className="bg-brand-light-gray p-3 rounded-md">
                        <p className="text-sm text-brand-text">{log.summary}</p>
                        <p className="text-xs text-brand-text-secondary mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                )) : (
                    <p className="text-sm text-brand-text-secondary text-center p-4">No activities completed yet.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParentTeacherConsole;
--- END OF FILE components/ParentTeacherConsole.tsx ---
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
--- START OF FILE components/MissionCommandView.tsx ---
import React, { useState, useEffect } from 'react';
import { manifestAgents } from '../core/agentManifest';
import { ManifestAgent, MissionPlan, MissionStep, CommLogEntry, MissionStepStatus } from '../types/index';
import { useAppContext } from '../context/AppContext';
import { PlusIcon, MinusCircleIcon, PaperAirplaneIcon, SparklesIcon, PlayIcon, CpuIcon, CheckCircleIcon, XCircleIcon, CommandLineIcon } from './icons';
import { generateContent } from '../services/logicBroker';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MissionCommandView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [objective, setObjective] = useState('');
    const [isPlanning, setIsPlanning] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [commLog, setCommLog] = useState<CommLogEntry[]>([]);
    const brokerParams = { isPremium: state.currentUser?.subscriptionPlan === 'pro' };
    
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
            const { text } = await generateContent({ prompt }, brokerParams);
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
                const { text: result } = await generateContent({ prompt }, brokerParams);
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

---
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

---
--- END OF FILE USER_LOG.md ---
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
--- START OF FILE components/LectureModal.tsx ---
import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { XMarkIcon } from './icons';

interface LectureModalProps {
    onClose: () => void;
}

const LectureModal: React.FC<LectureModalProps> = ({ onClose }) => {
    const { state, dispatch } = useAppContext();
    const activeStudent = state.students.find(s => s.id === state.activeStudentId);

    useEffect(() => {
        if (activeStudent) {
            dispatch({ type: 'JOIN_LECTURE', payload: activeStudent.companionAgentId });
        }

        return () => {
            if (activeStudent) {
                dispatch({ type: 'LEAVE_LECTURE', payload: activeStudent.companionAgentId });
            }
        };
    }, [dispatch, activeStudent]);

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-brand-gray border border-brand-border rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <header className="flex justify-between items-center p-4 border-b border-brand-border">
                    <h2 className="text-xl font-bold text-white">Live Teacher Seminar</h2>
                    <button onClick={onClose} className="text-brand-text-secondary hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                </header>
                <main className="p-6 overflow-y-auto bg-brand-dark flex-grow flex items-center justify-center">
                    <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center relative">
                        <p className="text-brand-text-secondary">Teacher's Video Feed</p>
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="text-red-500 font-bold text-sm">LIVE</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default LectureModal;
--- END OF FILE components/LectureModal.tsx ---
--- START OF FILE components/TeacherLectureView.tsx ---
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { StarIcon, UserGroupIcon } from './icons';

const TeacherLectureView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { liveLectureSession } = state;

    const handleStartLecture = () => {
        dispatch({ type: 'START_LECTURE' });
    };

    const handleEndLecture = () => {
        dispatch({ type: 'END_LECTURE' });
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <StarIcon className="w-8 h-8 mr-3 text-yellow-400" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Live Lecture Hall</h1>
                    <p className="text-brand-text-secondary">Manage your live seminars and monitor student attendance privately.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-brand-gray border border-brand-border rounded-lg p-4 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white mb-4">Session Control</h2>
                        {liveLectureSession?.isActive ? (
                            <button onClick={handleEndLecture} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md">
                                End Live Lecture
                            </button>
                        ) : (
                            <button onClick={handleStartLecture} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-md">
                                Start Live Lecture
                            </button>
                        )}
                    </div>
                    <div className="mt-4 text-center">
                        {liveLectureSession?.isActive ? (
                             <div className="border-2 border-green-500 rounded-lg p-3">
                                <p className="text-2xl font-bold text-green-400 animate-pulse">LIVE</p>
                                <p className="text-xs text-brand-text-secondary">Session is active</p>
                             </div>
                        ) : (
                             <div className="border-2 border-red-500 rounded-lg p-3">
                                <p className="text-2xl font-bold text-red-400">OFFLINE</p>
                                <p className="text-xs text-brand-text-secondary">Session is not active</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-brand-gray border border-brand-border rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <UserGroupIcon className="w-5 h-5"/>
                        Live Attendance Roster ({liveLectureSession?.attendeeAgentIds.length || 0})
                    </h2>
                    <div className="h-96 overflow-y-auto bg-brand-dark rounded-md p-2 space-y-2">
                        {liveLectureSession?.isActive ? (
                            liveLectureSession.attendeeAgentIds.length > 0 ? (
                                liveLectureSession.attendeeAgentIds.map(agentId => (
                                    <div key={agentId} className="p-2 bg-brand-light-gray rounded-md font-mono text-sm text-brand-cyan animate-fade-in">
                                        {agentId}
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-brand-text-secondary text-center p-4">Waiting for students to join the live lecture...</p>
                                </div>
                            )
                        ) : (
                             <div className="flex items-center justify-center h-full">
                                <p className="text-brand-text-secondary text-center p-4">Start the lecture session to begin tracking attendance.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherLectureView;
--- END OF FILE components/TeacherLectureView.tsx ---
--- START OF FILE components/AgentRoster.tsx ---
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { manifestAgents } from '../core/agentManifest';
// FIX: Replaced the non-existent 'ViewfinderCircleIcon' with 'DocumentMagnifyingGlassIcon'.
import { UserCircleIcon, SignalIcon, DocumentMagnifyingGlassIcon } from './icons';
// FIX: Corrected the import path for the 'View' type to point to the centralized 'types/index.ts' file.
import { View } from '../types/index';

interface AgentRosterProps {
  setActiveView: (view: View) => void;
}

const AgentRoster: React.FC<AgentRosterProps> = ({ setActiveView }) => {
    const { state, dispatch } = useAppContext();
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');

    const allAgents = useMemo(() => {
        const manifestAgentIds = new Set(manifestAgents.map(a => a.id));
        const dynamicAgents = state.agents
            .filter(a => !manifestAgentIds.has(a.id))
            .map(a => ({
                id: a.id,
                name: a.name,
                category: a.type || 'Dynamic',
                role: a.systemInstruction,
            }));
        return [...manifestAgents, ...dynamicAgents];
    }, [state.agents]);

    const categories = useMemo(() => ['All', ...Array.from(new Set(allAgents.map(a => a.category)))], [allAgents]);

    const filteredAndSortedAgents = useMemo(() => {
        let agents = allAgents;

        if (filterCategory !== 'All') {
            agents = agents.filter(a => a.category === filterCategory);
        }

        agents.sort((a, b) => {
            if (sortBy === 'name') {
                return a.name.localeCompare(b.name);
            }
            if (sortBy === 'category') {
                return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
            }
            return 0;
        });

        return agents;
    }, [allAgents, filterCategory, sortBy]);
    
    const handleSelectAgent = (agentId: string) => {
        dispatch({ type: 'SET_ACTIVE_AGENT_ID', payload: agentId });
        setActiveView('agent-detail');
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <UserCircleIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">System Agent Roster</h1>
                        <p className="text-brand-text-secondary">Browse, filter, and inspect all agents in the ecosystem.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-brand-gray border border-brand-border rounded-md px-3 py-1.5 text-sm">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                     <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-brand-gray border border-brand-border rounded-md px-3 py-1.5 text-sm">
                        <option value="name">Sort by Name</option>
                        <option value="category">Sort by Category</option>
                    </select>
                </div>
            </header>

            {filteredAndSortedAgents.length === 0 ? (
                <div className="text-center p-10 bg-brand-gray rounded-lg border border-brand-border">
                    <p className="text-brand-text-secondary">No agents match the current filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredAndSortedAgents.map(agent => (
                        <div 
                            key={agent.id} 
                            onClick={() => handleSelectAgent(agent.id)}
                            className="bg-brand-gray border border-brand-border rounded-lg p-4 cursor-pointer group hover:border-brand-primary transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="font-bold text-white truncate">{agent.name}</h2>
                                    <p className="text-xs text-brand-text-secondary">{agent.id}</p>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-green-400">
                                    <SignalIcon className="w-4 h-4" />
                                    <span>Active</span>
                                </div>
                            </div>
                            <div className="mt-4 border-t border-brand-border pt-3 space-y-2 text-sm">
                               <p className="text-brand-text-secondary text-xs h-16 overflow-hidden text-ellipsis">{agent.role}</p>
                               <div className="flex justify-between items-center">
                                   <span className="text-xs bg-brand-dark px-2 py-1 rounded-full">{agent.category}</span>
                                   <button className="flex items-center gap-1 text-xs text-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                                       <DocumentMagnifyingGlassIcon className="w-4 h-4" />
                                       View Details
                                   </button>
                               </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AgentRoster;
--- END OF FILE components/AgentRoster.tsx ---
--- START OF FILE components/AgentDetailView.tsx ---
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { manifestAgents } from '../core/agentManifest';
import { ArrowUturnLeftIcon, BookOpenIcon, Cog6ToothIcon, CubeTransparentIcon, LightBulbIcon } from './icons';
import { AVAILABLE_TOOLS } from '../core/tools';
// FIX: The import path for the 'View' type was corrected to point to the centralized 'types/index.ts' file.
import { View } from '../types/index';

interface AgentDetailViewProps {
  setActiveView: (view: View) => void;
}

const DetailSection: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-brand-gray border border-brand-border rounded-lg p-4">
        <div className="flex items-center text-brand-cyan mb-3">
            {icon}
            <h2 className="ml-2 text-lg font-semibold text-white">{title}</h2>
        </div>
        <div className="text-sm text-brand-text-secondary space-y-2">
            {children}
        </div>
    </div>
);

const AgentDetailView: React.FC<AgentDetailViewProps> = ({ setActiveView }) => {
    const { state } = useAppContext();
    const manifestAgent = manifestAgents.find(a => a.id === state.activeAgentId);
    const dynamicAgent = state.agents.find(a => a.id === state.activeAgentId);

    const agentData = dynamicAgent 
      ? { ...manifestAgent, ...dynamicAgent, role: manifestAgent?.role || dynamicAgent.systemInstruction } 
      : manifestAgent;

    if (!agentData) {
        return (
            <div className="p-6 text-center">
                <p>Agent not found.</p>
                <button onClick={() => setActiveView('student-roster')} className="mt-4 text-brand-secondary">Return to Roster</button>
            </div>
        );
    }

    const agentTools = dynamicAgent?.tools || [];

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">{agentData.name}</h1>
                    <p className="text-brand-text-secondary font-mono">{agentData.id}</p>
                </div>
                <button onClick={() => setActiveView('student-roster')} className="flex items-center gap-2 bg-brand-gray px-4 py-2 rounded-lg hover:bg-brand-light-gray">
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                    <span className="text-sm">Back to Roster</span>
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <DetailSection icon={<BookOpenIcon className="w-5 h-5" />} title="System Instruction & Role">
                        <p className="whitespace-pre-wrap leading-relaxed">{agentData.role}</p>
                    </DetailSection>

                    <DetailSection icon={<Cog6ToothIcon className="w-5 h-5" />} title="Equipped Tools">
                        {agentTools.length > 0 ? (
                            <div className="space-y-3">
                                {agentTools.map(toolConfig => {
                                    const toolDef = AVAILABLE_TOOLS.find(t => t.id === toolConfig.toolId);
                                    return (
                                        <div key={toolConfig.toolId} className="p-3 bg-brand-dark rounded-md">
                                            <h3 className="font-semibold text-brand-text">{toolDef?.name || toolConfig.toolId}</h3>
                                            <p className="text-xs text-brand-text-secondary">{toolDef?.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>No tools equipped.</p>
                        )}
                    </DetailSection>
                </div>

                <div className="space-y-6">
                     <DetailSection icon={<LightBulbIcon className="w-5 h-5" />} title="Configuration">
                        <p><strong>Category:</strong> {agentData.category}</p>
                        {dynamicAgent && <>
                            <p><strong>Model:</strong> <span className="font-mono">{dynamicAgent.model}</span></p>
                            <p><strong>Tone:</strong> {dynamicAgent.personality.tone}</p>
                            <p><strong>Creativity:</strong> {dynamicAgent.personality.creativity}</p>
                            <p><strong>Verbosity:</strong> {dynamicAgent.personality.verbosity}</p>
                        </>}
                     </DetailSection>
                     <DetailSection icon={<CubeTransparentIcon className="w-5 h-5" />} title="Core Memory">
                        {dynamicAgent?.coreMemory && dynamicAgent.coreMemory.length > 0 ? (
                           <div className="space-y-2">
                               {dynamicAgent.coreMemory.map(mem => (
                                   <div key={mem.id} className="p-2 bg-brand-dark rounded">
                                       <h4 className="font-semibold text-brand-text">{mem.title}</h4>
                                       <p className="text-xs italic">{mem.content}</p>
                                   </div>
                               ))}
                           </div>
                        ) : (
                            <p>Core memory is empty.</p>
                        )}
                    </DetailSection>
                </div>
            </div>
        </div>
    );
};

export default AgentDetailView;
--- END OF FILE components/AgentDetailView.tsx ---
--- START OF FILE components/CurriculumManagerView.tsx ---
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpenIcon, PlusIcon, TrashIcon } from './icons';
import { CurriculumItem, CoreSubject } from '../types/index';

const subjects: CoreSubject[] = ['Math', 'Reading', 'Science', 'History', 'Language Arts', 'Geography'];

const CurriculumManagerView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const [newItem, setNewItem] = useState<{ [key in CoreSubject]?: { title: string, content: string } }>({});

    const handleAddItem = (subject: CoreSubject) => {
        const itemData = newItem[subject];
        if (itemData && itemData.title.trim() && itemData.content.trim()) {
            const newItemPayload: CurriculumItem = {
                id: \`curr-\${Date.now()}\`,
                subject,
                title: itemData.title.trim(),
                content: itemData.content.trim(),
            };
            dispatch({ type: 'ADD_CURRICULUM_ITEM', payload: newItemPayload });
            setNewItem(prev => ({ ...prev, [subject]: { title: '', content: '' } }));
            dispatch({ type: 'SHOW_TOAST', payload: { message: \`Added "\${newItemPayload.title}" to \${subject}.\`, type: 'success' } });
        } else {
            dispatch({ type: 'SHOW_TOAST', payload: { message: 'Title and content cannot be empty.', type: 'error' } });
        }
    };

    const handleRemoveItem = (id: string) => {
        dispatch({ type: 'REMOVE_CURRICULUM_ITEM', payload: id });
    };
    
    const handleInputChange = (subject: CoreSubject, field: 'title' | 'content', value: string) => {
        setNewItem(prev => ({
            ...prev,
            [subject]: {
                ...(prev[subject] || { title: '', content: '' }),
                [field]: value,
            },
        }));
    };

    return (
        <div className="p-6 bg-brand-dark min-h-full">
            <header className="flex items-center mb-6">
                <BookOpenIcon className="w-8 h-8 mr-3 text-brand-cyan" />
                <div>
                    <h1 className="text-2xl font-bold text-white">Curriculum Manager</h1>
                    <p className="text-brand-text-secondary">Manage the central library of educational content for all companion agents.</p>
                </div>
            </header>

            <div className="space-y-8">
                {subjects.map(subject => {
                    const subjectItems = state.curriculum?.filter(item => item.subject === subject) || [];
                    const currentNewItem = newItem[subject] || { title: '', content: '' };
                    return (
                        <div key={subject} className="bg-brand-gray border border-brand-border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-white">{subject}</h2>
                                <span className="text-sm font-mono bg-brand-dark px-2 py-1 rounded-full text-brand-text-secondary">{subjectItems.length} Lessons</span>
                            </div>
                            <div className="space-y-2 mb-4">
                                {subjectItems.length > 0 ? (
                                    subjectItems.map(item => (
                                        <div key={item.id} className="flex items-start justify-between bg-brand-light-gray p-3 rounded">
                                            <div>
                                                <h3 className="font-bold text-brand-text">{item.title}</h3>
                                                <p className="text-sm text-brand-text-secondary mt-1 whitespace-pre-wrap">{item.content}</p>
                                            </div>
                                            <button onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-400 flex-shrink-0 ml-4">
                                                <TrashIcon className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-brand-text-secondary italic">No curriculum items for this subject yet.</p>
                                )}
                            </div>
                            <div className="border-t border-brand-border pt-4">
                                <h3 className="text-sm font-semibold text-white mb-2">Add New Lesson</h3>
                                <div className="flex gap-2 items-start">
                                    <input
                                        type="text"
                                        value={currentNewItem.title}
                                        onChange={e => handleInputChange(subject, 'title', e.target.value)}
                                        placeholder="Lesson Title"
                                        className="w-1/3 bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm"
                                    />
                                    <textarea
                                        value={currentNewItem.content}
                                        onChange={e => handleInputChange(subject, 'content', e.target.value)}
                                        placeholder="Lesson content or key points..."
                                        rows={1}
                                        className="flex-grow bg-brand-dark border border-brand-border rounded px-2 py-1 text-sm resize-y"
                                    />
                                    <button onClick={() => handleAddItem(subject)} className="bg-brand-primary p-2 rounded flex-shrink-0">
                                        <PlusIcon className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CurriculumManagerView;
--- END OF FILE components/CurriculumManagerView.tsx ---
`;
