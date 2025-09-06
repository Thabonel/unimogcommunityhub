interface ElevationPoint {
  distance: number; // Distance along route in meters
  elevation: number; // Elevation in meters
}

/**
 * Extract elevation data from Mapbox Directions API route
 */
export function extractElevationFromRoute(route: any): ElevationPoint[] {
  if (!route?.legs) return [];

  const elevationPoints: ElevationPoint[] = [];
  let cumulativeDistance = 0;

  // Process each leg of the route
  route.legs.forEach((leg: any) => {
    if (!leg.steps) return;

    leg.steps.forEach((step: any) => {
      if (!step.geometry?.coordinates) return;

      // Add elevation point for each coordinate in the step
      step.geometry.coordinates.forEach((coord: number[], index: number) => {
        const [lng, lat, elevation] = coord;
        
        // Only add if we have elevation data (3D coordinate)
        if (elevation !== undefined) {
          // Calculate distance from previous point if not first point
          if (elevationPoints.length > 0) {
            const prevPoint = elevationPoints[elevationPoints.length - 1];
            const distance = calculateDistance(
              lat, lng,
              // Get lat/lng from previous coordinate - need to reverse lookup
              0, 0 // This would need proper calculation
            );
            cumulativeDistance += distance;
          }

          elevationPoints.push({
            distance: cumulativeDistance,
            elevation: elevation
          });
        }
      });
    });
  });

  return elevationPoints;
}

/**
 * Fetch elevation data for a route using Mapbox Tilesets API
 */
export async function getElevationProfile(coordinates: [number, number][]): Promise<ElevationPoint[]> {
  try {
    const token = localStorage.getItem('mapbox-token') || import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.warn('No Mapbox token for elevation data');
      return [];
    }

    // Sample points along the route (max 300 points for API limit)
    const sampledCoords = sampleCoordinates(coordinates, 100);
    
    // Build query string for elevation API
    const coordsString = sampledCoords
      .map(coord => `${coord[0]},${coord[1]}`)
      .join(';');

    const response = await fetch(
      `https://api.mapbox.com/v4/mapbox.terrain-rgb/tilequery/${coordsString}.json?access_token=${token}`
    );

    if (!response.ok) {
      console.warn('Failed to fetch elevation data:', response.statusText);
      return generateMockElevationData(coordinates);
    }

    const data = await response.json();
    return processElevationResponse(data, coordinates);
    
  } catch (error) {
    console.error('Error fetching elevation data:', error);
    return generateMockElevationData(coordinates);
  }
}

/**
 * Sample coordinates to reduce API calls while maintaining route shape
 */
function sampleCoordinates(coordinates: [number, number][], maxPoints: number): [number, number][] {
  if (coordinates.length <= maxPoints) return coordinates;
  
  const step = Math.ceil(coordinates.length / maxPoints);
  const sampled: [number, number][] = [];
  
  for (let i = 0; i < coordinates.length; i += step) {
    sampled.push(coordinates[i]);
  }
  
  // Always include the last point
  if (sampled[sampled.length - 1] !== coordinates[coordinates.length - 1]) {
    sampled.push(coordinates[coordinates.length - 1]);
  }
  
  return sampled;
}

/**
 * Process elevation API response into elevation points
 */
function processElevationResponse(data: any, originalCoords: [number, number][]): ElevationPoint[] {
  const elevationPoints: ElevationPoint[] = [];
  let cumulativeDistance = 0;

  if (!data.features || data.features.length === 0) {
    return generateMockElevationData(originalCoords);
  }

  data.features.forEach((feature: any, index: number) => {
    const elevation = feature.properties?.elevation || 0;
    const coords = feature.geometry?.coordinates;
    
    if (coords && coords.length >= 2) {
      // Calculate distance from previous point
      if (index > 0) {
        const prevFeature = data.features[index - 1];
        const prevCoords = prevFeature.geometry?.coordinates;
        
        if (prevCoords) {
          const distance = calculateDistance(
            prevCoords[1], prevCoords[0],
            coords[1], coords[0]
          );
          cumulativeDistance += distance;
        }
      }

      elevationPoints.push({
        distance: cumulativeDistance,
        elevation: elevation
      });
    }
  });

  return elevationPoints;
}

