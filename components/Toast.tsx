import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from './icons';

const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000); // Auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
    error: <XCircleIcon className="w-6 h-6 text-red-400" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-400" />,
  };

  const borderColors = {
    success: 'border-green-500',
    error: 'border-red-500',
    info: 'border-blue-500',
  };

  return (
    <div
      className={`relative w-full max-w-sm p-4 bg-brand-light-gray border-l-4 ${borderColors[type]} rounded-r-lg shadow-lg flex items-center space-x-4 animate-fade-in-right`}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-brand-text">{message}</p>
      </div>
      <button onClick={onDismiss} className="text-brand-text-secondary hover:text-white">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { toasts } = state;

  const handleDismiss = (id: number) => {
    dispatch({ type: 'HIDE_TOAST', payload: id });
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => handleDismiss(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;