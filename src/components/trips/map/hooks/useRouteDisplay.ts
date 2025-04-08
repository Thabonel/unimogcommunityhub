
import { useEffect, useRef, useCallback, useLayoutEffect } from 'react';
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
  const processingRef = useRef(false);
  const mountedRef = useRef(true);
  const activeRequestsRef = useRef<AbortController[]>([]);
  
  // Cancel any active requests when unmounting
  const cancelActiveRequests = useCallback(() => {
    activeRequestsRef.current.forEach(controller => {
      try {
        controller.abort();
      } catch (e) {
        // Ignore errors from aborting
      }
    });
    activeRequestsRef.current = [];
  }, []);
  
  // Set mounted ref to false on unmount and cancel active requests
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      processingRef.current = false;
      cancelActiveRequests();
    };
  }, [cancelActiveRequests]);
  
  // Update refs when props change to avoid unnecessary re-renders
  useEffect(() => {
    // Only update refs if values have changed
    if (prevStartRef.current !== startLocation) {
      prevStartRef.current = startLocation;
    }
    if (prevEndRef.current !== endLocation) {
      prevEndRef.current = endLocation;
    }
    if (JSON.stringify(waypointsRef.current) !== JSON.stringify(waypoints)) {
      waypointsRef.current = waypoints;
    }
  }, [startLocation, endLocation, waypoints]);
  
  // Memoized update function to prevent recreation on each render
  const updateMapForLocations = useCallback(async () => {
    // Avoid concurrent processing and check if map and component are available
    if (processingRef.current || !mountedRef.current || !map) return;
    processingRef.current = true;
    
    // Cancel any ongoing requests from previous updates
    cancelActiveRequests();
    
    // Create a new abort controller for this update operation
    const controller = new AbortController();
    activeRequestsRef.current.push(controller);
    
    try {
      // Skip if no locations
      if (!startLocation && !endLocation) {
        processingRef.current = false;
        return;
      }
      
      console.log('Updating map for locations:', { startLocation, endLocation });
      
      // Clear any existing markers and routes
      clearMapMarkers(map);
      clearMapRoutes(map);
      
      // Geocode locations to coordinates
      let startCoords: [number, number] | null = null;
      let endCoords: [number, number] | null = null;
      
      if (startLocation) {
        try {
          startCoords = await geocodeLocation(startLocation);
          // Check if operation was aborted or component unmounted
          if (!mountedRef.current || controller.signal.aborted) {
            throw new Error('Operation aborted');
          }
        } catch (err) {
          if (err instanceof Error && err.message === 'Operation aborted') {
            throw err; // Re-throw to be caught by outer try-catch
          }
          console.error('Error geocoding start location:', err);
        }
      }
      
      if (endLocation) {
        try {
          endCoords = await geocodeLocation(endLocation);
          // Check if operation was aborted or component unmounted
          if (!mountedRef.current || controller.signal.aborted) {
            throw new Error('Operation aborted');
          }
        } catch (err) {
          if (err instanceof Error && err.message === 'Operation aborted') {
            throw err; // Re-throw to be caught by outer try-catch
          }
          console.error('Error geocoding end location:', err);
        }
      }
      
      // Skip if component unmounted during async operations
      if (!mountedRef.current || controller.signal.aborted) {
        throw new Error('Operation aborted');
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
          if (!mountedRef.current || controller.signal.aborted) {
            throw new Error('Operation aborted');
          }
          
          // Add the route to the map
          addRouteAndFitView(map, routeCoordinates, startCoords, endCoords);
        } catch (err) {
          if (err instanceof Error && err.message === 'Operation aborted') {
            throw err; // Re-throw to be caught by outer try-catch
          }
          console.error('Error fetching route:', err);
          
          // Update map view based on available location info even if route fetch fails
          if (mountedRef.current && !controller.signal.aborted) {
            updateMapView(map, startLocation, endLocation, startCoords, endCoords);
          }
        }
      } else {
        // Update map view based on available location info
        updateMapView(map, startLocation, endLocation, startCoords, endCoords);
      }
      
    } catch (err) {
      if (err instanceof Error && err.message === 'Operation aborted') {
        console.log('Route display operation was aborted');
      } else {
        console.error('Error updating map for locations:', err);
      }
    } finally {
      // Remove this controller from the active requests
      if (mountedRef.current) {
        activeRequestsRef.current = activeRequestsRef.current.filter(c => c !== controller);
        processingRef.current = false;
      }
    }
  }, [map, startLocation, endLocation, waypoints, cancelActiveRequests]);
  
  // Only update when locations change and map is ready
  useEffect(() => {
    if (!map || isLoading || error) return;
    
    // Skip if component is unmounted
    if (!mountedRef.current) return;
    
    // Debounce the update to prevent rapid consecutive updates
    const timerId = setTimeout(() => {
      if (mountedRef.current && !processingRef.current) {
        updateMapForLocations();
      }
    }, 100);
    
    return () => {
      clearTimeout(timerId);
    };
  }, [map, startLocation, endLocation, waypoints, isLoading, error, updateMapForLocations]);
