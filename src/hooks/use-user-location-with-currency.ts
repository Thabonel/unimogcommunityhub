/**
 * Enhanced User Location Hook with Currency Detection
 * Combines geolocation with country/currency detection
 */

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserLocation } from './use-user-location';
import { getCountryFromCoordinates, getCountryFromBrowserLocale } from '@/services/geolocationService';
import { getCurrencyFromCountry } from '@/utils/currencyUtils';

export interface LocationWithCurrency extends UserLocation {
  country?: string;
  countryCode?: string;
  currency?: string;
  city?: string;
  region?: string;
}

interface UseLocationWithCurrencyResult {
  location: LocationWithCurrency | null;
  error: string | null;
  isLoading: boolean;
  getLocationWithCurrency: () => Promise<LocationWithCurrency | null>;
  refreshCurrency: () => Promise<void>;
  clearLocationCache: () => void;
  forceAustraliaDetection: () => void;
}

export function useUserLocationWithCurrency(): UseLocationWithCurrencyResult {
  const LOCATION_CACHE_KEY = 'lastKnownLocationWithCurrency';
  
  // Get cached location immediately
  const getCachedLocation = (): LocationWithCurrency | null => {
    try {
      const cached = localStorage.getItem(LOCATION_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);

        // Check if cached data is too old (more than 7 days)
        const cacheAge = Date.now() - (parsed.timestamp || 0);
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (cacheAge > sevenDays) {
          console.log('📍 Cached location is too old, clearing cache');
          localStorage.removeItem(LOCATION_CACHE_KEY);
          return null;
        }

        console.log('📍 Using cached location with currency:', {
          country: parsed.country,
          currency: parsed.currency,
          coordinates: `${parsed.latitude}, ${parsed.longitude}`,
          age: Math.round(cacheAge / (1000 * 60 * 60 * 24)) + ' days'
        });
        return parsed;
      }
    } catch (e) {
      console.error('Error reading cached location:', e);
      localStorage.removeItem(LOCATION_CACHE_KEY);
    }
    return null;
  };

  // Initialize with cached location for immediate availability
  const [location, setLocation] = useState<LocationWithCurrency | null>(getCachedLocation());
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Default location with currency
  const getDefaultLocation = useCallback((): LocationWithCurrency => {
    // Use browser locale to determine default country/currency
    const browserCountry = getCountryFromBrowserLocale();
    const currency = getCurrencyFromCountry(browserCountry.countryCode);
    
    console.log('🌐 Using default location fallback:', {
      country: browserCountry.country,
      countryCode: browserCountry.countryCode,
      currency: currency,
      browserLocale: navigator.language
    });
    
    return {
      latitude: -25.0,
      longitude: 135.0, // Center of Australia as fallback
      country: browserCountry.country,
      countryCode: browserCountry.countryCode,
      currency: currency
    };
  }, []);

  // Enhanced function to get location with currency information
  const getLocationWithCurrency = useCallback(async (): Promise<LocationWithCurrency | null> => {
    console.log('🌍 Starting enhanced location request with currency detection...');
    setIsLoading(true);
    setError(null);

    try {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      console.log('🌍 Geolocation API available, requesting position...');

      return new Promise<LocationWithCurrency>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const baseLocation: UserLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
              };
              
              console.log('✅ Coordinates obtained, detecting country...', {
                latitude: baseLocation.latitude,
                longitude: baseLocation.longitude,
                accuracy: baseLocation.accuracy
              });
              
              // Get country information from coordinates
              const geoData = await getCountryFromCoordinates(
                baseLocation.latitude, 
                baseLocation.longitude
              );
              
              let currency = 'USD'; // Default fallback
              if (geoData && geoData.countryCode) {
                currency = getCurrencyFromCountry(geoData.countryCode);
              }
              
              const enhancedLocation: LocationWithCurrency = {
                ...baseLocation,
                country: geoData?.country,
                countryCode: geoData?.countryCode,
                currency: currency,
                city: geoData?.city,
                region: geoData?.region
              };
              
              console.log('✅ Enhanced location with currency detected!', {
                coordinates: `${enhancedLocation.latitude}, ${enhancedLocation.longitude}`,
                country: enhancedLocation.country,
                currency: enhancedLocation.currency,
                city: enhancedLocation.city
              });
              
              // Cache the enhanced location
              try {
                localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(enhancedLocation));
                console.log('💾 Cached enhanced location for future use');
              } catch (e) {
                console.error('Error caching enhanced location:', e);
              }
              
              setLocation(enhancedLocation);
              setIsLoading(false);
              resolve(enhancedLocation);
            } catch (geoError) {
              console.error('❌ Error during country detection:', geoError);
              
              // Fall back to basic location with browser-detected currency
              const browserCountry = getCountryFromBrowserLocale();
              const fallbackLocation: LocationWithCurrency = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp,
                country: browserCountry.country,
                countryCode: browserCountry.countryCode,
                currency: getCurrencyFromCountry(browserCountry.countryCode)
              };
              
              console.log('⚠️ Using coordinates with browser-detected country', fallbackLocation);
              setLocation(fallbackLocation);
              setIsLoading(false);
              resolve(fallbackLocation);
            }
          },
          (err) => {
            console.error('❌ Geolocation error occurred', {
              code: err.code,
              message: err.message
            });
            
            // Handle specific error cases
            let errorMessage = 'Failed to get your location';
            switch (err.code) {
              case err.PERMISSION_DENIED:
                errorMessage = 'Location permission denied. Using browser locale for currency.';
                console.log('⚠️ Permission denied, using browser locale');
                const defaultLoc = getDefaultLocation();
                setLocation(defaultLoc);
                setIsLoading(false);
                resolve(defaultLoc);
                return;
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
      
      // Use default location as fallback
      const defaultLoc = getDefaultLocation();
      setLocation(defaultLoc);
      
      toast({
        title: "Location Error",
        description: `${message}. Using default currency.`,
        variant: "destructive"
      });
      
      return defaultLoc;
    }
  }, [toast, getDefaultLocation]);

  // Function to refresh just the currency (useful if user manually changes location)
  const refreshCurrency = useCallback(async (): Promise<void> => {
    if (!location || !location.latitude || !location.longitude) {
      console.log('⚠️ No location available for currency refresh');
      return;
    }

    try {
      console.log('🔄 Refreshing currency information...');
      const geoData = await getCountryFromCoordinates(location.latitude, location.longitude);
      
      if (geoData && geoData.countryCode) {
        const newCurrency = getCurrencyFromCountry(geoData.countryCode);
        const updatedLocation: LocationWithCurrency = {
          ...location,
          country: geoData.country,
          countryCode: geoData.countryCode,
          currency: newCurrency,
          city: geoData.city,
          region: geoData.region
        };
        
        setLocation(updatedLocation);
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(updatedLocation));
        console.log('✅ Currency refreshed', { currency: newCurrency, country: geoData.country });
      }
    } catch (error) {
      console.error('❌ Error refreshing currency:', error);
    }
  }, [location]);

  // Get location when component mounts
  useEffect(() => {
    // If we have cached location, still try to get fresh location in background
    const hasValidCache = location && location.currency;
    
    if (hasValidCache) {
      // We have cached data, set loading to false immediately
      setIsLoading(false);
      console.log('📍 Using cached location, updating in background');
      
      // Still try to get fresh location in background (no loading state)
      getLocationWithCurrency().catch(err => {
        console.log('Background location update failed:', err);
        // Don't show error if we have cached data
      });
    } else {
      // No cached data, get location with loading state and timeout
      console.log('🔍 No cached location, detecting with timeout...');
      
      const timeoutId = setTimeout(() => {
        console.log('⏰ Location detection timeout, using default');
        if (isLoading) {
          const defaultLoc = getDefaultLocation();
          setLocation(defaultLoc);
          setIsLoading(false);
        }
      }, 8000); // 8 second timeout
      
      getLocationWithCurrency()
        .then(() => {
          clearTimeout(timeoutId);
        })
        .catch(err => {
          clearTimeout(timeoutId);
          console.error('Error getting initial location:', err);
          // Use default if we couldn't get location
          const defaultLoc = getDefaultLocation();
          setLocation(defaultLoc);
          setIsLoading(false);
        });
    }
  }, [getLocationWithCurrency, getDefaultLocation, isLoading]);

  // Function to clear cache and force fresh detection
  const clearLocationCache = useCallback(() => {
    localStorage.removeItem(LOCATION_CACHE_KEY);
    localStorage.removeItem('geo_location_data');
    console.log('🗑️ Location cache cleared, will detect fresh location');
    setLocation(null);
    setIsLoading(true);
    getLocationWithCurrency();
  }, [getLocationWithCurrency]);

  // Function to force Australia if user is clearly in Australia
  const forceAustraliaDetection = useCallback(() => {
    console.log('🇦🇺 Forcing Australia detection');
    const australianLocation: LocationWithCurrency = {
      latitude: -25.0,
      longitude: 135.0,
      country: 'Australia',
      countryCode: 'AU',
      currency: 'AUD',
      timestamp: Date.now()
    };

    setLocation(australianLocation);
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(australianLocation));
    localStorage.removeItem('geo_location_data'); // Clear any old geo cache

    toast({
      title: "Currency Updated",
      description: "Switched to Australian pricing (AUD)",
    });
  }, [toast]);

  return {
    location,
    error,
    isLoading,
    getLocationWithCurrency,
    refreshCurrency,
    clearLocationCache,
    forceAustraliaDetection
  };
}