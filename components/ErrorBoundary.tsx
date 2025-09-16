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
