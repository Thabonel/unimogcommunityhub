
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

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
 * Hook to get the user's location from their IP or profile
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
            
            // If we only have the location string, try to parse it
            if (profile.location) {
              // This is a simplified approach - in a real app you might want to geocode the location string
              setLocation({
                country: profile.country || '',
                countryCode: profile.country || '',
                region: '',
                regionName: '',
                city: profile.city || '',
                latitude: 0, // Default values
                longitude: 0,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              });
              
              // Make a geocoding request to get coordinates from the location string
              try {
                const geocodeResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(profile.location)}`);
                const geocodeData = await geocodeResponse.json();
                
                if (geocodeData && geocodeData.length > 0) {
                  setLocation(prevState => ({
                    ...prevState!,
                    latitude: parseFloat(geocodeData[0].lat),
                    longitude: parseFloat(geocodeData[0].lon),
                  }));
                }
              } catch (geocodeError) {
                console.error("Error geocoding location string:", geocodeError);
              }
              
              setIsLoading(false);
              return;
            }
          }
        }
        
        // If we don't have profile location data, use IP geolocation
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        
        const locationData = await response.json();
        
        if (locationData.error) {
          throw new Error(locationData.reason || 'Failed to determine location');
        }
        
        setLocation({
          country: locationData.country_name,
          countryCode: locationData.country_code,
          region: locationData.region_code,
          regionName: locationData.region,
          city: locationData.city,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          timezone: locationData.timezone
        });
        
        // If user is logged in and we don't have location in profile, save this location
        if (user && locationData.latitude && locationData.longitude) {
          await supabase
            .from('profiles')
            .update({
              city: locationData.city,
              country: locationData.country_code,
              latitude: locationData.latitude,
              longitude: locationData.longitude
            })
            .eq('id', user.id);
        }
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
          title: "Location Detection Failed",
          description: "Using default location. You can set your location in your profile.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    getLocationData();
  }, [user, toast]);
  
  return { location, isLoading, error };
}
