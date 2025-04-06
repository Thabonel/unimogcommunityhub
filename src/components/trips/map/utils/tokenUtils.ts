
import { MAPBOX_CONFIG } from '@/config/env';

/**
 * Get the active Mapbox token from storage or env
 */
export const getMapboxToken = (): string | null => {
  // First check localStorage, then environment variable
  return localStorage.getItem('mapbox-token') || MAPBOX_CONFIG.accessToken || null;
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
