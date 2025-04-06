
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { isMasterUser } from './profile/use-master-profile';

export interface UserLocation {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

/**
 * Hook to get the user's location from their profile
 */
export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function getLocationData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if this is a master user first
        if (user && isMasterUser(user)) {
          console.log("Master user detected, using Sydney coordinates");
          // Use hardcoded Sydney coordinates for master user
          setLocation({
            country: 'Australia',
            countryCode: 'AU',
            region: 'NSW',
            regionName: 'New South Wales',
            city: 'Sydney',
            latitude: -33.8688,
            longitude: 151.2093,
            timezone: 'Australia/Sydney'
          });
          setIsLoading(false);
          return;
        }
        
        // First check if the user has a profile with location data
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('location, country, city, latitude, longitude')
            .eq('id', user.id)
            .single();
            
          if (profile && !profileError && (profile.location || (profile.latitude && profile.longitude))) {
            // If we have coordinates in the profile, use them
            if (profile.latitude && profile.longitude) {
              setLocation({
                latitude: profile.latitude,
                longitude: profile.longitude,
                country: profile.country || '',
                countryCode: profile.country || '',
                region: '',
                regionName: '',
                city: profile.city || '',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              });
              setIsLoading(false);
              return;
            }
            
            // If we only have the location string, try to parse it using mock data
            if (profile.location) {
              // Use mock location data instead of geocoding
              setLocation({
                country: profile.country || 'Unknown Country',
                countryCode: profile.country || 'UN',
                region: '',
                regionName: '',
                city: profile.city || profile.location,
                latitude: 0, // Default values will be overridden by mock data
                longitude: 0,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              });
              
              // Mock geocoding instead of making a network request
              const mockGeoData = getMockGeocodingData(profile.location);
              if (mockGeoData) {
                setLocation(prevState => ({
                  ...prevState!,
                  latitude: mockGeoData.latitude,
                  longitude: mockGeoData.longitude,
                }));
              }
              
              setIsLoading(false);
              return;
            }
          }
        }
        
        // If we don't have profile location data, use default location
        console.log("No profile location data, using default location");
        setLocation({
          country: 'Germany', // Default to Germany for a Unimog community
          countryCode: 'DE',
          region: '',
          regionName: '',
          city: 'Stuttgart', // Mercedes-Benz/Unimog HQ city
          latitude: 48.7758, // Stuttgart coordinates
          longitude: 9.1829,
          timezone: 'Europe/Berlin'
        });
      } catch (err) {
        console.error('Error fetching location:', err);
        setError('Could not determine your location');
        
        // Set default location (could be center of the target market)
        setLocation({
          country: 'Germany', // Default to Germany for a Unimog community
          countryCode: 'DE',
          region: '',
          regionName: '',
          city: 'Stuttgart', // Mercedes-Benz/Unimog HQ city
          latitude: 48.7758, // Stuttgart coordinates
          longitude: 9.1829,
          timezone: 'Europe/Berlin'
        });
        
        toast({
          title: "Using Default Location",
          description: "Using Stuttgart, Germany as the default location.",
          variant: "default"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    getLocationData();
  }, [user, toast]);
  
  return { location, isLoading, error };
}

// Mock geocoding function to avoid network requests
function getMockGeocodingData(locationString: string): { latitude: number, longitude: number } | null {
  const mockLocations: Record<string, [number, number]> = {
    'new york': [40.7128, -74.0060],
    'los angeles': [34.0522, -118.2437],
    'chicago': [41.8781, -87.6298],
    'houston': [29.7604, -95.3698],
    'london': [51.5074, -0.1278],
    'paris': [48.8566, 2.3522],
    'tokyo': [35.6762, 139.6503],
    'sydney': [-33.8688, 151.2093],
    'berlin': [52.5200, 13.4050],
    'munich': [48.1351, 11.5820],
    'hamburg': [53.5511, 9.9937],
    'frankfurt': [50.1109, 8.6821],
    'stuttgart': [48.7758, 9.1829],
    'cologne': [50.9375, 6.9603],
    'dusseldorf': [51.2277, 6.7735],
    'germany': [51.1657, 10.4515],
    'usa': [37.0902, -95.7129],
    'uk': [55.3781, -3.4360],
    'australia': [-25.2744, 133.7751],
    'france': [46.2276, 2.2137]
  };
  
  // Search for matching location in our mock data
  const normalizedInput = locationString.toLowerCase();
  
  for (const [key, coords] of Object.entries(mockLocations)) {
    if (normalizedInput.includes(key)) {
      return {
        latitude: coords[0],
        longitude: coords[1]
      };
    }
  }
  
  // Default to Stuttgart if no match
  return {
    latitude: 48.7758,
    longitude: 9.1829
  };
}
