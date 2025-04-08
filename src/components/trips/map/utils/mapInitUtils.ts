
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
    
    if (offsetWidth <= 10 || offsetHeight <= 10) {
      const message = `Map container has invalid dimensions: ${offsetWidth}x${offsetHeight}`;
      console.error(message);
      throw new Error(message);
    }
    
    // Create map with default options and container
    const mapOptions = {
      ...DEFAULT_MAP_OPTIONS,
      container, // Override the container
    };
    
    // Attempt to create the map
    const map = new mapboxgl.Map(mapOptions);
    
    console.log('Map instance created successfully');
    
    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    
    // Add scale control
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
    
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
    const commonEvents = ['load', 'error', 'style.load', 'resize', 'move', 'click'];
    
    commonEvents.forEach(event => {
      try {
        // Use an empty function as the second parameter since off() requires both parameters
        map.off(event, () => {});
      } catch (e) {
        // Ignore errors from removing listeners
      }
    });
    
    // Remove the map
    map.remove();
    
    console.log('Map instance removed successfully');
  } catch (error) {
    console.error('Error cleaning up map:', error);
  }
};
