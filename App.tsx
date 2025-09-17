import React from 'react';
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
  const { state } = useAppContext();
  const { currentUser, systemError, isEnrolling } = state;

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
      {currentUser && !systemError && !isEnrolling && <ChatWidget currentUserRole={currentUser.role} />}
      <ToastContainer />
    </div>
  );
};

export default App;