/**
 * Enhanced Supabase Error Handler
 * Intelligent error categorization, recovery strategies, and user-friendly handling
 */

import { logger } from '@/utils/logger';
import authRecoveryService from '@/services/core/AuthRecoveryService';

// Error categories for different handling strategies
export enum ErrorCategory {
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  RATE_LIMIT = 'rate_limit',
  SERVER = 'server',
  CLIENT = 'client',
  ENVIRONMENT = 'environment',
  UNKNOWN = 'unknown'
}

export enum RecoveryStrategy {
  IMMEDIATE_RETRY = 'immediate_retry',
  EXPONENTIAL_BACKOFF = 'exponential_backoff',
  TOKEN_REFRESH = 'token_refresh',
  FULL_RECOVERY = 'full_recovery',
  USER_ACTION_REQUIRED = 'user_action_required',
  NO_RECOVERY = 'no_recovery'
}

export interface ErrorAnalysis {
  category: ErrorCategory;
  strategy: RecoveryStrategy;
  isRecoverable: boolean;
  requiresUserAction: boolean;
  retryAfter?: number;
  userMessage: string;
  technicalMessage: string;
}

let errorCount = 0;
let lastErrorTime = 0;
const ERROR_THRESHOLD = 8; // Increased threshold for better resilience
const TIME_WINDOW = 10000; // 10 seconds window
const COOLDOWN_PERIOD = 60000; // 1 minute cooldown

// Track error patterns
const errorHistory: Array<{ error: any; timestamp: number; context: string }> = [];
const MAX_HISTORY_SIZE = 50;

/**
 * Helper functions for error categorization
 */
function isAuthenticationError(error: any): boolean {
  const message = error?.message || '';
  const authErrors = [
    'JWT expired',
    'Invalid JWT',
    'refresh_token_not_found',
    'Invalid API key',
    'Invalid login credentials',
    'Email not confirmed',
    'User not found',
    'Authentication',
    'Unauthorized'
  ];
  return authErrors.some(err => message.includes(err));
}

function isNetworkError(error: any): boolean {
  const message = error?.message || '';
  const networkErrors = [
    'Network',
    'fetch',
    'Connection',
    'timeout',
    'ECONNREFUSED',
    'ENOTFOUND',
    'ETIMEDOUT'
  ];
  return networkErrors.some(err => message.toLowerCase().includes(err.toLowerCase()));
}

function isRateLimitError(error: any): boolean {
  const code = error?.code || error?.status;
  const message = error?.message || '';
  return code === 429 || message.includes('rate limit') || message.includes('too many requests');
}

/**
 * Analyzes an error and determines the appropriate recovery strategy
 */
