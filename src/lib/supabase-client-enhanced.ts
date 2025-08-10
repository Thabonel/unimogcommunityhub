/**
 * Enhanced Supabase client with automatic retry and recovery
 * This wraps the standard Supabase client with transparent error handling
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fetchRetry from 'fetch-retry';
import { SUPABASE_CONFIG } from '@/config/env';
import authRecoveryService from '@/services/core/AuthRecoveryService';
import { logger } from '@/utils/logger';

// Configure fetch with retry capabilities
const fetchWithRetry = fetchRetry(fetch, {
  retries: 3,
  retryDelay: (attempt: number) => {
    // Exponential backoff: 100ms, 200ms, 400ms
    return Math.min(100 * Math.pow(2, attempt), 30000);
  },
  retryOn: (attempt: number, error: Error | null, response: Response | null) => {
    // Retry on network errors
    if (error) {
      logger.debug(`Network error, retrying (attempt ${attempt})`, { 
        component: 'SupabaseClient',
        error: error.message 
      });
      return true;
    }

    // Retry on server errors (5xx)
    if (response && response.status >= 500) {
      logger.debug(`Server error ${response.status}, retrying (attempt ${attempt})`, { 
        component: 'SupabaseClient' 
      });
      return true;
    }

    // Retry on rate limiting
    if (response && response.status === 429) {
      logger.debug(`Rate limited, retrying (attempt ${attempt})`, { 
        component: 'SupabaseClient' 
      });
      return true;
    }

    // Special handling for Invalid API key - trigger recovery instead of retry
    if (response && response.status === 401) {
      response.text().then(text => {
        if (text.includes('Invalid API key')) {
          logger.warn('Invalid API key detected, triggering recovery', { 
            component: 'SupabaseClient' 
          });
          authRecoveryService.initiateRecovery('invalid_api_key');
        }
      });
      return false; // Don't retry 401s
    }

    return false;
  }
});

/**
 * Smart Supabase client wrapper with automatic recovery
 */
