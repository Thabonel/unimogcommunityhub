
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
import { clearMapboxTokenStorage } from '@/utils/mapbox-helper';

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
  const [hasToken, setHasToken] = useState<boolean>(() => hasMapboxToken());
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  
  // Initialize map when component mounts
  useEffect(() => {
    // Skip if no token or no container
    if (!hasToken || !mapContainer.current) {
      setIsLoading(false);
      return;
    }
    
    // Skip if map already exists and is initialized
    if (map.current && isMapInitialized) {
      setIsLoading(false);
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
        
        // Add navigation controls - fix the type error by instantiating the control
        try {
          newMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
        } catch (err) {
          console.warn('Navigation control may already exist:', err);
        }
        
        setIsMapInitialized(true);
        setIsLoading(false);
      });
      
      // Handle map errors
      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        const errorMessage = e.error?.message || 'Unknown error';
        
        // Check for WebGL-specific errors
        if (errorMessage.toLowerCase().includes('webgl') || 
            errorMessage.toLowerCase().includes('context') ||
            errorMessage.toLowerCase().includes('gl')) {
          setError('WebGL initialization failed. Please check your browser settings or try refreshing the page.');
          setIsLoading(false);
          return;
        }
        
        // Don't set error for known non-critical errors
        if (errorMessage.includes('raster-dem source can only be used with layer type "hillshade"') ||
            errorMessage.includes('403') || 
            errorMessage.includes('mapbox-terrain-dem') ||
            errorMessage === 'Unknown error') {
          console.warn('Ignoring non-critical map error:', errorMessage);
          return;
        }
        
        setError(`Error loading map: ${errorMessage}`);
        setIsLoading(false);
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
    
    // Cleanup map on unmount
    return () => {
      cleanupMap(map.current);
      map.current = null;
      setIsMapInitialized(false);
    };
  }, [hasToken]); // Only re-initialize if token changes
  
  // Handle center changes after map is initialized
  useEffect(() => {
    if (map.current && isMapInitialized && initialCenter) {
      map.current.setCenter(initialCenter);
    }
  }, [initialCenter, isMapInitialized]);
  
  // Handle terrain changes after map is initialized
  useEffect(() => {
    if (map.current && isMapInitialized) {
      if (enableTerrain) {
        try {
          addDemSource(map.current);
          map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        } catch (err) {
          console.warn('Could not enable terrain:', err);
        }
      } else {
        try {
          map.current.setTerrain(null);
        } catch (err) {
          console.warn('Could not disable terrain:', err);
        }
      }
    }
  }, [enableTerrain, isMapInitialized]);
  
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
    clearMapboxTokenStorage(); // Use centralized cleanup
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
