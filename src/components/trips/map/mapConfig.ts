
import { 
  getMapboxToken, 
  isMapboxSupported, 
  saveMapboxToken,
  validateMapboxToken, 
  isTokenFormatValid, 
  validateAndTestCurrentToken,
  getActiveToken,
  addTopographicalLayers, 
  TOPO_LAYERS,
  toggleLayerVisibility,
  initializeAllLayers
} from './utils';

// Re-export validation function and other utility functions
export { 
  validateMapboxToken, 
  isTokenFormatValid, 
  validateAndTestCurrentToken,
  getActiveToken 
} from './utils';

export { 
  addTopographicalLayers, 
  TOPO_LAYERS,
  toggleLayerVisibility,
  initializeAllLayers
} from './utils';

// Check if mapbox token exists
export const hasMapboxToken = (): boolean => {
  return !!getMapboxToken();
};

// Check browser compatibility
export const isSupported = (): boolean => {
  return isMapboxSupported();
};

// Re-export other utility functions
export { saveMapboxToken, getMapboxToken };

// Export base map styles
export const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v11',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12', // Use v12 for better terrain support
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11',
  NAVIGATION_DAY: 'mapbox://styles/mapbox/navigation-day-v1',
  NAVIGATION_NIGHT: 'mapbox://styles/mapbox/navigation-night-v1'
};

// Default map options for consistent initialization
export const DEFAULT_MAP_OPTIONS: mapboxgl.MapOptions = {
  container: 'map',
  style: MAP_STYLES.OUTDOORS,
  center: [9.1829, 48.7758] as [number, number], // Stuttgart, Germany - explicitly typed as [lng, lat]
  zoom: 5,
  attributionControl: true,
  trackResize: true,
  preserveDrawingBuffer: true
};