class SmartSupabaseClient {
  private client: SupabaseClient;
  private isRecovering = false;
  private operationQueue: Array<{
    operation: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    // Validate configuration
    this.validateConfig();

    // Create Supabase client with enhanced fetch
    this.client = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: this.createEnhancedStorage(),
      },
      global: {
        fetch: fetchWithRetry,
        headers: {
          'X-Client-Info': 'unimog-community-hub/1.0.0',
        },
      },
    });

    // Set up recovery listeners
    this.setupRecoveryListeners();

    // Initialize recovery service
    this.initializeRecovery();
  }

  /**
   * Validate Supabase configuration
   */
  private validateConfig(): void {
    const errors: string[] = [];
    
    if (!SUPABASE_CONFIG.url) {
      errors.push('VITE_SUPABASE_URL is not configured');
    } else if (!SUPABASE_CONFIG.url.includes('supabase.co')) {
      errors.push('Invalid Supabase URL');
    }
    
    if (!SUPABASE_CONFIG.anonKey) {
      errors.push('VITE_SUPABASE_ANON_KEY is not configured');
    } else if (!SUPABASE_CONFIG.anonKey.startsWith('eyJ')) {
      errors.push('Invalid API key format');
    }
    
    if (errors.length > 0) {
      // Don't throw - trigger recovery instead
      logger.error('Supabase configuration issues detected', undefined, { 
        component: 'SmartSupabaseClient',
        errors 
      });
      
      // Use cached credentials if available
      this.attemptCachedCredentials();
    }
  }

  /**
   * Create enhanced storage with automatic cleanup
   */
  private createEnhancedStorage() {
    return {
      getItem: (key: string) => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            // Check if token is expired
            try {
              const data = JSON.parse(item);
              if (data.expires_at) {
                const expiresAt = new Date(data.expires_at).getTime();
                if (expiresAt < Date.now()) {
                  logger.debug('Removing expired token from storage', { 
                    component: 'SmartSupabaseClient',
                    key 
                  });
                  localStorage.removeItem(key);
                  return null;
                }
              }
            } catch {
              // Not a token, return as-is
            }
          }
          return item;
        } catch (error) {
          logger.error('Storage getItem error', error, { 
            component: 'SmartSupabaseClient',
            key 
          });
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
          // Also backup to IndexedDB for resilience
          this.backupToIndexedDB(key, value);
        } catch (error) {
          logger.error('Storage setItem error', error, { 
            component: 'SmartSupabaseClient',
            key 
          });
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
          this.removeFromIndexedDB(key);
        } catch (error) {
          logger.error('Storage removeItem error', error, { 
            component: 'SmartSupabaseClient',
            key 
          });
        }
      },
    };
  }

  /**
   * Backup auth data to IndexedDB for resilience
   */
  private async backupToIndexedDB(key: string, value: string): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) return;

    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['auth'], 'readwrite');
      const store = transaction.objectStore('auth');
      store.put({ key, value, timestamp: Date.now() });
    } catch (error) {
      // Silent fail - IndexedDB is just a backup
      logger.debug('IndexedDB backup failed', { 
        component: 'SmartSupabaseClient',
        error 
      });
    }
  }

  /**
   * Remove from IndexedDB
   */
  private async removeFromIndexedDB(key: string): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) return;

    try {
      const db = await this.openIndexedDB();
      const transaction = db.transaction(['auth'], 'readwrite');
      const store = transaction.objectStore('auth');
      store.delete(key);
    } catch (error) {
      // Silent fail
      logger.debug('IndexedDB removal failed', { 
        component: 'SmartSupabaseClient',
        error 
      });
    }
  }

  /**
   * Open IndexedDB connection
   */
  private openIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('UnimogAuthDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('auth')) {
          db.createObjectStore('auth', { keyPath: 'key' });
        }
      };
    });
  }

  /**
   * Attempt to use cached credentials
   */
  private async attemptCachedCredentials(): Promise<void> {
    try {
      // Try to restore from IndexedDB
      if (typeof window !== 'undefined' && window.indexedDB) {
        const db = await this.openIndexedDB();
        const transaction = db.transaction(['auth'], 'readonly');
        const store = transaction.objectStore('auth');
        const request = store.getAll();
        
        request.onsuccess = () => {
          const items = request.result;
          items.forEach(item => {
            if (item.key && item.value) {
              localStorage.setItem(item.key, item.value);
            }
          });
          logger.info('Restored auth data from backup', { 
            component: 'SmartSupabaseClient',
            itemCount: items.length 
          });
        };
      }
    } catch (error) {
      logger.debug('Failed to restore cached credentials', { 
        component: 'SmartSupabaseClient',
        error 
      });
    }
  }

  /**
   * Set up recovery service listeners
   */
  private setupRecoveryListeners(): void {
    authRecoveryService.on('recoveryStarted', (data: any) => {
      this.isRecovering = true;
      logger.info('Recovery started, queueing operations', { 
        component: 'SmartSupabaseClient',
        reason: data.reason 
      });
    });

    authRecoveryService.on('recoveryCompleted', (data: any) => {
      this.isRecovering = false;
      logger.info('Recovery completed, processing queued operations', { 
        component: 'SmartSupabaseClient',
        success: data.success 
      });
      this.processQueue();
    });

    authRecoveryService.on('recoveryFailed', (data: any) => {
      this.isRecovering = false;
      logger.error('Recovery failed', data.error, { 
        component: 'SmartSupabaseClient',
        attempt: data.attempt 
      });
    });
  }

  /**
   * Initialize recovery service
   */
  private async initializeRecovery(): Promise<void> {
    // Perform initial health check
    try {
      const { error } = await this.client.auth.getSession();
      if (error?.message?.includes('Invalid API key')) {
        logger.warn('Initial health check detected API key issue', { 
          component: 'SmartSupabaseClient' 
        });
        authRecoveryService.initiateRecovery('initial_check');
      }
    } catch (error) {
      logger.debug('Initial health check error', { 
        component: 'SmartSupabaseClient',
        error 
      });
    }
  }

  /**
   * Wrap operations with automatic queueing during recovery
   */
  private async wrapOperation<T>(operation: () => Promise<T>): Promise<T> {
    if (this.isRecovering) {
      // Queue the operation
      return new Promise((resolve, reject) => {
        this.operationQueue.push({
          operation,
          resolve,
          reject,
        });
        logger.debug('Operation queued during recovery', { 
          component: 'SmartSupabaseClient',
          queueLength: this.operationQueue.length 
        });
      });
    }

    try {
      return await operation();
    } catch (error: any) {
      // Check if this is an auth error that needs recovery
      if (error?.message?.includes('Invalid API key') || 
          error?.message?.includes('JWT expired')) {
        logger.warn('Auth error detected, triggering recovery', { 
          component: 'SmartSupabaseClient',
          error: error.message 
        });
        authRecoveryService.initiateRecovery('operation_error');
        
        // Queue this operation for retry
        return new Promise((resolve, reject) => {
          this.operationQueue.push({
            operation,
            resolve,
            reject,
          });
        });
      }
      
      throw error;
    }
  }

  /**
   * Process queued operations after recovery
   */
  private async processQueue(): Promise<void> {
    const queue = [...this.operationQueue];
    this.operationQueue = [];
    
    logger.info(`Processing ${queue.length} queued operations`, { 
      component: 'SmartSupabaseClient' 
    });
    
    for (const item of queue) {
      try {
        const result = await item.operation();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
    }
  }

  /**
   * Get the underlying Supabase client
   */
  getClient(): SupabaseClient {
    return this.client;
  }

  /**
   * Proxy auth methods with automatic recovery
   */
  get auth() {
    const originalAuth = this.client.auth;
    const wrapOperation = this.wrapOperation.bind(this);

    return {
      ...originalAuth,
      signInWithPassword: (credentials: any) => 
        wrapOperation(() => originalAuth.signInWithPassword(credentials)),
      signUp: (credentials: any) => 
        wrapOperation(() => originalAuth.signUp(credentials)),
      signOut: () => 
        wrapOperation(() => originalAuth.signOut()),
      getSession: () => 
        wrapOperation(() => originalAuth.getSession()),
      getUser: () => 
        wrapOperation(() => originalAuth.getUser()),
      refreshSession: (options?: any) => 
        wrapOperation(() => originalAuth.refreshSession(options)),
      setSession: (session: any) => 
        wrapOperation(() => originalAuth.setSession(session)),
      onAuthStateChange: originalAuth.onAuthStateChange.bind(originalAuth),
    };
  }

  /**
   * Proxy database methods with automatic recovery
   */
  from(table: string) {
    const originalFrom = this.client.from(table);
    const wrapOperation = this.wrapOperation.bind(this);

    return new Proxy(originalFrom, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        
        // Wrap async methods
        if (typeof value === 'function') {
          return (...args: any[]) => {
            const result = value.apply(target, args);
            
            // If it returns a promise, wrap it
            if (result && typeof result.then === 'function') {
              return wrapOperation(() => Promise.resolve(result));
            }
            
            // If it returns a query builder, return it as-is
            return result;
          };
        }
        
        return value;
      }
    });
  }

  /**
   * Proxy storage methods with automatic recovery
   */
  get storage() {
    const originalStorage = this.client.storage;
    const wrapOperation = this.wrapOperation.bind(this);

    return {
      ...originalStorage,
      from: (bucket: string) => {
        const originalBucket = originalStorage.from(bucket);
        
        return {
          ...originalBucket,
          upload: (path: string, file: any, options?: any) =>
            wrapOperation(() => originalBucket.upload(path, file, options)),
          download: (path: string) =>
            wrapOperation(() => originalBucket.download(path)),
          remove: (paths: string[]) =>
            wrapOperation(() => originalBucket.remove(paths)),
          list: (path?: string, options?: any) =>
            wrapOperation(() => originalBucket.list(path, options)),
          getPublicUrl: originalBucket.getPublicUrl.bind(originalBucket),
        };
      },
    };
  }

  /**
   * Proxy realtime methods
   */
  get realtime() {
    return this.client.realtime;
  }

  /**
   * Proxy functions methods with automatic recovery
   */
  get functions() {
    const originalFunctions = this.client.functions;
    const wrapOperation = this.wrapOperation.bind(this);

    return {
      ...originalFunctions,
      invoke: (name: string, options?: any) =>
        wrapOperation(() => originalFunctions.invoke(name, options)),
    };
  }
}

// Create and export the enhanced client
const smartSupabaseClient = new SmartSupabaseClient();

// Export the wrapped client that looks like a regular Supabase client
export const supabase = smartSupabaseClient.getClient();

// Also export auth, from, storage, etc. directly for convenience
export const auth = smartSupabaseClient.auth;
export const from = smartSupabaseClient.from.bind(smartSupabaseClient);
export const storage = smartSupabaseClient.storage;
export const realtime = smartSupabaseClient.realtime;
export const functions = smartSupabaseClient.functions;

// Export the smart client for advanced usage
export default smartSupabaseClient;