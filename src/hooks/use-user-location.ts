
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
  const LOCATION_CACHE_KEY = 'lastKnownLocation';
  
  // Get cached location immediately
  const getCachedLocation = (): UserLocation | null => {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log('📍 Using cached location:', parsed);
        return parsed;
      }
    } catch (e) {
      console.error('Error reading cached location:', e);
    }
    return null;
  };

  // Initialize with cached location for immediate availability
  const [location, setLocation] = useState<UserLocation | null>(getCachedLocation());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Default location (used if permission is denied and no cache)
  const DEFAULT_LOCATION: UserLocation = {
    // Default to a wider view if no cached location
    latitude: 40.0,
    longitude: -95.0 // Center of USA as fallback
  };

  // Function to get the user's current location
  const getLocation = async (): Promise<UserLocation | null> => {
    console.log('🌍 useUserLocation: Starting location request...');
    setIsLoading(true);
    setError(null);

    try {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      console.log('🌍 useUserLocation: Geolocation API available, requesting position...');

      return new Promise<UserLocation>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation: UserLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
            };
            
            console.log('✅ useUserLocation: Location obtained successfully!', {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              accuracy: userLocation.accuracy,
              timestamp: new Date(userLocation.timestamp || Date.now()).toISOString()
            });
            
            // Cache the new location
            try {
              localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(userLocation));
              console.log('💾 Cached location for future use');
            } catch (e) {
              console.error('Error caching location:', e);
            }
            
            setLocation(userLocation);
            setIsLoading(false);
            resolve(userLocation);
          },
          (err) => {
            console.error('❌ useUserLocation: Geolocation error occurred', {
              code: err.code,
              message: err.message,
              PERMISSION_DENIED: err.PERMISSION_DENIED,
              POSITION_UNAVAILABLE: err.POSITION_UNAVAILABLE,
              TIMEOUT: err.TIMEOUT
            });
            
            // Handle specific error cases
            let errorMessage = 'Failed to get your location';
            switch (err.code) {
              case err.PERMISSION_DENIED:
                errorMessage = 'Location permission denied. Using default location.';
                console.log('⚠️ useUserLocation: Permission denied, using default location (Stuttgart)', DEFAULT_LOCATION);
                // Use default location when permission is denied
                setLocation(DEFAULT_LOCATION);
                resolve(DEFAULT_LOCATION);
                break;
              case err.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable';
                console.error('❌ useUserLocation: Position unavailable');
                break;
              case err.TIMEOUT:
                errorMessage = 'Location request timed out';
                console.error('❌ useUserLocation: Request timed out (10s limit)');
                break;
              default:
                errorMessage = 'An unknown error occurred getting your location';
                console.error('❌ useUserLocation: Unknown error', err);
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
