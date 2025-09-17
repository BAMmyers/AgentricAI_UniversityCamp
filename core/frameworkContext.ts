// This file explains the core technical frameworks of the AgentricAI application for the AI assistant.

export const frameworkContext = `
// --- FRAMEWORK & STATE MANAGEMENT CONTEXT ---

// **1. Global State Management ('context/AppContext.tsx')**
// The entire application's state is managed by a single, global React Context.
//    - **Provider:** 'AppProvider' wraps the root 'App' component.
//    - **State Shape:** The global state is defined by the 'AppState' interface in 'types/index.ts'. It contains all users, agents, workflows, students, curriculum, security logs, etc.
//    - **State Updates:** State is updated using a 'useReducer' hook ('appReducer'). All possible state changes are defined as discriminated unions in the 'Action' type. To modify state, you dispatch an action object (e.g., dispatch({ type: 'ADD_AGENT', payload: newAgent })). The reducer contains the immutable logic for handling each action type.

// **2. Data Persistence & Optimization ('utils/storage.ts')**
// The global state is automatically persisted to the browser's 'localStorage'.
//    - A dedicated utility, 'storage.ts', handles all interactions with 'localStorage'.
//    - **Optimization:** Before saving, the state is serialized to JSON and then compressed using Base64 encoding ('btoa') to reduce the storage footprint. It's decompressed ('atob') upon loading. This is a key performance feature.
//    - The 'AppContext' uses a 'useEffect' hook to save the state whenever it changes and to load it on initial application mount.

// **3. UI Resilience Framework**
// The application is designed to be resilient to errors.
//    - **'ErrorBoundary.tsx'**: This component wraps the main application router. If any component within it throws a rendering error, it catches the error and prevents a white-screen crash.
//    - **'SET_SYSTEM_ERROR' Action:** The 'ErrorBoundary' dispatches a global action to record the error in the 'AppState'.
//    - **'SystemStatusBar.tsx'**: This component listens for a 'systemError' in the global state. When an error is present, it renders a non-intrusive status bar at the top of the screen, informing the user that the "Bug" agent has detected an anomaly and providing a one-click fix (reloading the app).

// **4. Global Notification System ('components/Toast.tsx')**
// A non-intrusive "toast" notification system is available globally.
//    - Any component can dispatch a 'SHOW_TOAST' action with a message and type ('success', 'error', 'info').
//    - The 'ToastContainer' component, rendered in 'App.tsx', listens for changes to the 'toasts' array in the global state and displays the notifications.
`;