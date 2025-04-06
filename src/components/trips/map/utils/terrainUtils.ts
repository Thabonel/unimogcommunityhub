import mapboxgl from 'mapbox-gl';
import { addDemSource } from './layerUtils';

// Safe way to enable 3D terrain that doesn't throw errors
export const enableTerrain = (map: mapboxgl.Map): boolean => {
  if (!map) {
    console.log('Map is null, cannot enable terrain');
    return false;
  }

  try {
    // Check if the map style is loaded
    if (!map.isStyleLoaded()) {
      console.log('Map style not fully loaded, cannot enable terrain');
      return false;
    }

    // First ensure the DEM source exists
    addDemSource(map);
    
    // Only set terrain if map style is loaded
    try {
      // Enable terrain with exaggeration
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      console.log('Terrain enabled successfully');
      return true;
    } catch (err) {
      console.error('Error setting terrain:', err);
      return false;
    }
  } catch (error) {
    console.error('Error enabling terrain:', error);
    return false;
  }
};

// Safe way to disable 3D terrain that doesn't throw errors
export const disableTerrain = (map: mapboxgl.Map): boolean => {
  if (!map) {
    console.log('Map is null, cannot disable terrain');
    return false;
  }

  try {
    // Check if the map style is loaded
    if (!map.isStyleLoaded()) {
      console.log('Map style not fully loaded, cannot disable terrain');
      return false;
    }

    try {
      map.setTerrain(null);
      console.log('Terrain disabled successfully');
      return true;
    } catch (err) {
      console.error('Error setting terrain to null:', err);
      return false;
    }
  } catch (error) {
    console.error('Error disabling terrain:', error);
    return false;
  }
};
