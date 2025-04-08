
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useRouteDisplay } from './hooks/useRouteDisplay';

interface UseMapLocationsProps {
  map: mapboxgl.Map | null;
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to manage locations and routes on the map
 * This is a wrapper around useRouteDisplay to maintain backward compatibility
 */
export const useMapLocations = ({
  map,
  startLocation,
  endLocation,
  waypoints = [],
  isLoading,
  error
}: UseMapLocationsProps): void => {
  // Track if the hook has already been initialized to prevent multiple initializations
  const initialized = useRef(false);
  
  // Only call useRouteDisplay when the map is ready and not loading
  useEffect(() => {
    if (map && !isLoading && !error && !initialized.current) {
      initialized.current = true;
      console.log('Map locations hook initialized');
    }
  }, [map, isLoading, error]);
  
  // Use the route display hook with stabilized props
  useRouteDisplay({
    map,
    startLocation,
    endLocation,
    waypoints,
    isLoading,
    error
  });
};
