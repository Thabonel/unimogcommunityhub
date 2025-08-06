/**
 * Environment Status Component
 * Shows environment variable status for debugging in development
 */

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SUPABASE_CONFIG, MAPBOX_CONFIG } from '@/config/env';

export const EnvironmentStatus: React.FC = () => {
  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  const envStatus = {
    supabaseUrl: !!SUPABASE_CONFIG.url,
    supabaseAnonKey: !!SUPABASE_CONFIG.anonKey,
    supabaseProjectId: !!SUPABASE_CONFIG.projectId,
    mapboxToken: !!MAPBOX_CONFIG.accessToken,
  };

  const allGood = Object.values(envStatus).every(Boolean);
  const missingVars = Object.entries(envStatus)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (allGood) {
    // Don't show success message - only show errors
    return null;
  }

  return (
    <Alert className="mb-4 border-red-200 bg-red-50">
      <AlertDescription className="text-red-800">
        <div className="space-y-2">
          <div className="font-semibold">🚨 Missing Environment Variables</div>
          <div>Missing: {missingVars.join(', ')}</div>
          <div className="text-sm">
            <div className="font-medium">Quick Fix for Lovable:</div>
            <div>1. Go to Environment Variables settings</div>
            <div>2. Add the missing VITE_* variables</div>
            <div>3. Restart the preview</div>
            <div className="mt-2 text-xs">
              See LOVABLE_AI_INSTRUCTIONS.md for exact values to add
            </div>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default EnvironmentStatus;