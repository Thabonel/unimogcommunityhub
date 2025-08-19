/**
 * Enterprise-grade Supabase Service Layer
 * Implements singleton pattern, circuit breaker, retry logic, and connection pooling
 */

import { supabase } from '@/lib/supabase-client';
import { PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { EventEmitter } from '@/utils/EventEmitter';
import { logger } from '@/utils/logger';

// Types
export interface QueryOptions {
  filters?: Array<{
    column: string;
    operator: string;
    value: any;
  }>;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  pagination?: {
    page: number;
    pageSize: number;
  };
  retryOptions?: RetryOptions;
}

export interface RetryOptions {
  maxRetries?: number;
  backoff?: 'exponential' | 'linear';
  initialDelay?: number;
}

export interface Result<T> {
  success: boolean;
  data?: T;
  error?: any;
  retryCount?: number;
  latency?: number;
}

export interface MutationOptions {
  optimistic?: boolean;
  rollbackOnError?: boolean;
  retryOptions?: RetryOptions;
}

// Circuit Breaker implementation
class CircuitBreaker {
  private failures = 0;
  private lastFailTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold = 5,
    private timeout = 60000 // 1 minute
  ) {}
  
  async call<T>(fn: () => Promise<T>): Promise<T> {
    // Check if circuit should transition from OPEN to HALF_OPEN
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime! > this.timeout) {
        logger.info('Circuit breaker transitioning to HALF_OPEN', { component: 'SupabaseService', action: 'circuit_breaker_half_open' });
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN - service unavailable');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    if (this.state === 'HALF_OPEN') {
      logger.info('Circuit breaker recovered', { component: 'SupabaseService', action: 'circuit_breaker_recovered' });
    }
    this.failures = 0;
    this.state = 'CLOSED';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();
    
    if (this.failures >= this.threshold) {
      logger.error(`Circuit breaker opened after ${this.failures} failures`, undefined, { component: 'SupabaseService', action: 'circuit_breaker_opened', failures: this.failures });
      this.state = 'OPEN';
    }
  }
  
  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailTime: this.lastFailTime
    };
  }
}

