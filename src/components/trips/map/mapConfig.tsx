
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/config/env';

// Configure Mapbox with the access token - prioritize environment token, fall back to localStorage
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
    // Force refresh the token from localStorage in case it was just added
    const freshToken = localStorage.getItem('mapbox_access_token');
    if (freshToken && !envToken) {
      console.log('Refreshing token from localStorage');
      mapboxgl.accessToken = freshToken;
    }
    
    console.log('Creating map with token:', mapboxgl.accessToken ? 'Available' : 'Missing');
    
    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12', // Use a more reliable default style
      center: [0, 0] as [number, number], // Default center, will be updated based on locations
      zoom: 2,
      attributionControl: true,
      trackResize: true, // Ensure map resizes with container
      preserveDrawingBuffer: true // Helps with map rendering issues
    });
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add scale control
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
    
    console.log('Map instance created successfully');
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

export const fitMapToBounds = (
  map: mapboxgl.Map, 
  coords: [number, number][]
): void => {
  if (!coords.length) return;
  
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
