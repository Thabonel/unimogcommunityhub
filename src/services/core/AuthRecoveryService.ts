/**
 * Automatic Authentication Recovery Service
 * Handles all auth errors transparently without user intervention
 */

import { supabase } from '@/lib/supabase-client';
import { logger } from '@/utils/logger';

interface RecoveryState {
  isRecovering: boolean;
  attemptCount: number;
  lastAttemptTime: number;
  circuitBreakerOpen: boolean;
  circuitBreakerOpenTime: number;
  successfulRecoveries: number;
  failedRecoveries: number;
}

interface RecoveryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  circuitBreakerThreshold: number;
  circuitBreakerCooldown: number;
}

class AuthRecoveryService {
  private static instance: AuthRecoveryService;
  private state: RecoveryState;
  private options: RecoveryOptions;
  private recoveryQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;
  private listeners: Map<string, Set<Function>> = new Map();

  private constructor() {
    this.state = {
      isRecovering: false,
      attemptCount: 0,
      lastAttemptTime: 0,
      circuitBreakerOpen: false,
      circuitBreakerOpenTime: 0,
      successfulRecoveries: 0,
      failedRecoveries: 0
    };

    this.options = {
      maxAttempts: 10,
      baseDelay: 100,
      maxDelay: 30000,
      circuitBreakerThreshold: 10,
      circuitBreakerCooldown: 300000 // 5 minutes
    };

    // Start monitoring for auth issues
    this.startMonitoring();
  }

  static getInstance(): AuthRecoveryService {
    if (!AuthRecoveryService.instance) {
      AuthRecoveryService.instance = new AuthRecoveryService();
    }
    return AuthRecoveryService.instance;
  }

  /**
   * Start monitoring for authentication issues
   */
  private startMonitoring() {
    // Monitor auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
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
    setInterval(() => {
      if (!this.state.isRecovering && !this.state.circuitBreakerOpen) {
        this.performHealthCheck();
      }
    }, 30000);
  }

