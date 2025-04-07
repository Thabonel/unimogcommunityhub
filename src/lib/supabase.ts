
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

// Helper function to check if buckets exist and create them if needed
export const ensureStorageBuckets = async () => {
  try {
    console.log('Ensuring storage buckets exist...');
    
    // Check if 'manuals' bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const manualsBucket = buckets?.find(bucket => bucket.name === 'manuals');
      
      if (!manualsBucket) {
        console.log('Creating manuals bucket...');
        await supabase.storage.createBucket('manuals', { public: false });
        console.log('Manuals bucket created successfully');
        
        // Set up bucket policy to allow authenticated users to read
        await supabase.storage.from('manuals').createSignedUrl('test.txt', 1);
      } else {
        console.log('Manuals bucket already exists');
      }
    } catch (e) {
      console.error('Error checking/creating manuals bucket:', e);
    }
    
    console.log('Storage buckets verification completed.');
  } catch (error) {
    console.error('Error checking storage buckets:', error);
  }
};

// Call this function early in the app initialization
ensureStorageBuckets();
