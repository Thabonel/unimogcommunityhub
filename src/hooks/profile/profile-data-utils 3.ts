
import { UserProfileData } from './types';

// Create minimal user data with default values
export const createMinimalUserData = (
  existingData: UserProfileData,
  email: string | undefined
): UserProfileData => {
  return {
    ...existingData,
    name: email?.split('@')[0] || 'User',
    email: email || '',
    avatarUrl: existingData.avatarUrl || '',
    about: existingData.about || 'No description available',
    location: existingData.location || 'Unknown location',
    joinDate: existingData.joinDate || new Date().toISOString().split('T')[0],
    coordinates: existingData.coordinates || {
      latitude: 40.0,
      longitude: -99.5
    }
  };
};

// Map profile data from database to UserProfileData format
export const mapProfileToUserData = (profile: any, email: string): UserProfileData => {
  return {
    name: profile.full_name || profile.display_name || email?.split('@')[0] || 'User',
    email: email || profile.email || '',
    avatarUrl: profile.avatar_url || '',
    unimogModel: profile.unimog_model || '',
    unimogSeries: profile.unimog_series || null,
    unimogSpecs: profile.unimog_specs || null,
    unimogFeatures: profile.unimog_features || null,
    about: profile.bio || profile.about || '',
    location: profile.location || '',
    website: profile.website || '',
    joinDate: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    vehiclePhotoUrl: profile.vehicle_photo_url || '',
    useVehiclePhotoAsProfile: profile.use_vehicle_photo_as_profile || false,
    coordinates: profile.coordinates || {
      latitude: profile.latitude || 40.0,
      longitude: profile.longitude || -99.5
    }
  };
};

// Timeout utilities for loading profiles
export const setupLoadingTimeout = (
  timeoutMs: number,
  timeoutRef: React.MutableRefObject<number | null>,
  setLoadingTimeout: (timeout: boolean) => void
): void => {
  // Clear any existing timeout first
  clearLoadingTimeout(timeoutRef);
  
  // Set new timeout
  timeoutRef.current = window.setTimeout(() => {
    console.log(`Loading timeout reached after ${timeoutMs}ms`);
    setLoadingTimeout(true);
  }, timeoutMs);
};

export const clearLoadingTimeout = (
  timeoutRef: React.MutableRefObject<number | null>
): void => {
  if (timeoutRef.current !== null) {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
};
