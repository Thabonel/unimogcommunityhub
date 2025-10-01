
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { fetchRouteCoordinates } from '../utils/geocodingUtils';
import { clearMapRoutes, addRouteAndFitView, updateMapView } from '../utils/mapRouteUtils';

/**
 * Hook to manage route calculations and display
 */
export const useRouteCalculation = () => {
  
  // Clear any routes on the map
  const clearRoutes = useCallback((map: mapboxgl.Map | null) => {
    if (!map) return;
    clearMapRoutes(map);
  }, []);
  
  // Fetch and display route
  const calculateAndDisplayRoute = useCallback(async (
    map: mapboxgl.Map | null,
    startCoords: [number, number] | null,
    endCoords: [number, number] | null,
    signal?: AbortSignal
  ): Promise<boolean> => {
    if (!map || !startCoords || !endCoords) return false;
    
    try {
      // Fetch route coordinates
      const routeCoordinates = await fetchRouteCoordinates(startCoords, endCoords);
      
      // Skip if aborted
      if (signal?.aborted) return false;
      
      // Add the route to the map
      addRouteAndFitView(map, routeCoordinates, startCoords, endCoords);
      return true;
    } catch (err) {
      console.error('Error fetching route:', err);
      return false;
    }
  }, []);
  
  // Update the map view based on available coordinates
  const updateMapViewWithCoordinates = useCallback((
    map: mapboxgl.Map | null,
    startLocation: string | undefined,
    endLocation: string | undefined,
    startCoords: [number, number] | null,
    endCoords: [number, number] | null
  ) => {
    if (!map) return;
    updateMapView(map, startLocation, endLocation, startCoords, endCoords);
  }, []);
  
  return {
    clearRoutes,
    calculateAndDisplayRoute,
    updateMapViewWithCoordinates
  };
};