  /**
   * Perform a health check on the authentication system
   */
  private async performHealthCheck() {
    try {
      const { error } = await supabase.auth.getSession();
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
    
    // Emit recovery started event
    this.emit('recoveryStarted', { reason, attempt: this.state.attemptCount });

    try {
      // Try different recovery strategies
      const recovered = await this.executeRecoveryStrategies();
      
      if (recovered) {
        this.state.successfulRecoveries++;
        this.state.attemptCount = 0;
        this.state.isRecovering = false;
        
        logger.info('Recovery successful', { 
          component: 'AuthRecoveryService',
          reason,
          strategies: recovered 
        });
        
        // Process queued operations
        this.processQueue();
        
        // Emit recovery completed event
        this.emit('recoveryCompleted', { reason, success: true });
        
        return true;
      } else {
        throw new Error('All recovery strategies failed');
      }
    } catch (error) {
      this.state.failedRecoveries++;
      
      logger.error('Recovery failed', error, { 
        component: 'AuthRecoveryService',
        reason,
        attempt: this.state.attemptCount 
      });

      // Check if we should open circuit breaker
      if (this.state.attemptCount >= this.options.circuitBreakerThreshold) {
        this.state.circuitBreakerOpen = true;
        this.state.circuitBreakerOpenTime = Date.now();
        
        logger.error('Circuit breaker opened after max attempts', undefined, { 
          component: 'AuthRecoveryService',
          attempts: this.state.attemptCount 
        });
        
        // Emit circuit breaker opened event
        this.emit('circuitBreakerOpened', { attempts: this.state.attemptCount });
      }

      this.state.isRecovering = false;
      
      // Emit recovery failed event
      this.emit('recoveryFailed', { reason, error, attempt: this.state.attemptCount });
      
      // Schedule retry if not at max attempts
      if (this.state.attemptCount < this.options.maxAttempts && !this.state.circuitBreakerOpen) {
        const delay = this.calculateBackoffDelay();
        logger.info(`Scheduling retry in ${delay}ms`, { 
          component: 'AuthRecoveryService',
          attempt: this.state.attemptCount + 1 
        });
        setTimeout(() => this.initiateRecovery(reason), delay);
      }
      
      return false;
    }
  }

  /**
   * Execute recovery strategies in order
   */
  private async executeRecoveryStrategies(): Promise<string[]> {
    const successfulStrategies: string[] = [];
    
    // Strategy 1: Clean up stale tokens
    try {
      await this.cleanupStaleTokens();
      successfulStrategies.push('cleanup_stale_tokens');
    } catch (error) {
      logger.debug('Token cleanup failed', { component: 'AuthRecoveryService', error });
    }

    // Strategy 2: Validate environment configuration
    try {
      const envValid = this.validateEnvironment();
      if (envValid) {
        successfulStrategies.push('environment_validation');
      }
    } catch (error) {
      logger.debug('Environment validation failed', { component: 'AuthRecoveryService', error });
    }

    // Strategy 3: Attempt token refresh
    try {
      const { error } = await supabase.auth.refreshSession();
      if (!error) {
        successfulStrategies.push('token_refresh');
      }
    } catch (error) {
      logger.debug('Token refresh failed', { component: 'AuthRecoveryService', error });
    }

    // Strategy 4: Clear and rebuild auth state
    try {
      await this.rebuildAuthState();
      successfulStrategies.push('rebuild_auth_state');
    } catch (error) {
      logger.debug('Auth state rebuild failed', { component: 'AuthRecoveryService', error });
    }

    // Strategy 5: Try to restore from backup storage
    try {
      const restored = await this.restoreFromBackup();
      if (restored) {
        successfulStrategies.push('backup_restore');
      }
    } catch (error) {
      logger.debug('Backup restore failed', { component: 'AuthRecoveryService', error });
    }

    // Consider recovery successful if at least one strategy worked
    return successfulStrategies.length > 0 ? successfulStrategies : [];
  }

  /**
   * Clean up stale authentication tokens
   */
  private async cleanupStaleTokens(): Promise<void> {
    if (typeof window === 'undefined') return;

    const keysToRemove: string[] = [];
    
    // Find all Supabase-related keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      if (key.includes('supabase') || key.startsWith('sb-')) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const data = JSON.parse(value);
            
            // Check if token is expired
            if (data.expires_at) {
              const expiresAt = new Date(data.expires_at).getTime();
              if (expiresAt < Date.now()) {
                keysToRemove.push(key);
              }
            }
          }
        } catch {
          // If can't parse, consider it stale
          keysToRemove.push(key);
        }
      }
    }
    
    // Remove stale tokens
    keysToRemove.forEach(key => {
      logger.debug(`Removing stale token: ${key}`, { component: 'AuthRecoveryService' });
      localStorage.removeItem(key);
    });
    
    if (keysToRemove.length > 0) {
      logger.info(`Cleaned up ${keysToRemove.length} stale tokens`, { 
        component: 'AuthRecoveryService' 
      });
    }
  }

  /**
   * Validate environment configuration
   */
  private validateEnvironment(): boolean {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const isValid = !!(
      supabaseUrl && 
      supabaseKey && 
      supabaseUrl.includes('supabase.co') && 
      supabaseKey.startsWith('eyJ')
    );
    
    if (!isValid) {
      logger.error('Environment configuration invalid', undefined, { 
        component: 'AuthRecoveryService',
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey 
      });
    }
    
    return isValid;
  }

  /**
   * Rebuild authentication state from scratch
   */
  private async rebuildAuthState(): Promise<void> {
    // Sign out to clear any corrupt state
    await supabase.auth.signOut();
    
    // Clear all auth-related storage
    if (typeof window !== 'undefined') {
      const authKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('auth') || key.includes('supabase') || key.startsWith('sb-'))) {
          authKeys.push(key);
        }
      }
      authKeys.forEach(key => localStorage.removeItem(key));
    }
    
    // Re-initialize auth state
    const { error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
  }

  /**
   * Try to restore session from backup storage
   */
  private async restoreFromBackup(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    try {
      // Try to find any valid session in storage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key || !key.includes('supabase.auth.token')) continue;
        
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const data = JSON.parse(value);
            if (data.access_token && data.refresh_token) {
              // Try to set this session
              const { error } = await supabase.auth.setSession({
                access_token: data.access_token,
                refresh_token: data.refresh_token
              });
              
              if (!error) {
                logger.info('Restored session from backup', { 
                  component: 'AuthRecoveryService' 
                });
                return true;
              }
            }
          }
        } catch {
          // Skip invalid entries
        }
      }
    } catch (error) {
      logger.debug('Backup restore failed', { component: 'AuthRecoveryService', error });
    }
    
    return false;
  }

  /**
   * Calculate exponential backoff delay with jitter
   */
  private calculateBackoffDelay(): number {
    const exponentialDelay = Math.min(
      this.options.baseDelay * Math.pow(2, this.state.attemptCount - 1),
      this.options.maxDelay
    );
    
    // Add jitter (±25%)
    const jitter = exponentialDelay * 0.25 * (Math.random() - 0.5);
    
    return Math.round(exponentialDelay + jitter);
  }

  /**
   * Queue an operation to be retried after recovery
   */
  queueOperation(operation: () => Promise<void>) {
    this.recoveryQueue.push(operation);
    
    // If not recovering, process immediately
    if (!this.state.isRecovering && !this.state.circuitBreakerOpen) {
      this.processQueue();
    }
  }

  /**
   * Process queued operations
   */
  private async processQueue() {
    if (this.isProcessingQueue || this.recoveryQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.recoveryQueue.length > 0) {
      const operation = this.recoveryQueue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          logger.error('Queued operation failed', error, { 
            component: 'AuthRecoveryService' 
          });
        }
      }
    }
    
    this.isProcessingQueue = false;
  }

  /**
   * Get current recovery state
   */
  getState(): RecoveryState {
    return { ...this.state };
  }

  /**
   * Manual trigger for recovery (for testing/debugging)
   */
  async triggerManualRecovery(): Promise<boolean> {
    logger.info('Manual recovery triggered', { component: 'AuthRecoveryService' });
    return this.initiateRecovery('manual');
  }

  /**
   * Subscribe to recovery events
   */
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  /**
   * Unsubscribe from recovery events
   */
  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit recovery event
   */
  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        logger.error('Event listener error', error, { 
          component: 'AuthRecoveryService',
          event 
        });
      }
    });
  }

  /**
   * Reset recovery state (for testing)
   */
  reset() {
    this.state = {
      isRecovering: false,
      attemptCount: 0,
      lastAttemptTime: 0,
      circuitBreakerOpen: false,
      circuitBreakerOpenTime: 0,
      successfulRecoveries: 0,
      failedRecoveries: 0
    };
    this.recoveryQueue = [];
  }
}

// Export singleton instance
export const authRecoveryService = AuthRecoveryService.getInstance();
export default authRecoveryService;