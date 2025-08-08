/**
 * Mapbox Directions API Service
 * Handles route calculation with road-following navigation
 */

import { toast } from 'sonner';

export interface DirectionsWaypoint {
  lng: number;
  lat: number;
  name?: string;
  bearing?: number; // Bearing in degrees (0-360) for magnetic routing
  snapRadius?: number; // Maximum distance in meters for road snapping
}

export interface DirectionsOptions {
  profile?: 'driving' | 'driving-traffic' | 'walking' | 'cycling';
  alternatives?: boolean;
  steps?: boolean;
  overview?: 'full' | 'simplified' | 'false';
  geometries?: 'geojson' | 'polyline' | 'polyline6';
  language?: string;
  enableMagneticRouting?: boolean; // Enable bearing and radius controls
  defaultSnapRadius?: number; // Default snap radius in meters
  bearingTolerance?: number; // Tolerance for bearing in degrees
}

export interface DirectionsRoute {
  distance: number; // meters
  duration: number; // seconds
  geometry: any; // GeoJSON LineString or encoded polyline
  legs: DirectionsLeg[];
  weight: number;
  weight_name: string;
}

export interface DirectionsLeg {
  distance: number;
  duration: number;
  steps: DirectionsStep[];
  summary: string;
}

export interface DirectionsStep {
  distance: number;
  duration: number;
  geometry: any;
  name: string;
  maneuver: {
    type: string;
    instruction: string;
    bearing_before: number;
    bearing_after: number;
    location: [number, number];
  };
}

export interface DirectionsResponse {
  routes: DirectionsRoute[];
  waypoints: any[];
  code: string;
  uuid: string;
}

/**
 * Get Mapbox access token from environment or localStorage
 */
function getMapboxToken(): string | null {
  const token = localStorage.getItem('mapbox-token') || 
                import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
                null;
  
  if (!token) {
    console.error('No Mapbox token found in localStorage or environment');
  } else {
    console.log('Mapbox token found, length:', token.length);
  }
  
  return token;
}

/**
 * Fetch directions between waypoints using Mapbox Directions API
 */
