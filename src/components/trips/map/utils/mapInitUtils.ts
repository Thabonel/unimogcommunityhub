
import mapboxgl from 'mapbox-gl';
import { getMapboxToken } from '../utils/tokenUtils';

/**
 * Initialize a new Mapbox map instance
 */
export const initializeMap = (container: HTMLDivElement): mapboxgl.Map => {
  // Set access token from localStorage or config
  const token = getMapboxToken();
  
  if (!token) {
    throw new Error('No Mapbox token provided');
  }
  
  mapboxgl.accessToken = token;
  
  // Create new map instance with error handling
  try {
    // Create new map instance
    const mapInstance = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [9.1829, 48.7758], // Default to Stuttgart, Germany
      zoom: 5,
      attributionControl: true,
      failIfMajorPerformanceCaveat: false,
      preserveDrawingBuffer: true,
      trackResize: true
    });
    
    // Add navigation controls
    mapInstance.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'bottom-right'
    );
    
    return mapInstance;
  } catch (err) {
    console.error('Error initializing map:', err);
    throw err;
  }
};

/**
 * Clean up a map instance
 */
export const cleanupMap = (mapInstance: mapboxgl.Map | null): void => {
  if (!mapInstance) return;
  
  try {
    mapInstance.remove();
  } catch (err) {
    console.error('Error removing map:', err);
  }
};
