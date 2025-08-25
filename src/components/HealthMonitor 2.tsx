/**
 * Runtime Health Monitor
 * Displays real-time authentication and API health status
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type HealthStatus = 'healthy' | 'warning' | 'error' | 'checking';

interface HealthState {
  status: HealthStatus;
  message: string;
  lastCheck: Date;
  details?: {
    supabaseConnection: boolean;
    authConfigured: boolean;
    sessionValid: boolean;
    apiKeyValid: boolean;
  };
}

export const HealthMonitor: React.FC = () => {
  // NEVER show in production - this is a debug tool only
  if (import.meta.env.PROD) {
    return null;
  }

  const [health, setHealth] = useState<HealthState>({
    status: 'checking',
    message: 'Initializing...',
    lastCheck: new Date(),
  });
  const [isVisible, setIsVisible] = useState(false);

  const checkHealth = async () => {
    try {
      const newHealth: HealthState = {
        status: 'checking',
        message: 'Checking...',
        lastCheck: new Date(),
        details: {
          supabaseConnection: false,
          authConfigured: false,
          sessionValid: false,
          apiKeyValid: false,
        },
      };

      // Check 1: Environment variables
      const hasUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      newHealth.details!.authConfigured = hasUrl && hasKey;

      if (!hasUrl || !hasKey) {
        setHealth({
          ...newHealth,
          status: 'error',
          message: 'Missing environment configuration',
        });
        return;
      }

      // Check 2: Supabase connection
      try {
        const { error: pingError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);

        if (pingError?.message?.includes('Invalid API key')) {
          setHealth({
            ...newHealth,
            status: 'error',
            message: 'Invalid API key detected',
            details: {
              ...newHealth.details!,
              apiKeyValid: false,
            },
          });
          
          // Log for monitoring
          console.error('❌ Health Monitor: Invalid API key detected', {
            timestamp: new Date().toISOString(),
            error: pingError.message,
          });
          
          return;
        }

        newHealth.details!.supabaseConnection = !pingError;
        newHealth.details!.apiKeyValid = !pingError || !pingError.message?.includes('Invalid API key');
      } catch (error) {
        newHealth.details!.supabaseConnection = false;
      }

      // Check 3: Session validity
      try {
        const { data: { session } } = await supabase.auth.getSession();
        newHealth.details!.sessionValid = !!session;
      } catch (error) {
        newHealth.details!.sessionValid = false;
      }

      // Determine overall status
      if (
        newHealth.details!.authConfigured &&
        newHealth.details!.supabaseConnection &&
        newHealth.details!.apiKeyValid
      ) {
        setHealth({
          ...newHealth,
          status: 'healthy',
          message: 'All systems operational',
        });
      } else if (newHealth.details!.authConfigured) {
        setHealth({
          ...newHealth,
          status: 'warning',
          message: 'Connection issues detected',
        });
      } else {
        setHealth({
          ...newHealth,
          status: 'error',
          message: 'Configuration error',
        });
      }
    } catch (error) {
      setHealth({
        status: 'error',
        message: 'Health check failed',
        lastCheck: new Date(),
      });
    }
  };

  useEffect(() => {
    // Initial check
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    // Show monitor if there are issues
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(showTimer);
    };
  }, []);

  // Only show if there are issues or in development
  if (!isVisible || (health.status === 'healthy' && import.meta.env.PROD)) {
    return null;
  }

  const getStatusIcon = () => {
    switch (health.status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'checking':
        return <RefreshCw className="h-4 w-4 text-gray-500 animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'checking':
        return 'bg-gray-500';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={checkHealth}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              {getStatusIcon()}
              <span className="text-xs font-medium">
                {health.status === 'checking' ? 'Checking...' : 'System Status'}
              </span>
              <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-sm">
          <div className="space-y-2">
            <div className="font-semibold">{health.message}</div>
            {health.details && (
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  {health.details.authConfigured ? '✅' : '❌'} Environment configured
                </div>
                <div className="flex items-center gap-2">
                  {health.details.supabaseConnection ? '✅' : '❌'} Database connection
                </div>
                <div className="flex items-center gap-2">
                  {health.details.apiKeyValid ? '✅' : '❌'} API key valid
                </div>
                <div className="flex items-center gap-2">
                  {health.details.sessionValid ? '✅' : '❔'} Session active
                </div>
              </div>
            )}
            <div className="text-xs text-gray-500">
              Last check: {health.lastCheck.toLocaleTimeString()}
            </div>
            <button
              onClick={checkHealth}
              className="text-xs text-blue-500 hover:text-blue-600"
            >
              Check now
            </button>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HealthMonitor;