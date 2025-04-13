
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

// List of buckets the app requires
const REQUIRED_BUCKETS = ['manuals', 'profile_photos', 'vehicle_photos', 'avatars'];

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
    
    // Create missing buckets
    for (const bucketName of REQUIRED_BUCKETS) {
      const bucketExists = existingBuckets.includes(bucketName);
      
      if (!bucketExists) {
        console.log(`Creating ${bucketName} bucket...`);
        try {
          const { error: createError } = await supabase.storage.createBucket(bucketName, { 
            public: bucketName === 'avatars', // Only avatars bucket is public by default
            fileSizeLimit: 52428800 // 50MB
          });
          
          if (createError) {
            console.error(`Error creating ${bucketName} bucket:`, createError);
            failedBuckets.push({ name: bucketName, error: createError.message });
            continue;
          }
          
          createdBuckets.push(bucketName);
          console.log(`${bucketName} bucket created successfully`);
        } catch (e) {
          console.error(`Exception creating ${bucketName} bucket:`, e);
          failedBuckets.push({ name: bucketName, error: e.message });
        }
      } else {
        console.log(`${bucketName} bucket already exists`);
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
      
      // Try to create the bucket if it doesn't exist
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: bucketName === 'avatars',
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error(`Failed to create ${bucketName} bucket:`, createError);
        return { success: false, error: createError.message };
      }
      
      console.log(`Successfully created ${bucketName} bucket`);
      return { success: true };
    }
    
    console.log(`Bucket ${bucketName} exists:`, data);
    return { success: true };
  } catch (error) {
    console.error(`Error verifying bucket ${bucketName}:`, error);
    return { success: false, error: error.message };
  }
};

// Helper to check if a file exists in a bucket
export const verifyFileExists = async (bucket, filePath) => {
  try {
    console.log(`Checking if file exists: ${bucket}/${filePath}`);
    
    // First ensure the bucket exists
    const bucketVerified = await verifyBucket(bucket);
    if (!bucketVerified.success) {
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
    
    const fileExists = data.some(file => file.name === filePath);
    console.log(`File ${filePath} exists in ${bucket}: ${fileExists}`);
    return fileExists;
  } catch (error) {
    console.error(`Error verifying file ${filePath} in ${bucket}:`, error);
    return false;
  }
};

// Export as default for backward compatibility
export default supabase;
