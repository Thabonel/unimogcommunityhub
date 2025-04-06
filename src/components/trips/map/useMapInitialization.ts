
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { hasMapboxToken, validateMapboxToken, addTopographicalLayers, addDemSource } from './mapConfig';
import { MAPBOX_CONFIG } from '@/config/env';
import { toast } from 'sonner';

interface UseMapInitializationProps {
  onMapClick?: () => void;
  enableTerrain?: boolean;
  initialCenter?: [number, number]; // Initial center coordinates
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

  // Initialize the map when the container is ready and we have a token
  useEffect(() => {
    if (!mapContainer.current || !hasToken) return;
    
    let isMounted = true;
    
    try {
      // Clear any previous error state
      setError(null);
      setIsLoading(true);
      
      console.log('Initializing map with center:', initialCenterRef.current);
      
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

      // Create a new map instance with a specific style (not null)
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12', // Use a specific style initially
        center: initialCenterRef.current || [9.1829, 48.7758], // Use initialCenter if provided, otherwise default to Stuttgart
        zoom: initialCenterRef.current ? 10 : 5, // Zoom in more if we have a specific center
        attributionControl: true,
        trackResize: true
      });
      
      // Add navigation controls
      newMap.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
      
      // Set map instance even before it's fully loaded
      setMap(newMap);
      
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
        addDemSource(newMap);
        
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
            
            setIsLoading(false);
          } catch (e) {
            console.error('Error adding layers:', e);
            setIsLoading(false);
          }
        }, 500);
      });
      
      // Handle full map load
      newMap.on('load', () => {
        console.log('Map loaded successfully');
        
        if (!isMounted) return;
        
        // Only proceed with initialization if style hasn't loaded yet
        if (!styleLoadedRef.current) {
          // Add DEM source as a backup in case style.load hasn't fired
          addDemSource(newMap);
        }
      });
      
      // Add error handling
      newMap.on('error', (e) => {
        console.error('Map error:', e);
        if (isMounted) {
          setError('Error loading map: ' + (e.error?.message || 'Unknown error'));
          setIsLoading(false);
        }
      });
      
      // Set loading to false after a timeout even if events don't fire
      const loadTimeout = setTimeout(() => {
        if (isMounted && isLoading) {
          console.log('Map load timeout reached, considering map ready');
          setIsLoading(false);
          
          // Add DEM source and layers as a fallback if we hit the timeout
          if (newMap && !styleLoadedRef.current) {
            try {
              addDemSource(newMap);
              addTopographicalLayers(newMap);
              console.log('Added layers after timeout');
            } catch (e) {
              console.error('Error adding layers after timeout:', e);
            }
          }
        }
      }, 8000); // 8 second timeout
      
      return () => {
        isMounted = false;
        clearTimeout(loadTimeout);
        if (newMap) {
          newMap.remove();
        }
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      if (isMounted) {
        setError(err instanceof Error ? err.message : 'Unknown error initializing map');
        setIsLoading(false);
      }
    }
    
    // Cleanup function to remove the map instance when component unmounts
    return () => {
      isMounted = false;
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [hasToken, terrainEnabled]);
  
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
