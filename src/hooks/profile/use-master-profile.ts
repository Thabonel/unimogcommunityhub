
import { User } from "@supabase/supabase-js";
import { supabase } from '@/lib/supabase';
import { UserProfileData } from './types';

export const createMasterUserProfile = async (user: User): Promise<UserProfileData> => {
  console.log("Creating default profile data for master user");
  const defaultData = {
    name: 'Development Master',
    email: user.email || 'master@development.com',
    avatarUrl: '',
    unimogModel: 'U1700L (Development)',
    unimogSeries: 'Development Series',
    unimogSpecs: null,
    unimogFeatures: null,
    about: 'This is the development master account for testing purposes.',
    location: 'Development Environment',
    website: '',
    joinDate: new Date().toISOString().split('T')[0],
    vehiclePhotoUrl: '',
    useVehiclePhotoAsProfile: false
  };
  
  // Create a profile for the master user
  try {
    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: 'Development Master',
      display_name: 'Development Master',
      bio: 'Development account for testing',
      location: 'Development Environment',
      unimog_model: 'U1700L (Development)',
      unimog_series: 'Development Series',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      email: user.email
    });
    console.log("Created profile for master user");
  } catch (err) {
    console.error("Error creating profile for master user:", err);
  }
  
  return defaultData;
};

export const isMasterUser = (user?: User | null): boolean => {
  return user?.email === 'master@development.com';
};
