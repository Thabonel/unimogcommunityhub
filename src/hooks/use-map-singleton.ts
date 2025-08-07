import { useEffect, useState, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import MapManager from '@/services/map/MapManager';
import { getMapboxToken } from '@/utils/mapbox-helper';

interface UseMapSingletonProps {
  center?: [number, number];
  zoom?: number;
  style?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

export function useMapSingleton({
  center = [9.1829, 48.7758],
  zoom = 5,
  style = 'mapbox://styles/mapbox/outdoors-v12',
  onMapLoad
}: UseMapSingletonProps = {}) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInitializedRef = useRef(false);

  // Set style when it changes
  const setStyle = useCallback((newStyle: string) => {
    if (map) {
      map.setStyle(newStyle);
    }
  }, [map]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapInitializedRef.current) return;

    const token = getMapboxToken();
    if (!token) {
      setError('No Mapbox token found');
      setIsLoading(false);
      return;
    }

    // Set the token
    mapboxgl.accessToken = token;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Create the map instance
      const mapInstance = new mapboxgl.Map({
        container: containerRef.current,
        style: style,
        center: center,
        zoom: zoom
      });
      
      mapInitializedRef.current = true;
      
      // Wait for map to load
      mapInstance.on('load', () => {
        setMap(mapInstance);
        setIsLoading(false);
        MapManager.setMap(mapInstance);
        
        // Call onMapLoad callback if provided
        if (onMapLoad) {
          onMapLoad(mapInstance);
        }
      });
      
      // Handle errors
      mapInstance.on('error', (e) => {
        console.error('Map error:', e);
        setError(e.error?.message || 'Map loading error');
        setIsLoading(false);
      });
      
      // Cleanup
      return () => {
        mapInstance.remove();
        MapManager.clear();
        mapInitializedRef.current = false;
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
      setIsLoading(false);
    }
  }, []); // Only run once on mount

  return {
    containerRef,
    map,
    isLoading,
    error,
    setStyle
  };
}