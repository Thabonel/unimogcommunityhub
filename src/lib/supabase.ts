
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
    // Check if the avatars bucket exists
    const { data: avatarsBucket, error: avatarsError } = await supabase.storage.getBucket('avatars');
    
    if (avatarsError && avatarsError.message.includes('The resource was not found')) {
      console.log('Creating avatars bucket...');
      await supabase.storage.createBucket('avatars', { public: true });
    }
    
    // Check if the vehicle_photos bucket exists
    const { data: vehicleBucket, error: vehicleError } = await supabase.storage.getBucket('vehicle_photos');
    
    if (vehicleError && vehicleError.message.includes('The resource was not found')) {
      console.log('Creating vehicle_photos bucket...');
      await supabase.storage.createBucket('vehicle_photos', { public: true });
    }
    
    console.log('Storage buckets verified.');
  } catch (error) {
    console.error('Error checking/creating storage buckets:', error);
  }
};

