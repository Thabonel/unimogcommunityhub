
import { MAPBOX_CONFIG } from '@/config/env';

// Get token from localStorage or environment
export const getMapboxToken = (): string => {
  // First try localStorage
  const localToken = localStorage.getItem('mapbox-token');
  if (localToken) {
    return localToken;
  }
  
  // Then try environment variable
  if (MAPBOX_CONFIG.accessToken) {
    console.log('Using Mapbox token from environment');
    return MAPBOX_CONFIG.accessToken;
  }
  
  return '';
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

// Save token to localStorage
export const saveMapboxToken = (token: string): void => {
  if (!token) {
    throw new Error('Token cannot be empty');
  }
  
  // Validate token format (basic check)
  if (!isTokenFormatValid(token)) {
    throw new Error('Invalid Mapbox token format. Public tokens should start with "pk."');
  }
  
  localStorage.setItem('mapbox-token', token);
};

// Check browser compatibility for Mapbox
export const isMapboxSupported = (): boolean => {
  try {
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return false;
    }
    
    // Check for basic features required by Mapbox
    const hasLocalStorage = typeof localStorage !== 'undefined';
    const hasPromise = typeof Promise !== 'undefined';
    const hasArrowFunctions = (() => true)();
    
    return hasLocalStorage && hasPromise && hasArrowFunctions;
  } catch (e) {
    return false;
  }
};

// Validate token format (starts with pk.)
export const isTokenFormatValid = (token: string): boolean => {
  if (!token) return false;
  return token.startsWith('pk.');
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

