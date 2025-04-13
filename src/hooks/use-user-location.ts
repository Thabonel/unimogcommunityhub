
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

interface UseUserLocationResult {
  location: UserLocation | null;
  error: string | null;
  isLoading: boolean;
  getLocation: () => Promise<UserLocation | null>;
}

export function useUserLocation(): UseUserLocationResult {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Default location (used if permission is denied)
  const DEFAULT_LOCATION: UserLocation = {
    // Default to Stuttgart, Germany as a fallback
    latitude: 48.7758,
    longitude: 9.1829
  };

  // Function to get the user's current location
  const getLocation = async (): Promise<UserLocation | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      return new Promise<UserLocation>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation: UserLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            };
            setLocation(userLocation);
            setIsLoading(false);
            resolve(userLocation);
          },
          (err) => {
            console.warn('Geolocation error:', err);
            
            // Handle specific error cases
            let errorMessage = 'Failed to get your location';
            switch (err.code) {
              case err.PERMISSION_DENIED:
                errorMessage = 'Location permission denied. Using default location.';
                // Use default location when permission is denied
                setLocation(DEFAULT_LOCATION);
                resolve(DEFAULT_LOCATION);
                break;
              case err.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable';
                break;
              case err.TIMEOUT:
                errorMessage = 'Location request timed out';
                break;
              default:
                errorMessage = 'An unknown error occurred getting your location';
                break;
            }
            
            setError(errorMessage);
            setIsLoading(false);
            
            if (err.code !== err.PERMISSION_DENIED) {
              reject(new Error(errorMessage));
            }
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes cache
          }
        );
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      setIsLoading(false);
      toast({
        title: "Location Error",
        description: message,
        variant: "destructive"
      });
      return null;
    }
  };

  // Get location when component mounts
  useEffect(() => {
    getLocation().catch(err => {
      console.error('Error getting initial location:', err);
      // If we couldn't get a location, use the default
      if (!location) {
        setLocation(DEFAULT_LOCATION);
        setIsLoading(false);
      }
    });
  }, []);

  return {
    location,
    error,
    isLoading,
    getLocation
  };
}
