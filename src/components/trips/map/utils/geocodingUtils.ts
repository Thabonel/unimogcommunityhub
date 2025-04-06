
import { getMapboxToken } from './tokenUtils';

/**
 * Geocode a location string to coordinates
 */
export const geocodeLocation = async (location: string): Promise<[number, number]> => {
  try {
    const token = getMapboxToken();
    if (!token) {
      throw new Error('No Mapbox token available for geocoding');
    }
    
    const encodedLocation = encodeURIComponent(location);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedLocation}.json?access_token=${token}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.features || data.features.length === 0) {
      throw new Error(`No geocoding results found for: ${location}`);
    }
    
    const [longitude, latitude] = data.features[0].center;
    return [longitude, latitude];
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

/**
 * Fetch route coordinates between two points
 */
export const fetchRouteCoordinates = async (
  startCoords: [number, number], 
  endCoords: [number, number]
): Promise<[number, number][]> => {
  try {
    const token = getMapboxToken();
    if (!token) {
      throw new Error('No Mapbox token available for routing');
    }
    
    // Format coordinates for the Mapbox Directions API
    const coordinatesString = `${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}`;
    
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?access_token=${token}&geometries=geojson&overview=full`
    );
    
    if (!response.ok) {
      throw new Error(`Routing error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found between the specified locations');
    }
    
    // Extract the route geometry
    const routeCoordinates = data.routes[0].geometry.coordinates;
    return routeCoordinates as [number, number][];
  } catch (error) {
    console.error('Route fetching error:', error);
    throw error;
  }
};
