
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
 * Hook to get the user's location from their profile or browser geolocation
 */
export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    let profileCheckAttempted = false;
    let browserGeolocationAttempted = false;
    let ipGeolocationAttempted = false;

    async function getLocationData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Try getting location from profile first
        await tryProfileLocation();
        
        // If still no location, try browser geolocation
        if (!profileCheckAttempted || !location) {
          await tryBrowserGeolocation();
        }
        
        // Last resort: IP-based geolocation
        if (!browserGeolocationAttempted || !location) {
          await tryIpGeolocation();
        }
        
        // Final fallback: Default location
        if (!location && !ipGeolocationAttempted) {
          setDefaultLocation();
        }
      } catch (err) {
        console.error('Error in location resolution sequence:', err);
        setDefaultLocation();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    
    // 1. Try to get location from user profile
    async function tryProfileLocation() {
      if (!user) return false;
      
      try {
        console.log('Attempting to get location from user profile...');
        
        // Query both profiles and user_details tables for maximum compatibility
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('location, country, city, latitude, longitude, address')
          .eq('id', user.id)
          .single();
          
        // Also try the user_details view if it exists (for backward compatibility)
        const { data: userDetails, error: userDetailsError } = await supabase
          .from('user_details')
          .select('location, country, city, latitude, longitude, address')
          .eq('id', user.id)
          .single();
          
        // Use profile data or fallback to user details
        const userData = profile || userDetails;
        
        if (userData && !profileError && !userDetailsError) {
          // If we have coordinates in the profile, use them
          if (userData.latitude && userData.longitude) {
            console.log('Found coordinates in profile:', { lat: userData.latitude, lng: userData.longitude });
            if (isMounted) {
              setLocation({
                latitude: userData.latitude,
                longitude: userData.longitude,
                country: userData.country || '',
                countryCode: userData.country || '',
                region: '',
                regionName: '',
                city: userData.city || '',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              });
            }
            profileCheckAttempted = true;
            return true;
          }
          
          // If we have address or location string, try to geocode them
          const locationString = userData.address || userData.location;
          if (locationString) {
            console.log('Using profile location string:', locationString);
            if (isMounted) {
              const mockGeoData = getMockGeocodingData(locationString);
              setLocation({
                country: userData.country || mockGeoData.country || 'Unknown Country',
                countryCode: userData.country || mockGeoData.countryCode || 'UN',
                region: mockGeoData.region || '',
                regionName: mockGeoData.regionName || '',
                city: userData.city || mockGeoData.city || locationString,
                latitude: mockGeoData.latitude,
                longitude: mockGeoData.longitude,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              });
            }
            profileCheckAttempted = true;
            return true;
          }
        }
        
        console.log('No usable location data found in profile');
        profileCheckAttempted = true;
        return false;
      } catch (err) {
        console.error('Error fetching profile location:', err);
        profileCheckAttempted = true;
        return false;
      }
    }
    
    // 2. Try browser geolocation
    function tryBrowserGeolocation() {
      return new Promise<boolean>((resolve) => {
        if (!navigator.geolocation) {
          console.log('Browser geolocation not supported');
          browserGeolocationAttempted = true;
          resolve(false);
          return;
        }
        
        console.log('Attempting browser geolocation...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Browser geolocation successful:', position.coords);
            if (isMounted) {
              setLocation({
                country: '',
                countryCode: '',
                region: '',
                regionName: '',
                city: '',
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              });
            }
            browserGeolocationAttempted = true;
            resolve(true);
          },
          (geoError) => {
            console.warn('Browser geolocation failed:', geoError);
            browserGeolocationAttempted = true;
            resolve(false);
          },
          { timeout: 5000, maximumAge: 600000 } // 5s timeout, 10min cache
        );
      });
    }
    
    // 3. Try IP-based geolocation
    async function tryIpGeolocation() {
      try {
        console.log('Attempting IP-based geolocation...');
        ipGeolocationAttempted = true;
        
        // Try ipinfo.io which doesn't require an API key for basic usage
        const response = await fetch('https://ipinfo.io/json?token=undefined');
        if (!response.ok) throw new Error('IP info response not OK');
        
        const data = await response.json();
        
        if (data && data.loc) {
          console.log('IP-based location successful:', data);
          const [latitude, longitude] = data.loc.split(',').map(parseFloat);
          
          if (isMounted && latitude && longitude) {
            setLocation({
              country: data.country || '',
              countryCode: data.country || '',
              region: data.region || '',
              regionName: data.region || '',
              city: data.city || '',
              latitude,
              longitude,
              timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
            });
            return true;
          }
        }
        
        console.warn('Could not determine location from IP');
        return false;
      } catch (ipError) {
        console.error('IP-based location failed:', ipError);
        return false;
      }
    }
    
    // 4. Final fallback: use default location
    function setDefaultLocation() {
      console.log('Using default location (Stuttgart, Germany)');
      if (isMounted) {
        setLocation({
          country: 'Germany',
          countryCode: 'DE',
          region: '',
          regionName: '',
          city: 'Stuttgart',
          latitude: 48.7758,
          longitude: 9.1829,
          timezone: 'Europe/Berlin'
        });
        
        toast({
          title: "Using Default Location",
          description: "Using Stuttgart, Germany as the default location.",
          variant: "default"
        });
      }
    }
    
    // Start the location resolution sequence
    getLocationData();
    
    return () => {
      isMounted = false;
    };
  }, [user, toast, location]);
  
  return { location, isLoading, error };
}

