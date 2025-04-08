
import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { initializeMap } from '../utils/mapInitUtils';

interface UseMapContainerProps {
  hasToken: boolean;
  onError: (error: string) => void;
}

/**
 * Hook to manage map container and initialization
 */
export const useMapContainer = ({ hasToken, onError }: UseMapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initAttempts = useRef(0);
  const isInitializing = useRef(false);
  const containerObserverRef = useRef<ResizeObserver | null>(null);
  const initialized = useRef(false);
  const mountedRef = useRef(true);
  
  // Effect for cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      
      // Clean up observer
      if (containerObserverRef.current) {
        containerObserverRef.current.disconnect();
        containerObserverRef.current = null;
      }
      
      // Clean up map
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          console.error('Error cleaning up map:', e);
        }
        map.current = null;
      }
      
      initialized.current = false;
    };
  }, []);

  // Create a memoized initialization function
  const initMap = useCallback(() => {
    // Guard against multiple concurrent initialization attempts
    if (isInitializing.current || map.current || initialized.current || !mountedRef.current) {
      console.log('Map already initializing or initialized, skipping');
      return;
    }

    try {
      if (!mapContainer.current) {
        console.error('Map container not available');
        return;
      }

      // Check if container has valid dimensions before initializing
      const { offsetWidth, offsetHeight } = mapContainer.current;
      console.log('Container dimensions:', { width: offsetWidth, height: offsetHeight });
      
      // Only initialize if container has actual dimensions
      if (offsetWidth <= 10 || offsetHeight <= 10) {
        console.log('Container dimensions too small, delaying initialization');
        return; // Don't initialize yet - observer will try again when dimensions change
      }

      // Set initializing flag to prevent multiple attempts
      isInitializing.current = true;
      console.log('Starting map initialization, attempt #', initAttempts.current + 1);
      
      // Clean up the observer since we're about to initialize
      if (containerObserverRef.current) {
        containerObserverRef.current.disconnect();
        containerObserverRef.current = null;
      }

      // Create the map instance using our utility
      const mapInstance = initializeMap(mapContainer.current);
      
      // Check if map creation failed or component unmounted
      if (!mapInstance || !mountedRef.current) {
        if (mountedRef.current) {
          onError('Failed to create map instance');
          setIsLoading(false);
        }
        isInitializing.current = false;
        return;
      }
      
      // Store the map reference
      map.current = mapInstance;
      initialized.current = true;
      
      // Add event listeners and configure map after loading
      mapInstance.on('load', () => {
        console.log('Map loaded successfully');
        if (mountedRef.current) {
          setIsLoading(false);
        }
        isInitializing.current = false;
      });
      
      // Error handling for map load failures
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
        if (mountedRef.current) {
          onError('Map failed to load properly. Please refresh and try again.');
          setIsLoading(false);
        }
        isInitializing.current = false;
      });
      
      // Add a safety timeout to ensure loading state doesn't get stuck
      setTimeout(() => {
        if (isInitializing.current && mountedRef.current) {
          console.log('Map initialization timeout reached, resetting loading state');
          setIsLoading(false);
          isInitializing.current = false;
        }
      }, 10000);
      
    } catch (err) {
      console.error('Error initializing map:', err);
      if (mountedRef.current) {
        onError(err instanceof Error ? err.message : 'Failed to initialize map');
        setIsLoading(false);
      }
      isInitializing.current = false;
      
      // Cleanup failed map instance
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          console.error('Error cleaning up failed map:', e);
        }
        map.current = null;
        initialized.current = false;
      }
    }
  }, [onError]); // Only depends on onError function

  // Initialize map when container is ready and token is available
  useEffect(() => {
    // Skip initialization if no token, no container ref, or map already initialized
    if (!hasToken || !mapContainer.current || initialized.current || !mountedRef.current) {
      return;
    }
    
    console.log('Setting up map container observer, attempt #', initAttempts.current + 1);
    initAttempts.current += 1;
    
    if (mountedRef.current) {
      setIsLoading(true);
    }

    // Set up ResizeObserver to monitor container dimensions
    if (!containerObserverRef.current && mapContainer.current && mountedRef.current) {
      console.log('Creating new ResizeObserver for map container');
      containerObserverRef.current = new ResizeObserver((entries) => {
        if (!mountedRef.current) return;
        
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          
          // Only attempt initialization if dimensions are valid and not already initializing
          if (width > 10 && height > 10 && !isInitializing.current && !initialized.current && mountedRef.current) {
            // Try to initialize the map when container has valid dimensions
            initMap();
          }
        }
      });
      
      // Start observing container
      containerObserverRef.current.observe(mapContainer.current);
    }

    // Also try to initialize immediately in case container is already ready
    if (!isInitializing.current && !initialized.current && mountedRef.current) {
      // Small delay to ensure the container has been properly measured
      setTimeout(initMap, 100);
    }

    // Safety timeout to prevent perpetual loading state
    const timeoutId = setTimeout(() => {
      if (mountedRef.current && isLoading) {
        console.log('Safety timeout reached, resetting loading state');
        setIsLoading(false);
      }
    }, 15000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [hasToken, initMap]); // Only depend on hasToken and the memoized init function

  return {
    mapContainer,
    map: map.current,
    isLoading
  };
};
