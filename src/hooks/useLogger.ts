/**
 * React hook for component-aware logging
 * Provides automatic context injection with component names and user information
 */

import { useCallback, useContext, useMemo } from 'react';
import { logger, LogContext, ContextLogger } from '@/utils/logger';
import AuthContext from '@/contexts/AuthContext';

interface UseLoggerOptions {
  component?: string;
  action?: string;
  includeUserContext?: boolean;
}

interface UseLoggerReturn {
  log: ContextLogger;
  logDebug: (message: string, context?: LogContext) => void;
  logInfo: (message: string, context?: LogContext) => void;
  logWarn: (message: string, context?: LogContext) => void;
  logError: (message: string, error?: Error, context?: LogContext) => void;
  withAction: (action: string) => ContextLogger;
}

export function useLogger(options: UseLoggerOptions = {}): UseLoggerReturn {
  const { user } = useContext(AuthContext);
  const { 
    component, 
    action, 
    includeUserContext = true 
  } = options;

  // Build base context
  const baseContext = useMemo((): LogContext => {
    const context: LogContext = {};

    // Add component context
    if (component) {
      context.component = component;
    }

    // Add action context
    if (action) {
      context.action = action;
    }

    // Add user context if enabled and available
    if (includeUserContext && user) {
      context.userId = user.id;
      context.userEmail = user.email;
    }

    return context;
  }, [component, action, includeUserContext, user?.id, user?.email]);

  // Create context logger with base context
  const contextLogger = useMemo(() => {
    return logger.withContext(baseContext);
  }, [baseContext]);

  // Convenience methods
  const logDebug = useCallback((message: string, additionalContext?: LogContext) => {
    contextLogger.debug(message, additionalContext);
  }, [contextLogger]);

  const logInfo = useCallback((message: string, additionalContext?: LogContext) => {
    contextLogger.info(message, additionalContext);
  }, [contextLogger]);

  const logWarn = useCallback((message: string, additionalContext?: LogContext) => {
    contextLogger.warn(message, additionalContext);
  }, [contextLogger]);

  const logError = useCallback((message: string, error?: Error, additionalContext?: LogContext) => {
    contextLogger.error(message, error, additionalContext);
  }, [contextLogger]);

  // Create action-specific logger
  const withAction = useCallback((actionName: string): ContextLogger => {
    return logger.withContext({ ...baseContext, action: actionName });
  }, [baseContext]);

  return {
    log: contextLogger,
    logDebug,
    logInfo,
    logWarn,
    logError,
    withAction
  };
}

/**
 * Hook for logging user actions and interactions
 */
export function useActionLogger(component: string) {
  const baseLogger = useLogger({ component, includeUserContext: true });

  const logUserAction = useCallback((
    action: string, 
    message: string, 
    metadata?: Record<string, any>
  ) => {
    baseLogger.logInfo(message, { action }, metadata);
  }, [baseLogger]);

  const logUserError = useCallback((
    action: string,
    message: string,
    error: Error,
    metadata?: Record<string, any>
  ) => {
    baseLogger.logError(message, error, { action }, metadata);
  }, [baseLogger]);

  return {
    ...baseLogger,
    logUserAction,
    logUserError
  };
}

/**
 * Hook for logging API calls and service interactions  
 */
export function useServiceLogger(service: string) {
  const baseLogger = useLogger({ component: service, includeUserContext: false });

  const logApiCall = useCallback((
    method: string,
    endpoint: string,
    duration?: number,
    metadata?: Record<string, any>
  ) => {
    const message = `API ${method} ${endpoint}${duration ? ` (${duration}ms)` : ''}`;
    baseLogger.logInfo(message, { action: 'api_call', method, endpoint }, { duration, ...metadata });
  }, [baseLogger]);

  const logApiError = useCallback((
    method: string,
    endpoint: string,
    error: Error,
    duration?: number,
    metadata?: Record<string, any>
  ) => {
    const message = `API ${method} ${endpoint} failed${duration ? ` after ${duration}ms` : ''}`;
    baseLogger.logError(message, error, { action: 'api_error', method, endpoint }, { duration, ...metadata });
  }, [baseLogger]);

  return {
    ...baseLogger,
    logApiCall,
    logApiError
  };
}