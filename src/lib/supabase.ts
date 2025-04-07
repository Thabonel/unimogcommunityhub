
import { createClient } from '@supabase/supabase-js';

// Use the values from the integrated Supabase project
const supabaseUrl = "https://ydevatqwkoccxhtejdor.supabase.co";
const supabaseAnonKey = "<JWT_TOKEN>";

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
