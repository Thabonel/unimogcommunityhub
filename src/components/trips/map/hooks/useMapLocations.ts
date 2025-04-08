
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useRouteDisplay } from './useRouteDisplay';

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
 * This is now a wrapper around useRouteDisplay to maintain backward compatibility
 */
export const useMapLocations = ({
  map,
  startLocation,
  endLocation,
  waypoints = [],
  isLoading,
  error
}: UseMapLocationsProps): void => {
  // Create stable refs for props to prevent unnecessary rerenders
  const propsRef = useRef({ startLocation, endLocation, waypoints });
  
  // Update the props ref when props change
  useEffect(() => {
    propsRef.current = { startLocation, endLocation, waypoints };
  }, [startLocation, endLocation, waypoints]);
  
  // Use the route display hook with stabilized props
  useRouteDisplay({
    map,
    startLocation: propsRef.current.startLocation,
    endLocation: propsRef.current.endLocation,
    waypoints: propsRef.current.waypoints,
    isLoading,
    error
  });
};
