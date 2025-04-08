
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
  if (!token.startsWith('pk.')) {
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
