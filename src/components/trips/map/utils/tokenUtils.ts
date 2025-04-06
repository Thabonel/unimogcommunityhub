
import { MAPBOX_CONFIG } from '@/config/env';

/**
 * Get the active Mapbox token from storage or env
 */
export const getMapboxToken = (): string | null => {
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
 */
export const isValidTokenFormat = (token: string): boolean => {
  return /^pk\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(token);
};

/**
 * Validate token with Mapbox API
 */
export const validateMapboxToken = async (token?: string): Promise<boolean> => {
  const tokenToValidate = token || getMapboxToken();
  
  if (!tokenToValidate) return false;
  
  try {
    // Try to fetch a simple style to validate the token
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${tokenToValidate}`
    );
    
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
