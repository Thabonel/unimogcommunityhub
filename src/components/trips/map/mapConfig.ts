
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/config/env';

// Get the active Mapbox token, either from environment or local storage
export const getMapboxToken = (): string | null => {
  return localStorage.getItem('mapbox-token') || MAPBOX_CONFIG.accessToken || null;
};

// Check if token exists
export const hasMapboxToken = (): boolean => {
  return !!getMapboxToken();
};

// Validate token format (simple check)
export const isValidTokenFormat = (token: string): boolean => {
  return /^pk\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(token);
};

// Validate token with Mapbox API
export const validateMapboxToken = async (): Promise<boolean> => {
  const token = getMapboxToken();
  
  if (!token) return false;
  
  try {
    // Try to fetch a simple style to validate the token
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${token}`
    );
    
    return response.status === 200;
  } catch (error) {
    console.error('Error validating Mapbox token:', error);
    return false;
  }
};

// Add DEM source and enable terrain
export const addTopographicalLayers = (map: mapboxgl.Map): void => {
  // Skip if already added
  if (map.getSource('mapbox-dem')) return;

  try {
    // Add DEM source for terrain
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });
  } catch (error) {
    console.error('Error adding DEM source:', error);
  }
};

// Fit map to bounds with padding
export const fitMapToBounds = (
  map: mapboxgl.Map, 
  coordinates: [number, number][], 
  padding: number = 100
): void => {
  try {
    const bounds = new mapboxgl.LngLatBounds();
    
    coordinates.forEach(coord => {
      bounds.extend(coord);
    });
    
    map.fitBounds(bounds, { padding });
  } catch (error) {
    console.error('Error fitting map to bounds:', error);
  }
};

// Fly to a specific location
export const flyToLocation = (
  map: mapboxgl.Map, 
  coordinates: [number, number], 
  zoom: number = 12
): void => {
  try {
    map.flyTo({
      center: coordinates,
      zoom,
      essential: true
    });
  } catch (error) {
    console.error('Error flying to location:', error);
  }
};
