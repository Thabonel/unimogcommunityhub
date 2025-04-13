
import { useState, useEffect, useRef, useCallback, MutableRefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { useMapToken } from '@/contexts/MapTokenContext';

interface UseMapProps {
  container: MutableRefObject<HTMLDivElement | null>;
  style?: string;
  center?: [number, number];
  zoom?: number;
  enableTerrain?: boolean;
  onMapReady?: (map: mapboxgl.Map) => void;
}

interface UseMapReturn {
  map: mapboxgl.Map | null;
  isLoading: boolean;
  error: string | null;
  updateCenter: (center: [number, number], zoom?: number) => void;
  resetMap: () => void;
}

export const useMap = ({
  container,
  style = 'mapbox://styles/mapbox/outdoors-v12',
  center = [9.1829, 48.7758], // Default to Stuttgart, Germany
  zoom = 5,
  enableTerrain = true,
  onMapReady
}: UseMapProps): UseMapReturn => {
  const { token, isTokenValid } = useMapToken();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const initAttempts = useRef(0);
  const maxInitAttempts = 3;
  const isMounted = useRef(true);

  // Clean up function for the map
  const cleanupMap = useCallback(() => {
    if (mapInstance.current) {
      console.log('Cleaning up map instance');
      mapInstance.current.remove();
      mapInstance.current = null;
      setMap(null);
    }
  }, []);

  // Initialize or reinitialize the map
  const initializeMap = useCallback(() => {
    if (!token || !isTokenValid || !container.current) {
      return;
    }

    // Don't exceed max attempts
    if (initAttempts.current >= maxInitAttempts) {
      console.error(`Failed to initialize map after ${maxInitAttempts} attempts`);
      setError(`Failed to initialize map after ${maxInitAttempts} attempts`);
      setIsLoading(false);
      return;
    }

    initAttempts.current += 1;
    setIsLoading(true);
    setError(null);

    try {
      // Clean up any existing map instance
      cleanupMap();

      // Set the access token
      mapboxgl.accessToken = token;

      console.log(`Initializing map (attempt ${initAttempts.current})...`);
      
      // Create new map instance
      const newMap = new mapboxgl.Map({
        container: container.current,
        style,
        center,
        zoom,
        attributionControl: true,
        preserveDrawingBuffer: true
      });

      // Store the reference
      mapInstance.current = newMap;

      // Set up event handlers
      newMap.on('load', () => {
        console.log('Map loaded successfully');
        
        if (!isMounted.current) return;

        try {
          if (enableTerrain) {
            // Add terrain source if it doesn't exist
            if (!newMap.getSource('mapbox-dem')) {
              newMap.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 14
              });
              
              // Add terrain
              newMap.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
            }
          }
          
          // Add navigation control - FIX: Use the instance directly, don't pass the class
          newMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

          // Update component state
          if (isMounted.current) {
            setMap(newMap);
            setIsLoading(false);
            setError(null);
          }

          // Call the onMapReady callback if provided
          if (onMapReady) {
            onMapReady(newMap);
          }

        } catch (err) {
          console.error('Error during map load event:', err);
          if (isMounted.current) {
            setError(`Error initializing map features: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setIsLoading(false);
          }
        }
      });

      // Handle map errors
      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        const errorMessage = e.error?.message || 'Unknown error';
        
        if (isMounted.current) {
          setError(`Error loading map: ${errorMessage}`);
          setIsLoading(false);
        }
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      if (isMounted.current) {
        setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    }
  }, [token, isTokenValid, container, style, center, zoom, enableTerrain, cleanupMap, onMapReady]);

  // Initialize map when token is available and container is ready
  useEffect(() => {
    isMounted.current = true;
    
    if (token && isTokenValid && container.current) {
      initializeMap();
    }
    
    return () => {
      isMounted.current = false;
      cleanupMap();
    };
  }, [token, isTokenValid, container, initializeMap, cleanupMap]);

  // Function to update the center of the map
  const updateCenter = useCallback((newCenter: [number, number], newZoom?: number) => {
    if (mapInstance.current) {
      mapInstance.current.flyTo({
        center: newCenter,
        zoom: newZoom || mapInstance.current.getZoom(),
        essential: true,
        duration: 1000
      });
    }
  }, []);

  // Function to reset the map
  const resetMap = useCallback(() => {
    cleanupMap();
    initAttempts.current = 0;
    setError(null);
    setIsLoading(true);
    
    // Slight delay to ensure DOM is updated
    setTimeout(() => {
      if (isMounted.current) {
        initializeMap();
      }
    }, 100);
  }, [cleanupMap, initializeMap]);

  return {
    map,
    isLoading,
    error,
    updateCenter,
    resetMap
  };
};
