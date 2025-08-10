/**
 * Token Manager Service
 * Handles proactive token refresh to prevent expiration
 */

import { supabase } from '@/lib/supabase-client';
import { logger } from '@/utils/logger';
import authRecoveryService from './AuthRecoveryService';

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  lastRefresh: number;
  refreshAttempts: number;
  isRefreshing: boolean;
}

interface TokenManagerOptions {
  refreshBufferMinutes: number;
  fallbackRefreshIntervalMinutes: number;
  maxRefreshAttempts: number;
}

class TokenManager {
  private static instance: TokenManager;
  private state: TokenState;
  private options: TokenManagerOptions;
  private refreshTimer: NodeJS.Timeout | null = null;
  private fallbackTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  private constructor() {
    this.state = {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      lastRefresh: 0,
      refreshAttempts: 0,
      isRefreshing: false,
    };

    this.options = {
      refreshBufferMinutes: 5, // Refresh 5 minutes before expiration
      fallbackRefreshIntervalMinutes: 30, // Fallback refresh every 30 minutes
      maxRefreshAttempts: 3,
    };

    // Initialize token monitoring
    this.initialize();
  }

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Initialize token monitoring
   */
  private async initialize(): Promise<void> {
    // Set up auth state change listener
    supabase.auth.onAuthStateChange((event, session) => {
      logger.debug('Auth state changed in TokenManager', { 
        component: 'TokenManager',
        event,
        hasSession: !!session 
      });

      if (session) {
        this.updateTokenState(session);
        this.scheduleProactiveRefresh();
      } else if (event === 'SIGNED_OUT') {
        this.clearTokenState();
      }
    });

    // Initial token check
    await this.checkAndUpdateTokens();

    // Set up fallback refresh timer
    this.setupFallbackRefresh();
  }

  /**
   * Check and update current tokens
   */
  private async checkAndUpdateTokens(): Promise<void> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        logger.error('Failed to get session in TokenManager', error, { 
          component: 'TokenManager' 
        });
        
