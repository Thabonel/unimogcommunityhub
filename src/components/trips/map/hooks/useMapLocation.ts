
import { useEffect, useRef, useCallback } from 'react';
import { useMapLocations } from './useMapLocations';

/**
 * Hook to handle map location updates
 */
export const useMapLocation = ({ 
  map, 
  startLocation, 
  endLocation, 
  waypoints, 
  isLoading, 
  error 
}) => {
  const prevPropsRef = useRef({ startLocation, endLocation, waypoints });
  const mapRef = useRef(map);
  
  // Update refs when props change
  useEffect(() => {
    prevPropsRef.current = { startLocation, endLocation, waypoints };
    mapRef.current = map;
  }, [startLocation, endLocation, waypoints, map]);
  
  // Memoize updates to prevent unnecessary re-renders
  const handleLocationUpdates = useCallback(() => {
    // Use the locations hook to manage map locations and routes
    useMapLocations({
      map: mapRef.current,
      startLocation,
      endLocation,
      waypoints,
      isLoading,
      error
    });
  }, [map, startLocation, endLocation, waypoints, isLoading, error]);
  
  // Apply location updates
  useEffect(() => {
    handleLocationUpdates();
  }, [handleLocationUpdates]);
};
