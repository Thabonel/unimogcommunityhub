
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
  return {
    name: 'Master User',
    email: user.email || 'master@development.com',
    avatarUrl: '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
    unimogModel: 'U1700L Master Edition',
    unimogSeries: 'Master Series',
    unimogSpecs: 'Professional Grade, All-Terrain',
    unimogFeatures: 'Full off-road capability, Advanced electronics, Custom equipment',
    about: 'Master user account with full system access.',
    location: 'System Core',
    website: 'https://unimogcommunity.com',
    joinDate: new Date().toISOString().split('T')[0],
    vehiclePhotoUrl: '',
    useVehiclePhotoAsProfile: false
  };
};
