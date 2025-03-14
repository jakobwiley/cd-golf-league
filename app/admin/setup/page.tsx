import { Suspense } from 'react';
import SetupClient from './SetupClient';

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Data Setup</h1>
        <p className="text-xl mb-8">
          Use this page to initialize or reset all data for the application. This is especially useful for the production environment.
        </p>
        
        <Suspense fallback={<div className="text-xl">Loading setup interface...</div>}>
          <SetupClient />
        </Suspense>
      </div>
    </div>
  );
} 