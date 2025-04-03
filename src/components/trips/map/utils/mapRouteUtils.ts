
import mapboxgl from 'mapbox-gl';
import { addRouteToMap } from '../createMapRoute';
import { fitMapToBounds, flyToLocation } from '../mapConfig';

/**
 * Clear existing routes from the map
 */
export const clearMapRoutes = (map: mapboxgl.Map): void => {
  if (map.getLayer('route-line')) {
    map.removeLayer('route-line');
  }
  
  if (map.getSource('route')) {
    map.removeSource('route');
  }
};

/**
 * Add a route to the map and fit the view
 */
export const addRouteAndFitView = (
  map: mapboxgl.Map, 
  routeCoordinates: [number, number][], 
  startCoords: [number, number], 
  endCoords: [number, number]
): void => {
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
};

/**
 * Update the map view based on available locations
 */
export const updateMapView = (
  map: mapboxgl.Map,
  startLocation: string | undefined,
  endLocation: string | undefined,
  startCoords: [number, number],
  endCoords: [number, number]
): void => {
  if (startLocation && endLocation) {
    // If we have both start and end coordinates, fit the map to show both
    fitMapToBounds(map, [startCoords, endCoords]);
  } else if (startLocation) {
    // If we only have start coordinates
    flyToLocation(map, startCoords);
  } else if (endLocation) {
    // If we only have end coordinates
    flyToLocation(map, endCoords);
  }
};
