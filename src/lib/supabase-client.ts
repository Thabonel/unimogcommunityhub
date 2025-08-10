/**
 * Centralized Supabase client configuration with automatic recovery
 * This is the single source of truth for Supabase client initialization
 * Features: automatic retry, circuit breaker, token recovery, and graceful error handling
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config/env';
import authRecoveryService from '@/services/core/AuthRecoveryService';
import initSequencer, { InitializationPhase } from '@/utils/InitializationSequencer';
import { logger } from '@/utils/logger';

// Validate environment variables with helpful error messages
// DO NOT USE HARDCODED FALLBACKS - they cause auth issues
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseAnonKey = SUPABASE_CONFIG.anonKey;

// ALWAYS debug log to catch initialization issues
if (typeof window !== 'undefined') {
  console.log('🔍 Supabase Client Initialization:', {
    url: supabaseUrl,
    keyLength: supabaseAnonKey?.length || 0,
    keyPrefix: supabaseAnonKey?.substring(0, 50) || 'NOT SET',
    envUrl: import.meta.env.VITE_SUPABASE_URL,
    envKeyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
    envVarsPresent: {
      VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      NODE_ENV: import.meta.env.NODE_ENV || 'undefined',
      MODE: import.meta.env.MODE || 'undefined'
    },
    timestamp: new Date().toISOString()
  });
}

// Comprehensive validation with specific error messages
const validateSupabaseConfig = () => {
  const errors = [];
  
  if (!supabaseUrl || supabaseUrl === '') {
    errors.push('VITE_SUPABASE_URL is missing or empty');
  } else if (!supabaseUrl.startsWith('https://')) {
    errors.push('VITE_SUPABASE_URL must start with https://');
  } else if (!supabaseUrl.includes('supabase.co')) {
    errors.push('VITE_SUPABASE_URL must be a valid Supabase URL');
  }
  
  if (!supabaseAnonKey || supabaseAnonKey === '') {
    errors.push('VITE_SUPABASE_ANON_KEY is missing or empty');
  } else if (!supabaseAnonKey.startsWith('eyJ')) {
    errors.push('VITE_SUPABASE_ANON_KEY must be a valid JWT token');
  } else if (supabaseAnonKey.length < 100) {
    errors.push('VITE_SUPABASE_ANON_KEY appears to be too short (possible truncation)');
  }
  
  if (errors.length > 0) {
    console.error('🚨 SUPABASE CONFIGURATION ERRORS:');
    errors.forEach(error => console.error(`  ❌ ${error}`));
    console.error('');
    console.error('📋 SETUP INSTRUCTIONS:');
    console.error('');
    console.error('For DEVELOPMENT:');
    console.error('1. Check your .env file in project root');
    console.error('2. Ensure it contains:');
    console.error('   VITE_SUPABASE_URL=https://your-project.supabase.co');
    console.error('   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...');
    console.error('3. Restart: npm run dev');
    console.error('');
    console.error('For NETLIFY DEPLOYMENT:');
    console.error('1. Netlify Dashboard → Site Settings → Environment Variables');
    console.error('2. Add both variables with exact same names');
    console.error('3. Get keys from: Supabase Dashboard → Settings → API');
    console.error('4. Redeploy the site');
    console.error('');
    
    throw new Error(`❌ Supabase configuration invalid: ${errors.join(', ')}`);
  }
};

validateSupabaseConfig();

// Enhanced Supabase client with automatic recovery
class EnhancedSupabaseClient {
  private client: SupabaseClient;
  private recoveryService: typeof authRecoveryService;
  private sequencer: typeof initSequencer;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  constructor(url: string, key: string) {
    // Create base client
    this.client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        debug: import.meta.env.DEV,
      },
      global: {
        headers: {
          'X-Client-Info': 'unimog-community-hub/1.0.0',
        },
      },
    });

    // Initialize recovery service
    this.recoveryService = authRecoveryService;
    this.sequencer = initSequencer;

    // Set up initialization sequence
    this.setupInitializationSequence();

    // Set up event handlers
    this.setupEventHandlers();

    // Start initialization
    this.initialize();
  }

  private setupInitializationSequence(): void {
    // Environment validation step
    this.sequencer.registerStep({
      id: 'environment-check',
      phase: InitializationPhase.ENVIRONMENT_CHECK,
      name: 'Validate Environment Configuration',
      execute: async () => {
        const isValid = !!(supabaseUrl && supabaseAnonKey);
        if (!isValid) {
          throw new Error('Invalid environment configuration');
        }
        return { valid: true };
      },
      timeout: 5000,
      critical: true,
    });

    // Client initialization step
    this.sequencer.registerStep({
      id: 'client-init',
      phase: InitializationPhase.CLIENT_INIT,
      name: 'Initialize Supabase Client',
      execute: async () => {
        // Client is already created, just verify it's working
        const { error } = await this.client.from('profiles').select('id').limit(1);
        return { clientReady: !error };
      },
      dependencies: ['environment-check'],
      timeout: 10000,
      critical: false, // Non-critical in case of initial connection issues
    });

    // Auth initialization step
    this.sequencer.registerStep({
      id: 'auth-init',
      phase: InitializationPhase.AUTH_INIT,
      name: 'Initialize Authentication',
      execute: async () => {
        const { data: { session }, error } = await this.client.auth.getSession();
        
        if (error && this.isRecoverableAuthError(error)) {
          // Attempt recovery
          const recoveryResult = await this.recoveryService.recover(this.client, error);
          return { session: recoveryResult.session, recovered: recoveryResult.success };
        }
        
        return { session, initialized: true };
      },
      dependencies: ['client-init'],
      timeout: 15000,
      critical: false,
    });

    // Recovery service initialization
    this.sequencer.registerStep({
      id: 'recovery-init',
      phase: InitializationPhase.RECOVERY_INIT,
      name: 'Initialize Recovery Service',
      execute: async () => {
        // Recovery service is already initialized
        return { recoveryReady: true };
      },
      dependencies: ['auth-init'],
      timeout: 5000,
      critical: true,
    });
  }

  private setupEventHandlers(): void {
    // Listen for auth state changes
    this.client.auth.onAuthStateChange(async (event, session) => {
      logger.debug('Auth state change detected', { 
        component: 'EnhancedSupabaseClient', 
        action: 'auth_state_change',
        event 
      });

      // Handle token refresh errors
      if (event === 'TOKEN_REFRESHED' && !session) {
        logger.warn('Token refresh failed, attempting recovery', { 
          component: 'EnhancedSupabaseClient', 
          action: 'token_refresh_failed' 
        });
        
        const recoveryResult = await this.recoveryService.recover(this.client);
        if (!recoveryResult.success) {
          logger.error('Failed to recover from token refresh failure', recoveryResult.error, { 
            component: 'EnhancedSupabaseClient', 
            action: 'recovery_failed' 
          });
        }
      }
    });

    // Listen for recovery events
    this.recoveryService.on('recovery:success', (data) => {
      logger.info('Authentication recovered successfully', { 
        component: 'EnhancedSupabaseClient', 
        action: 'recovery_success',
        attempts: data.attempts 
      });
    });

    this.recoveryService.on('circuit-breaker:opened', () => {
      logger.error('Authentication circuit breaker opened', undefined, { 
        component: 'EnhancedSupabaseClient', 
        action: 'circuit_breaker_opened' 
      });
    });
  }

  private async initialize(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private async performInitialization(): Promise<void> {
    try {
      logger.info('Starting enhanced Supabase client initialization', { 
        component: 'EnhancedSupabaseClient', 
        action: 'init_start' 
      });

      await this.sequencer.initialize();
      this.isInitialized = true;

      logger.info('Enhanced Supabase client initialized successfully', { 
        component: 'EnhancedSupabaseClient', 
        action: 'init_success' 
      });

    } catch (error) {
      logger.error('Enhanced Supabase client initialization failed', error as Error, { 
        component: 'EnhancedSupabaseClient', 
        action: 'init_failed' 
      });
      
      // Even if initialization fails, we still want to provide the client
      // but with degraded functionality
      this.isInitialized = false;
    }
  }

  private isRecoverableAuthError(error: any): boolean {
    const errorMessage = error?.message || '';
    return (
      errorMessage.includes('JWT expired') ||
      errorMessage.includes('refresh_token_not_found') ||
      errorMessage.includes('Invalid API key') ||
      errorMessage.includes('Network')
    );
  }

  // Proxy auth methods with automatic recovery
  get auth() {
    const originalAuth = this.client.auth;
    
    return {
      ...originalAuth,
      getSession: async () => {
        try {
          const result = await originalAuth.getSession();
          
          if (result.error && this.isRecoverableAuthError(result.error)) {
            const recoveryResult = await this.recoveryService.recover(this.client, result.error);
            if (recoveryResult.success) {
              return { data: { session: recoveryResult.session }, error: null };
            }
          }
          
          return result;
        } catch (error) {
          if (this.isRecoverableAuthError(error)) {
            const recoveryResult = await this.recoveryService.recover(this.client, error);
            if (recoveryResult.success) {
              return { data: { session: recoveryResult.session }, error: null };
            }
          }
          throw error;
        }
      },
      
      refreshSession: async () => {
        try {
          const result = await originalAuth.refreshSession();
          
          if (result.error && this.isRecoverableAuthError(result.error)) {
            const recoveryResult = await this.recoveryService.recover(this.client, result.error);
            if (recoveryResult.success) {
              return { 
                data: { 
                  session: recoveryResult.session, 
                  user: recoveryResult.user 
                }, 
                error: null 
              };
            }
          }
          
          return result;
        } catch (error) {
          if (this.isRecoverableAuthError(error)) {
            const recoveryResult = await this.recoveryService.recover(this.client, error);
            if (recoveryResult.success) {
              return { 
                data: { 
                  session: recoveryResult.session, 
                  user: recoveryResult.user 
                }, 
                error: null 
              };
            }
          }
          throw error;
        }
      },
    };
  }

  // Proxy other client methods
  get from() {
    return this.client.from.bind(this.client);
  }

  get storage() {
    return this.client.storage;
  }

  get functions() {
    return this.client.functions;
  }

  get channel() {
    return this.client.channel.bind(this.client);
  }

  get rest() {
    return this.client.rest;
  }

  // Get the underlying client for advanced use cases
  getClient(): SupabaseClient {
    return this.client;
  }

  // Check if client is initialized
  getIsInitialized(): boolean {
    return this.isInitialized;
  }

  // Wait for initialization to complete
  async waitForInitialization(): Promise<void> {
    await this.sequencer.waitForInitialization();
  }

  // Get recovery state
  getRecoveryState() {
    return this.recoveryService.getRecoveryState();
  }

  // Manual recovery trigger
  async recoverAuth() {
    return this.recoveryService.recover(this.client);
  }
}

// Create enhanced client instance
const enhancedClient = new EnhancedSupabaseClient(supabaseUrl, supabaseAnonKey);

// Export the enhanced client with backward compatibility
export const supabase = enhancedClient as any;

// Enhanced session validation with recovery (client-side only)
if (typeof window !== 'undefined') {
  const validateSession = async () => {
    try {
      // Wait for client initialization before validation
      await enhancedClient.waitForInitialization();
      
      const { data: { session }, error } = await enhancedClient.auth.getSession();
      
      // Only clear if session is actually expired
      if (!error && session && session.expires_at) {
        const now = Date.now() / 1000;
        const expiresAt = typeof session.expires_at === 'number' 
          ? session.expires_at 
          : new Date(session.expires_at).getTime() / 1000;
        
        if (expiresAt < now) {
          logger.info('Session expired, attempting recovery', { 
            component: 'supabase-client', 
            action: 'session_expired' 
          });
          
          // Try recovery first before signing out
          const recoveryResult = await enhancedClient.recoverAuth();
          if (!recoveryResult.success) {
            logger.info('Recovery failed, signing out', { 
              component: 'supabase-client', 
              action: 'recovery_failed_signout' 
            });
            await enhancedClient.auth.signOut();
          }
        }
      }
      // Don't sign out on error - let the recovery system handle it
    } catch (error) {
      // Don't automatically sign out on errors - enhanced client handles recovery
      logger.warn('Session validation error - recovery system will handle', { 
        component: 'supabase-client', 
        action: 'session_validation_error',
        error: (error as Error).message 
      });
    }
  };
  
  validateSession();
}

// Convenience export as default
export default supabase;

// Storage bucket configuration - simplified bucket names (no spaces, underscores, or capitals)
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',          // User profile photos
  PROFILE_PHOTOS: 'avatars',    // Use avatars bucket for profile photos
  VEHICLE_PHOTOS: 'vehicles',   // Vehicle photos
  VEHICLES: 'vehicles',         // Alternative name for vehicle photos
  MANUALS: 'manuals',          // PDF manuals
  ARTICLE_FILES: 'articles',   // Article images
  ARTICLES: 'articles',        // Alternative name
  SITE_ASSETS: 'assets',       // Site assets
  ASSETS: 'assets',            // Alternative name
} as const;

// Export the type of bucket names for TypeScript
export type BucketName = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS];

// Helper function to check if a bucket exists
export const checkBucketExists = async (bucketName: BucketName): Promise<boolean> => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    return !error && !!data;
  } catch (error) {
    console.error(`Error checking if bucket ${bucketName} exists:`, error);
    return false;
  }
};

// Helper function to create a bucket if it doesn't exist
export const createBucketIfNotExists = async (bucketName: BucketName, isPublic = true): Promise<boolean> => {
  try {
    // First check if bucket exists
    const bucketExists = await checkBucketExists(bucketName);
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${bucketName}`);
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (error) {
        throw error;
      }
      
      console.log(`Successfully created bucket: ${bucketName}`);
      return true;
    } else {
      console.log(`Bucket already exists: ${bucketName}`);
      return true;
    }
  } catch (error: any) {
    console.error(`Failed to create/check bucket ${bucketName}:`, error);
    return false;
  }
};

// Helper function to ensure all storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    console.log('Ensuring storage buckets exist...');
    
    // Define all required buckets with their settings
    const requiredBuckets = [
      { name: 'avatars', isPublic: true },
      { name: 'vehicles', isPublic: true },
      { name: 'manuals', isPublic: false },
      { name: 'articles', isPublic: true },
      { name: 'assets', isPublic: true },
    ];
    
    // Create buckets in parallel for better performance
    const results = await Promise.allSettled(
      requiredBuckets.map(bucket => 
        createBucketIfNotExists(bucket.name, bucket.isPublic)
      )
    );
    
    // Check for any failures
    const failedBuckets = results
      .map((result, index) => 
        result.status === 'rejected' ? requiredBuckets[index].name : null
      )
      .filter(Boolean);
    
    if (failedBuckets.length > 0) {
      console.error(`Failed to create buckets: ${failedBuckets.join(', ')}`);
      return { 
        success: false, 
        error: 'Failed to create some required buckets', 
        details: failedBuckets 
      };
    }
    
    console.log('Storage buckets verification completed successfully.');
    return { success: true };
  } catch (error: any) {
    console.error('Error checking storage buckets:', error);
    return { success: false, error: error.message };
  }
};

// Verify that a specific bucket exists
export const verifyBucket = async (bucketName: BucketName): Promise<boolean> => {
  return await createBucketIfNotExists(bucketName);
};

// Helper to check if a file exists in a bucket
export const verifyFileExists = async (bucket: BucketName, filePath: string): Promise<boolean> => {
  try {
    console.log(`Checking if file exists: ${bucket}/${filePath}`);
    
    // First ensure the bucket exists
    const bucketExists = await verifyBucket(bucket);
    if (!bucketExists) {
      console.error(`Bucket ${bucket} does not exist, cannot check file`);
      return false;
    }
    
    // Extract the path without the user ID prefix for checking
    const pathParts = filePath.split('/');
    const searchPath = pathParts.length > 1 ? pathParts.slice(1).join('/') : filePath;
    
    // Try to get the file metadata
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(pathParts[0] || '', {
        search: searchPath
      });
    
    if (error) {
      console.error(`Error checking if file exists in ${bucket}:`, error);
      return false;
    }
    
    // If we got an array of files, check if our file is in there
    const fileName = pathParts[pathParts.length - 1];
    const fileExists = Array.isArray(data) && data.some(file => file.name === fileName);
    console.log(`File ${fileName} exists in ${bucket}/${pathParts[0] || ''}: ${fileExists}`);
    return fileExists;
  } catch (error) {
    console.error(`Error verifying file ${filePath} in ${bucket}:`, error);
    return false;
  }
};