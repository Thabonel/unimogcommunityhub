
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { hasMapboxToken, validateMapboxToken } from './mapConfig';
import { addTopographicalLayers, addDemSource } from './utils/layerUtils';
import { MAPBOX_CONFIG } from '@/config/env';
import { toast } from 'sonner';

interface UseMapInitializationProps {
  onMapClick?: () => void;
  enableTerrain?: boolean;
  initialCenter?: [number, number];
}

export const useMapInitialization = ({ 
  onMapClick,
  enableTerrain = true,
  initialCenter
}: UseMapInitializationProps = {}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(hasMapboxToken());
  const [terrainEnabled, setTerrainEnabled] = useState<boolean>(enableTerrain);
  const initialCenterRef = useRef<[number, number] | undefined>(initialCenter);
  const styleLoadedRef = useRef<boolean>(false);
  const mapInitAttempts = useRef(0);

  // Initialize the map when the container is ready and we have a token
  useEffect(() => {
    if (!mapContainer.current || !hasToken) return;
    
    let isMounted = true;
    
    const initializeMap = () => {
      try {
        // Clear any previous error state
        if (isMounted) {
          setError(null);
          setIsLoading(true);
        }
        
        console.log('Initializing map with center:', initialCenterRef.current);
        console.log('Initialization attempt:', mapInitAttempts.current + 1);
        mapInitAttempts.current += 1;
        
        // Use the saved token from localStorage or the environment variable
        const token = localStorage.getItem('mapbox-token') || MAPBOX_CONFIG.accessToken;
        
        if (!token) {
          throw new Error('No Mapbox token available');
        }
        
        // Set the token for the mapboxgl library
        mapboxgl.accessToken = token;
        
        if (!mapContainer.current) {
          console.error('Map container ref is null');
          return;
        }

        // Validate container dimensions
        const { offsetWidth, offsetHeight } = mapContainer.current;
        if (offsetWidth <= 0 || offsetHeight <= 0) {
          console.warn('Container has invalid dimensions:', { width: offsetWidth, height: offsetHeight });
          
          // Wait a bit and retry if the container isn't ready
          if (mapInitAttempts.current < 5) {
            setTimeout(initializeMap, 500);
          } else {
            if (isMounted) {
              setError('Map container has invalid dimensions. Please refresh the page.');
              setIsLoading(false);
            }
          }
          return;
        }

        // Create a new map instance with a specific style (not null)
        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/outdoors-v12', // Use a specific style initially
          center: initialCenterRef.current || [9.1829, 48.7758], // Use initialCenter if provided, otherwise default to Stuttgart
          zoom: initialCenterRef.current ? 10 : 5, // Zoom in more if we have a specific center
          attributionControl: true,
          trackResize: true,
          preserveDrawingBuffer: true // This helps with rendering issues in some browsers
        });
        
        // Add navigation controls
        newMap.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
        
        // Set map instance even before it's fully loaded
        if (isMounted) {
          setMap(newMap);
        }
        
        // Handle style load event
        newMap.on('style.load', () => {
          console.log('Map style loaded successfully');
          
          if (!isMounted) return;
          
          styleLoadedRef.current = true;
          
          // If initialCenter changes after initial load, update the map
          if (initialCenterRef.current !== initialCenter && initialCenter) {
            initialCenterRef.current = initialCenter;
            newMap.flyTo({
              center: initialCenter,
              zoom: 10,
              essential: true
            });
          }
          
          // Add DEM source for terrain with safety check
          try {
            addDemSource(newMap);
            console.log('Added DEM source after style load');
            
            // Add topographical layers with a delay to ensure map is ready
            setTimeout(() => {
              if (!isMounted) return;
              
              try {
                addTopographicalLayers(newMap);
                console.log('Added topographical layers after style load');
                
                // Enable terrain if requested
                if (terrainEnabled) {
                  newMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
                  console.log('Terrain enabled');
                }
                
                if (isMounted) {
                  setIsLoading(false);
                }
              } catch (e) {
                console.error('Error adding layers:', e);
                if (isMounted) {
                  setIsLoading(false);
                }
              }
            }, 500);
          } catch (e) {
            console.error('Error adding DEM source:', e);
            // Continue anyway, not critical
          }
        });
        
        // Handle full map load
        newMap.on('load', () => {
          console.log('Map loaded successfully');
          
          if (!isMounted) return;
          
          // Only proceed with initialization if style hasn't loaded yet
          if (!styleLoadedRef.current) {
            // Add DEM source as a backup in case style.load hasn't fired
            try {
              addDemSource(newMap);
              console.log('Added DEM source after map load');
            } catch (e) {
              console.error('Error adding DEM source after map load:', e);
            }
          }
          
          if (isMounted && isLoading) {
            setIsLoading(false);
          }
        });
        
        // Add specific error handling
        newMap.on('error', (e) => {
          console.error('Map error:', e);
          const errorMessage = e.error?.message || 'Unknown error';
          
          if (isMounted) {
            setError(`Error loading map: ${errorMessage}`);
            setIsLoading(false);
          }
        });
        
        // Set loading to false after a timeout even if events don't fire
        const loadTimeout = setTimeout(() => {
          if (isMounted && isLoading) {
            console.log('Map load timeout reached, considering map ready');
            setIsLoading(false);
          }
        }, 8000); // 8 second timeout
        
        return () => {
          clearTimeout(loadTimeout);
          if (newMap) {
            try {
              newMap.remove();
            } catch (e) {
              console.error('Error removing map:', e);
            }
          }
        };
      } catch (err) {
        console.error('Error initializing map:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error initializing map');
          setIsLoading(false);
        }
      }
    };
    
    // Start initialization
    initializeMap();
    
    // Cleanup function to remove the map instance when component unmounts
    return () => {
      isMounted = false;
      if (map) {
        try {
          map.remove();
        } catch (e) {
          console.error('Error removing map on unmount:', e);
        }
        setMap(null);
      }
    };
  }, [hasToken, terrainEnabled, initialCenter, enableTerrain, isLoading]);
  
  // Update map center when initialCenter prop changes
  useEffect(() => {
    if (map && initialCenter && initialCenterRef.current !== initialCenter) {
      console.log('Updating map center to:', initialCenter);
      initialCenterRef.current = initialCenter;
      map.flyTo({
        center: initialCenter,
        zoom: 10,
        essential: true
      });
    }
  }, [map, initialCenter]);
  
  // Save the token and set hasToken state
  const handleTokenSave = useCallback((token: string) => {
    localStorage.setItem('mapbox-token', token);
    setHasToken(true);
  }, []);
  
  // Reset the token and clear hasToken state
  const handleResetToken = useCallback(() => {
    localStorage.removeItem('mapbox-token');
    setHasToken(false);
    setMap(null);
    setError(null);
  }, []);
  
  // Handle map click
  const handleMapClick = useCallback(() => {
    if (onMapClick) {
      onMapClick();
    }
  }, [onMapClick]);
  
  // Toggle terrain
  const toggleTerrain = useCallback(() => {
    if (!map) return;
    
    try {
      if (terrainEnabled) {
        // Disable terrain
        map.setTerrain(null);
        console.log('Terrain disabled');
      } else {
        // Enable terrain
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        console.log('Terrain enabled');
      }
      
      setTerrainEnabled(!terrainEnabled);
    } catch (e) {
      console.error('Error toggling terrain:', e);
      toast.error('Failed to toggle terrain. Please try again.');
    }
  }, [map, terrainEnabled]);
  
  return {
    mapContainer,
    map,
    isLoading,
    error,
    hasToken,
    terrainEnabled,
    handleTokenSave,
    handleResetToken,
    handleMapClick,
    toggleTerrain
  };
};
