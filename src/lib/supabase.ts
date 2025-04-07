
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
    
    // Check if the avatars bucket exists
    const { data: avatarsBucket, error: avatarsError } = await supabase.storage.getBucket('avatars');
    
    if (avatarsError && avatarsError.message.includes('The resource was not found')) {
      console.log('Creating avatars bucket...');
      const { error } = await supabase.storage.createBucket('avatars', { public: true });
      if (error) {
        console.error('Error creating avatars bucket:', error);
      } else {
        console.log('Avatars bucket created successfully.');
      }
    } else {
      console.log('Avatars bucket already exists.');
    }
    
    // Check if the vehicle_photos bucket exists
    const { data: vehicleBucket, error: vehicleError } = await supabase.storage.getBucket('vehicle_photos');
    
    if (vehicleError && vehicleError.message.includes('The resource was not found')) {
      console.log('Creating vehicle_photos bucket...');
      const { error } = await supabase.storage.createBucket('vehicle_photos', { public: true });
      if (error) {
        console.error('Error creating vehicle_photos bucket:', error);
      } else {
        console.log('Vehicle_photos bucket created successfully.');
      }
    } else {
      console.log('Vehicle_photos bucket already exists.');
    }
    
    console.log('Storage buckets verification completed.');
  } catch (error) {
    console.error('Error checking/creating storage buckets:', error);
  }
};