export function analyzeError(error: any, context: string = 'Unknown'): ErrorAnalysis {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  const errorCode = error?.code || error?.status;
  
  // Authentication errors
  if (isAuthenticationError(error)) {
    if (errorMessage.includes('JWT expired') || errorMessage.includes('refresh_token_not_found')) {
      return {
        category: ErrorCategory.AUTHENTICATION,
        strategy: RecoveryStrategy.TOKEN_REFRESH,
        isRecoverable: true,
        requiresUserAction: false,
        userMessage: 'Session expired. Attempting to refresh automatically...',
        technicalMessage: `Token refresh needed: ${errorMessage}`
      };
    }
    
    if (errorMessage.includes('Invalid login credentials')) {
      return {
        category: ErrorCategory.AUTHENTICATION,
        strategy: RecoveryStrategy.USER_ACTION_REQUIRED,
        isRecoverable: false,
        requiresUserAction: true,
        userMessage: 'Invalid email or password. Please check your credentials.',
        technicalMessage: errorMessage
      };
    }
    
    if (errorMessage.includes('Email not confirmed')) {
      return {
        category: ErrorCategory.AUTHENTICATION,
        strategy: RecoveryStrategy.USER_ACTION_REQUIRED,
        isRecoverable: false,
        requiresUserAction: true,
        userMessage: 'Please check your email and confirm your account.',
        technicalMessage: errorMessage
      };
    }
    
    if (errorMessage.includes('Invalid API key')) {
      return {
        category: ErrorCategory.ENVIRONMENT,
        strategy: RecoveryStrategy.FULL_RECOVERY,
        isRecoverable: true,
        requiresUserAction: false,
        retryAfter: 2000,
        userMessage: 'Connection issue detected. Attempting to reconnect...',
        technicalMessage: `API key issue: ${errorMessage}`
      };
    }
  }
  
  // Network errors
  if (isNetworkError(error)) {
    return {
      category: ErrorCategory.NETWORK,
      strategy: RecoveryStrategy.EXPONENTIAL_BACKOFF,
      isRecoverable: true,
      requiresUserAction: false,
      retryAfter: 1000,
      userMessage: 'Network connection issue. Retrying...',
      technicalMessage: `Network error: ${errorMessage}`
    };
  }
  
  // Rate limiting
  if (isRateLimitError(error)) {
    const retryAfter = error.retryAfter || 60000; // Default 1 minute
    return {
      category: ErrorCategory.RATE_LIMIT,
      strategy: RecoveryStrategy.EXPONENTIAL_BACKOFF,
      isRecoverable: true,
      requiresUserAction: false,
      retryAfter,
      userMessage: `Too many requests. Please wait ${Math.ceil(retryAfter / 1000)} seconds.`,
      technicalMessage: `Rate limited: ${errorMessage}`
    };
  }
  
  // Server errors (5xx)
  if (errorCode >= 500 && errorCode < 600) {
    return {
      category: ErrorCategory.SERVER,
      strategy: RecoveryStrategy.EXPONENTIAL_BACKOFF,
      isRecoverable: true,
      requiresUserAction: false,
      retryAfter: 5000,
      userMessage: 'Server temporarily unavailable. Retrying...',
      technicalMessage: `Server error ${errorCode}: ${errorMessage}`
    };
  }
  
  // Client errors (4xx)
  if (errorCode >= 400 && errorCode < 500) {
    return {
      category: ErrorCategory.CLIENT,
      strategy: RecoveryStrategy.NO_RECOVERY,
      isRecoverable: false,
      requiresUserAction: true,
      userMessage: 'Invalid request. Please try again or contact support.',
      technicalMessage: `Client error ${errorCode}: ${errorMessage}`
    };
  }
  
  // Unknown errors
  return {
    category: ErrorCategory.UNKNOWN,
    strategy: RecoveryStrategy.IMMEDIATE_RETRY,
    isRecoverable: true,
    requiresUserAction: false,
    retryAfter: 1000,
    userMessage: 'An unexpected error occurred. Retrying...',
    technicalMessage: `Unknown error: ${errorMessage}`
  };
}

/**
 * Attempts emergency recovery when error threshold is reached
 */
async function attemptEmergencyRecovery(context: string): Promise<void> {
  try {
    logger.info(`Attempting emergency recovery for ${context}`, {
      component: 'SupabaseErrorHandler',
      action: 'emergency_recovery_start',
      context
    });
    
    // Clear potentially stale tokens
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('sb-') || key.includes('supabase') || key.includes('auth-token'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      logger.debug(`Removed potentially stale token: ${key}`, {
        component: 'SupabaseErrorHandler',
        action: 'token_cleanup',
        key
      });
    });
    
    // Try to get recovery service if available
    try {
      const recoveryService = AuthRecoveryService.getInstance();
      if (recoveryService) {
        recoveryService.resetRecoveryState();
      }
    } catch (err) {
      // Recovery service may not be available yet
      logger.debug('Recovery service not available for emergency recovery', {
        component: 'SupabaseErrorHandler',
        action: 'recovery_service_unavailable'
      });
    }
    
    logger.info('Emergency recovery completed', {
      component: 'SupabaseErrorHandler',
      action: 'emergency_recovery_completed',
      context,
      tokensRemoved: keysToRemove.length
    });
    
  } catch (recoveryError) {
    logger.error('Emergency recovery failed', recoveryError as Error, {
      component: 'SupabaseErrorHandler',
      action: 'emergency_recovery_failed',
      context
    });
  }
}

/**
 * Shows user-friendly error messages
 */
function showErrorMessage(analysis: ErrorAnalysis, errorCount: number): void {
  // Prevent multiple alerts
  if (window.__supabaseErrorShown) {
    return;
  }
  
  window.__supabaseErrorShown = true;
  
  const message = `
    ⚠️ Connection Issue Detected
    
    ${analysis.userMessage}
    
    Error Count: ${errorCount}
    
    What you can try:
    1. Refresh the page
    2. Check your internet connection
    3. Clear browser cache and cookies
    4. Try again in a few minutes
    
    If the problem persists, please contact support.
  `;
  
  logger.error(message, undefined, {
    component: 'SupabaseErrorHandler',
    action: 'user_message_shown',
    category: analysis.category,
    strategy: analysis.strategy
  });
  
  // Reset the flag after 30 seconds to allow new messages
  setTimeout(() => {
    if (typeof window !== 'undefined') {
      window.__supabaseErrorShown = false;
    }
  }, 30000);
}

