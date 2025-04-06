
import { useEffect } from 'react';
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
  useEffect(() => {
    if (!map || isLoading || error) return;
    
    const updateMapForLocations = async () => {
      if (!startLocation && !endLocation) return;
      
      try {
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
          
          // Process waypoints if available
          if (waypoints && waypoints.length > 0) {
            console.log('Processing waypoints:', waypoints);
            // This would be where you'd integrate waypoints into the route
            // For demonstration, we'll just log them for now
          }
          
          // Add the route to the map
          addRouteAndFitView(map, routeCoordinates, startCoords, endCoords);
        } else {
          // Update map view based on available location info
          updateMapView(map, startLocation, endLocation, startCoords || undefined, endCoords || undefined);
        }
      } catch (err) {
        console.error('Error updating map for locations:', err);
      }
    };
    
    updateMapForLocations();
  }, [startLocation, endLocation, waypoints, isLoading, error, map]);
};
