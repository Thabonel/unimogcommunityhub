/**
 * Route Name Generator
 * Generates descriptive names for saved routes
 */

import { Waypoint } from '@/types/waypoint';

/**
 * Extract city/location name from a place name
 */
function extractLocationName(placeName: string): string {
  // Remove country at the end if present
  const parts = placeName.split(',');
  if (parts.length > 0) {
    // Take the first part (usually city or landmark)
    return parts[0].trim();
  }
  return placeName;
}

/**
 * Generate a descriptive route name from waypoints
 */
export function generateRouteName(
  waypoints: Waypoint[],
  distance?: number,
  profile?: string
): string {
  if (waypoints.length === 0) {
    return 'Unnamed Route';
  }

  // Get start and end locations
  const start = waypoints[0];
  const end = waypoints[waypoints.length - 1];
  
  const startName = extractLocationName(start.name || 'Start');
  const endName = extractLocationName(end.name || 'End');
  
  // Base name
  let routeName = `${startName} to ${endName}`;
  
  // Add via points if there are intermediate waypoints
  if (waypoints.length > 2) {
    const viaCount = waypoints.length - 2;
    routeName += ` (${viaCount} stop${viaCount > 1 ? 's' : ''})`;
  }
  
  // Add distance if available
  if (distance) {
    const km = (distance / 1000).toFixed(0);
    routeName += ` - ${km}km`;
  }
  
  // Add profile type if not driving
  if (profile && profile !== 'driving') {
    const profileLabel = profile === 'walking' ? '🚶' : '🚴';
    routeName = `${profileLabel} ${routeName}`;
  }
  
  return routeName;
}

/**
 * Generate a unique route name with timestamp
 */
export function generateUniqueRouteName(
  waypoints: Waypoint[],
  distance?: number,
  profile?: string
): string {
  const baseName = generateRouteName(waypoints, distance, profile);
  const date = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
  return `${baseName} (${date})`;
}

/**
 * Generate route description with more details
 */
export function generateRouteDescription(
  waypoints: Waypoint[],
  distance?: number,
  duration?: number,
  profile?: string
): string {
  const parts: string[] = [];
  
  // Add route type
  if (profile === 'walking') {
    parts.push('Walking route');
  } else if (profile === 'cycling') {
    parts.push('Cycling route');
  } else {
    parts.push('Driving route');
  }
  
  // Add waypoint details
  if (waypoints.length > 0) {
    const waypointNames = waypoints
      .map(w => extractLocationName(w.name || 'Waypoint'))
      .join(' → ');
    parts.push(`via ${waypointNames}`);
  }
  
  // Add distance
  if (distance) {
    const km = (distance / 1000).toFixed(1);
    parts.push(`Distance: ${km}km`);
  }
  
  // Add duration
  if (duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    if (hours > 0) {
      parts.push(`Duration: ${hours}h ${minutes}m`);
    } else {
      parts.push(`Duration: ${minutes} minutes`);
    }
  }
  
  return parts.join(' • ');
}

/**
 * Generate a filename-safe version of the route name
 */
export function generateRouteFileName(routeName: string): string {
  return routeName
    .replace(/[^a-z0-9]/gi, '_') // Replace non-alphanumeric with underscore
    .replace(/_+/g, '_') // Remove multiple underscores
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
}