/**
 * Enhanced error handler with intelligent recovery
 */
export async function handleSupabaseError(
  error: any, 
  context: string = 'Unknown',
  options: {
    enableRecovery?: boolean;
    showUserMessages?: boolean;
    maxRetries?: number;
  } = {}
): Promise<{
  shouldRetry: boolean;
  shouldRecover: boolean;
  analysis: ErrorAnalysis;
  waitTime?: number;
}> {
  const {
    enableRecovery = true,
    showUserMessages = true,
    maxRetries = ERROR_THRESHOLD
  } = options;
  
  const now = Date.now();
  
  // Reset counter if outside time window
  if (now - lastErrorTime > TIME_WINDOW) {
    errorCount = 0;
  }
  
  errorCount++;
  lastErrorTime = now;
  
  // Add to error history
  errorHistory.push({ error, timestamp: now, context });
  if (errorHistory.length > MAX_HISTORY_SIZE) {
    errorHistory.shift();
  }
  
  // Analyze the error
  const analysis = analyzeError(error, context);
  
  logger.warn(`Supabase error in ${context}`, {
    component: 'SupabaseErrorHandler',
    action: 'error_handled',
    context,
    errorCount,
    maxRetries,
    category: analysis.category,
    strategy: analysis.strategy,
    isRecoverable: analysis.isRecoverable,
    errorMessage: analysis.technicalMessage
  });
  
  // Check if we've hit the error threshold
  if (errorCount >= maxRetries) {
    logger.error(`Error threshold reached in ${context}. Entering cooldown.`, undefined, {
      component: 'SupabaseErrorHandler',
      action: 'error_threshold_reached',
      context,
      errorCount,
      maxRetries
    });
    
    // Attempt emergency recovery for authentication errors
    if (analysis.category === ErrorCategory.AUTHENTICATION && enableRecovery) {
      await attemptEmergencyRecovery(context);
    }
    
    // Show user-friendly message
    if (showUserMessages && typeof window !== 'undefined') {
      showErrorMessage(analysis, errorCount);
    }
    
    return {
      shouldRetry: false,
      shouldRecover: analysis.category === ErrorCategory.AUTHENTICATION && enableRecovery,
      analysis,
    };
  }
  
  // Determine if we should retry or recover
  const shouldRetry = analysis.isRecoverable && 
                     analysis.strategy !== RecoveryStrategy.USER_ACTION_REQUIRED &&
                     analysis.strategy !== RecoveryStrategy.NO_RECOVERY;
  
  const shouldRecover = enableRecovery && 
                       analysis.category === ErrorCategory.AUTHENTICATION &&
                       (analysis.strategy === RecoveryStrategy.TOKEN_REFRESH ||
                        analysis.strategy === RecoveryStrategy.FULL_RECOVERY);
  
  return {
    shouldRetry,
    shouldRecover,
    analysis,
    waitTime: analysis.retryAfter
  };
}

/**
 * Gets error statistics and patterns
 */
export function getErrorStatistics(): {
  currentErrorCount: number;
  errorHistory: Array<{ error: any; timestamp: number; context: string }>;
  lastErrorTime: number;
  isInCooldown: boolean;
  timeUntilCooldownEnd: number;
} {
  const now = Date.now();
  const isInCooldown = errorCount >= ERROR_THRESHOLD && 
                      (now - lastErrorTime) < COOLDOWN_PERIOD;
  const timeUntilCooldownEnd = isInCooldown ? 
    COOLDOWN_PERIOD - (now - lastErrorTime) : 0;
  
  return {
    currentErrorCount: errorCount,
    errorHistory: [...errorHistory],
    lastErrorTime,
    isInCooldown,
    timeUntilCooldownEnd
  };
}

// Window type extension
declare global {
  interface Window {
    __supabaseErrorShown?: boolean;
  }
}

/**
 * Reset error count after cooldown or manual reset
 */
export function resetErrorCount(): void {
  errorCount = 0;
  lastErrorTime = 0;
  errorHistory.length = 0;
  
  if (typeof window !== 'undefined') {
    window.__supabaseErrorShown = false;
  }
  
  logger.info('Error count and history reset', {
    component: 'SupabaseErrorHandler',
    action: 'error_count_reset'
  });
}

/**
 * Legacy function for backward compatibility
 */
export function handleSupabaseErrorLegacy(error: any, context: string = 'Unknown') {
  handleSupabaseError(error, context, {
    enableRecovery: false,
    showUserMessages: false
  }).then(result => {
    if (!result.shouldRetry) {
      return null;
    }
    return error;
  }).catch(() => error);
  
  return error;
}