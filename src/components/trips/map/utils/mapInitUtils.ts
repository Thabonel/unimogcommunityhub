
import mapboxgl from 'mapbox-gl';
import { getMapboxToken } from './tokenUtils';
import { MAP_STYLES } from '../mapConfig';

/**
 * Initialize a new Mapbox map with proper error handling
 * @param container The HTML element to contain the map
 * @returns A new mapboxgl.Map instance
 */
export const initializeMap = (container: HTMLElement): mapboxgl.Map => {
  const token = getMapboxToken();
  
  if (!token) {
    throw new Error('No Mapbox token found. Please provide a valid token.');
  }
  
  // Set the token
  mapboxgl.accessToken = token;
  
  // Create new map instance
  const map = new mapboxgl.Map({
    container,
    style: MAP_STYLES.OUTDOORS,
    center: [9.1829, 48.7758], // Default to Stuttgart, Germany
    zoom: 5,
    attributionControl: true,
    trackResize: true,
    preserveDrawingBuffer: true, // Needed for image export
    fadeDuration: 300, // Smooth transitions
    minZoom: 2,
    maxZoom: 18
  });
  
  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
  
  // Add scale control
  map.addControl(new mapboxgl.ScaleControl({
    maxWidth: 100,
    unit: 'metric'
  }), 'bottom-right');
  
  // Handle visibility changes to pause rendering when tab is not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Use stop() to pause map rendering when tab is hidden
      map.stop();
    } else {
      // Use different approach instead of start() which doesn't exist
      // Simply trigger a movestart event to resume rendering
      map.fire('movestart');
    }
  });
  
  return map;
};

/**
 * Clean up map resources
 * @param map The map instance to clean up
 */
export const cleanupMap = (map: mapboxgl.Map | null): void => {
  if (!map) return;
  
  try {
    // Remove event listeners (if any were added)
    map.off();
    
    // Remove the map
    map.remove();
  } catch (err) {
    console.error('Error cleaning up map:', err);
  }
};
