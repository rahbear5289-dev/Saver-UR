import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {PUBLISHABLE_KEY ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary p-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Setup Required</h1>
          <p className="mb-4">Please add your Clerk Publishable Key to the <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file:</p>
          <pre className="bg-gray-800 text-white p-4 rounded text-left text-sm overflow-x-auto">
            VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
          </pre>
          <p className="mt-4 text-sm text-gray-500">Restart the dev server after adding it.</p>
        </div>
      </div>
    )}
  </React.StrictMode>,
)
