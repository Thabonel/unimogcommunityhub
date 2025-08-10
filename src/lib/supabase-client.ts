/**
 * Centralized Supabase client configuration
 * This is the single source of truth for Supabase client initialization
 */

import { createClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '@/config/env';

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

// Create the Supabase client with consistent configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Only clear truly expired sessions (client-side only)
if (typeof window !== 'undefined') {
  const validateSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      // Only clear if session is actually expired
      if (!error && session && session.expires_at) {
        const now = Date.now() / 1000;
        const expiresAt = typeof session.expires_at === 'number' 
          ? session.expires_at 
          : new Date(session.expires_at).getTime() / 1000;
        
        if (expiresAt < now) {
          console.log('Session expired, clearing...');
          await supabase.auth.signOut();
        }
      }
      // Don't sign out on error - let the auth system handle it
    } catch (error) {
      // Don't automatically sign out on errors
      console.warn('Session validation error:', error);
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