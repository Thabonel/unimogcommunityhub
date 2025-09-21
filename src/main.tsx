
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'
import './index.css'
import './styles/global.css'

// Initialize PDF.js worker early for better PDF viewer reliability
import './utils/pdfWorkerSetup'

// Initialize i18n for multilingual support
import './lib/i18n'

console.log('=== MAIN.TSX STARTING ===');

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    console.log('React app mounted successfully');
  } catch (error) {
    console.error('Error rendering React app:', error);
  }
}
