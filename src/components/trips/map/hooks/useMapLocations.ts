
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { geocodeLocation, fetchRouteCoordinates } from '../utils/geocodingUtils';
import { clearMapMarkers, addLocationMarkers } from '../utils/mapMarkerUtils';
import { clearMapRoutes, addRouteAndFitView, updateMapView } from '../utils/mapRouteUtils';

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
 */
export const useMapLocations = ({
  map,
  startLocation,
  endLocation,
  waypoints = [],
  isLoading,
  error
}: UseMapLocationsProps): void => {
  useEffect(() => {
    if (!map || isLoading || error) return;
    
    const updateMapForLocations = async () => {
      if (!startLocation && !endLocation) return;
      
      try {
        // Clear any existing markers and routes
        clearMapMarkers(map);
        clearMapRoutes(map);
        
        // Geocode locations to coordinates
        const startCoords: [number, number] = startLocation ? geocodeLocation(startLocation) : [-99.5, 40.0];
        const endCoords: [number, number] = endLocation ? geocodeLocation(endLocation) : [-97.5, 39.5];
        
        // Add markers for start and end locations
        addLocationMarkers(map, startLocation, startCoords, endLocation, endCoords);
        
        // If we have both start and end coordinates, draw a route between them
        if (startLocation && endLocation) {
          // Get route coordinates
          const routeCoordinates = await fetchRouteCoordinates(startCoords, endCoords);
          
          // Add the route to the map and fit the view
          addRouteAndFitView(map, routeCoordinates, startCoords, endCoords);
        } else {
          // Update map view based on available locations
          updateMapView(map, startLocation, endLocation, startCoords, endCoords);
        }
      } catch (err) {
        console.error('Error updating map for locations:', err);
      }
    };
    
    updateMapForLocations();
  }, [startLocation, endLocation, waypoints, isLoading, error, map]);
};
