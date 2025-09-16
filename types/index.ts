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
}

export interface Student {
    id: string;
    companionAgentId: string;
    schedule: ScheduleItem[];
}

export interface AppState {
  agents: Agent[];
  workflows: Workflow[];
  students: Student[];
  activeAgentId: string | null;
  activeWorkflowId: string | null;
  activeStudentId: string | null;
  missionTeam: ManifestAgent[];
}