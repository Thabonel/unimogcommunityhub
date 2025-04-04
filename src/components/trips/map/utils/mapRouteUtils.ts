
import mapboxgl from 'mapbox-gl';

/**
 * Clear any existing route lines from the map
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
 * Add a route line to the map and fit the view to show the route
 */
export const addRouteAndFitView = (
  map: mapboxgl.Map,
  routeCoordinates: number[][],
  startCoords: [number, number],
  endCoords: [number, number]
): void => {
  if (!map.isStyleLoaded()) {
    // Wait for the style to load
    map.once('style.load', () => {
      addRouteAndFitView(map, routeCoordinates, startCoords, endCoords);
    });
    return;
  }
  
  // Add the route source
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: routeCoordinates
      },
      properties: {}
    }
  });
  
  // Add the route layer
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
  
  // Fit the map to show the route
  const bounds = new mapboxgl.LngLatBounds()
    .extend(startCoords)
    .extend(endCoords);
  
  map.fitBounds(bounds, {
    padding: 50,
    maxZoom: 15,
    duration: 1000
  });
};

/**
 * Update the map view based on available location information
 */
export const updateMapView = (
  map: mapboxgl.Map,
  startLocationName?: string,
  endLocationName?: string,
  startCoords?: [number, number],
  endCoords?: [number, number]
): void => {
  // If we have both start and end coordinates, fit the map to show both
  if (startCoords && endCoords) {
    const bounds = new mapboxgl.LngLatBounds()
      .extend(startCoords)
      .extend(endCoords);
    
    map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 15,
      duration: 1000
    });
  } 
  // If we only have start coordinates, fly to them
  else if (startCoords) {
    map.flyTo({
      center: startCoords,
      zoom: 10,
      essential: true,
      duration: 1000
    });
  } 
  // If we only have end coordinates, fly to them
  else if (endCoords) {
    map.flyTo({
      center: endCoords,
      zoom: 10,
      essential: true,
      duration: 1000
    });
  } 
  // Default view
  else {
    map.flyTo({
      center: [-95.7129, 37.0902], // Center of US
      zoom: 3,
      essential: true,
      duration: 1000
    });
  }
};
