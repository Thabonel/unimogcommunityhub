
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { geocodeLocation } from '../utils/geocodingUtils';
import { clearMapMarkers, addLocationMarkers } from '../utils/mapMarkerUtils';
import { clearMapRoutes, addRouteAndFitView, updateMapView } from '../utils/mapRouteUtils';
import { fetchRouteCoordinates } from '../utils/geocodingUtils';

interface UseRouteDisplayProps {
  map: mapboxgl.Map | null;
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to manage route display on the map
 */
export const useRouteDisplay = ({
  map,
  startLocation,
  endLocation,
  waypoints = [],
  isLoading,
  error
}: UseRouteDisplayProps): void => {
  // Use refs to track previous values and prevent unnecessary re-renders
  const prevStartRef = useRef(startLocation);
  const prevEndRef = useRef(endLocation);
  const waypointsRef = useRef(waypoints);
  const routeUpdateInProgressRef = useRef(false);
  const mountedRef = useRef(true);
  
  // Set mounted ref to false on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (!map || isLoading || error) return;
    
    // Skip processing if component is unmounted
    if (!mountedRef.current) return;
    
    // Only update if locations have changed or first render
    const locationChanged = 
      prevStartRef.current !== startLocation || 
      prevEndRef.current !== endLocation ||
      JSON.stringify(waypointsRef.current) !== JSON.stringify(waypoints);
    
    if (!locationChanged && routeUpdateInProgressRef.current) return;
    
    // Update refs with current values
    prevStartRef.current = startLocation;
    prevEndRef.current = endLocation;
    waypointsRef.current = waypoints;
    
    let updateCancelled = false;
    
    const updateMapForLocations = async () => {
      if (routeUpdateInProgressRef.current || !mountedRef.current) return;
      
      if (!startLocation && !endLocation) return;
      
      try {
        routeUpdateInProgressRef.current = true;
        
        // Clear any existing markers and routes
        if (!mountedRef.current || updateCancelled) return;
        clearMapMarkers(map);
        clearMapRoutes(map);
        
        // Geocode locations to coordinates
        let startCoords: [number, number] | null = null;
        let endCoords: [number, number] | null = null;
        
        if (startLocation) {
          startCoords = await geocodeLocation(startLocation);
          if (!mountedRef.current || updateCancelled) return;
        }
        
        if (endLocation) {
          endCoords = await geocodeLocation(endLocation);
          if (!mountedRef.current || updateCancelled) return;
        }
        
        // Skip if component unmounted during async operations
        if (!mountedRef.current || updateCancelled) return;
        
        // Add markers for start and end if we have coordinates
        if (startLocation && startCoords) {
          addLocationMarkers(map, startLocation, startCoords, endLocation, endCoords || undefined);
        }
        
        // If we have both start and end coordinates, draw a route between them
        if (startCoords && endCoords) {
          // Fetch route coordinates
          const routeCoordinates = await fetchRouteCoordinates(startCoords, endCoords);
          
          // Skip if component unmounted during async operations
          if (!mountedRef.current || updateCancelled) return;
          
          // Add the route to the map
          addRouteAndFitView(map, routeCoordinates, startCoords, endCoords);
        } else {
          // Update map view based on available location info
          updateMapView(map, startLocation, endLocation, startCoords || undefined, endCoords || undefined);
        }
      } catch (err) {
        console.error('Error updating map for locations:', err);
      } finally {
        if (mountedRef.current) {
          routeUpdateInProgressRef.current = false;
        }
      }
    };
    
    updateMapForLocations();
    
    return () => {
      updateCancelled = true;
    };
  }, [startLocation, endLocation, waypoints, isLoading, error, map]);
};
