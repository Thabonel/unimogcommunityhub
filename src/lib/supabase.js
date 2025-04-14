
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjAxNjEsImV4cCI6MjA1ODc5NjE2MX0.kbjmP9__CU21gJfZwyKbw0GVfjX_PL7jmVTZsY-W8uY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Define a consistent list of bucket names
// Using Object.freeze() to make the object immutable (similar to 'as const' in TypeScript)
export const STORAGE_BUCKETS = Object.freeze({
  AVATARS: 'avatars',
  PROFILE_PHOTOS: 'profile_photos',
  VEHICLE_PHOTOS: 'vehicle_photos',
  MANUALS: 'manuals',
});

// Helper function to check if buckets exist and create them if needed
export const ensureStorageBuckets = async () => {
  try {
    console.log('Ensuring storage buckets exist...');
    
    // Check existing buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return { success: false, error: bucketsError.message };
    }
    
    const existingBuckets = buckets?.map(b => b.name) || [];
    console.log('Available buckets:', existingBuckets);
    
    // Track created buckets for logging
    const createdBuckets = [];
    const failedBuckets = [];
    
    // Define all required buckets with their settings
    const requiredBuckets = [
      { name: STORAGE_BUCKETS.AVATARS, isPublic: true },
      { name: STORAGE_BUCKETS.PROFILE_PHOTOS, isPublic: true },
      { name: STORAGE_BUCKETS.VEHICLE_PHOTOS, isPublic: true },
      { name: STORAGE_BUCKETS.MANUALS, isPublic: false },
    ];
    
    // Create missing buckets
    for (const bucket of requiredBuckets) {
      const bucketExists = existingBuckets.includes(bucket.name);
      
      if (!bucketExists) {
        console.log(`Creating ${bucket.name} bucket...`);
        try {
          const { error: createError } = await supabase.storage.createBucket(bucket.name, { 
            public: bucket.isPublic,
            fileSizeLimit: 52428800 // 50MB
          });
          
          if (createError) {
            console.error(`Error creating ${bucket.name} bucket:`, createError);
            failedBuckets.push({ name: bucket.name, error: createError.message });
            continue;
          }
          
          // If bucket creation was successful, update RLS policy if needed
          if (bucket.isPublic) {
            // Note: We can't directly set RLS policies here in code,
            // but we'll log a reminder in case additional SQL setup is needed
            console.log(`Remember to set public access policy for ${bucket.name} bucket`);
          }
          
          createdBuckets.push(bucket.name);
          console.log(`${bucket.name} bucket created successfully`);
        } catch (e) {
          console.error(`Exception creating ${bucket.name} bucket:`, e);
          failedBuckets.push({ name: bucket.name, error: e.message });
        }
      } else {
        console.log(`${bucket.name} bucket already exists`);
      }
    }
    
    // Log summary of operation
    if (createdBuckets.length > 0) {
      console.log(`Created buckets: ${createdBuckets.join(', ')}`);
    }
    
    if (failedBuckets.length > 0) {
      console.error(`Failed to create buckets:`, failedBuckets);
      return { success: false, error: 'Failed to create some required buckets', details: failedBuckets };
    }
    
    console.log('Storage buckets verification completed successfully.');
    return { success: true };
  } catch (error) {
    console.error('Error checking storage buckets:', error);
    return { success: false, error: error.message };
  }
};

// Verify that a specific bucket exists
export const verifyBucket = async (bucketName) => {
  try {
    console.log(`Verifying bucket: ${bucketName}`);
    
    // First check if bucket exists
    const { data, error } = await supabase.storage.getBucket(bucketName);
    
    if (error) {
      console.log(`Bucket ${bucketName} doesn't exist or can't be accessed, attempting to create...`);
      
      // Get the default publicity setting for this bucket
      let isPublic = bucketName === STORAGE_BUCKETS.AVATARS || 
                      bucketName === STORAGE_BUCKETS.PROFILE_PHOTOS || 
                      bucketName === STORAGE_BUCKETS.VEHICLE_PHOTOS;
      
      // Try to create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error(`Failed to create ${bucketName} bucket:`, createError);
        return false;
      }
      
      console.log(`Successfully created ${bucketName} bucket`);
      return true;
    }
    
    console.log(`Bucket ${bucketName} exists:`, data);
    return true;
  } catch (error) {
    console.error(`Error verifying bucket ${bucketName}:`, error);
    return false;
  }
};

// Helper to check if a file exists in a bucket
export const verifyFileExists = async (bucket, filePath) => {
  try {
    console.log(`Checking if file exists: ${bucket}/${filePath}`);
    
    // First ensure the bucket exists
    const bucketExists = await verifyBucket(bucket);
    if (!bucketExists) {
      console.error(`Bucket ${bucket} does not exist, cannot check file`);
      return false;
    }
    
    // Try to get the file metadata
    const { data, error } = await supabase.storage
      .from(bucket)
      .list('', {
        search: filePath
      });
    
    if (error) {
      console.error(`Error checking if file exists in ${bucket}:`, error);
      return false;
    }
    
    // If we got an array of files, check if our file is in there
    const fileExists = Array.isArray(data) && data.some(file => file.name === filePath);
    console.log(`File ${filePath} exists in ${bucket}: ${fileExists}`);
    return fileExists;
  } catch (error) {
    console.error(`Error verifying file ${filePath} in ${bucket}:`, error);
    return false;
  }
};

// Export as default for backward compatibility
export default supabase;
