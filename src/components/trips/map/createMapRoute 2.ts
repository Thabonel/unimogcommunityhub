
import mapboxgl from 'mapbox-gl';

/**
 * Creates route coordinates between start and end points,
 * optionally including waypoints
 */
export const createRouteCoordinates = (
  startCoords: [number, number],
  endCoords: [number, number],
  waypointCoords?: [number, number][]
): [number, number][] => {
  // In a real app, this would call a routing API
  // For now, we'll create a simple line between points
  
  if (!waypointCoords || waypointCoords.length === 0) {
    // Direct route between start and end
    return [startCoords, endCoords];
  }
  
  // Include waypoints in the route
  const routeCoordinates: [number, number][] = [startCoords];
  waypointCoords.forEach(waypoint => {
    routeCoordinates.push(waypoint);
  });
  routeCoordinates.push(endCoords);
  
  return routeCoordinates;
};

/**
 * Adds a route line to the map
 */
export const addRouteToMap = (
  map: mapboxgl.Map,
  coordinates: [number, number][]
): void => {
  if (!map || !coordinates || coordinates.length < 2) return;
  
  // Remove existing route if present
  if (map.getLayer('route-line')) {
    map.removeLayer('route-line');
  }
  
  if (map.getSource('route')) {
    map.removeSource('route');
  }
  
  // Add the route source
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
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
      'line-color': '#2196F3',
      'line-width': 6,
      'line-opacity': 0.8
    }
  });
};
