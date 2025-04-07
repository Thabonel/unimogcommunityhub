
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
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        throw bucketsError;
      }
      
      console.log('Available buckets:', buckets?.map(b => b.name) || []);
      
      const manualsBucket = buckets?.find(bucket => bucket.name === 'manuals');
      
      if (!manualsBucket) {
        console.log('Creating manuals bucket...');
        const { error: createError } = await supabase.storage.createBucket('manuals', { 
          public: false,
          fileSizeLimit: 52428800 // 50MB
        });
        
        if (createError) {
          console.error('Error creating bucket:', createError);
          throw createError;
        }
        
        console.log('Manuals bucket created successfully');
        
        // Add a default bucket policy
        const { error: policyError } = await supabase.storage.from('manuals').createSignedUrl('README.txt', 60);
        if (policyError && !policyError.message.includes('not found')) {
          console.error('Error setting bucket policy:', policyError);
        }
      } else {
        console.log('Manuals bucket already exists');
      }
    } catch (e) {
      console.error('Error checking/creating manuals bucket:', e);
      // Don't throw here, let the app continue
    }
    
    console.log('Storage buckets verification completed.');
    return true;
  } catch (error) {
    console.error('Error checking storage buckets:', error);
    return false;
  }
};

// Call this function early in the app initialization
// ensureStorageBuckets(); // Don't call it here, we'll call it explicitly
