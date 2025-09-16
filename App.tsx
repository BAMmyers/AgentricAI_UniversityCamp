import React from 'react';
import { useAppContext } from './context/AppContext';
import LoginView from './components/LoginView';
import StudentPortal from './components/StudentPortal';
import ParentTeacherPortal from './components/ParentTeacherPortal';
import AdminPortal from './components/AdminPortal';
import ToastContainer from './components/Toast';
import { ChatWidget } from './components/ChatWidget';
import ErrorBoundary from './components/ErrorBoundary';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const { state } = useAppContext();
  const { currentUser, systemError } = state;

  const renderPortal = () => {
    if (systemError) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center p-4">
          <div>
            <SparklesIcon className="w-16 h-16 mx-auto text-red-500 mb-4"/>
            <h1 className="text-2xl font-bold text-white">A System Anomaly Occurred</h1>
            <p className="text-brand-text-secondary mt-2">Our systems have detected an unexpected issue. The Mechanic Agent has been dispatched to investigate.</p>
            <p className="font-mono text-xs text-red-400 mt-4 bg-brand-gray p-2 rounded">{systemError.error.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-brand-primary hover:bg-brand-accent text-white font-bold py-2 px-4 rounded"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
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
      {currentUser && !systemError && <ChatWidget currentUserRole={currentUser.role} />}
      <ToastContainer />
    </div>
  );
};

export default App;
