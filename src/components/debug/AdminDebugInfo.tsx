/**
 * Admin Debug Info Component
 * Shows admin functionality status for debugging in development
 */

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export const AdminDebugInfo: React.FC = () => {
  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  const { user, isAuthenticated } = useAuth();

  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50">
      <AlertDescription className="text-blue-800">
        <div className="space-y-1">
          <div className="font-semibold">🔧 Admin Debug Info (Dev Only)</div>
          <div className="text-sm space-y-1">
            <div>Auth Status: {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</div>
            <div>User Email: {user?.email || 'None'}</div>
            <div>Environment: {import.meta.env.DEV ? 'Development' : 'Production'}</div>
            <div className="text-xs mt-2 p-2 bg-blue-100 rounded">
              <div className="font-medium">Admin Users Status:</div>
              <div>• Edge Function will fall back to mock data in development</div>
              <div>• Authentication errors are gracefully handled</div>
              <div>• Mock users include admin, regular, and banned examples</div>
            </div>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default AdminDebugInfo;