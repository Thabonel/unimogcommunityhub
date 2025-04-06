
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/config/env';
import { toast } from 'sonner';

// Clear access token to start fresh
mapboxgl.accessToken = '';

/**
 * Basic validation of token format (Mapbox tokens typically start with 'pk.')
 */
export const isTokenFormatValid = (token: string): boolean => {
  return token.startsWith('pk.') && token.length > 20;
};

/**
 * Save a token to localStorage to persist it between page reloads
 */
export const saveMapboxToken = (token: string): void => {
  if (!token) return;
  
  // Validate token format before saving
  if (!isTokenFormatValid(token)) {
    console.warn('Saving token with invalid format. Mapbox tokens typically start with "pk."');
    toast.warning('The token format appears unusual. If the map doesn\'t load, please check your token.');
  }
  
  localStorage.setItem('mapbox_access_token', token);
  mapboxgl.accessToken = token;
  console.log('Mapbox token saved and set:', token.substring(0, 5) + '...');
};

/**
 * Check if a mapbox token exists either in env or localStorage
 */
export const hasMapboxToken = (): boolean => {
  const token = MAPBOX_CONFIG.accessToken || localStorage.getItem('mapbox_access_token');
  console.log('Checking for Mapbox token:', !!token);
  
  if (token) {
    // Ensure the token is set on mapboxgl
    mapboxgl.accessToken = token;
  }
  
  return !!token;
};

/**
 * Get the current active token from either localStorage or environment
 */
export const getActiveToken = (): string => {
  const localToken = localStorage.getItem('mapbox_access_token');
  const envToken = MAPBOX_CONFIG.accessToken;
  
  return localToken || envToken || '';
};

/**
 * Validate if the current token works by creating a test map instance
 */
export const validateMapboxToken = async (): Promise<boolean> => {
  const token = getActiveToken();
  console.log('Validating token starting with:', token ? token.substring(0, 5) + '...' : 'No token');
  
  if (!token) return false;
  
  // First check the format
  if (!isTokenFormatValid(token)) {
    console.warn('Token format validation failed');
    return false;
  }
  
  // Make sure the token is set on mapboxgl
  mapboxgl.accessToken = token;
  
  // Create a temporary hidden container
  const testContainer = document.createElement('div');
  testContainer.style.position = 'absolute';
  testContainer.style.visibility = 'hidden';
  testContainer.style.width = '100px';
  testContainer.style.height = '100px';
  document.body.appendChild(testContainer);
  
  try {
    // Try to create a map instance
    const testMap = new mapboxgl.Map({
      container: testContainer,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0, 0],
      zoom: 1
    });
    
    // Wait for map to either load or error
    return new Promise((resolve) => {
      testMap.once('load', () => {
        console.log('Token validation: Map loaded successfully');
        testMap.remove();
        document.body.removeChild(testContainer);
        resolve(true);
      });
      
      testMap.once('error', (err) => {
        console.error('Token validation: Map load error', err);
        testMap.remove();
        document.body.removeChild(testContainer);
        resolve(false);
      });
      
      // Set a timeout in case neither event fires
      setTimeout(() => {
        console.warn('Token validation: Timeout occurred');
        if (testContainer.parentNode) {
          testMap.remove();
          document.body.removeChild(testContainer);
        }
        resolve(false);
      }, 5000);
    });
  } catch (error) {
    console.error('Token validation error:', error);
    if (testContainer.parentNode) {
      document.body.removeChild(testContainer);
    }
    return false;
  }
};
