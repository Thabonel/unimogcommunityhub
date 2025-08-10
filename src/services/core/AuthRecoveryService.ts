/**
 * Automatic Authentication Recovery Service
 * Handles all auth errors transparently without user intervention
 */

import { logger } from '@/utils/logger';
import type { SupabaseClient, Session, User } from '@supabase/supabase-js';
import { EventEmitter } from '@/utils/EventEmitter';

interface RecoveryState {
  isRecovering: boolean;
  attemptCount: number;
  lastAttemptTime: number;
  circuitBreakerOpen: boolean;
  circuitBreakerOpenTime: number;
  successfulRecoveries: number;
  failedRecoveries: number;
  environmentCheckPassed: boolean;
}

interface RecoveryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  circuitBreakerThreshold: number;
  circuitBreakerCooldown: number;
}

interface RecoveryResult {
  success: boolean;
  session: Session | null;
  user: User | null;
  error?: Error;
  attempts?: number;
}

class AuthRecoveryService extends EventEmitter {
  private static instance: AuthRecoveryService;
  private state: RecoveryState;
  private options: RecoveryOptions;
  private recoveryQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;
  private monitoringStarted = false;
  private supabaseClient: SupabaseClient | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    super();
    
    this.state = {
      isRecovering: false,
      attemptCount: 0,
      lastAttemptTime: 0,
      circuitBreakerOpen: false,
      circuitBreakerOpenTime: 0,
      successfulRecoveries: 0,
      failedRecoveries: 0,
      environmentCheckPassed: this.checkEnvironment()
    };

    this.options = {
      maxAttempts: 10,
      baseDelay: 100,
      maxDelay: 30000,
      circuitBreakerThreshold: 10,
      circuitBreakerCooldown: 300000 // 5 minutes
    };

