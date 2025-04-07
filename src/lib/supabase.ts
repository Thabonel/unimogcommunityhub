
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
    const { error: manualsError } = await supabase.storage.getBucket('manuals');
    
    if (manualsError) {
      console.log('Creating manuals bucket...');
      try {
        await supabase.storage.createBucket('manuals', { public: false });
        console.log('Manuals bucket created successfully');
      } catch (e) {
        console.error('Failed to create manuals bucket:', e);
      }
    }
    
    // Check if 'avatars' bucket exists - this is our fallback bucket
    const { error: avatarsError } = await supabase.storage.getBucket('avatars');
    
    if (avatarsError) {
      console.log('Creating avatars bucket as fallback...');
      try {
        await supabase.storage.createBucket('avatars', { public: true });
        console.log('Avatars bucket created successfully');
      } catch (e) {
        console.error('Failed to create avatars bucket:', e);
      }
    }
    
    // Check profile_photos bucket (created via SQL)
    const { error: profileError } = await supabase.storage.getBucket('profile_photos');
    if (profileError) {
      console.log('Profile photos bucket does not exist, will use avatars as fallback');
    }
    
    // Check vehicle_photos bucket
    const { error: vehicleError } = await supabase.storage.getBucket('vehicle_photos');
    if (vehicleError) {
      console.log('Vehicle photos bucket does not exist, will use avatars as fallback');
    }
    
    console.log('Storage buckets verification completed.');
  } catch (error) {
    console.error('Error checking storage buckets:', error);
  }
};
