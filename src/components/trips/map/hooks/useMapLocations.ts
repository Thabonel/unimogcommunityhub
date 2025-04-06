
import { useEffect } from 'react';
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
 * This is now a thin wrapper around useRouteDisplay to maintain backward compatibility
 */
export const useMapLocations = ({
  map,
  startLocation,
  endLocation,
  waypoints = [],
  isLoading,
  error
}: UseMapLocationsProps): void => {
  // Use the new hook for route display
  useRouteDisplay({
    map,
    startLocation,
    endLocation,
    waypoints,
    isLoading,
    error
  });
};