    // Log initial state
    logger.info('AuthRecoveryService initialized', {
      component: 'AuthRecoveryService',
      environmentValid: this.state.environmentCheckPassed
    });
  }

  static getInstance(): AuthRecoveryService {
    if (!AuthRecoveryService.instance) {
      AuthRecoveryService.instance = new AuthRecoveryService();
    }
    return AuthRecoveryService.instance;
  }

  /**
   * Initialize the service with Supabase client
   * This must be called after the Supabase client is created
   */
  initialize(client: SupabaseClient) {
    if (this.supabaseClient) {
      logger.debug('AuthRecoveryService already initialized', {
        component: 'AuthRecoveryService'
      });
      return;
    }

    this.supabaseClient = client;
    
    if (!this.monitoringStarted) {
      this.startMonitoring();
      this.monitoringStarted = true;
    }
    
    logger.info('AuthRecoveryService initialized with Supabase client', {
      component: 'AuthRecoveryService'
    });
  }

  /**
   * Check if environment variables are properly configured
   */
  private checkEnvironment(): boolean {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const isValid = !!(url && key && url.includes('supabase.co') && key.startsWith('eyJ'));
    
    if (!isValid) {
      logger.error('Invalid environment configuration', undefined, {
        component: 'AuthRecoveryService',
        hasUrl: !!url,
        hasKey: !!key,
        urlValid: url?.includes('supabase.co'),
        keyValid: key?.startsWith('eyJ')
      });
    }
    
    return isValid;
  }

  /**
   * Start monitoring for authentication issues
   */
  private startMonitoring() {
    if (!this.supabaseClient) {
      logger.warn('Cannot start monitoring - Supabase client not set', {
        component: 'AuthRecoveryService'
      });
      return;
    }

    // Monitor auth state changes
    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        logger.warn('Token refresh failed, initiating recovery', { 
          component: 'AuthRecoveryService',
          action: 'token_refresh_failed' 
        });
        this.initiateRecovery('token_refresh_failed');
      } else if (event === 'SIGNED_OUT' && this.state.isRecovering) {
        // Don't trigger recovery if we're already recovering
        logger.debug('Signed out during recovery, ignoring', { 
          component: 'AuthRecoveryService' 
        });
      }
    });

    // Periodic health check (every 30 seconds)
    this.healthCheckInterval = setInterval(() => {
      if (!this.state.isRecovering && !this.state.circuitBreakerOpen) {
        this.performHealthCheck();
      }
    }, 30000);

    logger.info('Auth monitoring started', {
      component: 'AuthRecoveryService'
    });
  }

  /**
   * Stop monitoring
   */
  destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    this.removeAllListeners();
    logger.info('AuthRecoveryService destroyed', {
      component: 'AuthRecoveryService'
    });
  }

  /**
   * Perform a health check on the authentication system
   */
  private async performHealthCheck() {
    if (!this.supabaseClient) return;
    
    try {
      const { error } = await this.supabaseClient.auth.getSession();
      if (error?.message?.includes('Invalid API key')) {
        logger.warn('Health check detected API key issue', { 
          component: 'AuthRecoveryService',
          error: error.message 
        });
        this.initiateRecovery('api_key_invalid');
      }
    } catch (error) {
      // Silently handle health check errors
      logger.debug('Health check error (non-critical)', { 
        component: 'AuthRecoveryService',
        error 
      });
    }
  }

  /**
   * Initiate automatic recovery
   */
  async initiateRecovery(reason: string): Promise<boolean> {
    // Check circuit breaker
    if (this.state.circuitBreakerOpen) {
      const timeSinceOpen = Date.now() - this.state.circuitBreakerOpenTime;
      if (timeSinceOpen < this.options.circuitBreakerCooldown) {
        logger.debug('Circuit breaker is open, skipping recovery', { 
          component: 'AuthRecoveryService',
          timeRemaining: this.options.circuitBreakerCooldown - timeSinceOpen 
        });
        return false;
      } else {
        // Reset circuit breaker
        this.state.circuitBreakerOpen = false;
        this.state.attemptCount = 0;
        this.emit('circuit-breaker:reset');
        logger.info('Circuit breaker reset, attempting recovery', { 
          component: 'AuthRecoveryService' 
        });
      }
    }

    // Prevent concurrent recovery attempts
    if (this.state.isRecovering) {
      logger.debug('Recovery already in progress', { 
        component: 'AuthRecoveryService' 
      });
      return false;
    }

    this.state.isRecovering = true;
    this.state.attemptCount++;
    this.state.lastAttemptTime = Date.now();
    
    this.emit('recovery:started', { reason, attempt: this.state.attemptCount });

    logger.info('Starting auth recovery', {
      component: 'AuthRecoveryService',
      reason,
      attempt: this.state.attemptCount
    });

    try {
      // Execute recovery strategies in sequence
      const strategies = [
        () => this.cleanupTokens(),
        () => this.validateEnvironment(),
        () => this.refreshToken(),
        () => this.rebuildAuthState(),
        () => this.restoreFromBackup()
      ];

      for (const strategy of strategies) {
        try {
          const result = await strategy();
          if (result) {
            this.state.isRecovering = false;
            this.state.successfulRecoveries++;
            this.state.attemptCount = 0;
            
            this.emit('recovery:success', { 
              reason, 
              attempts: this.state.attemptCount,
              session: result.session 
            });
            
            logger.info('Auth recovery successful', {
              component: 'AuthRecoveryService',
              strategy: strategy.name,
              attempts: this.state.attemptCount
            });
            
            // Process queued operations
            this.processQueue();
            return true;
          }
        } catch (error) {
          logger.debug('Recovery strategy failed', {
            component: 'AuthRecoveryService',
            strategy: strategy.name,
            error
          });
        }
      }

      // All strategies failed
      throw new Error('All recovery strategies exhausted');
      
    } catch (error) {
      this.state.isRecovering = false;
      this.state.failedRecoveries++;
      
      // Check if we should open circuit breaker
      if (this.state.attemptCount >= this.options.circuitBreakerThreshold) {
        this.state.circuitBreakerOpen = true;
        this.state.circuitBreakerOpenTime = Date.now();
        this.emit('circuit-breaker:opened');
        
        logger.error('Circuit breaker opened after max attempts', error as Error, {
          component: 'AuthRecoveryService',
          attempts: this.state.attemptCount
        });
      }
      
      this.emit('recovery:failed', { reason, error, attempts: this.state.attemptCount });
      
      logger.error('Auth recovery failed', error as Error, {
        component: 'AuthRecoveryService',
        reason,
        attempts: this.state.attemptCount
      });
      
      return false;
    }
  }

  /**
   * Recovery strategy: Clean up potentially corrupted tokens
   */
  private async cleanupTokens(): Promise<RecoveryResult | null> {
    if (!this.supabaseClient) return null;
    
    try {
      logger.debug('Cleaning up tokens', { component: 'AuthRecoveryService' });
      
      // Clear all auth-related localStorage items
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Try to get a fresh session
      const { data: { session }, error } = await this.supabaseClient.auth.getSession();
      
      if (!error && session) {
        return { success: true, session, user: session.user };
      }
      
      return null;
    } catch (error) {
      logger.debug('Token cleanup failed', { component: 'AuthRecoveryService', error });
      return null;
    }
  }

  /**
   * Recovery strategy: Validate environment configuration
   */
  private async validateEnvironment(): Promise<RecoveryResult | null> {
    try {
      logger.debug('Validating environment', { component: 'AuthRecoveryService' });
      
      const isValid = this.checkEnvironment();
      
      if (isValid) {
        this.state.environmentCheckPassed = true;
        this.emit('environment:valid');
        
        // Environment is valid, but this doesn't fix the auth issue by itself
        return null;
      } else {
        this.state.environmentCheckPassed = false;
        this.emit('environment:invalid');
        throw new Error('Invalid environment configuration');
      }
    } catch (error) {
      logger.debug('Environment validation failed', { component: 'AuthRecoveryService', error });
      return null;
    }
  }

  /**
   * Recovery strategy: Attempt token refresh
   */
  private async refreshToken(): Promise<RecoveryResult | null> {
    if (!this.supabaseClient) return null;
    
    try {
      logger.debug('Attempting token refresh', { component: 'AuthRecoveryService' });
      
      const { data: { session }, error } = await this.supabaseClient.auth.refreshSession();
      
      if (!error && session) {
        return { success: true, session, user: session.user };
      }
      
      return null;
    } catch (error) {
      logger.debug('Token refresh failed', { component: 'AuthRecoveryService', error });
      return null;
    }
  }

  /**
   * Recovery strategy: Rebuild authentication state
   */
  private async rebuildAuthState(): Promise<RecoveryResult | null> {
    if (!this.supabaseClient) return null;
    
    try {
      logger.debug('Rebuilding auth state', { component: 'AuthRecoveryService' });
      
      // Sign out to clear any corrupted state
      await this.supabaseClient.auth.signOut();
      
      // Wait a moment for cleanup
      await this.delay(500);
      
      // Try to restore session
      const { data: { session }, error } = await this.supabaseClient.auth.getSession();
      
      if (!error && session) {
        return { success: true, session, user: session.user };
      }
      
      return null;
    } catch (error) {
      logger.debug('Auth state rebuild failed', { component: 'AuthRecoveryService', error });
      return null;
    }
  }

  /**
   * Recovery strategy: Restore from backup (IndexedDB)
   */
  private async restoreFromBackup(): Promise<RecoveryResult | null> {
    try {
      logger.debug('Attempting restore from backup', { component: 'AuthRecoveryService' });
      
      // Check if IndexedDB is available
      if (!('indexedDB' in window)) {
        return null;
      }
      
      // Try to restore from IndexedDB backup
      const db = await this.openBackupDB();
      const transaction = db.transaction(['auth'], 'readonly');
      const store = transaction.objectStore('auth');
      const request = store.get('session');
      
      return new Promise((resolve) => {
        request.onsuccess = () => {
          const backup = request.result;
          if (backup && backup.session) {
            logger.info('Restored session from backup', { component: 'AuthRecoveryService' });
            resolve({ 
              success: true, 
              session: backup.session, 
              user: backup.session.user 
            });
          } else {
            resolve(null);
          }
        };
        
        request.onerror = () => {
          logger.debug('Backup restore failed', { component: 'AuthRecoveryService' });
          resolve(null);
        };
      });
    } catch (error) {
      logger.debug('Backup restore error', { component: 'AuthRecoveryService', error });
      return null;
    }
  }

  /**
   * Open or create the backup database
   */
  private openBackupDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('AuthBackup', 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('auth')) {
          db.createObjectStore('auth');
        }
      };
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  /**
   * Save current session to backup
   */
  async backupSession(session: Session) {
    try {
      const db = await this.openBackupDB();
      const transaction = db.transaction(['auth'], 'readwrite');
      const store = transaction.objectStore('auth');
      store.put({ session, timestamp: Date.now() }, 'session');
      
      logger.debug('Session backed up', { component: 'AuthRecoveryService' });
    } catch (error) {
      logger.debug('Failed to backup session', { component: 'AuthRecoveryService', error });
    }
  }

  /**
   * Queue an operation to be executed after recovery
   */
  queueOperation(operation: () => Promise<void>) {
    this.recoveryQueue.push(operation);
    
    if (!this.state.isRecovering && !this.isProcessingQueue) {
      this.processQueue();
    }
  }

  /**
   * Process queued operations
   */
  private async processQueue() {
    if (this.isProcessingQueue || this.recoveryQueue.length === 0) {
      return;
    }
    
    this.isProcessingQueue = true;
    
    while (this.recoveryQueue.length > 0) {
      const operation = this.recoveryQueue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          logger.debug('Queued operation failed', { component: 'AuthRecoveryService', error });
        }
      }
    }
    
    this.isProcessingQueue = false;
  }

  /**
   * Helper: Delay with exponential backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private calculateBackoff(attempt: number): number {
    const baseDelay = this.options.baseDelay;
    const maxDelay = this.options.maxDelay;
    
    // Exponential backoff with jitter
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    const jitter = Math.random() * delay * 0.1; // 10% jitter
    
    return delay + jitter;
  }

  /**
   * Public method to recover with client
   */
  async recover(client?: SupabaseClient, error?: any): Promise<RecoveryResult> {
    // Use provided client or stored client
    if (client && !this.supabaseClient) {
      this.initialize(client);
    }
    
    if (!this.supabaseClient) {
      return {
        success: false,
        session: null,
        user: null,
        error: new Error('Supabase client not initialized')
      };
    }
    
    const reason = error?.message || 'manual_recovery';
    const success = await this.initiateRecovery(reason);
    
    if (success) {
      const { data: { session } } = await this.supabaseClient.auth.getSession();
      return {
        success: true,
        session,
        user: session?.user || null
      };
    }
    
    return {
      success: false,
      session: null,
      user: null,
      error: new Error('Recovery failed')
    };
  }

  /**
   * Get current recovery state
   */
  getRecoveryState() {
    return { ...this.state };
  }

  /**
   * Reset recovery state (for testing or manual reset)
   */
  resetRecoveryState() {
    this.state = {
      isRecovering: false,
      attemptCount: 0,
      lastAttemptTime: 0,
      circuitBreakerOpen: false,
      circuitBreakerOpenTime: 0,
      successfulRecoveries: 0,
      failedRecoveries: 0,
      environmentCheckPassed: this.checkEnvironment()
    };
    
    this.emit('state:reset');
    
    logger.info('Recovery state reset', { component: 'AuthRecoveryService' });
  }
}

// Export singleton instance
const authRecoveryService = AuthRecoveryService.getInstance();
export default authRecoveryService;

// Also export the class for typing
export { AuthRecoveryService };
export type { RecoveryState, RecoveryOptions, RecoveryResult };