// Enhanced mock geocoding function with more detailed return values
function getMockGeocodingData(locationString: string): {
  latitude: number;
  longitude: number;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
} {
  const normalizedInput = locationString.toLowerCase();
  const mockLocations: Record<string, {
    coords: [number, number];
    country?: string;
    countryCode?: string;
    region?: string;
    regionName?: string;
    city?: string;
  }> = {
    'new york': {
      coords: [40.7128, -74.0060],
      country: 'United States',
      countryCode: 'US',
      region: 'NY',
      regionName: 'New York',
      city: 'New York City'
    },
    'los angeles': {
      coords: [34.0522, -118.2437],
      country: 'United States',
      countryCode: 'US',
      region: 'CA',
      regionName: 'California',
      city: 'Los Angeles'
    },
    'chicago': {
      coords: [41.8781, -87.6298],
      country: 'United States',
      countryCode: 'US',
      region: 'IL',
      regionName: 'Illinois',
      city: 'Chicago'
    },
    'london': {
      coords: [51.5074, -0.1278],
      country: 'United Kingdom',
      countryCode: 'UK',
      region: 'England',
      regionName: 'England',
      city: 'London'
    },
    'paris': {
      coords: [48.8566, 2.3522],
      country: 'France',
      countryCode: 'FR',
      region: 'Île-de-France',
      regionName: 'Île-de-France',
      city: 'Paris'
    },
    'berlin': {
      coords: [52.5200, 13.4050],
      country: 'Germany',
      countryCode: 'DE',
      region: 'Berlin',
      regionName: 'Berlin',
      city: 'Berlin'
    },
    'munich': {
      coords: [48.1351, 11.5820],
      country: 'Germany',
      countryCode: 'DE',
      region: 'Bavaria',
      regionName: 'Bavaria',
      city: 'Munich'
    },
    'hamburg': {
      coords: [53.5511, 9.9937],
      country: 'Germany',
      countryCode: 'DE',
      region: 'Hamburg',
      regionName: 'Hamburg',
      city: 'Hamburg'
    },
    'frankfurt': {
      coords: [50.1109, 8.6821],
      country: 'Germany',
      countryCode: 'DE',
      region: 'Hesse',
      regionName: 'Hesse',
      city: 'Frankfurt'
    },
    'stuttgart': {
      coords: [48.7758, 9.1829],
      country: 'Germany',
      countryCode: 'DE',
      region: 'Baden-Württemberg',
      regionName: 'Baden-Württemberg',
      city: 'Stuttgart'
    },
    'germany': {
      coords: [51.1657, 10.4515],
      country: 'Germany',
      countryCode: 'DE'
    },
    'usa': {
      coords: [37.0902, -95.7129],
      country: 'United States',
      countryCode: 'US'
    },
    'france': {
      coords: [46.2276, 2.2137],
      country: 'France',
      countryCode: 'FR'
    }
  };
  
  // Search for matching location
  for (const [key, data] of Object.entries(mockLocations)) {
    if (normalizedInput.includes(key)) {
      return {
        latitude: data.coords[0],
        longitude: data.coords[1],
        country: data.country,
        countryCode: data.countryCode,
        region: data.region,
        regionName: data.regionName,
        city: data.city
      };
    }
  }
  
  // Extract potential location indicators from the string
  const words = normalizedInput.split(/[\s,]+/);
  for (const word of words) {
    if (word.length > 3) { // Skip very short words
      for (const [key, data] of Object.entries(mockLocations)) {
        if (key.includes(word)) {
          return {
            latitude: data.coords[0],
            longitude: data.coords[1],
            country: data.country,
            countryCode: data.countryCode,
            region: data.region,
            regionName: data.regionName,
            city: data.city
          };
        }
      }
    }
  }
  
  // Default to Stuttgart if no match
  return {
    latitude: 48.7758,
    longitude: 9.1829,
    country: 'Germany',
    countryCode: 'DE',
    region: 'Baden-Württemberg',
    regionName: 'Baden-Württemberg',
    city: 'Stuttgart'
  };
}
