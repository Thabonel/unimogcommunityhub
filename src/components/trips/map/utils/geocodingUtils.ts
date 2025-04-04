
import mapboxgl from 'mapbox-gl';

/**
 * Convert a location string to coordinates
 * In a real app, this would use the Mapbox Geocoding API
 * For this demo, it returns mock coordinates
 */
export const geocodeLocation = async (location: string): Promise<[number, number]> => {
  console.log(`Geocoding location: ${location}`);
  
  try {
    // For demo purposes, we'll use placeholder coordinates
    // In a real app, you would call the Mapbox Geocoding API
    
    // Mock some different coordinates based on the location string
    // to make it appear like actual geocoding is happening
    switch (location.toLowerCase()) {
      case 'new york':
        return [-74.0060, 40.7128];
      case 'los angeles':
        return [-118.2437, 34.0522];
      case 'chicago':
        return [-87.6298, 41.8781];
      case 'london':
        return [-0.1278, 51.5074];
      case 'paris':
        return [2.3522, 48.8566];
      case 'tokyo':
        return [139.6917, 35.6895];
      case 'sydney':
        return [151.2093, -33.8688];
      case 'zurich, switzerland':
        return [8.5417, 47.3769];
      case 'interlaken, switzerland':
        return [7.8632, 46.6863];
      case 'marrakech, morocco':
        return [-7.9811, 31.6295];
      case 'merzouga, morocco':
        return [-4.0071, 31.1676];
      default:
        // Generate a random point near the US center for any other location
        const randomOffset = (Math.random() - 0.5) * 10; // +/- 5 degrees
        return [-98.5795 + randomOffset, 39.8283 + randomOffset];
    }
  } catch (error) {
    console.error(`Error geocoding location ${location}:`, error);
    // Return a default location if geocoding fails
    return [-98.5795, 39.8283]; // Center of US
  }
};

/**
 * Generate or fetch route coordinates between two points
 * In a real app, this would use the Mapbox Directions API
 */
export const fetchRouteCoordinates = async (
  start: [number, number],
  end: [number, number]
): Promise<[number, number][]> => {
  console.log(`Fetching route from ${start} to ${end}`);
  
  try {
    // For demo purposes, we'll create a simple curved path
    // In a real app, you would call the Mapbox Directions API
    
    // Create a simple curved path between the two points
    const midLng = (start[0] + end[0]) / 2;
    const midLat = (start[1] + end[1]) / 2;
    
    // Add a slight offset to create a curve
    const latOffset = (end[1] - start[1]) * 0.15;
    const midPoint: [number, number] = [midLng, midLat + latOffset];
    
    // Create a few intermediate points to smooth the path
    const quarterPoint1: [number, number] = [
      start[0] * 0.75 + midPoint[0] * 0.25,
      start[1] * 0.75 + midPoint[1] * 0.25
    ];
    
    const quarterPoint2: [number, number] = [
      midPoint[0] * 0.75 + end[0] * 0.25,
      midPoint[1] * 0.75 + end[1] * 0.25
    ];
    
    return [start, quarterPoint1, midPoint, quarterPoint2, end];
  } catch (error) {
    console.error('Error fetching route:', error);
    // Return a simple straight-line route if the API call fails
    return [start, end];
  }
};
