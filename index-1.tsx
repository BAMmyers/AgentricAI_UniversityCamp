import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: The main component is AgenticStudio, not AgenticStudioApp, and the path needs to be corrected.
import AgenticStudio from './components/AgenticStudio';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AgenticStudio />
    </ErrorBoundary>
  </React.StrictMode>
);
