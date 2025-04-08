
import { useEffect, useRef, useCallback } from 'react';
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
  const processingRef = useRef(false);
  
  // Set mounted ref to false on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  
  // Memoized update function to prevent recreation on each render
  const updateMapForLocations = useCallback(async () => {
    // Avoid concurrent processing
    if (processingRef.current || !mountedRef.current || !map) return;
    
    try {
      processingRef.current = true;
      
      // Skip if no locations
      if (!startLocation && !endLocation) {
        processingRef.current = false;
        return;
      }
      
      // Clear any existing markers and routes
      clearMapMarkers(map);
      clearMapRoutes(map);
      
      // Geocode locations to coordinates
      let startCoords: [number, number] | null = null;
      let endCoords: [number, number] | null = null;
      
      if (startLocation && startLocation !== prevStartRef.current) {
        try {
          startCoords = await geocodeLocation(startLocation);
          if (!mountedRef.current) {
            processingRef.current = false;
            return;
          }
        } catch (err) {
          console.error('Error geocoding start location:', err);
        }
      }
      
      if (endLocation && endLocation !== prevEndRef.current) {
        try {
          endCoords = await geocodeLocation(endLocation);
          if (!mountedRef.current) {
            processingRef.current = false;
            return;
          }
        } catch (err) {
          console.error('Error geocoding end location:', err);
        }
      }
      
      // Skip if component unmounted during async operations
      if (!mountedRef.current) {
        processingRef.current = false;
        return;
      }
      
      // Add markers for start and end if we have coordinates
      if (startLocation && startCoords) {
        addLocationMarkers(map, startLocation, startCoords, endLocation, endCoords || undefined);
      }
      
      // If we have both start and end coordinates, draw a route between them
      if (startCoords && endCoords) {
        try {
          // Fetch route coordinates
          const routeCoordinates = await fetchRouteCoordinates(startCoords, endCoords);
          
          // Skip if component unmounted during async operations
          if (!mountedRef.current) {
            processingRef.current = false;
            return;
          }
          
          // Add the route to the map
          addRouteAndFitView(map, routeCoordinates, startCoords, endCoords);
        } catch (err) {
          console.error('Error fetching route:', err);
          
          // Update map view based on available location info even if route fetch fails
          updateMapView(map, startLocation, endLocation, startCoords, endCoords);
        }
      } else {
        // Update map view based on available location info
        updateMapView(map, startLocation, endLocation, startCoords, endCoords);
      }
      
      // Update refs with current values to track changes
      prevStartRef.current = startLocation;
      prevEndRef.current = endLocation;
      waypointsRef.current = waypoints;
      
    } catch (err) {
      console.error('Error updating map for locations:', err);
    } finally {
      if (mountedRef.current) {
        processingRef.current = false;
      }
    }
  }, [map, startLocation, endLocation, waypoints]);
  
  // Only update when locations change and map is ready
  useEffect(() => {
    if (!map || isLoading || error) return;
    
    // Skip if component is unmounted
    if (!mountedRef.current) return;
    
    // Only update if locations have changed
    const locationChanged = 
      prevStartRef.current !== startLocation || 
      prevEndRef.current !== endLocation ||
      JSON.stringify(waypointsRef.current) !== JSON.stringify(waypoints);
    
    if (locationChanged && !processingRef.current) {
      updateMapForLocations();
    }
  }, [map, startLocation, endLocation, waypoints, isLoading, error, updateMapForLocations]);
};
