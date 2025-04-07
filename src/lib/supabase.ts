
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

// Helper function to introduce delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Updated helper function to check if buckets exist and create them if needed
export const ensureStorageBuckets = async () => {
  try {
    console.log('Ensuring storage buckets exist...');
    
    // Function to check and create a bucket if needed
    const ensureBucket = async (bucketName: string) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          console.log(`Checking if ${bucketName} bucket exists (attempt ${attempt + 1})...`);
          
          const { data, error } = await supabase.storage.getBucket(bucketName);
          
          if (error && error.message.includes('The resource was not found')) {
            console.log(`Creating ${bucketName} bucket...`);
            
            // Try to create the bucket
            const { error: createError } = await supabase.storage.createBucket(bucketName, { 
              public: true 
            });
            
            if (createError) {
              console.error(`Error creating ${bucketName} bucket:`, createError);
              
              if (attempt < 2) {
                console.log(`Retrying in 1 second...`);
                await delay(1000);
                continue;
              }
              
              return false;
            } else {
              // Set public bucket access
              console.log(`Setting ${bucketName} bucket as public...`);
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
            
            if (attempt < 2) {
              console.log(`Retrying in 1 second...`);
              await delay(1000);
              continue;
            }
            
            return false;
          } else {
            console.log(`${bucketName} bucket already exists.`);
            
            // Update bucket to ensure it's public
            console.log(`Ensuring ${bucketName} bucket is public...`);
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
          console.error(`Unexpected error checking/creating ${bucketName} bucket:`, error);
          
          if (attempt < 2) {
            console.log(`Retrying in 1 second...`);
            await delay(1000);
            continue;
          }
          
          return false;
        }
      }
      
      return false;
    };
    
    // Check each required bucket - retry on failure
    const buckets = ['profile_photos', 'avatars', 'vehicle_photos'];
    
    // Create buckets in parallel using Promise.all
    const results = await Promise.all(
      buckets.map(bucket => ensureBucket(bucket))
    );
    
    // Check if all buckets were created successfully
    const allSuccessful = results.every(success => success);
    if (allSuccessful) {
      console.log('All storage buckets verified successfully.');
    } else {
      console.warn('Some buckets could not be verified or created.');
    }
    
    return allSuccessful;
  } catch (error) {
    console.error('Error checking/creating storage buckets:', error);
    return false;
  }
};
