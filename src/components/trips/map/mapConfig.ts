
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/config/env';
import { isTokenFormatValid, getActiveToken, testMapboxToken } from './utils/tokenUtils';

/**
 * Check if a Mapbox token is available
 */
export const hasMapboxToken = (): boolean => {
  return !!localStorage.getItem('mapbox-token') || !!MAPBOX_CONFIG.accessToken;
};

/**
 * Get the Mapbox token from localStorage or env
 */
export const getMapboxToken = (): string | null => {
  return getActiveToken();
};

/**
 * Save a Mapbox token to localStorage
 */
export const saveMapboxToken = (token: string): void => {
  localStorage.setItem('mapbox-token', token);
};

/**
 * Clear the saved Mapbox token
 */
export const clearMapboxToken = (): void => {
  localStorage.removeItem('mapbox-token');
};

/**
 * Validate a Mapbox token by making a test request
 */
export const validateMapboxToken = async (token?: string): Promise<boolean> => {
  const tokenToValidate = token || getMapboxToken();
  
  if (!tokenToValidate) return false;
  
  return await testMapboxToken(tokenToValidate);
};

/**
 * Makes the map fly to a specific location
 */
export const flyToLocation = (map: mapboxgl.Map, coordinates: [number, number], zoom?: number): void => {
  if (!map) return;
  
  map.flyTo({
    center: coordinates,
    zoom: zoom || map.getZoom(),
    essential: true // Animation will happen even if user has "prefers-reduced-motion" enabled
  });
};

/**
 * Fits the map view to include all provided coordinates
 */
export const fitMapToBounds = (map: mapboxgl.Map, coordinates: [number, number][]): void => {
  if (!map || coordinates.length === 0) return;
  
  const bounds = new mapboxgl.LngLatBounds();
  
  // Add each coordinate to the bounds
  coordinates.forEach(coord => {
    bounds.extend(coord);
  });
  
  // Fit the map to the bounds with padding
  map.fitBounds(bounds, {
    padding: 50, // Add padding around the bounds
    maxZoom: 15, // Don't zoom in too far
    duration: 1000 // Animation duration in milliseconds
  });
};
