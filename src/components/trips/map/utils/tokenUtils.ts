
import { MAPBOX_CONFIG } from '@/config/env';
import { getMapboxTokenFromAnySource, isValidMapboxTokenFormat, getMapboxTokenStorageKey } from '@/utils/mapbox-helper';

// Get token from localStorage or environment (using standardized helper)
export const getMapboxToken = (): string => {
  return getMapboxTokenFromAnySource() || '';
};

// Get the active/current token from any source
export const getActiveToken = (): string => {
  return getMapboxToken();
};

// Check if token exists
export const hasMapboxToken = (): boolean => {
  const token = getMapboxToken();
  return !!token;
};

// Save token to localStorage (using standardized key)
export const saveMapboxToken = (token: string): void => {
  if (!token) {
    throw new Error('Token cannot be empty');
  }
  
  // Validate token format (basic check)
  if (!isTokenFormatValid(token)) {
    throw new Error('Invalid Mapbox token format. Public tokens should start with "pk."');
  }
  
  const storageKey = getMapboxTokenStorageKey();
  localStorage.setItem(storageKey, token);
};

// Check browser compatibility for Mapbox
export const isMapboxSupported = (): boolean => {
  try {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl', { 
      failIfMajorPerformanceCaveat: true,
      preserveDrawingBuffer: false 
    }) || canvas.getContext('experimental-webgl', {
      failIfMajorPerformanceCaveat: true,
      preserveDrawingBuffer: false
    });
    
    if (!gl) {
      console.error('WebGL is not supported in this browser');
      return false;
    }
    
    // Properly clean up the WebGL context to prevent exhaustion
    const loseContext = gl.getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }
    
    // Remove canvas from memory
    canvas.width = 0;
    canvas.height = 0;
    
    // Check for basic features required by Mapbox
    const hasLocalStorage = typeof localStorage !== 'undefined';
    const hasPromise = typeof Promise !== 'undefined';
    const hasArrowFunctions = (() => true)();
    
    return hasLocalStorage && hasPromise && hasArrowFunctions;
  } catch (e) {
    console.error('Error checking Mapbox support:', e);
    return false;
  }
};

// Validate token format (starts with pk.) - use helper function
export const isTokenFormatValid = (token: string): boolean => {
  return isValidMapboxTokenFormat(token);
};

// Validate token with Mapbox API
export const validateMapboxToken = async (token?: string): Promise<boolean> => {
  const tokenToValidate = token || getMapboxToken();
  
  if (!tokenToValidate) {
    console.error('No token to validate');
    return false;
  }
  
  // Basic format check first
  if (!isTokenFormatValid(tokenToValidate)) {
    console.error('Token format invalid');
    return false;
  }
  
  try {
    // Try to fetch a small tile to validate token
    const response = await fetch(
      `https://api.mapbox.com/v4/mapbox.satellite/1/0/0@2x.png32?access_token=${tokenToValidate}`,
      { method: 'HEAD' }
    );
    
    return response.ok;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

// Validate current token and test if it works
export const validateAndTestCurrentToken = async (): Promise<boolean> => {
  return await validateMapboxToken();
};
