
import mapboxgl from 'mapbox-gl';

/**
 * Adds or updates a route line on the map
 */
export const addRouteToMap = (mapInstance: mapboxgl.Map, coordinates: [number, number][]): void => {
  // Add the route source if it doesn't exist
  if (!mapInstance.getSource('route')) {
    mapInstance.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      }
    });
  } else {
    // Update existing source
    const source = mapInstance.getSource('route') as mapboxgl.GeoJSONSource;
    source.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates
      }
    });
  }
  
  // Add the route layer if it doesn't exist
  if (!mapInstance.getLayer('route-line')) {
    mapInstance.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#F97316',
        'line-width': 4,
        'line-opacity': 0.8,
        'line-dasharray': [0.5, 1.5]
      }
    });
  }
};

/**
 * Creates a curved route between two points
 */
export const createRouteCoordinates = (
  startCoords: [number, number],
  endCoords: [number, number]
): [number, number][] => {
  // Create a simple curved line between the points
  const midpoint: [number, number] = [
    (startCoords[0] + endCoords[0]) / 2,
    (startCoords[1] + endCoords[1]) / 2 + 0.5 // Offset to create a curve
  ];
  
  return [startCoords, midpoint, endCoords];
};

/**
 * Adds waypoints to a route (not implemented yet)
 */
export const addWaypointsToRoute = (
  startCoords: [number, number],
  endCoords: [number, number],
  waypointCoords: [number, number][]
): [number, number][] => {
  // Simple implementation: just insert waypoints between start and end
  const routeCoordinates: [number, number][] = [startCoords];
  
  // Add all waypoints in order
  waypointCoords.forEach(waypoint => {
    routeCoordinates.push(waypoint);
  });
  
  // Add end point
  routeCoordinates.push(endCoords);
  
  return routeCoordinates;
};
