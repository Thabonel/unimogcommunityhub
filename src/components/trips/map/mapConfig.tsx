import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/config/env';

// Configure Mapbox with the access token - will use the one from config or localStorage
const localStorageToken = localStorage.getItem('mapbox_access_token');
mapboxgl.accessToken = MAPBOX_CONFIG.accessToken || localStorageToken || '';

/**
 * Creates and initializes a new Mapbox map instance
 */
export const initializeMap = (container: HTMLDivElement): mapboxgl.Map => {
  // Check if token is available
  if (!mapboxgl.accessToken) {
    console.error('Mapbox access token is missing. Please check your environment variables or enter a token manually.');
  }
  
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
  
  // Add terrain and sky for 3D effect
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
};

// Save a token to localStorage to persist it between page reloads
export const saveMapboxToken = (token: string): void => {
  if (token) {
    localStorage.setItem('mapbox_access_token', token);
    mapboxgl.accessToken = token;
  }
};

// Check if a mapbox token exists either in env or localStorage
export const hasMapboxToken = (): boolean => {
  return !!(MAPBOX_CONFIG.accessToken || localStorage.getItem('mapbox_access_token'));
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
