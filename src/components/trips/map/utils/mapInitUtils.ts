
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { isTokenFormatValid } from './tokenUtils';

/**
 * Creates and initializes a new Mapbox map instance
 */
export const initializeMap = (container: HTMLDivElement): mapboxgl.Map => {
  // Check if token is available and not already set
  if (!mapboxgl.accessToken) {
    console.log('Setting Mapbox token from localStorage or environment');
    // Force refresh the token from localStorage in case it was just added
    const freshToken = localStorage.getItem('mapbox_access_token');
    const envToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    if (freshToken && isTokenFormatValid(freshToken)) {
      console.log('Using token from localStorage');
      mapboxgl.accessToken = freshToken;
    } else if (envToken && isTokenFormatValid(envToken)) {
      console.log('Using token from environment variables');
      mapboxgl.accessToken = envToken;
    } else {
      console.error('Mapbox access token is missing or invalid');
      toast.error('Mapbox token is missing. Please enter a valid token.');
      throw new Error('Mapbox access token missing');
    }
  }
  
  try {
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
