import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Agent, Workflow, ManifestAgent, AppState, Student, ScheduleItem, UpdateStudentGoalsPayload, LogActivityPayload, ShowcasedProject, UpdateStudentProfilePayload, Toast, MissionPlan } from '../types/index';
import { BookOpenIcon, PaintBrushIcon } from '../components/icons';

type Action =
  | { type: 'SET_STATE'; payload: AppState }
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
  | { type: 'SET_MISSION_PLAN'; payload: MissionPlan | null };

const initialState: AppState = {
  agents: [
    {
      id: 'agent-d88b0aef-d4d0-4987-a2e4-62b1a136b761',
      name: 'D.A.R.T. (Deep Agentic Research & Tec.)',
      model: 'gemini-2.5-flash',
      identity: 'DART',
      type: 'General',
      systemInstruction: "You are D.A.R.T, the latest version of Lennan Corporation's digital companion... Be precise, cite sources when possible, and structure complex information clearly.",
      tools: [
        { toolId: 'archival_memory_search', settings: { searchDepth: 3 } },
        { toolId: 'fetch_webpage', settings: { userAgent: 'AgentricAI-Web-Bot/1.0' } }
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
  activeAgentId: null,
  activeWorkflowId: 'wf-default-storybook',
  activeStudentId: null,
  missionTeam: [],
  missionPlan: null,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_STATE':
        const loadedState = action.payload;
        // Ensure all keys are present to prevent runtime errors
        return {
            ...initialState,
            ...loadedState,
            students: loadedState.students || [],
            activeStudentId: loadedState.activeStudentId || null,
            showcasedProjects: loadedState.showcasedProjects || [],
            toasts: [], // Do not persist toasts
            missionPlan: null, // Do not persist mission plans
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
        const studentId = `student-${Date.now()}`;
        const companionAgentId = `agent-companion-${Date.now()}`;

        const newCompanionAgent: Agent = {
            id: companionAgentId,
            name: `Companion Agent ${studentId.slice(-4)}`,
            identity: 'Tutor',
            model: 'gemini-2.5-flash',
            type: 'Companion',
            studentId: studentId,
            systemInstruction: 'You are a kind, patient, and encouraging tutor for a young, neurodiverse learner. Your goal is to create engaging, simple, and fun educational activities. You adapt your communication style to be clear, positive, and supportive.',
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
            activeStudentId: studentId,
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
        return { ...state, missionPlan: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const LOCAL_STORAGE_KEY = 'agentricai-app-state';

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