export async function getDirections(
  waypoints: DirectionsWaypoint[],
  options: DirectionsOptions = {}
): Promise<DirectionsResponse | null> {
  const token = getMapboxToken();
  
  if (!token) {
    toast.error('Mapbox token not found');
    return null;
  }

  if (waypoints.length < 2) {
    toast.error('At least 2 waypoints required for directions');
    return null;
  }

  if (waypoints.length > 25) {
    toast.error('Maximum 25 waypoints allowed');
    return null;
  }

  // Log for debugging with 6+ waypoints
  if (waypoints.length >= 6) {
    console.log('Processing route with', waypoints.length, 'waypoints');
  }

  // Set default options
  const defaultOptions: DirectionsOptions = {
    profile: 'driving',
    alternatives: false,
    steps: true,
    overview: 'full',
    geometries: 'geojson',
    language: 'en',
    enableMagneticRouting: true,
    defaultSnapRadius: 50, // 50 meters default snap radius
    bearingTolerance: 45 // 45 degree tolerance
  };

  const finalOptions = { ...defaultOptions, ...options };

  // Build coordinates string (longitude,latitude pairs separated by semicolons)
  const coordinates = waypoints
    .map(wp => `${wp.lng},${wp.lat}`)
    .join(';');

  // Build waypoint indices - Mapbox requires first AND last coordinates in waypoints parameter
  // For 3+ waypoints, we need to include ALL waypoint indices: 0;1;...;n-1
  const waypointIndices = waypoints.length > 2 
    ? Array.from({ length: waypoints.length }, (_, i) => i).join(';')
    : undefined;

  // Build radiuses parameter for magnetic road snapping
  const radiuses = finalOptions.enableMagneticRouting 
    ? waypoints.map(wp => {
        const radius = wp.snapRadius ?? finalOptions.defaultSnapRadius ?? 50;
        return radius.toString();
      }).join(';')
    : undefined;

  // Build bearings parameter for directional control
  const bearings = finalOptions.enableMagneticRouting && waypoints.some(wp => wp.bearing !== undefined)
    ? waypoints.map(wp => {
        if (wp.bearing !== undefined) {
          const tolerance = finalOptions.bearingTolerance ?? 45;
          return `${wp.bearing},${tolerance}`;
        }
        return ''; // Empty string for waypoints without bearing
      }).join(';')
    : undefined;

  // Build query parameters
  const params = new URLSearchParams({
    access_token: token,
    alternatives: finalOptions.alternatives?.toString() || 'false',
    steps: finalOptions.steps?.toString() || 'true',
    overview: finalOptions.overview || 'full',
    geometries: finalOptions.geometries || 'geojson',
    language: finalOptions.language || 'en'
  });

  // Add waypoints parameter if we have more than 2 waypoints
  if (waypointIndices) {
    params.append('waypoints', waypointIndices);
  }

  // Add radiuses parameter for road snapping
  if (radiuses) {
    params.append('radiuses', radiuses);
  }

  // Add bearings parameter for directional control
  if (bearings) {
    params.append('bearings', bearings);
  }

  const url = `https://api.mapbox.com/directions/v5/mapbox/${finalOptions.profile}/${coordinates}?${params}`;

  try {
    console.log('Fetching directions:', {
      waypoints: waypoints.length,
      profile: finalOptions.profile,
      coordinates: coordinates,
      waypointIndices: waypointIndices,
      magneticRouting: finalOptions.enableMagneticRouting,
      radiuses: radiuses,
      bearings: bearings,
      url: url.substring(0, 100) + '...'
    });
    
    // Extra logging for 6+ waypoints
    if (waypoints.length >= 6) {
      console.log('Full URL for 6+ waypoints:', url);
      console.log('Waypoint coordinates:', waypoints.map(wp => `[${wp.lng.toFixed(4)}, ${wp.lat.toFixed(4)}]`));
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Directions API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Directions API error response:', errorText);
      console.error('Failed with', waypoints.length, 'waypoints');
      
      // Check for specific error types
      if (response.status === 422) {
        console.error('Invalid request - check waypoint format');
        if (waypoints.length >= 6) {
          console.error('Error occurred with 6+ waypoints, waypoint indices:', waypointIndices);
        }
      }
      
      throw new Error(`Directions API error: ${response.status} - ${errorText}`);
    }

    const data: DirectionsResponse = await response.json();
    console.log('Directions API response code:', data.code);

    if (data.code !== 'Ok') {
      console.error('Directions API non-OK code:', data);
      throw new Error(`Directions API returned: ${data.code}`);
    }

    console.log('Directions fetched successfully:', {
      routes: data.routes.length,
      distance: data.routes[0]?.distance,
      duration: data.routes[0]?.duration,
      geometryType: data.routes[0]?.geometry ? typeof data.routes[0].geometry : 'none',
      coordinatesCount: data.routes[0]?.geometry?.coordinates?.length || 0
    });

    return data;
  } catch (error) {
    console.error('Error fetching directions:', error);
    if (error instanceof Error) {
      toast.error(`Route directions failed: ${error.message}`);
    } else {
      toast.error('Failed to fetch route directions');
    }
    return null;
  }
}

/**
 * Format distance in meters to human-readable string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Format duration in seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

/**
 * Calculate estimated fuel consumption (rough estimate)
 */
export function estimateFuelConsumption(distanceKm: number, profile: string = 'driving'): string {
  if (profile !== 'driving' && profile !== 'driving-traffic') {
    return 'N/A';
  }
  
  // Assume average fuel consumption of 8L/100km
  const avgConsumption = 8;
  const liters = (distanceKm * avgConsumption) / 100;
  
  return `~${liters.toFixed(1)}L`;
}

/**
 * Generate turn-by-turn instructions from route
 */
export function extractInstructions(route: DirectionsRoute): string[] {
  const instructions: string[] = [];
  
  route.legs.forEach(leg => {
    leg.steps?.forEach(step => {
      if (step.maneuver?.instruction) {
        instructions.push(step.maneuver.instruction);
      }
    });
  });
  
  return instructions;
}

/**
 * Get elevation data for route (if available)
 */
export async function getRouteElevation(
  coordinates: [number, number][]
): Promise<number[] | null> {
  // Mapbox doesn't provide elevation in Directions API
  // You would need to use Mapbox Tilequery API or another elevation service
  // This is a placeholder for future implementation
  
  console.log('Elevation data not yet implemented');
  return null;
}

/**
 * Optimize waypoint order for shortest route
 * Note: This requires Mapbox Optimization API (different pricing)
 */
export async function optimizeWaypointOrder(
  waypoints: DirectionsWaypoint[]
): Promise<DirectionsWaypoint[] | null> {
  // This would use the Mapbox Optimization API
  // Placeholder for future implementation
  
  console.log('Route optimization not yet implemented');
  return waypoints;
}