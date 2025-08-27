/**
 * Mapbox Token Testing Utility
 * Provides functions to verify Mapbox token configuration
 */

import mapboxgl from 'mapbox-gl';
import { getMapboxTokenFromAnySource } from './mapbox-helper';

/**
 * Test if Mapbox token is properly configured and working
 * Returns true if token is valid and can access Mapbox services
 */
export const testMapboxToken = async (): Promise<{ isValid: boolean; error?: string }> => {
  const token = getMapboxTokenFromAnySource();
  
  if (!token) {
    return { 
      isValid: false, 
      error: 'No Mapbox token found. Please set VITE_MAPBOX_ACCESS_TOKEN in your .env file' 
    };
  }
  
  if (!token.startsWith('pk.')) {
    return { 
      isValid: false, 
      error: 'Invalid token format. Mapbox public tokens should start with "pk."' 
    };
  }
  
  try {
    // Test token by attempting to fetch a style
    const response = await fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=${token}`);
    
    if (response.ok) {
      console.log('✅ Mapbox token is valid and working');
      return { isValid: true };
    } else if (response.status === 401) {
      return { 
        isValid: false, 
        error: 'Invalid Mapbox token. Please check your token is correct' 
      };
    } else {
      return { 
        isValid: false, 
        error: `Mapbox API error: ${response.status} ${response.statusText}` 
      };
    }
  } catch (error) {
    console.error('Error testing Mapbox token:', error);
    return { 
      isValid: false, 
      error: 'Network error while testing Mapbox token' 
    };
  }
};

/**
 * Initialize Mapbox with proper error handling
 * Use this before creating any map instances
 */
export const initializeMapbox = (): boolean => {
  const token = getMapboxTokenFromAnySource();
  
  if (!token) {
    console.error('❌ Cannot initialize Mapbox: No token available');
    console.log('Please ensure VITE_MAPBOX_ACCESS_TOKEN is set in your .env file');
    console.log('Example: VITE_MAPBOX_ACCESS_TOKEN=pk.your_token_here');
    return false;
  }
  
  // Set the global token
  mapboxgl.accessToken = token;
  
  console.log('✅ Mapbox initialized with token from:', 
    token === import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ? 'environment' : 'localStorage'
  );
  
  return true;
};

/**
 * Get helpful error message for missing Mapbox token
 */
export const getMapboxErrorMessage = (): string => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return `
      Mapbox token is missing. To fix this:
      1. Create a .env file in the project root
      2. Add: VITE_MAPBOX_ACCESS_TOKEN=pk.your_token_here
      3. Get a free token from https://www.mapbox.com/
      4. Restart the development server
    `.trim();
  }
  
  return 'Map service is temporarily unavailable.';
};