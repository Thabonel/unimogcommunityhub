
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { hasMapboxToken, validateMapboxToken, addTopographicalLayers, addDemSource } from './mapConfig';
import { MAPBOX_CONFIG } from '@/config/env';
import { toast } from 'sonner';

interface UseMapInitializationProps {
  onMapClick?: () => void;
  enableTerrain?: boolean;
}

export const useMapInitialization = ({ 
  onMapClick,
  enableTerrain = true 
}: UseMapInitializationProps = {}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(hasMapboxToken());
  const [terrainEnabled, setTerrainEnabled] = useState<boolean>(enableTerrain);

  // Initialize the map when the container is ready and we have a token
  useEffect(() => {
    if (!mapContainer.current || !hasToken) return;
    
    try {
      // Clear any previous error state
      setError(null);
      setIsLoading(true);
      
      console.log('Initializing map...');
      
      // Use the saved token from localStorage or the environment variable
      const token = localStorage.getItem('mapbox-token') || MAPBOX_CONFIG.accessToken;
      
      if (!token) {
        throw new Error('No Mapbox token available');
      }
      
      // Set the token for the mapboxgl library
      mapboxgl.accessToken = token;
      
      // Create a new map instance
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [9.1829, 48.7758], // Default to Stuttgart, Germany
        zoom: 5
      });
      
      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Set map instance even before it's fully loaded
      setMap(newMap);
      
      // Wait for the map to load before finishing initialization
      newMap.on('load', () => {
        console.log('Map loaded successfully');
        
        // Pre-add DEM source for faster layer toggling
        addDemSource(newMap);
        
        // Add topographical layers with a delay to ensure map is ready
        setTimeout(() => {
          addTopographicalLayers(newMap);
          
          // Enable terrain if requested
          if (terrainEnabled) {
            newMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
          }
          
          setIsLoading(false);
        }, 500);
      });
      
      // Add error handling
      newMap.on('error', (e) => {
        console.error('Map error:', e);
        setError('Error loading map: ' + (e.error?.message || 'Unknown error'));
        setIsLoading(false);
      });
      
      // Set loading to false after a timeout even if 'load' event doesn't fire
      const loadTimeout = setTimeout(() => {
        if (isLoading) {
          console.log('Map load timeout reached, considering map ready');
          setIsLoading(false);
        }
      }, 10000); // 10 second timeout
      
      return () => {
        clearTimeout(loadTimeout);
        if (newMap) {
          newMap.remove();
        }
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err instanceof Error ? err.message : 'Unknown error initializing map');
      setIsLoading(false);
    }
    
    // Cleanup function to remove the map instance when component unmounts
    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [hasToken, terrainEnabled, isLoading]);
  
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
    
    if (terrainEnabled) {
      // Disable terrain
      map.setTerrain(null);
    } else {
      // Enable terrain
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    }
    
    setTerrainEnabled(!terrainEnabled);
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
