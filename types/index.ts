import React from 'react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
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
  color: string;
  icon?: React.ReactNode;
}

export interface Connection {
  fromNodeId: string;
  fromOutput: string; // output name
  toNodeId: string;
  toInput: string; // input name
}

export interface Workflow {
    id: string;
    name: string;
    nodes: NodeData[];
    connections: Connection[];
    ownerAgentId?: string; // Link workflow to the agent that created it
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
    tools: ToolConfig[];
    coreMemory: MemoryBlock[];
    type?: 'General' | 'Companion'; // Differentiate agent types
    studentId?: string; // Link companion agent to a student
}

export interface ScheduleItem {
    id: string;
    title: string;
    workflowId: string;
    icon: React.ReactNode;
    color: string;
    status: 'pending' | 'in-progress' | 'completed';
    notes?: string; // Note from the agent about why this was added/modified
    review?: string; // Agent's constructive feedback after completion
}

export interface ActivityLogEntry {
    timestamp: string;
    summary: string; // Agent-generated summary of the activity
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
    // Inputs from external stakeholders
    parentGoals: string[];
    teacherCurriculum: string[];
    // Agent-curated log for external review
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
    learningGoals?: string[]; // Kept this generic for future use
}


export interface LogActivityPayload {
    studentId: string;
    scheduleItemId: string;
    summary: string;
    review: string;
}

export interface ShowcasedProject {
    id: string; // scheduleItem.id can be used for uniqueness
    title: string;
    content: any;
    companionAgentId: string;
}

export interface AppState {
  agents: Agent[];
  workflows: Workflow[];
  students: Student[];
  showcasedProjects: ShowcasedProject[];
  activeAgentId: string | null;
  activeWorkflowId: string | null;
  activeStudentId: string | null;
  missionTeam: ManifestAgent[];
}