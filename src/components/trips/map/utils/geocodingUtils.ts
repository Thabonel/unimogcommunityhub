
import mapboxgl from 'mapbox-gl';

/**
 * Geocode a location string to coordinates
 * In a real app, this would call a geocoding service API
 */
export const geocodeLocation = async (location: string): Promise<[number, number]> => {
  // This is a mock implementation - in a real app you would use the Mapbox Geocoding API
  // For now we'll return mock coordinates based on location strings
  console.log(`Geocoding location: ${location}`);
  
  // Mock coordinates for some common locations
  const mockCoords: Record<string, [number, number]> = {
    'New York': [-74.0060, 40.7128],
    'Los Angeles': [-118.2437, 34.0522],
    'Chicago': [-87.6298, 41.8781],
    'Houston': [-95.3698, 29.7604],
    'Phoenix': [-112.0740, 33.4484],
    'Philadelphia': [-75.1652, 39.9526],
    'San Antonio': [-98.4936, 29.4241],
    'San Diego': [-117.1611, 32.7157],
    'Dallas': [-96.7970, 32.7767],
    'San Francisco': [-122.4194, 37.7749],
    'Austin': [-97.7431, 30.2672],
    'Denver': [-104.9903, 39.7392],
    'Zurich, Switzerland': [8.5417, 47.3769],
    'Interlaken, Switzerland': [7.8632, 46.6863],
    'Marrakech, Morocco': [-7.9811, 31.6295],
    'Merzouga, Morocco': [-4.0185, 31.1616]
  };
  
  // Look for a matching city name
  for (const city in mockCoords) {
    if (location.toLowerCase().includes(city.toLowerCase())) {
      console.log(`Found mock coordinates for ${location}: ${mockCoords[city]}`);
      return mockCoords[city];
    }
  }
  
  // Return default coordinates if no match found
  console.log(`No mock coordinates for ${location}, using default coordinates`);
  return [-95.7129, 37.0902]; // Default to center of US
};

/**
 * Fetch route coordinates between two points
 * In a real app, this would call a directions service API
 */
export const fetchRouteCoordinates = async (
  startCoords: [number, number],
  endCoords: [number, number]
): Promise<number[][]> => {
  // This is a mock implementation - in a real app you would use the Mapbox Directions API
  console.log(`Fetching route from ${startCoords} to ${endCoords}`);
  
  // Create a simple route with a gentle arc
  const routeCoordinates: number[][] = [];
  
  // Calculate midpoint with a slight offset for the arc
  const midLng = (startCoords[0] + endCoords[0]) / 2;
  const midLat = (startCoords[1] + endCoords[1]) / 2;
  
  // Add offset to create a curve
  const offset = 0.5; // Adjust for more/less curve
  const distance = Math.sqrt(
    Math.pow(endCoords[0] - startCoords[0], 2) + 
    Math.pow(endCoords[1] - startCoords[1], 2)
  );
  
  const offsetLng = (endCoords[1] - startCoords[1]) / distance * offset;
  const offsetLat = -(endCoords[0] - startCoords[0]) / distance * offset;
  
  const arcMidLng = midLng + offsetLng;
  const arcMidLat = midLat + offsetLat;
  
  // Create a smooth route with multiple points
  const steps = 20;
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    
    // Quadratic Bezier curve to create the arc
    const lng = Math.pow(1 - t, 2) * startCoords[0] + 
               2 * (1 - t) * t * arcMidLng + 
               Math.pow(t, 2) * endCoords[0];
               
    const lat = Math.pow(1 - t, 2) * startCoords[1] + 
               2 * (1 - t) * t * arcMidLat + 
               Math.pow(t, 2) * endCoords[1];
               
    routeCoordinates.push([lng, lat]);
  }
  
  return routeCoordinates;
};
