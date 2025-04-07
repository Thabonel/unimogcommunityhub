
import { MAPBOX_CONFIG } from '@/config/env';

/**
 * Get the active Mapbox token from storage or env
 */
export const getMapboxToken = (): string | null => {
  // Use a consistent localStorage key, first check 'mapbox_access_token' (new standard)
  const localToken = localStorage.getItem('mapbox_access_token');
  
  // Fallback to legacy keys if needed
  const legacyToken = localStorage.getItem('mapbox-token');
  
  // Return the first available token in this order: localStorage (new) -> localStorage (legacy) -> env variable
  return localToken || legacyToken || MAPBOX_CONFIG.accessToken || null;
};

/**
 * Get the active token (alias for backward compatibility)
 */
export const getActiveToken = getMapboxToken;

/**
 * Check if token exists
 */
export const hasMapboxToken = (): boolean => {
  return !!getMapboxToken();
};

/**
 * Save the token to localStorage with the standardized key
 */
export const saveMapboxToken = (token: string): void => {
  // Always save to the standardized key
  localStorage.setItem('mapbox_access_token', token);
  
  // Also ensure we cleanup any legacy keys for consistency
  if (localStorage.getItem('mapbox-token')) {
    // Migrate the legacy token to avoid duplicates
    localStorage.removeItem('mapbox-token');
  }
  
  console.log('Mapbox token saved to localStorage with key: mapbox_access_token');
};

/**
 * Validate token format (simple check)
 * This function checks if the token has the correct format for a Mapbox public token
 */
export const isValidTokenFormat = (token: string): boolean => {
  return /^pk\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(token);
};

/**
 * Alias for isValidTokenFormat for better naming consistency
 */
export const isTokenFormatValid = isValidTokenFormat;

/**
 * Check if the browser supports Mapbox GL
 * This is a simple detection method since mapboxgl.supported() is no longer available
 */
export const isMapboxSupported = (): boolean => {
  try {
    // Basic check for WebGL support which is required for Mapbox GL
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    // Check if WebGL is available and mapboxgl is loaded
    return !!gl && !!window.mapboxgl;
  } catch (err) {
    console.error('Error checking Mapbox support:', err);
    return false;
  }
};

/**
 * Validate token with Mapbox API
 */
export const validateMapboxToken = async (token?: string): Promise<boolean> => {
  const tokenToValidate = token || getMapboxToken();
  
  if (!tokenToValidate) return false;
  
  // Check token format first
  if (!isValidTokenFormat(tokenToValidate)) {
    console.warn('Token format is invalid (must start with pk.*)');
    return false;
  }
  
  try {
    // Try to fetch a simple style to validate the token
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${tokenToValidate}`
    );
    
    if (response.status === 401 || response.status === 403) {
      console.error('Mapbox token authentication failed:', response.statusText);
      return false;
    }
    
    return response.status === 200;
  } catch (error) {
    console.error('Error validating Mapbox token:', error);
    return false;
  }
};

/**
 * Alias for validateMapboxToken for backward compatibility
 */
export const validateAndTestCurrentToken = validateMapboxToken;

