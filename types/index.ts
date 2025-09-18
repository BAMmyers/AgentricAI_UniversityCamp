import React from 'react';

// --- CORE APP & USER TYPES ---

export type View =
  | 'dashboard'
  | 'studio' // Now refers to the new AgenticStudio
  | 'agent-editor' 
  | 'university'
  | 'gateway'
  | 'student-roster'
  | 'parent-teacher-console'
  | 'showcase'
  | 'account'
  | 'system-optimization'
  | 'security-sentinel'
  | 'mission-command'
  | 'teacher-lecture'
  | 'agent-detail'
  | 'curriculum-manager'
  | 'student-ui-builder'
  | 'agent-roster';

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';
export type SubscriptionPlan = 'free' | 'pro';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    subscriptionPlan: SubscriptionPlan;
    passwordHash?: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface SystemError {
    error: Error;
    errorInfo: React.ErrorInfo;
}

// --- STUDENT & EDUCATION TYPES ---

export type ScheduleItemType = 'reading' | 'math' | 'art' | 'mealtime' | 'writing' | 'free-play' | 'lecture' | 'custom';

export interface ScheduleItem {
    id: string;
    title: string;
    time: string;
    type: ScheduleItemType;
    status: 'pending' | 'in-progress' | 'completed';
    content: any; // The generated content for the activity
    review?: string; // Feedback from the agent
    workflowId?: string;
    color?: string;
    icon?: React.ReactNode;
    notes?: string;
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

export type CoreSubject = 'Math' | 'Reading' | 'Science' | 'History' | 'Language Arts' | 'Geography';

export interface CurriculumItem {
    id: string;
    subject: CoreSubject;
    title: string;
    content: string;
}

// --- AGENT & STUDIO TYPES ---

export interface Point { x: number; y: number; }
export interface Port { id: string; name: string; type: 'input' | 'output'; dataType: 'string' | 'number' | 'boolean' | 'image' | 'audio' | 'json' | 'any'; exampleValue?: any; }

export type NodeType = 'textInput' | 'storyGenerator' | 'jsonExtractor' | 'imageGenerator' | 'agentDesigner' | 'pythonInterpreter' | 'quizGenerator' | 'lessonPlanner' | 'textSummarizer' | 'webSearch' | 'dataDisplay' | 'imageDisplay';

export interface NodeData {
  id: string;
  type: NodeType; 
  title: string;
  position: Point;
  inputs: Port[];
  outputs: Port[];
  color: string;
  icon: React.ReactNode;
  content?: any;
  outputData?: any;
  status?: 'idle' | 'running' | 'success' | 'error';
  error?: string;
  // Properties for the new AgenticStudio
  name?: string;
  x?: number;
  y?: number;
  data?: { [key: string]: any };
  isDynamic?: boolean;
  requiresWebSearch?: boolean;
  category?: string;
  executionTime?: string;
  currentWidth?: number;
  currentHeight?: number;
  executionLogicPrompt?: string;
  isImmutable?: boolean;
  description?: string;
}

export interface Connection {
  sourceNodeId: string;
  sourceOutputName: string;
  targetNodeId: string;
  targetInputName: string;
}

export interface Edge {
  id: string;
  sourceNodeId: string;
  sourceOutputId: string;
  targetNodeId: string;
  targetInputId: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: NodeData[];
  connections: Connection[];
  // New property for AgenticStudio compatibility
  edges?: Edge[]; 
}

export interface DynamicNodeConfig {
  name: string;
  description: string;
  inputs: (Omit<Port, 'type' | 'id'> & { id?: string })[];
  outputs: (Omit<Port, 'type' | 'id'> & { id?: string })[];
  executionLogicPrompt?: string;
  color: string;
  icon: React.ReactNode | string;
  isDynamic: boolean;
  category: string;
  requiresWebSearch?: boolean;
  defaultHeight?: number;
  isImmutable?: boolean;
  isPromoted?: boolean;
  currentWidth?: number;
}

export type Environment = 'studio' | 'sandbox' | 'echo';
export type ExecutionRuntime = 'net' | 'local' | 'native';
export type AiMode = 'agent' | 'assist' | 'chat';
export type ContextMemory = 'full' | 'recent' | 'none';

export interface LlmServiceConfig {
    service: 'gemini' | 'openai';
    apiKey: string;
    basePath?: string;
    ollamaHost?: string;
    ollamaModel?: string;
}

export interface ExecutionHistoryEntry {
  id: string;
  nodeName: string;
  nodeIcon: React.ReactNode | string;
  status: 'success' | 'error';
  timestamp: string;
  executionTime: string;
  error?: string | null;
}

export interface SavedWorkflow {
  name: string;
  nodes: NodeData[];
  edges: Edge[];
}

export interface ManifestAgent {
  id: string;
  name: string;
  category: string;
  role: string;
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

// --- LEGACY AGENT & CHAT TYPES (for compatibility) ---

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  mode?: 'confirmation';
  proposedChanges?: ProposedChanges;
}

export interface CodeChange {
  filePath: string;
  modifiedContent: string;
}

export interface ProposedChanges {
  summary: string;
  changes: CodeChange[];
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

// --- AppState & Actions ---

export interface AppState {
  currentUser: User | null;
  users: User[];
  agents: Agent[];
  students: Student[];
  showcasedProjects: ShowcasedProject[];
  toasts: Toast[];
  systemError: SystemError | null;
  activeAgentId: string | null;
  activeStudentId: string | null;
  securityLog: SecurityLogEntry[];
  liveLectureSession: LiveLectureSession | null;
  curriculum: CurriculumItem[];
  isEnrolling: boolean;
  isOfflineMode: boolean;
  workflows: Workflow[];
  missionPlan: MissionPlan | null;
  missionTeam: ManifestAgent[];
}

export type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'LOGIN'; payload: { user: User, password?: string } }
  | { type: 'REGISTER_USER'; payload: { email: string; passwordHash: string; role: UserRole; subscriptionPlan: SubscriptionPlan; preferences?: Student['preferences'] } }
  | { type: 'SETUP_ADMIN_ACCOUNT'; payload: { passwordHash: string } }
  | { type: 'LOGOUT' }
  | { type: 'START_ENROLLMENT' }
  | { type: 'CANCEL_ENROLLMENT' }
  | { type: 'UPGRADE_PLAN' }
  | { type: 'UPDATE_AGENT'; payload: Agent }
  | { type: 'ADD_AGENT'; payload: Agent }
  | { type: 'SET_ACTIVE_AGENT_ID'; payload: string | null }
  | { type: 'ENROLL_STUDENT' }
  | { type: 'SET_ACTIVE_STUDENT_ID'; payload: string | null }
  | { type: 'UPDATE_STUDENT_SCHEDULE'; payload: { studentId: string; schedule: ScheduleItem[] } }
  | { type: 'UPDATE_STUDENT_GOALS_AND_CURRICULUM'; payload: UpdateStudentGoalsPayload }
  | { type: 'UPDATE_STUDENT_PROFILE'; payload: UpdateStudentProfilePayload }
  | { type: 'LOG_ACTIVITY_COMPLETION'; payload: LogActivityPayload }
  | { type: 'SHOWCASE_PROJECT'; payload: ShowcasedProject }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: Toast['type'] } }
  | { type: 'HIDE_TOAST'; payload: number }
  | { type: 'SET_SYSTEM_ERROR', payload: SystemError | null }
  | { type: 'CLEAR_SYSTEM_ERROR' }
  | { type: 'LOG_SECURITY_EVENT'; payload: Omit<SecurityLogEntry, 'timestamp'> }
  | { type: 'START_LECTURE' }
  | { type: 'END_LECTURE' }
  | { type: 'JOIN_LECTURE'; payload: string } // agentId
  | { type: 'LEAVE_LECTURE'; payload: string } // agentId
  | { type: 'ADD_CURRICULUM_ITEM'; payload: CurriculumItem }
  | { type: 'REMOVE_CURRICULUM_ITEM'; payload: string }
  | { type: 'SET_OFFLINE_MODE' }
  | { type: 'SET_ONLINE_MODE' }
  | { type: 'ADD_AGENT_TO_TEAM'; payload: ManifestAgent }
  | { type: 'REMOVE_AGENT_FROM_TEAM'; payload: string }
  | { type: 'SET_MISSION_PLAN'; payload: MissionPlan | null }
  | { type: 'UPDATE_MISSION_STEP_STATE'; payload: { step: number; status: MissionStepStatus; result?: string } };


// --- MISC TYPES ---

export type SecurityEventType = 
  | 'LOGIN_SUCCESS' 
  | 'LOGIN_FAILURE' 
  | 'LOGOUT' 
  | 'USER_REGISTERED'
  | 'ADMIN_SETUP'
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