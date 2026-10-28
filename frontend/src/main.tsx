import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { runReasonValidationSuite } from './tests/algorithmReason.test.ts';

// Mandatory Quality Assurance: Validate that 100% of algorithm steps produce a non-empty reason
try {
  runReasonValidationSuite();
} catch (err) {
  console.error('Critical Algorithm Reason Validation Failure:', err);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
