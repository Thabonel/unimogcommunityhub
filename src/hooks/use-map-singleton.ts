import { useEffect, useState, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import MapManager from '@/services/map/MapManager';

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
  const onMapLoadRef = useRef(onMapLoad);

  // Update ref when onMapLoad changes
  useEffect(() => {
    onMapLoadRef.current = onMapLoad;
  }, [onMapLoad]);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;
    
    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const mapInstance = await MapManager.getMap(containerRef.current!, {
          center,
          zoom,
          style
        });
        
        if (mounted) {
          setMap(mapInstance);
          setIsLoading(false);
          
          // Call onMapLoad callback
          if (onMapLoadRef.current) {
            onMapLoadRef.current(mapInstance);
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to initialize map:', err);
          setError(err instanceof Error ? err.message : 'Failed to initialize map');
          setIsLoading(false);
        }
      }
    };

    initMap();

    return () => {
      mounted = false;
      // Don't cleanup map here - let MapManager handle it
    };
  }, []); // Empty deps - only initialize once

  // Update center when it changes
  useEffect(() => {
    if (map && center) {
      MapManager.flyTo(center, zoom);
    }
  }, [map, center, zoom]);

  // Update style when it changes
  const setStyle = useCallback((newStyle: string) => {
    MapManager.setStyle(newStyle);
  }, []);

  return {
    containerRef,
    map,
    isLoading,
    error,
    setStyle
  };
}