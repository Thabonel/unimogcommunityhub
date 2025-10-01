
import mapboxgl from 'mapbox-gl';
import { fitMapToBounds } from './mapNavigationUtils';

/**
 * Clear any existing routes from the map
 */
export const clearMapRoutes = (map: mapboxgl.Map): void => {
  // Remove route layers if they exist
  const routeLayers = ['route-line', 'route-line-casing'];
  
  routeLayers.forEach(layer => {
    if (map.getLayer(layer)) {
      map.removeLayer(layer);
    }
  });
  
  // Remove route source if it exists
  if (map.getSource('route')) {
    map.removeSource('route');
  }
};

/**
 * Add a route to the map and fit the view to include start and end points
 */
export const addRouteAndFitView = (
  map: mapboxgl.Map,
  routeCoordinates: [number, number][],
  startCoords: [number, number],
  endCoords: [number, number]
): void => {
  if (routeCoordinates.length === 0) {
    console.warn('No route coordinates provided');
    return;
  }
  
  // Add the route source
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: routeCoordinates
      }
    }
  });
  
  // Add a casing line for the route (slightly wider, appears as an outline)
  map.addLayer({
    id: 'route-line-casing',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#2c3e50',
      'line-width': 8
    }
  });
  
  // Add the main route line on top of the casing
  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#3498db',
      'line-width': 4
    }
  });
  
  // Fit the map view to include the entire route plus some padding
  const allCoords = [startCoords, endCoords, ...routeCoordinates];
  fitMapToBounds(map, allCoords);
};

/**
 * Update map view based on available location information
 */
export const updateMapView = (
  map: mapboxgl.Map,
  startLocation?: string,
  endLocation?: string,
  startCoords?: [number, number],
  endCoords?: [number, number]
): void => {
  if (!map) return;
  
  if (startCoords && endCoords) {
    // If we have both coordinates, fit view to include both
    fitMapToBounds(map, [startCoords, endCoords]);
  } else if (startCoords) {
    // If we only have start coordinates, center on those
    map.flyTo({
      center: startCoords,
      zoom: 12,
      essential: true
    });
  } else if (endCoords) {
    // If we only have end coordinates, center on those
    map.flyTo({
      center: endCoords,
      zoom: 12,
      essential: true
    });
  } else {
    // If no coordinates are available, but we have location names,
    // we could potentially do additional geocoding here
    console.log('No coordinates available for map view update');
  }
};
