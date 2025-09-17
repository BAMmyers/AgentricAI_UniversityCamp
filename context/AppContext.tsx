import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Agent, Workflow, ManifestAgent, AppState, Student, ScheduleItem, UpdateStudentGoalsPayload, LogActivityPayload, ShowcasedProject, UpdateStudentProfilePayload, Toast, MissionPlan, User, UserRole, SubscriptionPlan, SystemError, MissionStep, SecurityLogEntry, LiveLectureSession, CurriculumItem } from '../types/index';
import { BookOpenIcon, PaintBrushIcon } from '../components/icons';
import { saveStateToLocalStorage, loadStateFromLocalStorage } from '../utils/storage';

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'LOGIN'; payload: { user: User, password?: string } }
  | { type: 'REGISTER_USER'; payload: { email: string; passwordHash: string; role: UserRole; subscriptionPlan: SubscriptionPlan; preferences?: Student['preferences'] } }
  | { type: 'LOGOUT' }
  | { type: 'START_ENROLLMENT' }
  | { type: 'CANCEL_ENROLLMENT' }
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
  | { type: 'LOG_SECURITY_EVENT'; payload: Omit<SecurityLogEntry, 'timestamp'> }
  | { type: 'START_LECTURE' }
  | { type: 'END_LECTURE' }
  | { type: 'JOIN_LECTURE'; payload: string } // agentId
  | { type: 'LEAVE_LECTURE'; payload: string } // agentId
  | { type: 'ADD_CURRICULUM_ITEM'; payload: CurriculumItem }
  | { type: 'REMOVE_CURRICULUM_ITEM'; payload: string };

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
  liveLectureSession: { isActive: false, attendeeAgentIds: [] },
  curriculum: [],
  isEnrolling: false,
};

// Simple hash simulation for the frontend.
// In a real app, this would be a one-way hash (like bcrypt) performed on a server.
const hashPassword = (password: string) => `hashed_${password}`;

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
            liveLectureSession: loadedState.liveLectureSession || { isActive: false, attendeeAgentIds: [] },
            curriculum: loadedState.curriculum || [],
            toasts: [], // Do not persist toasts
            missionPlan: null, // Do not persist mission plans
            systemError: null, // Do not persist errors
            isEnrolling: false, // Don't persist enrollment state
        };
    case 'START_ENROLLMENT':
        return { ...state, isEnrolling: true };
    case 'CANCEL_ENROLLMENT':
        return { ...state, isEnrolling: false };
    case 'REGISTER_USER': {
        const { email, passwordHash, role, subscriptionPlan, preferences } = action.payload;
        const userExists = state.users.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (userExists) return state;

        const newUserId = `${role}-${Date.now()}`;
        const newUser: User = {
            id: newUserId,
            email,
            passwordHash,
            role,
            subscriptionPlan,
        };

        let newState: AppState = {
            ...state,
            users: [...state.users, newUser],
            currentUser: newUser,
            isEnrolling: false, // Close enrollment view on success
            securityLog: [
                { type: 'USER_REGISTERED', details: `New user registered: ${newUser.email} (Role: ${newUser.role})`, timestamp: new Date().toISOString() },
                ...state.securityLog
            ],
        };

        if (role === 'student' && preferences) {
            const studentId = newUserId;
            const companionAgentId = `agent-companion-${studentId.slice(-6)}`;
            const newCompanionAgent: Agent = {
                id: companionAgentId,
                name: `Companion Agent ${studentId.slice(-4)}`,
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
                preferences: preferences,
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
                { type: 'LOGIN_SUCCESS', details: `User logged in: ${userInDb.email}`, timestamp: new Date().toISOString() },
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
                { type: 'LOGOUT', details: `User logged out: ${userEmail}`, timestamp: new Date().toISOString() },
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
        const studentId = `student-${Date.now()}`;
        const companionAgentId = `agent-companion-${Date.now()}`;

        const newCompanionAgent: Agent = {
            id: companionAgentId,
            name: `Companion Agent ${studentId.slice(-4)}`,
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
                { type: 'SYSTEM_ERROR_DETECTED', details: `Bug Agent caught error: ${errorMessage}`, timestamp: new Date().toISOString() },
                 ...state.securityLog,
            ]
        };
    case 'CLEAR_SYSTEM_ERROR':
        return { ...state, systemError: null };
    case 'START_LECTURE':
        return { ...state, liveLectureSession: { ...(state.liveLectureSession as LiveLectureSession), isActive: true } };
    case 'END_LECTURE':
        return { ...state, liveLectureSession: { isActive: false, attendeeAgentIds: [] } };
    case 'JOIN_LECTURE':
        if (!state.liveLectureSession || state.liveLectureSession.attendeeAgentIds.includes(action.payload)) return state;
        return { ...state, liveLectureSession: { ...state.liveLectureSession, attendeeAgentIds: [...state.liveLectureSession.attendeeAgentIds, action.payload] } };
    case 'LEAVE_LECTURE':
        if (!state.liveLectureSession) return state;
        return { ...state, liveLectureSession: { ...state.liveLectureSession, attendeeAgentIds: state.liveLectureSession.attendeeAgentIds.filter(id => id !== action.payload) } };
    case 'ADD_CURRICULUM_ITEM':
      return {
        ...state,
        curriculum: [...(state.curriculum || []), action.payload],
      };
    case 'REMOVE_CURRICULUM_ITEM':
      return {
        ...state,
        curriculum: (state.curriculum || []).filter(item => item.id !== action.payload),
      };
    default:
      return state;
  }
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedState = loadStateFromLocalStorage();
    if (savedState) {
      dispatch({ type: 'SET_STATE', payload: savedState as AppState });
    }
  }, []);

  useEffect(() => {
    saveStateToLocalStorage(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);