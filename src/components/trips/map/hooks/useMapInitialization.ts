
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { getMapboxToken, hasMapboxToken, saveMapboxToken } from '../utils/tokenUtils';
import { initializeMap, cleanupMap } from '../utils/mapInitUtils';
import { addTerrainLayer } from '../utils/layerUtils';

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
      
      // Add terrain layer if enabled
      if (enableTerrain) {
        newMap.on('load', () => {
          if (newMap && enableTerrain) {
            try {
              addTerrainLayer(newMap);
            } catch (err) {
              console.error('Error adding terrain layer:', err);
              // Don't set error state for terrain failure - it's not critical
            }
          }
          setIsLoading(false);
        });
      } else {
        newMap.on('load', () => {
          setIsLoading(false);
        });
      }
      
      // Handle map errors
      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError(`Error loading map: ${e.error?.message || 'Unknown error'}`);
        setIsLoading(false);
      });
      
      // Handle style errors
      newMap.on('style.load', () => {
        console.log('Map style loaded successfully');
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
