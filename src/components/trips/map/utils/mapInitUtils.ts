
import mapboxgl from 'mapbox-gl';
import { getMapboxToken } from '../mapConfig';

/**
 * Initialize a new Mapbox map instance
 */
export const initializeMap = (container: HTMLDivElement): mapboxgl.Map => {
  // Set access token from localStorage
  const token = getMapboxToken();
  mapboxgl.accessToken = token;
  
  // Create new map instance
  const mapInstance = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [9.1829, 48.7758], // Default to Stuttgart, Germany
    zoom: 5,
    attributionControl: true
  });
  
  // Add navigation controls
  mapInstance.addControl(
    new mapboxgl.NavigationControl({
      visualizePitch: true,
    }),
    'bottom-right'
  );
  
  return mapInstance;
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
