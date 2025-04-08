
import { useEffect, useRef } from 'react';
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
  
  // Update props ref when props change
  useEffect(() => {
    prevPropsRef.current = { startLocation, endLocation, waypoints };
  }, [startLocation, endLocation, waypoints]);
  
  // Use the locations hook to manage map locations and routes
  useMapLocations({
    map,
    startLocation,
    endLocation,
    waypoints,
    isLoading,
    error
  });
};
