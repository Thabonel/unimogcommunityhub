
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { hasMapboxToken, validateMapboxToken, isSupported, saveMapboxToken, getMapboxToken } from './mapConfig';
import { addTopographicalLayers, addDemSource } from './utils/layerUtils';
import { toast } from 'sonner';
import { initializeMap, cleanupMap } from './utils/mapInitUtils';

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
  const isMountedRef = useRef(true);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  // Update initial center ref when prop changes
  useEffect(() => {
    initialCenterRef.current = initialCenter;
  }, [initialCenter]);

  // Browser compatibility check
  useEffect(() => {
    if (!isSupported()) {
      setError('Your browser does not support Mapbox GL. Please try a different browser.');
      setIsLoading(false);
    }
  }, []);

  // Initialize the map when the container is ready and we have a token
  useEffect(() => {
    if (!mapContainer.current || !hasToken || error || !isMountedRef.current) return;
    
    if (mapInstance.current) {
      console.log('Map already initialized, skipping initialization');
      return;
    }
    
    let aborted = false;
    
    const initializeMapInstance = async () => {
      try {
        // Reset error state
        setError(null);
        setIsLoading(true);
        
        console.log('Initializing map with center:', initialCenterRef.current);
        console.log('Initialization attempt:', mapInitAttempts.current + 1);
        mapInitAttempts.current += 1;
        
        // Validate container dimensions
        if (!mapContainer.current) {
          throw new Error('Map container reference is null');
        }
        
        const { offsetWidth, offsetHeight } = mapContainer.current;
        if (offsetWidth <= 10 || offsetHeight <= 10) {
          console.warn('Container has invalid dimensions:', { width: offsetWidth, height: offsetHeight });
          
          // Wait and retry later with a timeout
          setTimeout(() => {
            if (!aborted && isMountedRef.current && !mapInstance.current) {
              initializeMapInstance();
            }
          }, 500);
          return;
        }

        // Use our improved initialization utility
        const newMapInstance = initializeMap(mapContainer.current);
        
        if (aborted) {
          // Cleanup if component unmounted during initialization
          try {
            newMapInstance.remove();
          } catch (e) {
            console.error('Error cleaning up aborted map:', e);
          }
          return;
        }
        
        // Update center if provided
        if (initialCenterRef.current) {
          newMapInstance.setCenter(initialCenterRef.current);
          newMapInstance.setZoom(10); // Zoom in when we have a specific center
        }
        
        // Store map instance
        mapInstance.current = newMapInstance;
        
        if (isMountedRef.current) {
          setMap(newMapInstance);
        }
        
        // Set up style.load event handler
        newMapInstance.on('style.load', () => {
          console.log('Map style loaded successfully');
          
          if (!isMountedRef.current || !newMapInstance) return;
          
          styleLoadedRef.current = true;
          
          // Add DEM source for terrain
          try {
            addDemSource(newMapInstance);
            console.log('Added DEM source after style load');
            
            // Add topographical layers with a delay
            setTimeout(() => {
              if (!isMountedRef.current || !newMapInstance) return;
              
              try {
                addTopographicalLayers(newMapInstance);
                console.log('Added topographical layers after style load');
                
                // Enable terrain if requested
                if (terrainEnabled) {
                  newMapInstance.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
                  console.log('Terrain enabled');
                }
                
                if (isMountedRef.current) {
                  setIsLoading(false);
                }
              } catch (e) {
                console.error('Error adding layers:', e);
                if (isMountedRef.current) {
                  setIsLoading(false);
                }
              }
            }, 500);
          } catch (e) {
            console.error('Error adding DEM source:', e);
            // Continue anyway, not critical
            if (isMountedRef.current) {
              setIsLoading(false);
            }
          }
        });
        
        // Set up load event handler
        newMapInstance.on('load', () => {
          console.log('Map loaded successfully');
          
          if (!isMountedRef.current) return;
          
          if (isMountedRef.current) {
            setIsLoading(false);
          }
        });
        
        // Set up error handler
        newMapInstance.on('error', (e) => {
          const errorMessage = e.error?.message || 'Unknown error';
          console.error('Map error:', e, errorMessage);
          
          if (isMountedRef.current) {
            setError(`Error loading map: ${errorMessage}`);
            setIsLoading(false);
          }
        });
        
        // Safety fallback timer
        const loadTimeout = setTimeout(() => {
          if (isMountedRef.current && isLoading) {
            console.log('Map load timeout reached, considering map ready');
            setIsLoading(false);
          }
        }, 8000);
        
        return () => {
          clearTimeout(loadTimeout);
        };
      } catch (err) {
        console.error('Error initializing map:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error initializing map';
        
        if (isMountedRef.current) {
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };
    
    // Start initialization
    initializeMapInstance();
    
    // Cleanup function
    return () => {
      aborted = true;
      cleanupMap(mapInstance.current);
      mapInstance.current = null;
    };
  }, [hasToken, terrainEnabled, enableTerrain, error]);
  
  // Set isMounted ref to false on component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanupMap(mapInstance.current);
      mapInstance.current = null;
      setMap(null);
    };
  }, []);
  
  // Handle map click
  const handleMapClick = useCallback(() => {
    if (onMapClick) {
      onMapClick();
    }
  }, [onMapClick]);
  
  // Save the token and set hasToken state
  const handleTokenSave = useCallback((token: string) => {
    saveMapboxToken(token);
    mapboxgl.accessToken = token;
    setHasToken(true);
    toast.success('Mapbox token saved successfully');
  }, []);
  
  // Reset the token and clear hasToken state
  const handleResetToken = useCallback(() => {
    localStorage.removeItem('mapbox_access_token');
    localStorage.removeItem('mapbox-token'); // also remove legacy key
    setHasToken(false);
    cleanupMap(mapInstance.current);
    mapInstance.current = null;
    setMap(null);
    setError(null);
    toast.info('Mapbox token has been reset');
  }, []);
  
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
