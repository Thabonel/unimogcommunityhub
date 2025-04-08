
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
  const isInitializingRef = useRef(false);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  // Update initial center ref when prop changes
  useEffect(() => {
    initialCenterRef.current = initialCenter;
  }, [initialCenter]);

  // Mounted status tracking
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      // Mark component as unmounted to prevent state updates
      isMountedRef.current = false;
      
      // Clean up any map instance when component unmounts
      if (mapInstance.current) {
        console.log('Cleaning up map on unmount');
        cleanupMap(mapInstance.current);
        mapInstance.current = null;
      }
    };
  }, []);

  // Browser compatibility check
  useEffect(() => {
    if (!isSupported()) {
      setError('Your browser does not support Mapbox GL. Please try a different browser.');
      setIsLoading(false);
    }
  }, []);

  // Initialize the map when the container is ready and we have a token
  useEffect(() => {
    if (!mapContainer.current || !hasToken || error || !isMountedRef.current || isInitializingRef.current) return;
    
    if (mapInstance.current) {
      console.log('Map already initialized, skipping initialization');
      return;
    }
    
    isInitializingRef.current = true;
    
    const initializeMapInstance = async () => {
      try {
        // Reset error state
        setError(null);
        if (isMountedRef.current) {
          setIsLoading(true);
        }
        
        console.log('Initializing map with center:', initialCenterRef.current);
        mapInitAttempts.current += 1;
        
        // Validate container dimensions
        if (!mapContainer.current) {
          throw new Error('Map container reference is null');
        }
        
        const { offsetWidth, offsetHeight } = mapContainer.current;
        if (offsetWidth <= 10 || offsetHeight <= 10) {
          console.warn('Container has invalid dimensions:', { width: offsetWidth, height: offsetHeight });
          isInitializingRef.current = false;
          return;
        }

        // Use our improved initialization utility
        const newMapInstance = initializeMap(mapContainer.current);
        
        // Check if component was unmounted during async operation
        if (!isMountedRef.current) {
          cleanupMap(newMapInstance);
          isInitializingRef.current = false;
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
        
        // Set up style.load event handler with proper unmount checks
        newMapInstance.on('style.load', () => {
          console.log('Map style loaded successfully');
          
          if (!isMountedRef.current || !newMapInstance) return;
          
          styleLoadedRef.current = true;
          
          try {
            if (isMountedRef.current && newMapInstance) {
              // Add DEM source for terrain
              addDemSource(newMapInstance);
              
              // Add topographical layers
              addTopographicalLayers(newMapInstance);
              
              // Enable terrain if requested
              if (terrainEnabled) {
                newMapInstance.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
              }
              
              if (isMountedRef.current) {
                setIsLoading(false);
              }
            }
          } catch (e) {
            console.error('Error adding layers:', e);
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
        
      } catch (err) {
        console.error('Error initializing map:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error initializing map';
        
        if (isMountedRef.current) {
          setError(errorMessage);
          setIsLoading(false);
        }
      } finally {
        isInitializingRef.current = false;
      }
    };
    
    // Start initialization
    initializeMapInstance();
    
    // Safety timeout to prevent stuck loading state
    const safetyTimeoutId = setTimeout(() => {
      if (isMountedRef.current && isLoading) {
        console.log('Safety timeout reached, resetting loading state');
        setIsLoading(false);
        isInitializingRef.current = false;
      }
    }, 10000);
    
    // Cleanup function
    return () => {
      clearTimeout(safetyTimeoutId);
    };
  }, [hasToken, terrainEnabled, enableTerrain, error]);
  
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
