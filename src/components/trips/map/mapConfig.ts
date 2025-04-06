
import { getMapboxToken, validateMapboxToken } from './utils/tokenUtils';
import { addTopographicalLayers, addDemSource } from './utils/layerUtils';

// Check if mapbox token exists
export const hasMapboxToken = (): boolean => {
  return !!getMapboxToken();
};

// Re-export validation function
export { validateMapboxToken, addTopographicalLayers, addDemSource };

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
