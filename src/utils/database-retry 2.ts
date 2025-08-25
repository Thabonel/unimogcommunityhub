import { PostgrestError } from '@supabase/supabase-js';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableErrors: [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
    'ENETUNREACH',
    '503', // Service Unavailable
    '504', // Gateway Timeout
    '522', // Connection Timeout
    '524', // Timeout Occurred
  ],
};

/**
 * Determines if an error is retryable
 */
function isRetryableError(error: any, retryableErrors: string[]): boolean {
  if (!error) return false;

  // Check for network errors
  if (error.code && retryableErrors.includes(error.code)) {
    return true;
  }

  // Check for HTTP status codes
  if (error.status && retryableErrors.includes(String(error.status))) {
    return true;
  }

  // Check for Postgres errors that might be transient
  if (error.code === 'PGRST301') {
    // Database connection error
    return true;
  }

  // Check error message for retryable patterns
  const message = error.message?.toLowerCase() || '';
  const retryablePatterns = [
    'timeout',
    'timed out',
    'connection refused',
    'network error',
    'fetch failed',
    'socket hang up',
  ];

  return retryablePatterns.some(pattern => message.includes(pattern));
}

/**
 * Calculates the delay for the next retry attempt
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  backoffMultiplier: number
): number {
  const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.1 * delay;
  return Math.min(delay + jitter, maxDelay);
}

/**
 * Retry wrapper for database operations
 * @param operation The async operation to retry
 * @param options Retry configuration options
 * @returns The result of the operation
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: any;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry if it's the last attempt
      if (attempt === config.maxRetries) {
        break;
      }

      // Check if the error is retryable
      if (!isRetryableError(error, config.retryableErrors)) {
        throw error;
      }

      // Calculate delay and wait
      const delay = calculateDelay(
        attempt,
        config.initialDelay,
        config.maxDelay,
        config.backoffMultiplier
      );

      console.warn(
        `Operation failed (attempt ${attempt}/${config.maxRetries}). Retrying in ${delay}ms...`,
        error
      );

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // All retries exhausted
  console.error(`Operation failed after ${config.maxRetries} attempts`, lastError);
  throw lastError;
}

/**
 * Retry wrapper specifically for Supabase operations
 * Handles PostgrestError types
 */
export async function withSupabaseRetry<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  options?: RetryOptions
): Promise<{ data: T | null; error: PostgrestError | null }> {
  return withRetry(async () => {
    const result = await operation();
    
    // If there's an error, check if it's retryable
    if (result.error && isRetryableError(result.error, options?.retryableErrors || DEFAULT_OPTIONS.retryableErrors)) {
      throw result.error;
    }
    
    return result;
  }, options);
}

/**
 * Circuit breaker pattern for database operations
 */
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private readonly threshold = 5,
    private readonly timeout = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await operation();
      if (this.state === 'half-open') {
        this.reset();
      }
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.threshold) {
      this.state = 'open';
      console.error(`Circuit breaker opened after ${this.failures} failures`);
    }
  }

  private reset() {
    this.failures = 0;
    this.lastFailureTime = 0;
    this.state = 'closed';
  }
}

/**
 * Connection pool manager for better resource utilization
 */
export class ConnectionPoolManager {
  private activeConnections = 0;
  private readonly maxConnections: number;
  private readonly queue: Array<() => void> = [];

  constructor(maxConnections = 10) {
    this.maxConnections = maxConnections;
  }

  async acquire(): Promise<void> {
    if (this.activeConnections < this.maxConnections) {
      this.activeConnections++;
      return;
    }

    // Wait for a connection to be released
    return new Promise(resolve => {
      this.queue.push(resolve);
    });
  }

  release(): void {
    this.activeConnections--;

    // Process waiting requests
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      if (resolve) {
        this.activeConnections++;
        resolve();
      }
    }
  }

  async withConnection<T>(operation: () => Promise<T>): Promise<T> {
    await this.acquire();
    try {
      return await operation();
    } finally {
      this.release();
    }
  }
}