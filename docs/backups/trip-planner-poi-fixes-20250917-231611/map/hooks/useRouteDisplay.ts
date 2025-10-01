
import { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useRequestController } from './useRequestController';
import { useMapMarkers } from './useMapMarkers';
import { useRouteCalculation } from './useRouteCalculation';
import { useGeocoding } from './useGeocoding';

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
 * Composes smaller, focused hooks for better maintainability
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
  
  // Use our smaller, focused hooks
  const { mountedRef, processingRef, createRequestController, cancelActiveRequests } = useRequestController();
  const { updateMapMarkers } = useMapMarkers();
  const { clearRoutes, calculateAndDisplayRoute, updateMapViewWithCoordinates } = useRouteCalculation();
  const { geocodeLocationWithErrorHandling } = useGeocoding();
  
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
    const controller = createRequestController();
    
    try {
      // Skip if no locations
      if (!startLocation && !endLocation) {
        processingRef.current = false;
        return;
      }
      
      console.log('Updating map for locations:', { startLocation, endLocation });
      
      // Clear any existing markers and routes
      updateMapMarkers(map, undefined, null, undefined, null);
      clearRoutes(map);
      
      // Geocode locations to coordinates
      let startCoords: [number, number] | null = null;
      let endCoords: [number, number] | null = null;
      
      if (startLocation) {
        try {
          startCoords = await geocodeLocationWithErrorHandling(startLocation, controller.signal);
          // Check if operation was aborted or component unmounted
          if (!mountedRef.current || controller.signal.aborted) {
            throw new Error('Operation aborted');
          }
        } catch (err) {
          if (err instanceof Error && err.message === 'Operation aborted') {
            throw err; // Re-throw to be caught by outer try-catch
          }
        }
      }
      
      if (endLocation) {
        try {
          endCoords = await geocodeLocationWithErrorHandling(endLocation, controller.signal);
          // Check if operation was aborted or component unmounted
          if (!mountedRef.current || controller.signal.aborted) {
            throw new Error('Operation aborted');
          }
        } catch (err) {
          if (err instanceof Error && err.message === 'Operation aborted') {
            throw err; // Re-throw to be caught by outer try-catch
          }
        }
      }
      
      // Skip if component unmounted during async operations
      if (!mountedRef.current || controller.signal.aborted) {
        throw new Error('Operation aborted');
      }
      
      // Add markers for start and end if we have coordinates
      updateMapMarkers(map, startLocation, startCoords, endLocation, endCoords);
      
      // If we have both start and end coordinates, draw a route between them
      if (startCoords && endCoords) {
        try {
          const routeDisplayed = await calculateAndDisplayRoute(
            map, 
            startCoords, 
            endCoords, 
            controller.signal
          );
          
          // Skip if component unmounted during async operations
          if (!mountedRef.current || controller.signal.aborted) {
            throw new Error('Operation aborted');
          }
          
          // If route display failed, update map view based on available coordinates
          if (!routeDisplayed && mountedRef.current && !controller.signal.aborted) {
            updateMapViewWithCoordinates(map, startLocation, endLocation, startCoords, endCoords);
          }
        } catch (err) {
          if (err instanceof Error && err.message === 'Operation aborted') {
            throw err; // Re-throw to be caught by outer try-catch
          }
          
          // Update map view based on available location info even if route fetch fails
          if (mountedRef.current && !controller.signal.aborted) {
            updateMapViewWithCoordinates(map, startLocation, endLocation, startCoords, endCoords);
          }
        }
      } else {
        // Update map view based on available location info
        updateMapViewWithCoordinates(map, startLocation, endLocation, startCoords, endCoords);
      }
      
    } catch (err) {
      if (err instanceof Error && err.message === 'Operation aborted') {
        console.log('Route display operation was aborted');
      } else {
        console.error('Error updating map for locations:', err);
      }
    } finally {
      // Reset processing flag if component is still mounted
      if (mountedRef.current) {
        processingRef.current = false;
      }
    }
  }, [
    map, 
    startLocation, 
    endLocation, 
    cancelActiveRequests, 
    createRequestController, 
    updateMapMarkers, 
    clearRoutes, 
    geocodeLocationWithErrorHandling, 
    calculateAndDisplayRoute, 
    updateMapViewWithCoordinates
  ]);
  
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
};
