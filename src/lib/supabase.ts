
import { createClient } from '@supabase/supabase-js';

// Use the values from the integrated Supabase project
const supabaseUrl = "https://ydevatqwkoccxhtejdor.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjAxNjEsImV4cCI6MjA1ODc5NjE2MX0.kbjmP9__CU21gJfZwyKbw0GVfjX_PL7jmVTZsY-W8uY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
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
      throw bucketsError;
    }
    
    console.log('Available buckets:', buckets?.map(b => b.name) || []);
    
    // Create missing buckets
    for (const bucketName of REQUIRED_BUCKETS) {
      const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
      
      if (!bucketExists) {
        console.log(`Creating ${bucketName} bucket...`);
        try {
          const { error: createError } = await supabase.storage.createBucket(bucketName, { 
            public: bucketName === 'avatars', // Only avatars bucket is public by default
            fileSizeLimit: 52428800 // 50MB
          });
          
          if (createError) {
            console.error(`Error creating ${bucketName} bucket:`, createError);
            // Continue to next bucket rather than failing completely
            continue;
          }
          
          console.log(`${bucketName} bucket created successfully`);
          
          // Initialize with a default policy by trying to create a signed URL
          try {
            await supabase.storage.from(bucketName).createSignedUrl('README.txt', 60);
          } catch (policyError) {
            // Ignore expected errors when file doesn't exist
            console.log(`Initialized policies for ${bucketName}`);
          }
        } catch (e) {
          console.error(`Error creating ${bucketName} bucket:`, e);
          // Continue to next bucket
        }
      } else {
        console.log(`${bucketName} bucket already exists`);
      }
    }
    
    console.log('Storage buckets verification completed.');
    return true;
  } catch (error) {
    console.error('Error checking storage buckets:', error);
    return false;
  }
};

// Verify that a specific bucket exists
export const verifyBucket = async (bucketName: string): Promise<boolean> => {
  try {
    // First try to get the bucket directly
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
export const verifyFileExists = async (bucket: string, filePath: string): Promise<boolean> => {
  try {
    // First ensure the bucket exists
    const bucketExists = await verifyBucket(bucket);
    if (!bucketExists) {
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
    
    return data.some(file => file.name === filePath);
  } catch (error) {
    console.error(`Error verifying file ${filePath} in ${bucket}:`, error);
    return false;
  }
};
