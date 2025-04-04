
import { Dispatch, SetStateAction, MutableRefObject } from 'react';
import { UserProfileData } from './types';
import { useToast } from '../toast';

/**
 * Sets up a timeout for profile data loading
 */
export const setupLoadingTimeout = (
  timeoutMs: number,
  timeoutRef: MutableRefObject<number | null>,
  setLoadingTimeout: Dispatch<SetStateAction<boolean>>
): void => {
  // Clear any existing timeout
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  
  // Set new timeout - using MutableRefObject instead of RefObject
  timeoutRef.current = setTimeout(() => {
    setLoadingTimeout(true);
  }, timeoutMs) as unknown as number;
};

/**
 * Clears the loading timeout if it exists
 */
export const clearLoadingTimeout = (
  timeoutRef: MutableRefObject<number | null>
): void => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }
};

/**
 * Creates minimal default user data when loading fails or times out
 */
export const createMinimalUserData = (
  userData: UserProfileData,
  userEmail?: string | null
): UserProfileData => {
  return {
    ...userData,
    name: userEmail?.split('@')[0] || 'User',
    email: userEmail || '',
    joinDate: new Date().toISOString().split('T')[0]
  };
};

/**
 * Maps database profile data to UserProfileData format
 */
export const mapProfileToUserData = (
  profile: any,
  userEmail: string | null
): UserProfileData => {
  return {
    name: profile.full_name || profile.display_name || userEmail?.split('@')[0] || 'User',
    email: userEmail || '',
    avatarUrl: profile.avatar_url || '',
    unimogModel: profile.unimog_model || '',
    unimogSeries: profile.unimog_series || null,
    unimogSpecs: profile.unimog_specs || null,
    unimogFeatures: profile.unimog_features || null,
    about: profile.bio || '',
    location: profile.location || '',
    website: profile.website || '', 
    joinDate: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    vehiclePhotoUrl: profile.vehicle_photo_url || '',
    useVehiclePhotoAsProfile: profile.use_vehicle_photo_as_profile || false
  };
};
