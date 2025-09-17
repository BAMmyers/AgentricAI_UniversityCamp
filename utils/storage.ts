import { AppState } from '../types/index';

const LOCAL_STORAGE_KEY = 'agentricai-app-state-v2';

/**
 * Saves the application state to localStorage after serialization and compression.
 * Note: Uses Base64 encoding as a lightweight compression/encoding method.
 * @param state The application state to save.
 */
export const saveStateToLocalStorage = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    // 'Compress' the state using btoa (binary to ASCII)
    const compressedState = btoa(unescape(encodeURIComponent(serializedState)));
    localStorage.setItem(LOCAL_STORAGE_KEY, compressedState);
  } catch (error) {
    console.error("Failed to save and compress state to localStorage", error);
  }
};

/**
 * Loads the application state from localStorage, decompressing it first.
 * @returns The loaded application state or null if not found or an error occurs.
 */
export const loadStateFromLocalStorage = (): Partial<AppState> | null => {
  try {
    const compressedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (compressedState === null) {
      return null;
    }
    // 'Decompress' the state using atob (ASCII to binary)
    const serializedState = decodeURIComponent(escape(atob(compressedState)));
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Failed to load and decompress state from localStorage", error);
    // If there's an error (e.g., corrupted data), clear it to prevent loops
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return null;
  }
};