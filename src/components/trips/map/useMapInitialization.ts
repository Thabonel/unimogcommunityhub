
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { hasMapboxToken, validateMapboxToken, isSupported, saveMapboxToken, getMapboxToken } from './mapConfig';
import { addTopographicalLayers, addDemSource } from './utils/layerUtils';
import { MAPBOX_CONFIG } from '@/config/env';
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
    
    let mapInstance: mapboxgl.Map | null = null;
    
    const initializeMapWithRetry = () => {
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
        if (offsetWidth <= 0 || offsetHeight <= 0) {
          console.warn('Container has invalid dimensions:', { width: offsetWidth, height: offsetHeight });
          
          // Wait a bit and retry if the container isn't ready
          if (mapInitAttempts.current < 5) {
            setTimeout(initializeMapWithRetry, 500);
            return;
          } else {
            throw new Error('Map container has invalid dimensions. Please refresh the page.');
          }
        }

        // Use our improved initialization utility
        mapInstance = initializeMap(mapContainer.current);
        
        // Update center if provided
        if (initialCenterRef.current) {
          mapInstance.setCenter(initialCenterRef.current);
          mapInstance.setZoom(10); // Zoom in when we have a specific center
        }
        
        // Store map instance
        if (isMountedRef.current) {
          setMap(mapInstance);
        }
        
        // Set up style.load event handler
        mapInstance.on('style.load', () => {
          console.log('Map style loaded successfully');
          
          if (!isMountedRef.current || !mapInstance) return;
          
          styleLoadedRef.current = true;
          
          // Add DEM source for terrain
          try {
            addDemSource(mapInstance);
            console.log('Added DEM source after style load');
            
            // Add topographical layers with a delay
            setTimeout(() => {
              if (!isMountedRef.current || !mapInstance) return;
              
              try {
                addTopographicalLayers(mapInstance);
                console.log('Added topographical layers after style load');
                
                // Enable terrain if requested
                if (terrainEnabled) {
                  mapInstance.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
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
        mapInstance.on('load', () => {
          console.log('Map loaded successfully');
          
          if (!isMountedRef.current) return;
          
          // Only proceed with initialization if style hasn't loaded yet
          if (!styleLoadedRef.current) {
            // Add DEM source as a backup
            try {
              addDemSource(mapInstance);
              addTopographicalLayers(mapInstance);
              console.log('Added layers after map load (backup)');
              
              if (terrainEnabled && mapInstance) {
                mapInstance.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
              }
            } catch (e) {
              console.error('Error adding layers after map load:', e);
            }
          }
          
          if (isMountedRef.current && isLoading) {
            setIsLoading(false);
          }
        });
        
        // Set up error handler
        mapInstance.on('error', (e) => {
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
    initializeMapWithRetry();
    
    // Cleanup function
    return () => {
      cleanupMap(mapInstance);
    };
  }, [hasToken, terrainEnabled, enableTerrain, isLoading, error]);
  
  // Set isMounted ref to false on component unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanupMap(map);
      setMap(null);
    };
  }, []);
  
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
    // Use our standardized save function
    saveMapboxToken(token);
    
    // Set mapboxgl token
    mapboxgl.accessToken = token;
    
    // Update state
    setHasToken(true);
    
    // Log success for debugging
    console.log('Mapbox token saved successfully');
    
    // Inform user
    toast.success('Mapbox token saved successfully');
  }, []);
  
  // Reset the token and clear hasToken state
  const handleResetToken = useCallback(() => {
    localStorage.removeItem('mapbox_access_token');
    localStorage.removeItem('mapbox-token'); // also remove legacy key
    setHasToken(false);
    cleanupMap(map);
    setMap(null);
    setError(null);
    toast.info('Mapbox token has been reset');
  }, [map]);
  
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
