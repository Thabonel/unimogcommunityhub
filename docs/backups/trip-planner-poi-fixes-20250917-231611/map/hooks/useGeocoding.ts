
import { useCallback } from 'react';
import { geocodeLocation } from '../utils/geocodingUtils';

/**
 * Hook to handle geocoding operations
 */
export const useGeocoding = () => {
  
  // Geocode a location string to coordinates
  const geocodeLocationWithErrorHandling = useCallback(async (
    location: string | undefined,
    signal?: AbortSignal
  ): Promise<[number, number] | null> => {
    if (!location) return null;
    
    try {
      const coordinates = await geocodeLocation(location);
      
      // Check if operation was aborted
      if (signal?.aborted) {
        throw new Error('Operation aborted');
      }
      
      return coordinates;
    } catch (err) {
      if (err instanceof Error && err.message === 'Operation aborted') {
        throw err; // Re-throw abort errors to be caught by caller
      }
      console.error(`Error geocoding location "${location}":`, err);
      return null;
    }
  }, []);
  
  return { geocodeLocationWithErrorHandling };
};
