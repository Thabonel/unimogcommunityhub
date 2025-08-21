/**
 * Generate unique route names and descriptions based on waypoints
 */

const routeAdjectives = [
  'Scenic', 'Epic', 'Grand', 'Classic', 'Ultimate', 'Legendary', 'Amazing',
  'Spectacular', 'Magnificent', 'Incredible', 'Adventurous', 'Majestic'
];

const routeNouns = [
  'Journey', 'Adventure', 'Expedition', 'Trail', 'Route', 'Path', 'Trek',
  'Voyage', 'Passage', 'Circuit', 'Loop', 'Tour'
];

/**
 * Generate a unique route name based on waypoints or random combination
 */
export function generateUniqueRouteName(waypoints?: any[]): string {
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (waypoints && waypoints.length > 0) {
    // Try to use first and last waypoint names
    const firstWaypoint = waypoints[0];
    const lastWaypoint = waypoints[waypoints.length - 1];
    
    if (firstWaypoint.name && lastWaypoint.name && firstWaypoint.name !== lastWaypoint.name) {
      // Extract meaningful parts from waypoint names
      const firstName = firstWaypoint.name.split(',')[0].split(' ')[0];
      const lastName = lastWaypoint.name.split(',')[0].split(' ')[0];
      return `${firstName} to ${lastName} Route`;
    }
  }
  
  // Generate random combination
  const adjective = routeAdjectives[Math.floor(Math.random() * routeAdjectives.length)];
  const noun = routeNouns[Math.floor(Math.random() * routeNouns.length)];
  
  return `${adjective} ${noun} ${timestamp}`;
}

/**
 * Generate a route description based on waypoints and route details
 */
export function generateRouteDescription(
  waypoints: any[],
  distance?: number,
  duration?: number,
  profile?: string
): string {
  const parts: string[] = [];
  
  // Add route type
  if (profile) {
    const profileText = profile.charAt(0).toUpperCase() + profile.slice(1);
    parts.push(`${profileText} route`);
  }
  
  // Add waypoint count
  if (waypoints && waypoints.length > 0) {
    parts.push(`with ${waypoints.length} waypoints`);
  }
  
  // Add distance
  if (distance) {
    const distanceKm = (distance / 1000).toFixed(1);
    parts.push(`covering ${distanceKm} km`);
  }
  
  // Add duration
  if (duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    if (hours > 0) {
      parts.push(`(~${hours}h ${minutes}min)`);
    } else {
      parts.push(`(~${minutes} minutes)`);
    }
  }
  
  // Add waypoint names if available
  if (waypoints && waypoints.length > 0) {
    const firstWaypoint = waypoints[0];
    const lastWaypoint = waypoints[waypoints.length - 1];
    
    if (firstWaypoint.name && lastWaypoint.name) {
      parts.push(`\nFrom: ${firstWaypoint.name}`);
      parts.push(`\nTo: ${lastWaypoint.name}`);
    }
  }
  
  return parts.join(' ') || 'Custom route created with waypoint planner';
}

/**
 * Format a route name for display
 */
export function formatRouteName(name: string): string {
  // Truncate long names
  if (name.length > 50) {
    return name.substring(0, 47) + '...';
  }
  return name;
}

/**
 * Generate a filename-safe version of the route name
 */
export function generateRouteFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}