/**
 * Mapbox Directions API Service
 * Handles route calculation with road-following navigation
 */

import { toast } from 'sonner';

export interface DirectionsWaypoint {
  lng: number;
  lat: number;
  name?: string;
}

export interface DirectionsOptions {
  profile?: 'driving' | 'driving-traffic' | 'walking' | 'cycling';
  alternatives?: boolean;
  steps?: boolean;
  overview?: 'full' | 'simplified' | 'false';
  geometries?: 'geojson' | 'polyline' | 'polyline6';
  language?: string;
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
    
  } else {
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

  // Set default options
  const defaultOptions: DirectionsOptions = {
    profile: 'driving',
    alternatives: false,
    steps: true,
    overview: 'full',
    geometries: 'geojson',
    language: 'en'
  };

  const finalOptions = { ...defaultOptions, ...options };

  // Build coordinates string (longitude,latitude pairs separated by semicolons)
  const coordinates = waypoints
    .map(wp => `${wp.lng},${wp.lat}`)
    .join(';');

  // Build waypoint indices to force order (all waypoints are required stops)
  const waypointIndices = waypoints.length > 2 
    ? Array.from({ length: waypoints.length - 2 }, (_, i) => i + 1).join(';')
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

  // Add waypoints parameter to force order if we have intermediate waypoints
  if (waypointIndices) {
    params.append('waypoints', waypointIndices);
  }

  const url = `https://api.mapbox.com/directions/v5/mapbox/${finalOptions.profile}/${coordinates}?${params}`;

  try {
    + '...'
    });
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error(`Directions API error: ${response.status} - ${errorText}`);
    }

    const data: DirectionsResponse = await response.json();
    if (data.code !== 'Ok') {
      
      throw new Error(`Directions API returned: ${data.code}`);
    }

    return data;
  } catch (error) {
    
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
  
  return waypoints;
}