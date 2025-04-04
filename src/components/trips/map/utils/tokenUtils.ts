
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/config/env';
import { toast } from 'sonner';

// Configure Mapbox with the access token - prioritize environment token, fall back to localStorage
const envToken = MAPBOX_CONFIG.accessToken;
const localStorageToken = localStorage.getItem('mapbox_access_token');

// Prioritize environment variable token, fall back to localStorage if needed
mapboxgl.accessToken = envToken || localStorageToken || '';

// Log token status for debugging
console.log('Mapbox config initialization:', { 
  envTokenExists: !!envToken, 
  localTokenExists: !!localStorageToken,
  resultingToken: mapboxgl.accessToken ? 'Set' : 'Not set',
  tokenFirstChars: mapboxgl.accessToken ? mapboxgl.accessToken.substring(0, 5) + '...' : 'None'
});

/**
 * Basic validation of token format (Mapbox tokens typically start with 'pk.')
 */
export const isTokenFormatValid = (token: string): boolean => {
  return token.startsWith('pk.') && token.length > 20;
};

// Validate the current token
const currentToken = mapboxgl.accessToken;
if (currentToken && !isTokenFormatValid(currentToken)) {
  console.warn('Mapbox token format appears invalid. Tokens should start with "pk." and be at least 20 characters.');
}

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
  const hasToken = !!(MAPBOX_CONFIG.accessToken || localStorage.getItem('mapbox_access_token'));
  console.log('Checking for Mapbox token:', hasToken);
  return hasToken;
};

/**
 * Validate if the current token works by creating a test map instance
 */
export const validateMapboxToken = async (): Promise<boolean> => {
  const token = mapboxgl.accessToken;
  console.log('Validating token starting with:', token ? token.substring(0, 5) + '...' : 'No token');
  
  if (!token) return false;
  
  // First check the format
  if (!isTokenFormatValid(token)) {
    console.warn('Token format validation failed');
    return false;
  }
  
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
