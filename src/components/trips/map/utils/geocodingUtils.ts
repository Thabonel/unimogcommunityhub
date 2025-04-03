
import mapboxgl from 'mapbox-gl';

/**
 * Improved geocoding function that handles more real-world locations
 */
export const geocodeLocation = (location: string): [number, number] => {
  // This is a mock implementation that returns realistic coordinates for demo purposes
  // In a real app, this would call the Mapbox Geocoding API
  
  const locationLower = location.toLowerCase();
  
  // Handle Australian locations
  if (locationLower.includes('sydney')) {
    return [151.2093, -33.8688]; // Sydney, Australia
  } else if (locationLower.includes('zigzag railway') || locationLower.includes('zig zag')) {
    return [150.2329, -33.4775]; // Zigzag Railway, Blue Mountains, Australia
  } else if (locationLower.includes('blue mountains')) {
    return [150.3014, -33.7081]; // Blue Mountains, Australia
  } else if (locationLower.includes('melbourne')) {
    return [144.9631, -37.8136]; // Melbourne, Australia
  }
  
  // Handle common terrain types from the form
  if (locationLower.includes('alps')) {
    return [9.5, 46.5]; // Swiss Alps
  } else if (locationLower.includes('desert')) {
    return [25.3, 29.2]; // Sahara Desert
  } else if (locationLower.includes('forest')) {
    return [-123.1, 47.7]; // Pacific Northwest forests
  } else if (locationLower.includes('mountain')) {
    return [-106.8294, 39.1911]; // Rocky Mountains
  } else if (locationLower.includes('river')) {
    return [-90.9176, 32.3182]; // Mississippi River
  }
  
  // Default fallback with slight randomization
  return [-99.5 + Math.random() * 2 - 1, 40.0 + Math.random() * 2 - 1];
};

/**
 * In a real app, this would make an API call to get routing data
 */
export const fetchRouteCoordinates = async (
  startCoords: [number, number],
  endCoords: [number, number]
): Promise<[number, number][]> => {
  // This is a placeholder that would normally make an API call to Mapbox Directions API
  return createRouteCoordinates(startCoords, endCoords);
};

/**
 * Creates a more realistic curved route between two points
 */
export const createRouteCoordinates = (
  startCoords: [number, number],
  endCoords: [number, number]
): [number, number][] => {
  // Create a more detailed curved line between the points with multiple waypoints
  const route: [number, number][] = [startCoords];
  
  // Calculate distance between points to determine number of waypoints
  const distance = Math.sqrt(
    Math.pow(endCoords[0] - startCoords[0], 2) + 
    Math.pow(endCoords[1] - startCoords[1], 2)
  );
  
  // Add more waypoints for longer distances
  const numPoints = Math.max(3, Math.ceil(distance * 15));
  
  for (let i = 1; i < numPoints - 1; i++) {
    const ratio = i / (numPoints - 1);
    
    // Linear interpolation
    const x = startCoords[0] + (endCoords[0] - startCoords[0]) * ratio;
    const y = startCoords[1] + (endCoords[1] - startCoords[1]) * ratio;
    
    // Add some curvature - more pronounced in the middle
    const curveFactor = Math.sin(ratio * Math.PI) * 0.04;
    const perpX = -(endCoords[1] - startCoords[1]) * curveFactor;
    const perpY = (endCoords[0] - startCoords[0]) * curveFactor;
    
    route.push([x + perpX, y + perpY]);
  }
  
  route.push(endCoords);
  return route;
};
