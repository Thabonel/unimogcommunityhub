
import mapboxgl from 'mapbox-gl';
import { addDemSource } from './layerUtils';

/**
 * Enable 3D terrain on the map
 * Returns true if successful, false otherwise
 */
export const enableTerrain = (map: mapboxgl.Map): boolean => {
  try {
    // Ensure the DEM source exists
    if (!map.getSource('mapbox-dem')) {
      console.log('DEM source missing, adding it...');
      if (!addDemSource(map)) {
        console.error('Failed to add DEM source, cannot enable terrain');
        return false;
      }
    }
    
    // Enable terrain
    map.setTerrain({ 
      source: 'mapbox-dem', 
      exaggeration: 1.5 
    });
    
    console.log('Terrain enabled successfully');
    return true;
  } catch (error) {
    console.error('Error enabling terrain:', error);
    return false;
  }
};

/**
 * Disable 3D terrain on the map
 * Returns true if successful, false otherwise
 */
export const disableTerrain = (map: mapboxgl.Map): boolean => {
  try {
    // Disable terrain
    map.setTerrain(null);
    
    console.log('Terrain disabled successfully');
    return true;
  } catch (error) {
    console.error('Error disabling terrain:', error);
    return false;
  }
};
