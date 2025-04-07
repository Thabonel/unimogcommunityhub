
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

// Updated helper function that's more direct and doesn't try to be too clever
export const ensureStorageBuckets = async () => {
  try {
    console.log('Ensuring storage buckets exist...');
    
    // Required buckets
    const buckets = ['profile_photos', 'avatars', 'vehicle_photos'];
    
    // Check each bucket - simple and direct approach
    for (const bucketName of buckets) {
      console.log(`Checking bucket: ${bucketName}`);
      
      try {
        // First check if bucket exists
        const { data, error } = await supabase.storage.getBucket(bucketName);
        
        if (error) {
          if (error.message.includes('not found')) {
            console.log(`Creating bucket: ${bucketName}`);
            // Create bucket with public access
            const { error: createError } = await supabase.storage.createBucket(
              bucketName, 
              { public: true }
            );
            
            if (createError) {
              console.error(`Failed to create bucket ${bucketName}:`, createError);
              continue; // Try the next bucket
            }
            
            console.log(`Successfully created bucket: ${bucketName}`);
          } else {
            console.error(`Error checking bucket ${bucketName}:`, error);
          }
        } else {
          console.log(`Bucket exists: ${bucketName}`);
          
          // Ensure bucket is public
          const { error: updateError } = await supabase.storage.updateBucket(
            bucketName,
            { public: true }
          );
          
          if (updateError) {
            console.error(`Failed to update bucket ${bucketName} to public:`, updateError);
          } else {
            console.log(`Ensured bucket ${bucketName} is public`);
          }
        }
      } catch (error) {
        console.error(`Unexpected error with bucket ${bucketName}:`, error);
      }
    }
    
    console.log('Storage bucket setup complete');
    return true;
  } catch (error) {
    console.error('Error in ensureStorageBuckets:', error);
    return false;
  }
};
