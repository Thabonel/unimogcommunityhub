
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { isValidTokenFormat, getMapboxToken } from './tokenUtils';
import { DEFAULT_MAP_OPTIONS } from '../mapConfig';

/**
 * Creates and initializes a new Mapbox map instance with robust error handling
 */
export const initializeMap = (container: HTMLDivElement): mapboxgl.Map => {
  
  try {
    if (!mapboxgl) {
      const message = 'Your browser does not support Mapbox GL';
      console.error(message);
      toast.error(message);
      throw new Error(message);
    }
  } catch (error) {
    console.error('Error checking Mapbox support:', error);
    toast.error('Your browser may not fully support interactive maps');
    throw new Error('Mapbox support check failed');
  }

  // Check if token is available using standardized function
  const token = getMapboxToken();
  
  if (!token) {
    const message = 'Mapbox access token is missing';
    console.error(message);
    toast.error('Mapbox token is missing. Please enter a valid token.');
    throw new Error(message);
  }
  
  // Validate token format
  if (!isValidTokenFormat(token)) {
    console.warn('Mapbox token format appears invalid (must start with pk.*)');
    toast.warning('Your Mapbox token format appears invalid. Map may not load correctly.');
  }
  
  // Set the token explicitly
  try {
    mapboxgl.accessToken = token;
    console.log('Mapbox token set successfully:', token.substring(0, 5) + '...' + token.substring(token.length - 5));
  } catch (error) {
    console.error('Error setting Mapbox access token:', error);
    toast.error('Failed to set Mapbox token. Please refresh and try again.');
    throw error;
  }
  
  try {
    // Verify container dimensions
    const { offsetWidth, offsetHeight } = container;
    console.log('Creating map with container dimensions:', { width: offsetWidth, height: offsetHeight });
    
    if (offsetWidth <= 0 || offsetHeight <= 0) {
      const message = `Map container has invalid dimensions: ${offsetWidth}x${offsetHeight}`;
      console.error(message);
      throw new Error(message);
    }
    
    // Create map with default options and container
    // Ensure center is properly typed as [number, number]
    const mapOptions = {
      ...DEFAULT_MAP_OPTIONS,
      container, // Override the container
      center: DEFAULT_MAP_OPTIONS.center as [number, number], // Properly type the center as a tuple
    };
    
    // Attempt to create the map
    const map = new mapboxgl.Map(mapOptions);
    
    console.log('Map instance created successfully');
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    
    // Add scale control
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
    
    // Set up comprehensive error handling
    map.on('error', (error) => {
      console.error('Mapbox error:', error);
      
      // Handle specific error types
      const errorMessage = error.error ? error.error.message : 'Unknown error';
      
      if (errorMessage.includes('access token')) {
        toast.error('Invalid Mapbox access token. Please check your token and try again.');
      } else if (errorMessage.includes('style')) {
        toast.error('Error loading map style. Please try a different style.');
      } else if (errorMessage.includes('source')) {
        toast.error('Error loading map source data. Please check your network connection.');
      } else {
        toast.error('Error loading map. Please try refreshing the page.');
      }
    });
    
    // Handle style loading errors
    map.on('style.error', (error) => {
      console.error('Mapbox style error:', error);
      toast.error('Error loading map style. Please try a different style.');
    });
    
    // Handle successful style load
    map.on('style.load', () => {
      console.log('Map style loaded successfully');
    });
    
    // Handle successful map load
    map.on('load', () => {
      console.log('Map fully loaded and ready');
    });
    
    return map;
  } catch (error) {
    console.error('Error creating Mapbox map:', error);
    
    if (mapboxgl.accessToken && !isValidTokenFormat(mapboxgl.accessToken)) {
      toast.error('Your Mapbox token appears to be invalid. Please check the format and try again.');
    } else {
      toast.error('Failed to create map. Please try again or check your network connection.');
    }
    
    throw error;
  }
};

/**
 * Safely removes a map instance and cleans up resources
 */
export const cleanupMap = (map: mapboxgl.Map | null): void => {
  if (!map) return;
  
  try {
    // Remove specific common event listeners
    // These are the most common events in Mapbox GL
    const commonEvents = ['load', 'error', 'style.load', 'resize', 'move', 'click'];
    
    // For each event type, remove all listeners
    // The TypeScript definition requires at least an event type and listener or layer parameter
    // Using `null` as the second parameter will remove all listeners of that event type
    commonEvents.forEach(event => {
      // Cast to 'any' to bypass TypeScript's strict typing since we want to remove all listeners of this type
      (map as any).off(event);
    });
    
    // Fix for TypeScript error: The Mapbox types expect arguments but the implementation doesn't
    // Need to use a type assertion since TypeScript definition doesn't match actual implementation
    (map as any).remove();
    
    console.log('Map instance removed successfully');
  } catch (error) {
    console.error('Error cleaning up map:', error);
  }
};
