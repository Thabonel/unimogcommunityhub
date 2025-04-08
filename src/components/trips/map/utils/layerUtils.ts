
import mapboxgl from 'mapbox-gl';
import { addDemSource } from './terrainUtils';

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
    // First add DEM source if not already present
    const hasDemSource = map.getSource('mapbox-dem') !== undefined;
    
    if (!hasDemSource) {
      const sourceAdded = addDemSource(map);
      if (!sourceAdded) {
        console.error('Failed to add DEM source');
        return false;
      }
    }
    
    // Then add topographical layers
    const layersAdded = addTopographicalLayers(map);
    
    return layersAdded;
  } catch (err) {
    console.error('Error initializing all layers:', err);
    return false;
  }
};

/**
 * Add terrain layer to the map
 * @param map The Mapbox GL map instance
 * @returns boolean indicating success
 */
export const addTerrainLayer = (map: mapboxgl.Map): boolean => {
  if (!map) return false;
  
  try {
    // Add DEM source if it doesn't exist
    if (!map.getSource('mapbox-dem')) {
      addDemSource(map);
    }
    
    // Enable terrain
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    
    return true;
  } catch (err) {
    console.error('Error adding terrain layer:', err);
    return false;
  }
};

/**
 * Add topographical layers to the map
 * @param map The Mapbox GL map instance
 * @returns boolean indicating success
 */
export const addTopographicalLayers = (map: mapboxgl.Map): boolean => {
  if (!map) return false;
  
  try {
    // Add hillshade layer
    if (!map.getLayer(TOPO_LAYERS.HILLSHADE)) {
      map.addLayer({
        id: TOPO_LAYERS.HILLSHADE,
        source: 'mapbox-dem',
        type: 'hillshade',
        layout: { visibility: 'none' },
        paint: {
          'hillshade-illumination-direction': 270,
          'hillshade-exaggeration': 0.6,
          'hillshade-shadow-color': '#000000',
          'hillshade-highlight-color': '#FFFFFF',
          'hillshade-accent-color': '#808080'
        }
      });
    }
    
    // Add contour lines
    if (!map.getLayer(TOPO_LAYERS.CONTOUR)) {
      map.addLayer({
        id: TOPO_LAYERS.CONTOUR,
        source: 'mapbox-dem',
        type: 'line',
        layout: {
          visibility: 'none',
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#614615',
          'line-width': 1
        },
        filter: ['==', ['mod', ['get', 'elevation'], 100], 0]
      });
    }
    
    // Only initialize 3D terrain if not already present
    if (!map.getLayer(TOPO_LAYERS.TERRAIN_3D)) {
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 0 });
      
      // Store this as a custom property since there's no real "layer" for 3D terrain
      // We'll use this to track whether terrain is enabled
      map.setLayoutProperty(TOPO_LAYERS.TERRAIN_3D, 'visibility', 'none');
    }
    
    return true;
  } catch (err) {
    console.error('Error adding topographical layers:', err);
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
    // Special handling for 3D terrain which isn't a regular layer
    if (layerId === TOPO_LAYERS.TERRAIN_3D) {
      if (visible) {
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      } else {
        map.setTerrain(null);
      }
      
      return true;
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
