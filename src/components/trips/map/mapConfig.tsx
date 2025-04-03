import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/config/env';

// Configure Mapbox with the access token - will use the one from config or localStorage
const envToken = MAPBOX_CONFIG.accessToken;
const localStorageToken = localStorage.getItem('mapbox_access_token');

// Prioritize environment variable token, fall back to localStorage if needed
mapboxgl.accessToken = envToken || localStorageToken || '';

console.log('Mapbox config initialization:', { 
  envTokenExists: !!envToken, 
  localTokenExists: !!localStorageToken,
  resultingToken: mapboxgl.accessToken ? 'Set' : 'Not set'
});

/**
 * Creates and initializes a new Mapbox map instance
 */
export const initializeMap = (container: HTMLDivElement): mapboxgl.Map => {
  // Check if token is available
  if (!mapboxgl.accessToken) {
    console.error('Mapbox access token is missing. Please check your environment variables or enter a token manually.');
    throw new Error('Mapbox access token missing');
  }
  
  try {
    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Enhanced satellite imagery with streets
      center: [0, 0] as [number, number], // Default center, will be updated based on locations
      zoom: 2,
      pitch: 30, // Add some pitch for a more immersive view
      attributionControl: false // We'll add a custom attribution control
    });
    
    // Add navigation controls with terrain visualization
    map.addControl(new mapboxgl.NavigationControl({
      visualizePitch: true,
      showZoom: true
    }), 'top-right');
    
    // Add attribution control separately
    map.addControl(new mapboxgl.AttributionControl({
      compact: true
    }), 'bottom-right');
    
    // Add terrain and fog for 3D effect
    map.on('load', () => {
      map.setFog({
        'horizon-blend': 0.1,
        'color': '#f8f8f8',
        'high-color': '#add8e6',
        'space-color': '#d8f2ff',
        'star-intensity': 0.15
      });
    });
    
    return map;
  } catch (error) {
    console.error('Error creating Mapbox map:', error);
    throw error;
  }
};

// Save a token to localStorage to persist it between page reloads
export const saveMapboxToken = (token: string): void => {
  if (token) {
    localStorage.setItem('mapbox_access_token', token);
    mapboxgl.accessToken = token;
    console.log('Mapbox token saved and set');
  }
};

// Check if a mapbox token exists either in env or localStorage
export const hasMapboxToken = (): boolean => {
  const hasToken = !!(MAPBOX_CONFIG.accessToken || localStorage.getItem('mapbox_access_token'));
  console.log('Checking for Mapbox token:', hasToken);
  return hasToken;
};

// Keep existing code for fitMapToBounds and flyToLocation
export const fitMapToBounds = (
  map: mapboxgl.Map, 
  coords: [number, number][]
): void => {
  const bounds = new mapboxgl.LngLatBounds();
  
  coords.forEach(coord => {
    bounds.extend(coord);
  });
  
  map.fitBounds(bounds, {
    padding: 80,
    duration: 1000
  });
};

export const flyToLocation = (
  map: mapboxgl.Map,
  coordinates: [number, number],
  zoom: number = 10
): void => {
  map.flyTo({
    center: coordinates,
    zoom,
    duration: 1000
  });
};
