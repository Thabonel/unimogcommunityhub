
import mapboxgl from 'mapbox-gl';

/**
 * Clear any existing routes from the map
 */
export const clearMapRoutes = (map: mapboxgl.Map): void => {
  // Remove any existing route layers and sources
  if (map.getLayer('route-line')) {
    map.removeLayer('route-line');
  }
  
  if (map.getSource('route')) {
    map.removeSource('route');
  }
};

/**
 * Add a route line to the map and fit the view to show both start and end points
 */
export const addRouteAndFitView = (
  map: mapboxgl.Map, 
  routeCoordinates: [number, number][],
  startCoords: [number, number],
  endCoords: [number, number]
): void => {
  // Create a GeoJSON source for the route
  const routeSource: GeoJSON.Feature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: routeCoordinates
    }
  };

  // Add the route source to the map
  if (map.getSource('route')) {
    // Update existing source
    (map.getSource('route') as mapboxgl.GeoJSONSource).setData(routeSource as GeoJSON.Feature);
  } else {
    // Create new source
    map.addSource('route', {
      type: 'geojson',
      data: routeSource
    });
  }

  // Add the route layer if it doesn't exist
  if (!map.getLayer('route-line')) {
    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });
  }

  // Create a bounds object and fit the map to show both points
  const bounds = new mapboxgl.LngLatBounds();
  bounds.extend(startCoords);
  bounds.extend(endCoords);
  
  // Add padding to the bounds
  map.fitBounds(bounds, {
    padding: 100,
    duration: 1000
  });
};

/**
 * Update the map view based on available locations
 * This function decides how to position the map based on what locations are available
 */
export const updateMapView = (
  map: mapboxgl.Map,
  startLocation: string | undefined,
  endLocation: string | undefined,
  startCoords: [number, number],
  endCoords: [number, number]
): void => {
  // If we have both start and end, fit to bounds
  if (startLocation && endLocation) {
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend(startCoords);
    bounds.extend(endCoords);
    
    map.fitBounds(bounds, {
      padding: 100,
      duration: 1000
    });
  } 
  // If we only have start, center on start
  else if (startLocation) {
    map.flyTo({
      center: startCoords,
      zoom: 10,
      duration: 1000
    });
  } 
  // If we only have end, center on end
  else if (endLocation) {
    map.flyTo({
      center: endCoords,
      zoom: 10,
      duration: 1000
    });
  } 
  // Default view if no locations provided
  else {
    map.flyTo({
      center: [-98.5, 39.8], // Center of US
      zoom: 4,
      duration: 1000
    });
  }
};
