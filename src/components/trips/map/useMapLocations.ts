
import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { addStartMarker, addEndMarker } from './createMapMarkers';
import { addRouteToMap, createRouteCoordinates } from './createMapRoute';
import { fitMapToBounds, flyToLocation } from './mapConfig';

interface UseMapLocationsProps {
  map: mapboxgl.Map | null;
  startLocation?: string;
  endLocation?: string;
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
  isLoading,
  error
}: UseMapLocationsProps): void => {
  useEffect(() => {
    if (!map || isLoading || error) return;
    
    const updateMapForLocations = async () => {
      if (!startLocation && !endLocation) return;
      
      try {
        // Clear any existing markers and routes
        const existingStartMarker = document.getElementById('start-marker');
        if (existingStartMarker) existingStartMarker.remove();
        
        const existingEndMarker = document.getElementById('end-marker');
        if (existingEndMarker) existingEndMarker.remove();
        
        if (map.getLayer('route-line')) {
          map.removeLayer('route-line');
        }
        
        if (map.getSource('route')) {
          map.removeSource('route');
        }
        
        // In a real app, we would geocode these locations
        // For now we'll use placeholder coordinates
        const startCoords: [number, number] = startLocation ? [-99.5, 40.0] : [-99.5, 40.0];
        const endCoords: [number, number] = endLocation ? [-97.5, 39.5] : [-97.5, 39.5];
        
        // Add markers for start and end if we have coordinates
        if (startLocation) {
          addStartMarker(map, startLocation, startCoords);
        }
        
        if (endLocation) {
          addEndMarker(map, endLocation, endCoords);
        }
        
        // If we have both start and end coordinates, draw a route between them
        if (startLocation && endLocation) {
          // Create route coordinates with a curve
          const routeCoordinates = createRouteCoordinates(startCoords, endCoords);
          
          // Add the route source and layer only if the map is fully loaded
          if (map.isStyleLoaded()) {
            addRouteToMap(map, routeCoordinates);
          } else {
            // Wait for the style to load if it hasn't already
            map.once('style.load', () => {
              addRouteToMap(map, routeCoordinates);
            });
          }
          
          // Fit the map to show both points with padding
          fitMapToBounds(map, [startCoords, endCoords]);
        } else if (startLocation) {
          // If we only have start coordinates
          flyToLocation(map, startCoords);
        } else if (endLocation) {
          // If we only have end coordinates
          flyToLocation(map, endCoords);
        }
      } catch (err) {
        console.error('Error updating map for locations:', err);
      }
    };
    
    updateMapForLocations();
  }, [startLocation, endLocation, isLoading, error, map]);
};
