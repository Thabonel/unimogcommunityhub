
import { User } from '@supabase/supabase-js';
import { UserProfileData } from './types';

// Check if a user is the master user (development)
export const isMasterUser = (user: User | null): boolean => {
  if (!user) return false;
  
  // Master user has a specific email
  const masterEmail = user.email === 'master@development.com';
  return masterEmail;
};

// Create a default profile for master users
export const createMasterUserProfile = async (user: User): Promise<UserProfileData> => {
  try {
    console.log("Creating master user profile for:", user.email);
    
    // Return a fully populated profile object with default values
    return {
      name: 'Master User',
      email: user?.email || 'master@development.com',
      avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
      unimogModel: 'U1700L Master Edition',
      unimogSeries: 'Master Series',
      unimogSpecs: {
        engine: 'OM352A 5.7L',
        power: '124 hp',
        transmission: '8 forward, 8 reverse'
      },
      unimogFeatures: [
        'Full off-road capability', 
        'Advanced electronics', 
        'Custom equipment'
      ],
      about: 'Master user account with full system access.',
      location: 'Sydney, Australia',
      website: 'https://unimogcommunity.com',
      joinDate: new Date().toISOString().split('T')[0],
      vehiclePhotoUrl: '',
      useVehiclePhotoAsProfile: false
    };
  } catch (error) {
    console.error("Error in createMasterUserProfile:", error);
    // Provide a minimal fallback profile in case of error
    return {
      name: 'Master User',
      email: user?.email || 'master@development.com',
      avatarUrl: '',
      unimogModel: 'U1700L',
      unimogSeries: null,
      unimogSpecs: null,
      unimogFeatures: null,
      about: 'Master user account',
      location: 'Sydney, Australia',
      website: '',
      joinDate: new Date().toISOString().split('T')[0],
      vehiclePhotoUrl: '',
      useVehiclePhotoAsProfile: false
    };
  }
};
