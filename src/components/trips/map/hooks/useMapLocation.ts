
import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
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
  const mapRef = useRef(map);
  const [isLocationUpdating, setIsLocationUpdating] = useState(false);
  const prevPropsRef = useRef({ startLocation, endLocation, waypoints });
  
  // Update refs when props change
  useEffect(() => {
    prevPropsRef.current = { startLocation, endLocation, waypoints };
    mapRef.current = map;
  }, [startLocation, endLocation, waypoints, map]);
  
  // Check if locations have changed to determine if we need to update
  const hasLocationsChanged = useCallback(() => {
    const { startLocation: prevStart, endLocation: prevEnd, waypoints: prevWaypoints } = prevPropsRef.current;
    return prevStart !== startLocation || prevEnd !== endLocation || 
           JSON.stringify(prevWaypoints) !== JSON.stringify(waypoints);
  }, [startLocation, endLocation, waypoints]);

  // Apply location updates only when needed
  useEffect(() => {
    if (!map || isLoading || error) return;
    
    // Only update if locations have changed and map is ready
    if (hasLocationsChanged() && map.loaded()) {
      setIsLocationUpdating(true);
      
      // Use the locations hook to manage map locations and routes
      useMapLocations({
        map,
        startLocation,
        endLocation,
        waypoints,
        isLoading,
        error
      });
      
      setIsLocationUpdating(false);
    }
  }, [map, startLocation, endLocation, waypoints, isLoading, error, hasLocationsChanged]);
  
  return { isLocationUpdating };
};
