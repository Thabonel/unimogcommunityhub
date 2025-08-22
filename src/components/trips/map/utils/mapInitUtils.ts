
import mapboxgl from 'mapbox-gl';
import { DEFAULT_MAP_OPTIONS } from '../mapConfig';
import { getMapboxToken } from './tokenUtils';

/**
 * Initialize a new mapbox map instance
 * @param container The HTML element to place the map in
 * @param options Optional map options to override defaults
 * @returns The initialized map instance
 */
export const initializeMap = (
  container: HTMLElement,
  options: Partial<mapboxgl.MapOptions> = {}
): mapboxgl.Map => {
  if (!container) {
    throw new Error('Container element is required to initialize map');
  }
  
  // Check WebGL support before attempting initialization
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) || 
             canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true });
  
  if (!gl) {
    // Clean up test canvas
    canvas.width = 0;
    canvas.height = 0;
    throw new Error('WebGL is not supported or has been disabled. Please enable WebGL in your browser settings or try a different browser.');
  }
  
  // Clean up test WebGL context
  const loseContext = gl.getExtension('WEBGL_lose_context');
  if (loseContext) {
    loseContext.loseContext();
  }
  canvas.width = 0;
  canvas.height = 0;
  
  try {
    // Get the token from storage
    const token = getMapboxToken();
    
    if (!token) {
      throw new Error('Mapbox token not found');
    }
    
    // Set the access token
    mapboxgl.accessToken = token;
    
    // Create a merged options object with defaults
    const mapOptions: mapboxgl.MapOptions = {
      ...DEFAULT_MAP_OPTIONS,
      ...options,
      container: container,
      // Add WebGL-friendly options
      failIfMajorPerformanceCaveat: false,
      preserveDrawingBuffer: false,
      antialias: false,
      refreshExpiredTiles: false
    };
    
    // Initialize the map
    return new mapboxgl.Map(mapOptions);
  } catch (err) {
    console.error('Error initializing map:', err);
    throw err;
  }
};

/**
 * Clean up a map instance
 * @param map The map instance to clean up
 */
export const cleanupMap = (map: mapboxgl.Map | null): void => {
  if (!map) return;
  
  try {
    // Remove the map
    map.remove();
  } catch (err) {
    console.error('Error cleaning up map:', err);
  }
};

/**
 * Add default controls to a map
 * @param map The map instance
 */
export const addDefaultControls = (map: mapboxgl.Map): void => {
  if (!map) return;
  
  try {
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
    // Add scale control
    map.addControl(new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: 'metric'
    }), 'bottom-left');
  } catch (err) {
    console.error('Error adding default controls:', err);
  }
};

// Note: We're removing the isMapboxSupported function from this file
// to avoid the conflict with the one in tokenUtils.ts
