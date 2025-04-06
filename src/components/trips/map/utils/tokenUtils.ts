
import { MAPBOX_CONFIG } from '@/config/env';

/**
 * Get the active Mapbox token from storage or env
 */
export const getActiveToken = (): string | null => {
  return localStorage.getItem('mapbox-token') || MAPBOX_CONFIG.accessToken || null;
};

/**
 * Check if a token exists
 */
export const hasToken = (): boolean => {
  return !!getActiveToken();
};

/**
 * Validate token format (simple check)
 */
export const isTokenFormatValid = (token: string): boolean => {
  return token.startsWith('pk.');
};

/**
 * Save token to localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem('mapbox-token', token);
};

/**
 * Remove token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem('mapbox-token');
};

/**
 * Validate token with Mapbox API
 */
export const validateToken = async (token: string): Promise<boolean> => {
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

/**
 * Validate and test the current token
 */
export const validateAndTestCurrentToken = async (): Promise<boolean> => {
  const token = getActiveToken();
  
  if (!token) return false;
  if (!isTokenFormatValid(token)) return false;
  
  return await validateToken(token);
};
