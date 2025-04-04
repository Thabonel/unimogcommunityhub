
import { useState, useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useUserLocation } from '@/hooks/use-user-location';
import { MAPBOX_CONFIG } from '@/config/env';
import { initializeMap, hasMapboxToken } from './mapConfig';

interface MapInitializationProps {
  onMapClick?: () => void;
  defaultZoom?: number;
  defaultCenter?: [number, number];
}

export const useMapInitialization = ({ 
  onMapClick,
  defaultZoom = 5,
  defaultCenter = [-99.5, 40.0]  // Default to US center
}: MapInitializationProps = {}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(hasMapboxToken());
  const { location } = useUserLocation();
  const initAttempts = useRef(0);
  const containerObserverRef = useRef<ResizeObserver | null>(null);

  // Check for tokens periodically in case they're added later
  useEffect(() => {
    // Initially check for token
    setHasToken(hasMapboxToken());
    console.log('Initial token check:', hasMapboxToken());
    
    // Set up periodic check for token
    const tokenCheckInterval = setInterval(() => {
      const tokenExists = hasMapboxToken();
      if (tokenExists && !hasToken) {
        console.log('Token detected, updating state');
        setHasToken(true);
      }
    }, 2000);
    
    return () => clearInterval(tokenCheckInterval);
  }, [hasToken]);

  // Initialize map when container is ready and token is available
  useEffect(() => {
    // Don't initialize if no token, container ref, or if map is already created
    if (!hasToken || !mapContainer.current || map.current) return;
    
    console.log('Setting up map container observer, attempt #', initAttempts.current + 1);
    initAttempts.current += 1;
    setIsLoading(true);
    setError(null);

    // Create a function to initialize the map
    const initMap = () => {
      try {
        if (!mapContainer.current) {
          console.error('Map container not available');
          return;
        }

        // Check if container has valid dimensions before initializing
        const { offsetWidth, offsetHeight } = mapContainer.current;
        console.log('Container dimensions:', { width: offsetWidth, height: offsetHeight });
        
        // Only initialize if container has actual dimensions
        if (offsetWidth <= 0 || offsetHeight <= 0) {
          console.log('Container dimensions too small, delaying initialization');
          return; // Don't initialize yet - observer will try again when dimensions change
        }

        // Clean up the observer since we're about to initialize
        if (containerObserverRef.current) {
          containerObserverRef.current.disconnect();
          containerObserverRef.current = null;
        }

        console.log('Container ready, initializing map now');
        
        // Create the map instance using our utility
        const mapInstance = initializeMap(mapContainer.current);
        
        // Check if map creation failed
        if (!mapInstance) {
          setError('Failed to create map instance');
          setIsLoading(false);
          return;
        }
        
        // Store the map reference
        map.current = mapInstance;
        
        // Add event listeners and configure map after loading
        mapInstance.on('load', () => {
          console.log('Map loaded successfully');
          setIsLoading(false);
          
          if (onMapClick) {
            mapInstance.on('click', onMapClick);
          }
          
          // Use user location or default center
          const center = location 
            ? [location.longitude, location.latitude] as [number, number] 
            : defaultCenter;
          
          // Fly to initial location with animation
          mapInstance.flyTo({
            center,
            zoom: defaultZoom,
            essential: true
          });
        });
        
        // Error handling for map load failures
        mapInstance.on('error', (e) => {
          console.error('Mapbox error:', e);
          setError('Map failed to load properly. Please refresh and try again.');
          setIsLoading(false);
        });
        
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize map');
        setIsLoading(false);
        
        // Cleanup failed map instance
        if (map.current) {
          try {
            map.current.remove();
          } catch (e) {
            console.error('Error cleaning up failed map:', e);
          }
          map.current = null;
        }
      }
    };

    // Set up ResizeObserver to monitor container dimensions
    if (!containerObserverRef.current && mapContainer.current) {
      console.log('Creating new ResizeObserver for map container');
      containerObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          console.log('Container resized:', { width, height });
          
          // Only attempt initialization if dimensions are valid
          if (width > 0 && height > 0) {
            // Try to initialize the map when container has valid dimensions
            initMap();
          }
        }
      });
      
      // Start observing container
      containerObserverRef.current.observe(mapContainer.current);
    }

    // Also try to initialize immediately in case container is already ready
    initMap();

    // Clean up on unmount
    return () => {
      // Disconnect observer
      if (containerObserverRef.current) {
        containerObserverRef.current.disconnect();
        containerObserverRef.current = null;
      }
      
      // Cleanup map
      if (map.current) {
        try {
          map.current.remove();
        } catch (e) {
          console.error('Error cleaning up map:', e);
        }
        map.current = null;
      }
    };
  }, [hasToken, location, defaultCenter, defaultZoom, onMapClick]);

  // Handle token saving
  const handleTokenSave = useCallback((token: string) => {
    localStorage.setItem('mapbox_access_token', token);
    mapboxgl.accessToken = token;
    setHasToken(true);
    setError(null);
  }, []);

  // Handle token reset
  const handleResetToken = useCallback(() => {
    localStorage.removeItem('mapbox_access_token');
    window.location.reload();
  }, []);

  // Handle map click - use the callback to avoid unnecessary re-renders
  const handleMapClick = useCallback(() => {
    if (onMapClick) onMapClick();
  }, [onMapClick]);

  return {
    mapContainer,
    map: map.current,
    isLoading,
    error,
    hasToken,
    handleTokenSave,
    handleResetToken,
    handleMapClick
  };
};
