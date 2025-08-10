/**
 * Test page for the new logging system
 */

import { useEffect } from 'react';
import { useLogger, useActionLogger, useServiceLogger } from '@/hooks/useLogger';
import { logger } from '@/utils/logger';

export function TestLogging() {
  // Test hook-based logging with component context
  const { logDebug, logInfo, logWarn, logError, withAction } = useLogger({
    component: 'TestLogging',
    action: 'page_load'
  });

  // Test action-specific logging
  const actionLogger = useActionLogger('TestLogging');
  
  // Test service logging
  const serviceLogger = useServiceLogger('TestService');

  useEffect(() => {
    // Test all logging levels
    logDebug('Debug message from TestLogging page');
    logInfo('Info message from TestLogging page');
    logWarn('Warning message from TestLogging page');
    logError('Error message from TestLogging page', new Error('Test error'));

    // Test direct logger usage
    logger.debug('Direct debug message');
    logger.info('Direct info message');
    logger.warn('Direct warn message');
    logger.error('Direct error message', new Error('Direct test error'));

    // Test action logger
    actionLogger.logUserAction('test_action', 'User performed test action');
    actionLogger.logUserError('test_action', 'User action failed', new Error('Action error'));

    // Test service logger
    serviceLogger.logApiCall('GET', '/api/test', 150);
    serviceLogger.logApiError('POST', '/api/test', new Error('API error'), 300);

    // Test context logger
    const contextualLogger = withAction('specific_action');
    contextualLogger.info('Message with specific action context');

    // Test environment detection
    logger.info(`Logging system initialized - Environment: ${import.meta.env.DEV ? 'development' : 'production'}`);
    logger.info(`Session ID: ${logger.getSessionId()}`);
  }, [logDebug, logInfo, logWarn, logError, withAction, actionLogger, serviceLogger]);

  const handleTestError = () => {
    try {
      throw new Error('Intentional test error');
    } catch (error) {
      logError('Caught test error', error as Error, { userAction: 'button_click' });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Logging System Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Instructions</h2>
          <p className="text-sm text-gray-600">
            1. Open browser console to see logging output<br/>
            2. In development: You'll see detailed, formatted logs<br/>
            3. In production build: You'll see structured JSON logs<br/>
            4. Check the browser console for various log levels and context
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Environment Info</h2>
          <p className="text-sm">
            Mode: {import.meta.env.DEV ? 'Development' : 'Production'}<br/>
            Session ID: {logger.getSessionId()}
          </p>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Test Actions</h2>
          <button 
            onClick={handleTestError}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Test Error Logging
          </button>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">What to Look For</h2>
          <ul className="text-sm space-y-1">
            <li>• Debug messages (only in development)</li>
            <li>• Info messages with component context</li>
            <li>• Warning messages</li>
            <li>• Error messages with stack traces</li>
            <li>• Structured context (component, action, userId if logged in)</li>
            <li>• Session ID consistency</li>
            <li>• API call logging examples</li>
          </ul>
        </div>
      </div>
    </div>
  );
}