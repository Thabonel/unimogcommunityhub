import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfileData } from './types';
import { isMasterUser, createMasterUserProfile } from './use-master-profile';
import { useRef, MutableRefObject } from 'react';

interface ProfileData {
  avatar_url?: string;
  banned_until?: string;
  bio?: string;
  city?: string;
  country?: string;
  created_at: string;
  currency?: string;
  display_name?: string;
  email?: string;
  experience_level?: string;
  full_name?: string;
  id: string;
  location?: string;
  online?: boolean;
  phone_number?: string;
  postal_code?: string;
  state?: string;
  street_address?: string;
  unimog_model?: string;
  unimog_modifications?: string;
  unimog_wiki_data?: any;
  unimog_year?: string;
  use_vehicle_photo_as_profile?: boolean;
  vehicle_photo_url?: string;
  website?: string;
  // Extended properties that might not be in all profiles
  unimog_series?: string | null;
  unimog_specs?: Record<string, any> | null;
  unimog_features?: string[] | null;
  latitude?: number;
  longitude?: number;
}

interface FetcherConfig {
  maxAttempts: number;
  timeoutMs: number;
}

/**
 * Hook to handle fetching user profile data with retries
 */
export const useProfileFetcher = (
  user: User | null,
  config: FetcherConfig = { maxAttempts: 3, timeoutMs: 5000 }
) => {
  // Reference to track fetch attempts
  const fetchAttempts = useRef<number>(0);
  
  /**
   * Fetch user profile data with retry logic
   */
  const fetchUserProfile = async (
    setIsLoading: (loading: boolean) => void,
    setUserData: (data: UserProfileData) => void,
    setIsMaster: (isMaster: boolean) => void,
    setError: (error: string | null) => void,
    setLoadingTimeout?: (timeout: boolean) => void
  ): Promise<void> => {
    if (!user) {
      console.log("No user provided to fetchUserProfile");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if this is a master user for development
      const masterUser = isMasterUser(user);
      setIsMaster(masterUser);
      
      if (masterUser) {
        console.log("Master user detected, using mock profile");
        const masterProfile = await createMasterUserProfile(user);
        setUserData(masterProfile);
        setIsLoading(false);
        return;
      }
      
      // Set timeout for loading
      let timeoutId: NodeJS.Timeout | null = null;
      if (setLoadingTimeout) {
        timeoutId = setTimeout(() => {
          setLoadingTimeout(true);
        }, config.timeoutMs);
      }
      
      // Query profile data from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      // Clear timeout if it was set
      if (timeoutId && setLoadingTimeout) {
        clearTimeout(timeoutId);
        setLoadingTimeout(false);
      }
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        
        // Increment and check retry attempts
        fetchAttempts.current += 1;
        
        if (fetchAttempts.current < config.maxAttempts) {
          console.log(`Retrying profile fetch, attempt ${fetchAttempts.current} of ${config.maxAttempts}`);
          setError(`Fetch attempt ${fetchAttempts.current} failed. Retrying...`);
          return fetchUserProfile(
            setIsLoading,
            setUserData,
            setIsMaster,
            setError,
            setLoadingTimeout
          );
        } else {
          setError(`Failed to fetch profile after ${config.maxAttempts} attempts: ${profileError.message}`);
          setIsLoading(false);
          return;
        }
      }
      
      // Reset fetch attempts on successful fetch
      fetchAttempts.current = 0;
      
      // Cast profileData to our extended type
      const profile = profileData as unknown as ProfileData;
      
      // Extract coordinates from the profile data or location string
      let coordinates = { latitude: 0, longitude: 0 };
      
      if (profile) {
        // Use explicit latitude/longitude if they exist
        if (profile.latitude !== undefined && profile.longitude !== undefined) {
          coordinates = {
            latitude: profile.latitude,
            longitude: profile.longitude
          };
        } 
        // Otherwise try to extract from location string
        else if (profile.location) {
          // Simple location string parser (this is a mock implementation)
          const locationParts = profile.location.split(',');
          const cityOrCountry = locationParts[0]?.trim().toLowerCase();
          
          // Map common locations to coordinates (simplified version)
          const locationMap: Record<string, [number, number]> = {
            'stuttgart': [48.7758, 9.1829],
            'berlin': [52.5200, 13.4050],
            'munich': [48.1351, 11.5820],
            'germany': [51.1657, 10.4515],
            'london': [51.5074, -0.1278],
            'new york': [40.7128, -74.0060],
            'sydney': [-33.8688, 151.2093]
          };
          
          // Try to find a match in our map
          const foundCoords = Object.entries(locationMap).find(
            ([key]) => cityOrCountry?.includes(key)
          );
          
          if (foundCoords) {
            coordinates = {
              latitude: foundCoords[1][0],
              longitude: foundCoords[1][1]
            };
          } else {
            // Default to Stuttgart (Unimog headquarters)
            coordinates = {
              latitude: 48.7758,
              longitude: 9.1829
            };
          }
        }
      }
      
      if (profile) {
        // Map profile data to UserProfileData with proper type handling
        setUserData({
          name: profile.display_name || profile.full_name || user.email?.split('@')[0] || 'Unknown',
          email: profile.email || user.email || '',
          avatarUrl: profile.avatar_url || '',
          unimogModel: profile.unimog_model || '',
          unimogSeries: profile.unimog_series || null,
          unimogSpecs: profile.unimog_specs || null,
          unimogFeatures: profile.unimog_features || null,
          about: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '',
          joinDate: new Date(profile.created_at).toISOString().split('T')[0],
          vehiclePhotoUrl: profile.vehicle_photo_url || '',
          useVehiclePhotoAsProfile: profile.use_vehicle_photo_as_profile || false,
          coordinates: coordinates
        });
      } else {
        setError('No profile data found');
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setError(error instanceof Error ? error.message : 'Unknown error fetching profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  return { fetchUserProfile, fetchAttempts };
};

const useRef = <T>(initialValue: T): MutableRefObject<T> => {
  return { current: initialValue };
};
