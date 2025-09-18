
import React, { useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import LoginView from './components/LoginView';
import StudentPortal from './components/StudentPortal';
import ParentTeacherPortal from './components/ParentTeacherPortal';
import AdminPortal from './components/AdminPortal';
import ToastContainer from './components/Toast';
import { ChatWidget } from './components/ChatWidget';
import ErrorBoundary from './components/ErrorBoundary';
import SystemAnomalyView from './components/SystemAnomalyView';
import EnrollmentView from './components/EnrollmentView';

const App: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { currentUser, systemError, isEnrolling, isOfflineMode } = state;

  useEffect(() => {
    const handleOnline = () => {
      if (isOfflineMode) { // Only act if we were previously offline
        dispatch({ type: 'SET_ONLINE_MODE' });
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'Connection restored. Reconnected to premium AI services.', type: 'success' } });
      }
    };

    const handleOffline = () => {
      if (!isOfflineMode) { // Only act if we were previously online
        dispatch({ type: 'SET_OFFLINE_MODE' });
        dispatch({ type: 'SHOW_TOAST', payload: { message: 'Connection lost. Using local RAG agent for responses.', type: 'info' } });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch, isOfflineMode]);

  const renderPortal = () => {
    if (systemError) {
      return <SystemAnomalyView />;
    }

    if (isEnrolling) {
      return <EnrollmentView />;
    }
    
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
      <ErrorBoundary>
        {renderPortal()}
      </ErrorBoundary>
      {/* The ChatWidget is now exclusive to the Parent/Teacher/Student portals, as the new Studio has its own context. */}
      {currentUser && currentUser.role !== 'admin' && !systemError && !isEnrolling && <ChatWidget currentUserRole={currentUser.role} />}
      <ToastContainer />
    </div>
  );
};

export default App;
