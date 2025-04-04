
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

// Basic validation of token format (Mapbox tokens typically start with 'pk.')
export const isTokenFormatValid = (token: string): boolean => {
  return token.startsWith('pk.') && token.length > 20;
};

// Validate the current token
const currentToken = mapboxgl.accessToken;
if (currentToken && !isTokenFormatValid(currentToken)) {
  console.warn('Mapbox token format appears invalid. Tokens should start with "pk." and be at least 20 characters.');
}

/**
 * Creates and initializes a new Mapbox map instance
 */
export const initializeMap = (container: HTMLDivElement): mapboxgl.Map => {
  // Check if token is available
  if (!mapboxgl.accessToken) {
    console.error('Mapbox access token is missing. Please check your environment variables or enter a token manually.');
    toast.error('Mapbox token is missing. Please enter a valid token.');
    throw new Error('Mapbox access token missing');
  }
  
  try {
    // Force refresh the token from localStorage in case it was just added
    const freshToken = localStorage.getItem('mapbox_access_token');
    if (freshToken && !envToken) {
      console.log('Refreshing token from localStorage');
      mapboxgl.accessToken = freshToken;
    }
    
    console.log('Creating map with token availability:', !!mapboxgl.accessToken);
    
    // Attempt to create the map
    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12', // Use a more reliable default style
      center: [0, 0] as [number, number], // Default center, will be updated based on locations
      zoom: 2,
      attributionControl: true,
      trackResize: true, // Ensure map resizes with container
      preserveDrawingBuffer: true // Helps with map rendering issues
    });
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    // Add scale control
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
    
    // Add error handling for map load
    map.on('error', (error) => {
      console.error('Mapbox error:', error);
      // Show user-friendly error message
      toast.error('Error loading map. Your Mapbox token may be invalid.');
    });
    
    console.log('Map instance created successfully');
    return map;
  } catch (error) {
    console.error('Error creating Mapbox map:', error);
    // Provide more informative error message about token validity
    if (mapboxgl.accessToken && !isTokenFormatValid(mapboxgl.accessToken)) {
      toast.error('Your Mapbox token appears to be invalid. Please check the format and try again.');
    } else {
      toast.error('Failed to create map. Please try again or check your network connection.');
    }
    throw error;
  }
};

// Save a token to localStorage to persist it between page reloads
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

// Check if a mapbox token exists either in env or localStorage
export const hasMapboxToken = (): boolean => {
  const hasToken = !!(MAPBOX_CONFIG.accessToken || localStorage.getItem('mapbox_access_token'));
  console.log('Checking for Mapbox token:', hasToken);
  return hasToken;
};

// Validate if the current token works by creating a test map instance
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

export const fitMapToBounds = (
  map: mapboxgl.Map, 
  coords: [number, number][]
): void => {
  if (!coords.length) return;
  
  const bounds = new mapboxgl.LngLatBounds();
  
  coords.forEach(coord => {
    bounds.extend(coord);
  });
  
  map.fitBounds(bounds, {
    padding: 80,
    duration: 1000
  });
};

export const flyToLocation = (
  map: mapboxgl.Map,
  coordinates: [number, number],
  zoom: number = 10
): void => {
  map.flyTo({
    center: coordinates,
    zoom,
    duration: 1000
  });
};
