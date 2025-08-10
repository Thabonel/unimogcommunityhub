/**
 * Environment-aware logging service for UnimogCommunityHub
 * 
 * Features:
 * - Environment-aware: full logging in dev, filtered in production
 * - Structured logging with context, timestamps, and log levels
 * - Automatic error serialization and context preservation
 * - Production-ready with performance considerations
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogContext {
  component?: string;
  userId?: string;
  sessionId?: string;
  traceId?: string;
  action?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
    cause?: any;
  };
  metadata?: Record<string, any>;
}

class Logger {
  private isDevelopment: boolean;
  private minLogLevel: LogLevel;
  private sessionId: string;

  constructor() {
    this.isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
    this.minLogLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLogLevel;
  }

  private formatLogEntry(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const timestamp = new Date(entry.timestamp).toISOString();
    
    if (this.isDevelopment) {
      // Rich formatting for development
      const contextStr = entry.context ? ` [${Object.entries(entry.context)
        .map(([k, v]) => `${k}:${v}`)
        .join(', ')}]` : '';
      
      const errorStr = entry.error ? `\nError: ${entry.error.name}: ${entry.error.message}` : '';
      
      return `[${timestamp}] ${levelName}${contextStr}: ${entry.message}${errorStr}`;
    } else {
      // Structured format for production
      return JSON.stringify(entry);
    }
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error,
    metadata?: Record<string, any>
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        ...context,
        sessionId: this.sessionId,
      },
      metadata
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined,
        cause: error.cause
      };
    }

    return entry;
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error, metadata?: Record<string, any>): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, error, metadata);
    const formattedMessage = this.formatLogEntry(entry);

    // Use appropriate console method based on log level
    switch (level) {
      case LogLevel.DEBUG:
        if (this.isDevelopment) {
          // Only show debug logs in development
          console.info(formattedMessage);
        }
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        if (error?.stack && this.isDevelopment) {
          console.error(error.stack);
        }
        break;
    }

    // In production, you could send logs to external service here
    // e.g., Sentry, LogRocket, custom analytics endpoint
    if (!this.isDevelopment && level >= LogLevel.ERROR) {
      this.sendToLogService(entry);
    }
  }

  private sendToLogService(entry: LogEntry): void {
    // Placeholder for external logging service integration
    // Could integrate with Supabase Edge Functions, Sentry, etc.
    try {
      // Example: Send to Supabase Edge Function for log aggregation
      // fetch('/api/logs', { method: 'POST', body: JSON.stringify(entry) });
    } catch (err) {
      // Fail silently to avoid logging loops
    }
  }

  /**
   * Debug level logging - only shown in development
   */
  debug(message: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context, undefined, metadata);
  }

  /**
   * Info level logging - general application flow
   */
  info(message: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context, undefined, metadata);
  }

  /**
   * Warning level logging - potentially problematic situations
   */
  warn(message: string, context?: LogContext, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context, undefined, metadata);
  }

  /**
   * Error level logging - error conditions
   */
  error(message: string, error?: Error, context?: LogContext, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error, metadata);
  }

  /**
   * Create a logger instance with pre-filled context
   */
  withContext(context: LogContext): ContextLogger {
    return new ContextLogger(this, context);
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }
}

/**
 * Context-aware logger that automatically includes component/action context
 */
class ContextLogger {
  constructor(private logger: Logger, private context: LogContext) {}

  debug(message: string, additionalContext?: LogContext, metadata?: Record<string, any>): void {
    this.logger.debug(message, { ...this.context, ...additionalContext }, metadata);
  }

  info(message: string, additionalContext?: LogContext, metadata?: Record<string, any>): void {
    this.logger.info(message, { ...this.context, ...additionalContext }, metadata);
  }

  warn(message: string, additionalContext?: LogContext, metadata?: Record<string, any>): void {
    this.logger.warn(message, { ...this.context, ...additionalContext }, metadata);
  }

  error(message: string, error?: Error, additionalContext?: LogContext, metadata?: Record<string, any>): void {
    this.logger.error(message, error, { ...this.context, ...additionalContext }, metadata);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for use in components
export type { LogContext, LogEntry };
export { ContextLogger };