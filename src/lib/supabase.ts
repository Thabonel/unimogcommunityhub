
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

// Updated helper function to check if buckets exist and create them if needed
export const ensureStorageBuckets = async () => {
  try {
    console.log('Ensuring storage buckets exist...');
    
    // Function to check and create a bucket if needed
    const ensureBucket = async (bucketName: string) => {
      try {
        const { data, error } = await supabase.storage.getBucket(bucketName);
        
        if (error && error.message.includes('The resource was not found')) {
          console.log(`Creating ${bucketName} bucket...`);
          
          // Try to create the bucket
          const { error: createError } = await supabase.storage.createBucket(bucketName, { 
            public: true 
          });
          
          if (createError) {
            console.error(`Error creating ${bucketName} bucket:`, createError);
            return false;
          } else {
            // Set public bucket access
            const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
              public: true
            });
            
            if (updateError) {
              console.error(`Error setting ${bucketName} bucket to public:`, updateError);
            }
            
            console.log(`${bucketName} bucket created successfully.`);
            return true;
          }
        } else if (error) {
          console.error(`Error checking ${bucketName} bucket:`, error);
          return false;
        } else {
          console.log(`${bucketName} bucket already exists.`);
          
          // Update bucket to ensure it's public
          const { error: updateError } = await supabase.storage.updateBucket(bucketName, {
            public: true
          });
          
          if (updateError) {
            console.error(`Error updating ${bucketName} bucket:`, updateError);
          } else {
            console.log(`${bucketName} bucket confirmed as public.`);
          }
          
          return true;
        }
      } catch (error) {
        console.error(`Error checking/creating ${bucketName} bucket:`, error);
        return false;
      }
    };
    
    // Check each required bucket - retry on failure
    const buckets = ['profile_photos', 'avatars', 'vehicle_photos'];
    
    // Try to create each bucket with up to 2 retries
    for (const bucket of buckets) {
      let success = false;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!success && attempts < maxAttempts) {
        attempts++;
        console.log(`Attempt ${attempts} to ensure ${bucket} bucket exists...`);
        success = await ensureBucket(bucket);
        
        if (!success && attempts < maxAttempts) {
          // Wait a bit before retrying
          console.log(`Retrying ${bucket} bucket creation in 1 second...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!success) {
        console.error(`Failed to ensure ${bucket} bucket after ${maxAttempts} attempts.`);
      }
    }
    
    console.log('Storage buckets verification completed.');
  } catch (error) {
    console.error('Error checking/creating storage buckets:', error);
  }
};
