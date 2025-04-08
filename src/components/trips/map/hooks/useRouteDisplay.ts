
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
  
  useEffect(() => {
    if (!map || isLoading || error) return;
    
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
    
    const updateMapForLocations = async () => {
      if (routeUpdateInProgressRef.current) return;
      
      if (!startLocation && !endLocation) return;
      
      try {
        routeUpdateInProgressRef.current = true;
        
        // Clear any existing markers and routes
        clearMapMarkers(map);
        clearMapRoutes(map);
        
        // Geocode locations to coordinates
        let startCoords: [number, number] | null = null;
        let endCoords: [number, number] | null = null;
        
        if (startLocation) {
          startCoords = await geocodeLocation(startLocation);
        }
        
        if (endLocation) {
          endCoords = await geocodeLocation(endLocation);
        }
        
        // Add markers for start and end if we have coordinates
        if (startLocation && startCoords) {
          addLocationMarkers(map, startLocation, startCoords, endLocation, endCoords || undefined);
        }
        
        // If we have both start and end coordinates, draw a route between them
        if (startCoords && endCoords) {
          // Fetch route coordinates
          const routeCoordinates = await fetchRouteCoordinates(startCoords, endCoords);
          
          // Add the route to the map
          addRouteAndFitView(map, routeCoordinates, startCoords, endCoords);
        } else {
          // Update map view based on available location info
          updateMapView(map, startLocation, endLocation, startCoords || undefined, endCoords || undefined);
        }
      } catch (err) {
        console.error('Error updating map for locations:', err);
      } finally {
        routeUpdateInProgressRef.current = false;
      }
    };
    
    updateMapForLocations();
  }, [startLocation, endLocation, waypoints, isLoading, error, map]);
};