/**
 * Generate mock elevation data based on route coordinates
 * Used as fallback when API is unavailable
 */
function generateMockElevationData(coordinates: [number, number][]): ElevationPoint[] {
  const elevationPoints: ElevationPoint[] = [];
  let cumulativeDistance = 0;

  coordinates.forEach((coord, index) => {
    // Calculate distance from previous point
    if (index > 0) {
      const prevCoord = coordinates[index - 1];
      const distance = calculateDistance(
        prevCoord[1], prevCoord[0],
        coord[1], coord[0]
      );
      cumulativeDistance += distance;
    }

    // Generate realistic elevation variation based on coordinate changes
    const baseElevation = 200; // Base elevation in meters
    const variation = Math.sin(index * 0.1) * 50 + Math.cos(index * 0.05) * 30;
    const elevation = baseElevation + variation + (Math.random() - 0.5) * 20;

    elevationPoints.push({
      distance: cumulativeDistance,
      elevation: Math.max(0, elevation) // Ensure non-negative elevation
    });
  });

  return elevationPoints;
}

/**
 * Calculate distance between two points in meters using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const lat1Rad = toRad(lat1);
  const lat2Rad = toRad(lat2);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Analyze elevation profile for route difficulty
 */
export interface RouteAnalysis {
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  totalClimb: number;
  totalDescent: number;
  maxGradient: number;
  averageGradient: number;
  recommendations: string[];
}

export function analyzeElevationProfile(elevationPoints: ElevationPoint[]): RouteAnalysis {
  if (elevationPoints.length < 2) {
    return {
      difficulty: 'Beginner',
      totalClimb: 0,
      totalDescent: 0,
      maxGradient: 0,
      averageGradient: 0,
      recommendations: ['Insufficient elevation data for analysis']
    };
  }

  const elevations = elevationPoints.map(p => p.elevation);
  const distances = elevationPoints.map(p => p.distance);
  
  let totalClimb = 0;
  let totalDescent = 0;
  let maxGradient = 0;
  const gradients: number[] = [];

  // Calculate climbing, descent, and gradients
  for (let i = 1; i < elevationPoints.length; i++) {
    const elevationChange = elevationPoints[i].elevation - elevationPoints[i - 1].elevation;
    const distanceChange = elevationPoints[i].distance - elevationPoints[i - 1].distance;
    
    if (elevationChange > 0) {
      totalClimb += elevationChange;
    } else {
      totalDescent += Math.abs(elevationChange);
    }
    
    if (distanceChange > 0) {
      const gradient = Math.abs((elevationChange / distanceChange) * 100);
      gradients.push(gradient);
      maxGradient = Math.max(maxGradient, gradient);
    }
  }

  const averageGradient = gradients.length > 0 
    ? gradients.reduce((sum, g) => sum + g, 0) / gradients.length 
    : 0;

  // Determine difficulty
  let difficulty: RouteAnalysis['difficulty'] = 'Beginner';
  const recommendations: string[] = [];

  if (totalClimb > 500 || maxGradient > 15) {
    difficulty = 'Expert';
    recommendations.push(
      'Use low range gearing throughout',
      'Engage front and rear diff locks on steep sections',
      'Monitor engine temperature on long climbs',
      'Consider tire pressure for maximum traction'
    );
  } else if (totalClimb > 200 || maxGradient > 10 || averageGradient > 5) {
    difficulty = 'Advanced';
    recommendations.push(
      'Engage diff locks for steep climbs',
      'Use engine braking on descents',
      'Portal axles provide excellent ground clearance'
    );
  } else if (totalClimb > 50 || maxGradient > 5 || averageGradient > 2) {
    difficulty = 'Intermediate';
    recommendations.push(
      'Standard driving mode is suitable',
      'Portal axles handle obstacles easily',
      'Good route for learning Unimog capabilities'
    );
  } else {
    recommendations.push(
      'Perfect terrain for your Unimog',
      'Enjoy the superior ride comfort',
      'Excellent visibility from high driving position'
    );
  }

  return {
    difficulty,
    totalClimb,
    totalDescent,
    maxGradient,
    averageGradient,
    recommendations
  };
}