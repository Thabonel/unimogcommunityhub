
import mapboxgl from 'mapbox-gl';
import { addDemSource, addTopographicalLayers as addTopoLayersFromTerrain } from './terrainUtils';

// Export layer names for use in other files
export const TOPO_LAYERS = {
  TERRAIN_3D: 'terrain-3d',
  HILLSHADE: 'hillshade',
  CONTOUR: 'contour'
};

/**
 * Initialize all topographical layers on the map
 * @param map The Mapbox GL map instance
 * @returns boolean indicating success
 */
export const initializeAllLayers = (map: mapboxgl.Map): boolean => {
  if (!map) return false;
  
  try {
    // Check if map style is loaded
    if (!map.isStyleLoaded()) {
      console.warn('Map style not fully loaded. Layers will be initialized when style loads.');
      
      // Set up a one-time listener for style.load event
      map.once('style.load', () => {
        console.log('Style loaded, now initializing layers');
        initializeAllLayers(map);
      });
      
      return false;
    }
    
    // First add DEM source if not already present
    const hasDemSource = map.getSource('mapbox-dem') !== undefined;
    
    if (!hasDemSource) {
      const sourceAdded = addDemSource(map);
      if (!sourceAdded) {
        console.error('Failed to add DEM source');
        return false;
      }
    }
    
    // Then add topographical layers using the function from terrainUtils
    const layersAdded = addTopoLayersFromTerrain(map);
    
    return layersAdded;
  } catch (err) {
    console.error('Error initializing all layers:', err);
    return false;
  }
};

/**
 * Toggle layer visibility
 * @param map The Mapbox GL map instance
 * @param layerId The ID of the layer to toggle
 * @param visible Whether the layer should be visible
 * @returns boolean indicating success
 */
export const toggleLayerVisibility = (
  map: mapboxgl.Map,
  layerId: string,
  visible: boolean
): boolean => {
  if (!map) return false;
  
  try {
    // Check if map style is loaded
    if (!map.isStyleLoaded()) {
      console.warn(`Map style not fully loaded. Cannot toggle ${layerId} yet.`);
      return false;
    }
    
    // Special handling for 3D terrain which isn't a regular layer
    if (layerId === TOPO_LAYERS.TERRAIN_3D) {
      if (visible) {
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      } else {
        map.setTerrain(null);
      }
      
      return true;
    }
    
    // Check if the layer exists before trying to set its visibility
    if (!map.getLayer(layerId)) {
      console.warn(`Layer ${layerId} does not exist on the map.`);
      return false;
    }
    
    // For normal layers, set the visibility property
    map.setLayoutProperty(
      layerId,
      'visibility',
      visible ? 'visible' : 'none'
    );
    
    return true;
  } catch (err) {
    console.error(`Error toggling layer ${layerId}:`, err);
    return false;
  }
};
