/**
 * Global Error Handler
 * Provides centralized error handling and recovery
 */

import { toast } from 'sonner';
import { logger } from '@/utils/logger';

// Error types
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTH = 'AUTH',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN'
}

export interface ErrorDetails {
  type: ErrorType;
  message: string;
  originalError?: Error;
  retryable: boolean;
  retryAction?: () => Promise<any>;
  context?: Record<string, any>;
}

// Error categorization
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorQueue: ErrorDetails[] = [];
  private isProcessing = false;
  
  private constructor() {
    this.setupGlobalHandlers();
  }
  
  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }
  
  private setupGlobalHandlers() {
    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        logger.error('Unhandled promise rejection', event.reason instanceof Error ? event.reason : new Error(String(event.reason)), { component: 'ErrorHandler', action: 'unhandled_promise_rejection' });
        this.handle(event.reason);
        event.preventDefault();
      });
      
      // Handle global errors
      window.addEventListener('error', (event) => {
        logger.error('Global error', event.error, { component: 'ErrorHandler', action: 'global_error' });
        this.handle(event.error);
      });
    }
  }
  
  // Main error handler
  handle(error: any, context?: Record<string, any>): ErrorDetails {
    const errorDetails = this.categorizeError(error, context);
    
    // Add to queue for batch processing
    this.errorQueue.push(errorDetails);
    
    // Process queue
    this.processErrorQueue();
    
    // Show user feedback
    this.showUserFeedback(errorDetails);
    
    // Log to monitoring
    this.logError(errorDetails);
    
    return errorDetails;
  }
  
  private categorizeError(error: any, context?: Record<string, any>): ErrorDetails {
    const message = error?.message || error?.toString() || 'Unknown error';
    
    // Network errors
    if (
      message.includes('Network') ||
      message.includes('fetch') ||
      error?.code === 'NETWORK_ERROR'
    ) {
      return {
        type: ErrorType.NETWORK,
        message: 'Connection issue. Please check your internet.',
        originalError: error,
        retryable: true,
        context
      };
    }
    
    // Auth errors
    if (
      message.includes('JWT') ||
      message.includes('auth') ||
      message.includes('401') ||
      error?.status === 401
    ) {
      return {
        type: ErrorType.AUTH,
        message: 'Authentication required. Please sign in.',
        originalError: error,
        retryable: false,
        context
      };
    }
    
    // Validation errors
    if (
      message.includes('validation') ||
      message.includes('invalid') ||
      error?.status === 400
    ) {
      return {
        type: ErrorType.VALIDATION,
        message: 'Please check your input and try again.',
        originalError: error,
        retryable: false,
        context
      };
    }
    
    // Permission errors
    if (
      message.includes('permission') ||
      message.includes('forbidden') ||
      error?.status === 403
    ) {
      return {
        type: ErrorType.PERMISSION,
        message: 'You don\'t have permission to perform this action.',
        originalError: error,
        retryable: false,
        context
      };
    }
    
    // Not found errors
    if (
      message.includes('not found') ||
      error?.status === 404
    ) {
      return {
        type: ErrorType.NOT_FOUND,
        message: 'The requested resource was not found.',
        originalError: error,
        retryable: false,
        context
      };
    }
    
    // Rate limit errors
    if (
      message.includes('rate limit') ||
      message.includes('too many') ||
      error?.status === 429
    ) {
      return {
        type: ErrorType.RATE_LIMIT,
        message: 'Too many requests. Please wait a moment.',
        originalError: error,
        retryable: true,
        context
      };
    }
    
    // Server errors
    if (
      error?.status >= 500 ||
      message.includes('server')
    ) {
      return {
        type: ErrorType.SERVER,
        message: 'Server error. Our team has been notified.',
        originalError: error,
        retryable: true,
        context
      };
    }
    
    // Unknown errors
    return {
      type: ErrorType.UNKNOWN,
      message: 'An unexpected error occurred.',
      originalError: error,
      retryable: true,
      context
    };
  }
  
  private async processErrorQueue() {
    if (this.isProcessing || this.errorQueue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    while (this.errorQueue.length > 0) {
      const error = this.errorQueue.shift();
      if (error) {
        await this.processError(error);
      }
    }
    
    this.isProcessing = false;
  }
  
  private async processError(error: ErrorDetails) {
    // Implement recovery strategies based on error type
    switch (error.type) {
      case ErrorType.NETWORK:
        // Wait and retry
        if (error.retryAction) {
          await this.retryWithBackoff(error.retryAction);
        }
        break;
        
      case ErrorType.AUTH:
        // Redirect to login
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
          // Don't redirect if already on login page
          if (!window.location.pathname.includes('/login')) {
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
          }
        }
        break;
        
      case ErrorType.RATE_LIMIT:
        // Wait before allowing retry
        await this.delay(5000);
        break;
        
      default:
        // Log for investigation
        logger.error('Unhandled error type', error instanceof Error ? error : new Error(String(error)), { component: 'ErrorHandler', action: 'unhandled_error_type' });
    }
  }
  
  private async retryWithBackoff(
    action: () => Promise<any>,
    maxRetries = 3
  ): Promise<any> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await action();
        toast.success('Action completed successfully');
        return result;
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
        await this.delay(Math.pow(2, i) * 1000);
      }
    }
  }
  
  private showUserFeedback(error: ErrorDetails) {
    // Show toast notification based on error type
    switch (error.type) {
      case ErrorType.NETWORK:
        toast.error(error.message, {
          action: error.retryable ? {
            label: 'Retry',
            onClick: () => error.retryAction?.()
          } : undefined
        });
        break;
        
      case ErrorType.AUTH:
        toast.error(error.message, {
          duration: 5000
        });
        break;
        
      case ErrorType.VALIDATION:
        toast.warning(error.message);
        break;
        
      case ErrorType.PERMISSION:
        toast.error(error.message);
        break;
        
      case ErrorType.RATE_LIMIT:
        toast.warning(error.message, {
          duration: 10000
        });
        break;
        
      default:
        toast.error(error.message);
    }
  }
  
  private logError(error: ErrorDetails) {
    // In production, send to monitoring service
    if (import.meta.env.PROD) {
      const errorLog = {
        type: error.type,
        message: error.message,
        stack: error.originalError?.stack,
        context: error.context,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
      };
      
      // Send to monitoring endpoint
      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorLog)
      }).catch(err => {
        // Avoid recursive logging - use fallback console.error for logger failures
        console.error('Failed to log error:', err);
      });
    }
    
    // Always log to console in development
    if (!import.meta.env.PROD) {
      console.group(`🔴 ${error.type} Error`);
      logger.error('Enhanced error details', error.originalError || new Error(error.message), { 
        component: 'ErrorHandler', 
        action: 'enhanced_error_log',
        message: error.message,
        context: error.context
      });
      console.groupEnd();
    }
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Public methods
  
  handleNetworkError(error: Error, retryAction?: () => Promise<any>) {
    return this.handle(error, { type: 'network', retryAction });
  }
  
  handleAuthError(error: Error) {
    return this.handle(error, { type: 'auth' });
  }
  
  handleValidationError(message: string, fields?: Record<string, string>) {
    return this.handle(new Error(message), { type: 'validation', fields });
  }
  
  clearErrors() {
    this.errorQueue = [];
  }
}

// Singleton export
export const errorHandler = ErrorHandler.getInstance();

// React hook for error handling
export function useErrorHandler() {
  return {
    handleError: (error: any, context?: Record<string, any>) => {
      return errorHandler.handle(error, context);
    },
    handleNetworkError: (error: Error, retryAction?: () => Promise<any>) => {
      return errorHandler.handleNetworkError(error, retryAction);
    },
    handleAuthError: (error: Error) => {
      return errorHandler.handleAuthError(error);
    },
    handleValidationError: (message: string, fields?: Record<string, string>) => {
      return errorHandler.handleValidationError(message, fields);
    }
  };
}