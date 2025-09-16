import React from 'react';

// Centralized View type for navigation state.
export type View =
  | 'dashboard'
  | 'studio'
  | 'agent-editor'
  | 'university'
  | 'core'
  | 'gateway'
  | 'student-roster'
  | 'parent-teacher-console'
  | 'showcase'
  | 'account'
  | 'student-dashboard';

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';
export type SubscriptionPlan = 'free' | 'pro';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    subscriptionPlan: SubscriptionPlan;
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

export interface AppState {
  currentUser: User | null;
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
}
