
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
      useVehiclePhotoAsProfile: false,
      // Add location coordinates based on the location string
      coordinates: getMockGeoDataForMasterUser('Sydney, Australia')
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
      useVehiclePhotoAsProfile: false,
      // Even in error case, provide valid coordinates
      coordinates: {
        latitude: -33.8688, 
        longitude: 151.2093
      }
    };
  }
};

// Function to get coordinates for the master user based on their location
function getMockGeoDataForMasterUser(locationString: string): { latitude: number, longitude: number } {
  const mockLocations: Record<string, [number, number]> = {
    'sydney': [-33.8688, 151.2093],
    'sydney, australia': [-33.8688, 151.2093],
    'berlin': [52.5200, 13.4050],
    'munich': [48.1351, 11.5820],
    'stuttgart': [48.7758, 9.1829],
    'hamburg': [53.5511, 9.9937],
    'frankfurt': [50.1109, 8.6821],
    'london': [51.5074, -0.1278],
    'paris': [48.8566, 2.3522],
    'new york': [40.7128, -74.0060],
    'tokyo': [35.6762, 139.6503]
  };
  
  const normalizedInput = locationString.toLowerCase();
  
  for (const [key, coords] of Object.entries(mockLocations)) {
    if (normalizedInput.includes(key)) {
      return {
        latitude: coords[0],
        longitude: coords[1]
      };
    }
  }
  
  // Default to Stuttgart (Unimog headquarters) if no match
  return {
    latitude: 48.7758,
    longitude: 9.1829
  };
}
