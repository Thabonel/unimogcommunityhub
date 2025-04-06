
import { toast } from 'sonner';
import { MAPBOX_CONFIG } from '@/config/env';

/**
 * Checks if a string has the format of a Mapbox token
 */
export const isTokenFormatValid = (token: string): boolean => {
  // Mapbox public tokens start with 'pk.'
  return token.startsWith('pk.');
};

/**
 * Gets the active Mapbox token from localStorage or environment variables
 */
export const getActiveToken = (): string | null => {
  // First try to get from localStorage, then fallback to env variable
  const localToken = localStorage.getItem('mapbox-token');
  const envToken = MAPBOX_CONFIG.accessToken;
  
  return localToken || envToken || null;
};

/**
 * Saves a Mapbox token to localStorage
 */
export const saveMapboxToken = (token: string): void => {
  localStorage.setItem('mapbox-token', token);
};

/**
 * Tests if a Mapbox token is valid by making a test request
 * @returns A promise that resolves to true if the token is valid
 */
export const testMapboxToken = async (token: string): Promise<boolean> => {
  try {
    // Test if we can fetch a style with this token
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${token}`
    );
    
    if (!response.ok) {
      console.error('Mapbox token validation failed:', response.status, response.statusText);
      return false;
    }
    
    // If we get a 200 OK, the token is valid
    return true;
  } catch (error) {
    console.error('Error testing Mapbox token:', error);
    return false;
  }
};

/**
 * Validates and tests the current Mapbox token
 * Shows a toast notification with the result
 */
export const validateAndTestCurrentToken = async (): Promise<boolean> => {
  const token = getActiveToken();
  
  if (!token) {
    toast.error('No Mapbox token available');
    return false;
  }
  
  // Check token format first
  if (!isTokenFormatValid(token)) {
    toast.warning('Mapbox token format is invalid. Public tokens should start with "pk."');
    return false;
  }
  
  // Then test if it works
  toast.loading('Testing Mapbox token...');
  const isValid = await testMapboxToken(token);
  
  if (isValid) {
    toast.success('Mapbox token is valid!');
  } else {
    toast.error('Mapbox token is invalid or has insufficient permissions');
  }
  
  return isValid;
};