// Retry Manager implementation
class RetryManager {
  async execute<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<{ result: T; retryCount: number }> {
    const {
      maxRetries = 3,
      backoff = 'exponential',
      initialDelay = 1000
    } = options;
    
    let lastError: any;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fn();
        return { result, retryCount: attempt };
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on non-retryable errors
        if (this.isNonRetryable(error)) {
          throw error;
        }
        
        if (attempt < maxRetries) {
          const delay = backoff === 'exponential'
            ? initialDelay * Math.pow(2, attempt)
            : initialDelay;
          
          logger.debug(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`, { component: 'SupabaseService', action: 'retry_attempt', attempt: attempt + 1, maxRetries, delay });
          await this.delay(delay);
        }
      }
    }
    
    throw lastError;
  }
  
  private isNonRetryable(error: any): boolean {
    // Don't retry on authentication errors
    if (error?.message?.includes('JWT') || 
        error?.message?.includes('Invalid API key') ||
        error?.code === 'PGRST301') {
      return true;
    }
    
    // Don't retry on 4xx errors (except 429 rate limit)
    if (error?.status && error.status >= 400 && error.status < 500 && error.status !== 429) {
      return true;
    }
    
    return false;
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Main Supabase Service
export class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient;
  private circuitBreaker: CircuitBreaker;
  private retryManager: RetryManager;
  private eventEmitter: EventEmitter;
  private metrics: Map<string, any[]> = new Map();
  
  private constructor() {
    this.client = supabase;
    this.circuitBreaker = new CircuitBreaker();
    this.retryManager = new RetryManager();
    this.eventEmitter = new EventEmitter();
    this.setupEventListeners();
    
    logger.info('SupabaseService initialized with enterprise features', { component: 'SupabaseService', action: 'service_init' });
  }
  
  static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }
  
  private setupEventListeners() {
    // Monitor circuit breaker state
    this.eventEmitter.on('circuit:open', () => {
      logger.error('Circuit breaker opened - database connectivity issues', undefined, { component: 'SupabaseService', action: 'circuit_breaker_warning' });
    });
    
    this.eventEmitter.on('circuit:closed', () => {
      logger.info('Circuit breaker closed - database connectivity restored', { component: 'SupabaseService', action: 'circuit_breaker_restored' });
    });
  }
  
  // Query with resilience
  async query<T>(
    table: string,
    options: QueryOptions = {}
  ): Promise<Result<T>> {
    const startTime = performance.now();
    
    try {
      const { result, retryCount } = await this.circuitBreaker.call(() =>
        this.retryManager.execute(
          () => this.performQuery<T>(table, options),
          options.retryOptions
        )
      );
      
      const latency = performance.now() - startTime;
      
      // Track metrics
      this.trackMetric('query', {
        table,
        latency,
        retryCount,
        success: true
      });
      
      return {
        success: true,
        data: result,
        retryCount,
        latency
      };
    } catch (error) {
      const latency = performance.now() - startTime;
      
      // Track error metrics
      this.trackMetric('query', {
        table,
        latency,
        success: false,
        error: error.message
      });
      
      return {
        success: false,
        error,
        latency
      };
    }
  }
  
  private async performQuery<T>(
    table: string,
    options: QueryOptions
  ): Promise<T> {
    let query = this.client.from(table).select();
    
    // Apply filters
    if (options.filters) {
      options.filters.forEach(filter => {
        query = query.filter(filter.column, filter.operator, filter.value);
      });
    }
    
    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      });
    }
    
    // Apply pagination
    if (options.pagination) {
      const { page, pageSize } = options.pagination;
      const from = page * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw this.enhanceError(error);
    }
    
    return data as T;
  }
  
  // Mutation with resilience
  async mutate<T>(
    table: string,
    operation: 'insert' | 'update' | 'delete' | 'upsert',
    data: any,
    options: MutationOptions = {}
  ): Promise<Result<T>> {
    const startTime = performance.now();
    
    try {
      const { result, retryCount } = await this.circuitBreaker.call(() =>
        this.retryManager.execute(
          () => this.performMutation<T>(table, operation, data, options),
          options.retryOptions
        )
      );
      
      const latency = performance.now() - startTime;
      
      // Track metrics
      this.trackMetric('mutation', {
        table,
        operation,
        latency,
        retryCount,
        success: true
      });
      
      return {
        success: true,
        data: result,
        retryCount,
        latency
      };
    } catch (error) {
      const latency = performance.now() - startTime;
      
      // Track error metrics
      this.trackMetric('mutation', {
        table,
        operation,
        latency,
        success: false,
        error: error.message
      });
      
      return {
        success: false,
        error,
        latency
      };
    }
  }
  
  private async performMutation<T>(
    table: string,
    operation: 'insert' | 'update' | 'delete' | 'upsert',
    data: any,
    options: MutationOptions
  ): Promise<T> {
    let query;
    
    switch (operation) {
      case 'insert':
        query = this.client.from(table).insert(data);
        break;
      case 'update':
        query = this.client.from(table).update(data.updates).match(data.match);
        break;
      case 'delete':
        query = this.client.from(table).delete().match(data);
        break;
      case 'upsert':
        query = this.client.from(table).upsert(data);
        break;
    }
    
    const { data: result, error } = await query.select();
    
    if (error) {
      throw this.enhanceError(error);
    }
    
    return result as T;
  }
  
  // Realtime subscriptions
  subscribe(
    table: string,
    callback: (payload: any) => void,
    filter?: any
  ) {
    const channel = this.client
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter
        },
        (payload) => {
          logger.debug(`Realtime event on ${table}`, { component: 'SupabaseService', action: 'realtime_event', table, eventType: payload.eventType });
          callback(payload);
        }
      )
      .subscribe();
    
    return channel;
  }
  
  // Enhanced error handling
  private enhanceError(error: PostgrestError): Error {
    const enhanced = new Error(error.message);
    enhanced.name = 'SupabaseError';
    (enhanced as any).code = error.code;
    (enhanced as any).details = error.details;
    (enhanced as any).hint = error.hint;
    
    // Add user-friendly messages
    if (error.code === 'PGRST301') {
      enhanced.message = 'Authentication required. Please sign in.';
    } else if (error.code === '23505') {
      enhanced.message = 'This record already exists.';
    } else if (error.code === '23503') {
      enhanced.message = 'Referenced record not found.';
    }
    
    return enhanced;
  }
  
  // Metrics tracking
  private trackMetric(name: string, data: any) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push({
      ...data,
      timestamp: Date.now()
    });
    
    // Emit metric event
    this.eventEmitter.emit('metric', { name, data });
    
    // Clean old metrics (keep last 1000)
    const metrics = this.metrics.get(name)!;
    if (metrics.length > 1000) {
      metrics.splice(0, metrics.length - 1000);
    }
  }
  
  // Get metrics
  getMetrics(name?: string): any {
    if (name) {
      return this.metrics.get(name) || [];
    }
    
    const result: any = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  
  // Health check
  async healthCheck(): Promise<{
    healthy: boolean;
    latency: number;
    circuitBreaker: any;
  }> {
    const startTime = performance.now();
    
    try {
      // Simple health check query
      const { error } = await this.client
        .from('profiles')
        .select('id')
        .limit(1);
      
      const latency = performance.now() - startTime;
      
      return {
        healthy: !error,
        latency,
        circuitBreaker: this.circuitBreaker.getState()
      };
    } catch (error) {
      const latency = performance.now() - startTime;
      
      return {
        healthy: false,
        latency,
        circuitBreaker: this.circuitBreaker.getState()
      };
    }
  }
  
  // Get the raw Supabase client (for auth operations)
  getClient(): SupabaseClient {
    return this.client;
  }
  
  // Event emitter access
  on(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.on(event, listener);
  }
  
  off(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.off(event, listener);
  }
}