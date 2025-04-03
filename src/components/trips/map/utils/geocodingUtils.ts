
/**
 * Geocodes a location string to coordinates
 * In a real app, this would call a geocoding API
 */
export const geocodeLocation = (location: string): [number, number] => {
  // This is a mock implementation 
  // In a real app, you would use the Mapbox Geocoding API
  
  // Create deterministic but different coordinates based on the location string
  const hash = Array.from(location).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Generate coordinates around the United States
  const lng = -98 + (hash % 30) - 15; // roughly US longitude range
  const lat = 38 + (hash % 20) - 10;  // roughly US latitude range
  
  console.log(`Geocoded "${location}" to [${lng}, ${lat}]`);
  
  return [lng, lat];
};

/**
 * Fetches route coordinates between two points
 * In a real app, this would call a directions API
 */
export const fetchRouteCoordinates = async (
  start: [number, number], 
  end: [number, number]
): Promise<[number, number][]> => {
  // This is a mock implementation
  // In a real app, you would use the Mapbox Directions API
  
  // Create a simple path with some intermediate points to make it look like a route
  const midpoint1: [number, number] = [
    start[0] + (end[0] - start[0]) * 0.33, 
    start[1] + (end[1] - start[1]) * 0.33 + 0.2 // Add some curve
  ];
  
  const midpoint2: [number, number] = [
    start[0] + (end[0] - start[0]) * 0.66,
    start[1] + (end[1] - start[1]) * 0.66 - 0.2 // Add some curve
  ];
  
  // Return an array of coordinates representing the route
  return [start, midpoint1, midpoint2, end];
};