        // Trigger recovery if needed
        if (error.message?.includes('Invalid API key')) {
          authRecoveryService.initiateRecovery('token_manager_api_key');
        }
        return;
      }

      if (session) {
        this.updateTokenState(session);
        this.scheduleProactiveRefresh();
      }
    } catch (error) {
      logger.error('Error checking tokens', error, { 
        component: 'TokenManager' 
      });
    }
  }

  /**
   * Update token state from session
   */
  private updateTokenState(session: any): void {
    this.state.accessToken = session.access_token;
    this.state.refreshToken = session.refresh_token;
    
    // Calculate expiration time
    if (session.expires_at) {
      this.state.expiresAt = typeof session.expires_at === 'number' 
        ? session.expires_at * 1000 // Convert to milliseconds if needed
        : new Date(session.expires_at).getTime();
    } else if (session.expires_in) {
      this.state.expiresAt = Date.now() + (session.expires_in * 1000);
    }

    this.state.lastRefresh = Date.now();
    this.state.refreshAttempts = 0;

    logger.info('Token state updated', { 
      component: 'TokenManager',
      expiresAt: this.state.expiresAt ? new Date(this.state.expiresAt).toISOString() : null,
      timeUntilExpiry: this.state.expiresAt ? this.state.expiresAt - Date.now() : null
    });

    // Emit token updated event
    this.emit('tokenUpdated', { session });
  }

  /**
   * Clear token state
   */
  private clearTokenState(): void {
    this.state = {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      lastRefresh: 0,
      refreshAttempts: 0,
      isRefreshing: false,
    };

    // Clear timers
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    logger.info('Token state cleared', { 
      component: 'TokenManager' 
    });

    // Emit token cleared event
    this.emit('tokenCleared', {});
  }

  /**
   * Schedule proactive token refresh
   */
  private scheduleProactiveRefresh(): void {
    // Clear existing timer
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    if (!this.state.expiresAt) {
      logger.warn('Cannot schedule refresh - no expiration time', { 
        component: 'TokenManager' 
      });
      return;
    }

    const now = Date.now();
    const expiresAt = this.state.expiresAt;
    const bufferMs = this.options.refreshBufferMinutes * 60 * 1000;
    const refreshAt = expiresAt - bufferMs;
    const timeUntilRefresh = refreshAt - now;

    if (timeUntilRefresh <= 0) {
      // Token needs immediate refresh
      logger.warn('Token needs immediate refresh', { 
        component: 'TokenManager',
        expired: now > expiresAt 
      });
      this.refreshToken();
    } else {
      // Schedule future refresh
      logger.info(`Scheduling token refresh in ${Math.round(timeUntilRefresh / 1000)}s`, { 
        component: 'TokenManager',
        refreshAt: new Date(refreshAt).toISOString() 
      });

      this.refreshTimer = setTimeout(() => {
        this.refreshToken();
      }, timeUntilRefresh);
    }
  }

  /**
   * Set up fallback refresh timer
   */
  private setupFallbackRefresh(): void {
    // Clear existing timer
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
    }

    // Set up periodic fallback refresh
    const intervalMs = this.options.fallbackRefreshIntervalMinutes * 60 * 1000;
    
    this.fallbackTimer = setInterval(() => {
      this.performFallbackRefresh();
    }, intervalMs);

    logger.info(`Fallback refresh scheduled every ${this.options.fallbackRefreshIntervalMinutes} minutes`, { 
      component: 'TokenManager' 
    });
  }

  /**
   * Perform fallback refresh
   */
  private async performFallbackRefresh(): Promise<void> {
    // Only refresh if we have a token and it's been a while
    if (!this.state.accessToken || this.state.isRefreshing) {
      return;
    }

    const timeSinceLastRefresh = Date.now() - this.state.lastRefresh;
    const minTimeBetweenRefreshes = 5 * 60 * 1000; // 5 minutes

    if (timeSinceLastRefresh < minTimeBetweenRefreshes) {
      logger.debug('Skipping fallback refresh - too soon', { 
        component: 'TokenManager',
        timeSinceLastRefresh 
      });
      return;
    }

    logger.info('Performing fallback token refresh', { 
      component: 'TokenManager' 
    });
    
    await this.refreshToken();
  }

  /**
   * Refresh the authentication token
   */
  async refreshToken(): Promise<boolean> {
    if (this.state.isRefreshing) {
      logger.debug('Refresh already in progress', { 
        component: 'TokenManager' 
      });
      return false;
    }

    this.state.isRefreshing = true;
    this.state.refreshAttempts++;

    // Emit refresh started event
    this.emit('refreshStarted', { attempt: this.state.refreshAttempts });

    try {
      logger.info('Refreshing authentication token', { 
        component: 'TokenManager',
        attempt: this.state.refreshAttempts 
      });

      const { data: { session }, error } = await supabase.auth.refreshSession();

      if (error) {
        throw error;
      }

      if (!session) {
        throw new Error('No session returned after refresh');
      }

      // Update token state
      this.updateTokenState(session);
      
      // Schedule next refresh
      this.scheduleProactiveRefresh();

      logger.info('Token refresh successful', { 
        component: 'TokenManager',
        newExpiry: this.state.expiresAt ? new Date(this.state.expiresAt).toISOString() : null 
      });

      // Emit refresh completed event
      this.emit('refreshCompleted', { success: true, session });

      this.state.isRefreshing = false;
      return true;

    } catch (error: any) {
      logger.error('Token refresh failed', error, { 
        component: 'TokenManager',
        attempt: this.state.refreshAttempts 
      });

      // Emit refresh failed event
      this.emit('refreshFailed', { error, attempt: this.state.refreshAttempts });

      // Check if we should retry
      if (this.state.refreshAttempts < this.options.maxRefreshAttempts) {
        const retryDelay = Math.min(1000 * Math.pow(2, this.state.refreshAttempts), 30000);
        
        logger.info(`Scheduling token refresh retry in ${retryDelay}ms`, { 
          component: 'TokenManager',
          attempt: this.state.refreshAttempts + 1 
        });

        setTimeout(() => {
          this.state.isRefreshing = false;
          this.refreshToken();
        }, retryDelay);
      } else {
        // Max attempts reached - trigger recovery
        logger.error('Max refresh attempts reached, triggering recovery', undefined, { 
          component: 'TokenManager' 
        });
        
        authRecoveryService.initiateRecovery('token_refresh_failed');
        this.state.isRefreshing = false;
        this.state.refreshAttempts = 0;
      }

      return false;
    }
  }

  /**
   * Force an immediate token refresh
   */
  async forceRefresh(): Promise<boolean> {
    logger.info('Force refresh requested', { 
      component: 'TokenManager' 
    });
    
    this.state.refreshAttempts = 0;
    return this.refreshToken();
  }

  /**
   * Get current token state
   */
  getState(): TokenState {
    return { ...this.state };
  }

  /**
   * Check if token is valid
   */
  isTokenValid(): boolean {
    if (!this.state.accessToken || !this.state.expiresAt) {
      return false;
    }

    const now = Date.now();
    const bufferMs = 60 * 1000; // 1 minute buffer
    
    return this.state.expiresAt > (now + bufferMs);
  }

  /**
   * Get time until token expiration
   */
  getTimeUntilExpiration(): number | null {
    if (!this.state.expiresAt) {
      return null;
    }

    return Math.max(0, this.state.expiresAt - Date.now());
  }

  /**
   * Subscribe to token events
   */
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  /**
   * Unsubscribe from token events
   */
  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit token event
   */
  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        logger.error('Event listener error', error, { 
          component: 'TokenManager',
          event 
        });
      }
    });
  }

  /**
   * Clean up timers (for testing)
   */
  cleanup() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }

    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();
export default tokenManager;