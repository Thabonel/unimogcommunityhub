

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
          const { error: createError } = await supabase.storage.createBucket(bucketName, { 
            public: true 
          });
          
          if (createError) {
            console.error(`Error creating ${bucketName} bucket:`, createError);
            return false;
          } else {
            console.log(`${bucketName} bucket created successfully.`);
            return true;
          }
        } else {
          console.log(`${bucketName} bucket already exists.`);
          return true;
        }
      } catch (error) {
        console.error(`Error checking/creating ${bucketName} bucket:`, error);
        return false;
      }
    };
    
    // Check each required bucket
    await Promise.all([
      ensureBucket('profile_photos'),
      ensureBucket('avatars'),
      ensureBucket('vehicle_photos')
    ]);
    
    console.log('Storage buckets verification completed.');
  } catch (error) {
    console.error('Error checking/creating storage buckets:', error);
  }
};

