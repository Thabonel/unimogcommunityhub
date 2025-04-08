
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
  // Track if the hook is mounted to prevent operations after unmount
  const mountedRef = useRef(true);
  
  // Use refs to track stable prop values
  const mapRef = useRef(map);
  const startLocationRef = useRef(startLocation);
  const endLocationRef = useRef(endLocation);
  const waypointsRef = useRef(waypoints);
  const isLoadingRef = useRef(isLoading);
  const errorRef = useRef(error);
  
  // Update refs when props change
  useEffect(() => {
    mapRef.current = map;
    startLocationRef.current = startLocation;
    endLocationRef.current = endLocation;
    waypointsRef.current = waypoints;
    isLoadingRef.current = isLoading;
    errorRef.current = error;
  }, [map, startLocation, endLocation, waypoints, isLoading, error]);
  
  // Set mounted ref to false on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Use the route display hook with the current stable ref values
  useRouteDisplay({
    map,
    startLocation,
    endLocation,
    waypoints,
    isLoading,
    error
  });
};
