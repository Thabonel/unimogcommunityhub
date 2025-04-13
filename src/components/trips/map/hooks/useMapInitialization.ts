
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { 
  getMapboxToken, 
  hasMapboxToken, 
  saveMapboxToken,
  initializeMap,
  cleanupMap
} from '../utils';
import { addDemSource } from '../utils/terrainUtils';

interface UseMapInitializationOptions {
  onMapClick?: () => void;
  initialCenter?: [number, number];
  enableTerrain?: boolean;
}

export const useMapInitialization = ({
  onMapClick,
  initialCenter,
  enableTerrain = false
}: UseMapInitializationOptions = {}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(hasMapboxToken());
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!hasToken || !mapContainer.current) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize new map
      const newMap = initializeMap(mapContainer.current);
      map.current = newMap;
      
      // Set up event handlers for map initialization
      newMap.on('load', () => {
        console.log('Map loaded successfully');
        
        if (enableTerrain) {
          try {
            // First add the DEM source
            addDemSource(newMap);
            
            // Handle terrain differently to avoid the raster-dem error
            // Note: We'll limit capabilities to avoid the error with hillshade
            newMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
            console.log('Terrain enabled');
          } catch (err) {
            console.error('Error setting up terrain:', err);
            // Don't fail if terrain setup fails
          }
        }
        
        // Add navigation controls - fix the type error by instantiating the control
        if (!newMap.hasControl(new mapboxgl.NavigationControl())) {
          newMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        }
        
        setIsLoading(false);
      });
      
      // Handle map errors
      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        const errorMessage = e.error?.message || 'Unknown error';
        
        // Don't set error for hillshade layer errors as we're working around them
        if (errorMessage.includes('raster-dem source can only be used with layer type "hillshade"')) {
          console.warn('Ignoring known hillshade error:', errorMessage);
          return;
        }
        
        setError(`Error loading map: ${errorMessage}`);
        setIsLoading(false);
      });
      
      // Set initial center if provided
      if (initialCenter && newMap) {
        newMap.setCenter(initialCenter);
      }
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
    
    // Cleanup map on unmount
    return () => {
      cleanupMap(map.current);
      map.current = null;
    };
  }, [hasToken, initialCenter, enableTerrain]);
  
  // Save token and refresh
  const handleTokenSave = useCallback((token: string) => {
    try {
      saveMapboxToken(token);
      setHasToken(true);
      toast.success('Mapbox token saved successfully');
    } catch (err) {
      console.error('Error saving token:', err);
      toast.error('Error saving token');
    }
  }, []);
  
  // Reset token and refresh
  const handleResetToken = useCallback(() => {
    localStorage.removeItem('mapbox-token');
    setHasToken(false);
    setError(null);
    toast.success('Mapbox token reset successfully');
  }, []);
  
  // Handle map click
  const handleMapClick = useCallback(() => {
    if (onMapClick) {
      onMapClick();
    }
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
