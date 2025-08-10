/**
 * Centralized Supabase client configuration
 * This is the single source of truth for Supabase client initialization
 * SINGLETON PATTERN: Only ONE instance can exist
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config/env';
import { validateEnvironment } from '@/utils/validateEnvironment';

// Track instance creation for debugging
let instanceCount = 0;
let clientInstance: SupabaseClient | null = null;

// Validate environment on load
const validation = validateEnvironment();
if (!validation.isValid) {
  console.error('❌ Environment validation failed:', validation.errors);
}

// Validate environment variables
const supabaseUrl = SUPABASE_CONFIG.url;
const supabaseAnonKey = SUPABASE_CONFIG.anonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create a single Supabase client instance with singleton enforcement
function createSupabaseClient() {
  if (clientInstance) {
    console.warn('⚠️ Supabase client already exists! Returning existing instance.', {
      instanceCount,
      stack: new Error().stack
    });
    return clientInstance;
  }

  instanceCount++;
  
  if (instanceCount > 1) {
    console.error('🚨 Multiple Supabase client instances detected!', {
      count: instanceCount,
      message: 'This can cause "Invalid API key" errors',
      stack: new Error().stack
    });
  }

  console.log('✅ Creating Supabase client instance', {
    instanceNumber: instanceCount,
    url: supabaseUrl?.substring(0, 30) + '...',
    hasKey: !!supabaseAnonKey,
    timestamp: new Date().toISOString()
  });

  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  // Add instance tracking for debugging
  (clientInstance as any).__instanceId = instanceCount;
  (clientInstance as any).__createdAt = new Date().toISOString();

  return clientInstance;
}

// Export the singleton instance
export const supabase = createSupabaseClient();

// Debug function to check instance status
export function getSupabaseInstanceInfo() {
  return {
    instanceCount,
    hasInstance: !!clientInstance,
    instanceId: (clientInstance as any)?.__instanceId,
    createdAt: (clientInstance as any)?.__createdAt,
    validation
  };
}

// Storage bucket configuration
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  PROFILE_PHOTOS: 'avatars',
  VEHICLE_PHOTOS: 'vehicles',
  VEHICLES: 'vehicles',
  MANUALS: 'manuals',
  ARTICLE_FILES: 'articles',
  ARTICLES: 'articles',
  SITE_ASSETS: 'assets',
  ASSETS: 'assets',
} as const;

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
    }
    return true;
  } catch (error: any) {
    console.error(`Failed to create/check bucket ${bucketName}:`, error);
    return false;
  }
};

// Helper function to ensure all storage buckets exist
export const ensureStorageBuckets = async () => {
  try {
    const requiredBuckets = [
      { name: 'avatars' as BucketName, isPublic: true },
      { name: 'vehicles' as BucketName, isPublic: true },
      { name: 'manuals' as BucketName, isPublic: false },
      { name: 'articles' as BucketName, isPublic: true },
      { name: 'assets' as BucketName, isPublic: true },
    ];
    
    const results = await Promise.allSettled(
      requiredBuckets.map(bucket => 
        createBucketIfNotExists(bucket.name, bucket.isPublic)
      )
    );
    
    const failedBuckets = results
      .map((result, index) => 
        result.status === 'rejected' ? requiredBuckets[index].name : null
      )
      .filter(Boolean);
    
    if (failedBuckets.length > 0) {
      console.error(`Failed to create buckets: ${failedBuckets.join(', ')}`);
      return { success: false, error: 'Failed to create some required buckets', details: failedBuckets };
    }
    
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
    const bucketExists = await verifyBucket(bucket);
    if (!bucketExists) {
      return false;
    }
    
    const pathParts = filePath.split('/');
    const searchPath = pathParts.length > 1 ? pathParts.slice(1).join('/') : filePath;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(pathParts[0] || '', {
        search: searchPath
      });
    
    if (error) {
      console.error(`Error checking if file exists in ${bucket}:`, error);
      return false;
    }
    
    const fileName = pathParts[pathParts.length - 1];
    const fileExists = Array.isArray(data) && data.some(file => file.name === fileName);
    return fileExists;
  } catch (error) {
    console.error(`Error verifying file ${filePath} in ${bucket}:`, error);
    return false;
  }
};

// Export default
export default supabase;