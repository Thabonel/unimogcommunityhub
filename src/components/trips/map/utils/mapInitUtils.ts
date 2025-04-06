
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { isValidTokenFormat, getMapboxToken } from './tokenUtils';

/**
 * Creates and initializes a new Mapbox map instance
 */
export const initializeMap = (container: HTMLDivElement): mapboxgl.Map => {
  // Check if token is available and not already set
  const token = getMapboxToken();
  
  if (!token) {
    console.error('Mapbox access token is missing');
    toast.error('Mapbox token is missing. Please enter a valid token.');
    throw new Error('Mapbox access token missing');
  }
  
  if (!isValidTokenFormat(token)) {
    console.warn('Mapbox token format appears invalid');
    toast.warning('Your Mapbox token format appears invalid. Map may not load correctly.');
  }
  
  // Set the token explicitly to ensure it's available
  console.log('Setting Mapbox token:', token.substring(0, 5) + '...');
  mapboxgl.accessToken = token;
  
  try {
    console.log('Creating map with container dimensions:', { 
      width: container.offsetWidth, 
      height: container.offsetHeight 
    });
    
    // Make sure container has dimensions before creating the map
    const { offsetWidth, offsetHeight } = container;
    
    if (offsetWidth <= 0 || offsetHeight <= 0) {
      console.error('Map container has invalid dimensions:', { width: offsetWidth, height: offsetHeight });
      throw new Error('Map container has invalid dimensions');
    }
    
    // Attempt to create the map
    const map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12', // Use a more reliable default style
      center: [0, 0], // Default center, will be updated based on locations
      zoom: 2,
      attributionControl: true,
      trackResize: true, // Ensure map resizes with container
      preserveDrawingBuffer: true // Helps with map rendering issues
    });
    
    // Debug map instance
    console.log('Map instance created successfully');
    
    // Add navigation controls - CHANGED FROM top-right TO bottom-left
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    
    // Add scale control
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');
    
    // Add error handling for map load
    map.on('error', (error) => {
      console.error('Mapbox error:', error);
      toast.error('Error loading map. Your Mapbox token may be invalid.');
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
