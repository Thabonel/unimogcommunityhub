
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';

// Layer IDs for topographical features
export const TOPO_LAYERS = {
  HILLSHADE: 'hillshade-layer',
  CONTOUR: 'contour-lines-layer',
  TERRAIN_3D: '3d-terrain'
};

/**
 * Add DEM source to map
 */
export const addDemSource = (map: mapboxgl.Map): boolean => {
  try {
    // Check if source already exists
    if (map.getSource('mapbox-dem')) {
      console.log('DEM source already exists');
      return true;
    }
    
    // Add DEM source
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });
    
    console.log('DEM source added successfully');
    return true;
  } catch (error) {
    console.error('Error adding DEM source:', error);
    return false;
  }
};

/**
 * Add topographical layers to map
 */
export const addTopographicalLayers = (map: mapboxgl.Map): boolean => {
  try {
    // Check if necessary sources exist
    if (!map.getSource('mapbox-dem')) {
      console.log('DEM source missing, adding it...');
      addDemSource(map);
    }
    
    // Check map style state
    if (!map.isStyleLoaded()) {
      console.warn('Map style not fully loaded, deferring layer addition');
      return false;
    }
    
    // Add hillshade layer if it doesn't exist
    if (!map.getLayer(TOPO_LAYERS.HILLSHADE)) {
      map.addLayer({
        id: TOPO_LAYERS.HILLSHADE,
        source: 'mapbox-dem',
        type: 'hillshade',
        layout: { visibility: 'none' },
        paint: {
          'hillshade-illumination-direction': 270,
          'hillshade-shadow-color': 'rgba(0, 0, 0, 0.3)',
          'hillshade-highlight-color': 'rgba(255, 255, 255, 0.2)',
          'hillshade-accent-color': 'rgba(0, 0, 0, 0.1)'
        }
      });
      console.log('Hillshade layer added');
    }
    
    // Add contour layer if it doesn't exist
    if (!map.getLayer(TOPO_LAYERS.CONTOUR)) {
      map.addLayer({
        id: TOPO_LAYERS.CONTOUR,
        type: 'line',
        source: {
          type: 'vector',
          url: 'mapbox://mapbox.mapbox-terrain-v2'
        },
        'source-layer': 'contour',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          visibility: 'none'
        },
        paint: {
          'line-color': '#b78d6e',
          'line-width': 1,
          'line-opacity': 0.6
        }
      });
      console.log('Contour layer added');
    }
    
    return true;
  } catch (error) {
    console.error('Error adding topographical layers:', error);
    return false;
  }
};

/**
 * Toggle layer visibility
 */
export const toggleLayerVisibility = (map: mapboxgl.Map, layerId: string): boolean => {
  try {
    // Ensure map and style are loaded
    if (!map.isStyleLoaded()) {
      console.warn('Map style not loaded, cannot toggle layer visibility');
      toast.warning('Map is still loading. Please try again in a moment.');
      return false;
    }
    
    // Check if the layer exists
    if (!map.getLayer(layerId)) {
      console.warn(`Layer ${layerId} does not exist, cannot toggle visibility`);
      return false;
    }
    
    // Get current visibility
    const visibility = map.getLayoutProperty(layerId, 'visibility');
    
    // Toggle visibility
    const newVisibility = visibility === 'visible' ? 'none' : 'visible';
    
    // Update layer visibility
    map.setLayoutProperty(layerId, 'visibility', newVisibility);
    console.log(`Layer ${layerId} visibility set to ${newVisibility}`);
    
    return newVisibility === 'visible';
  } catch (error) {
    console.error(`Error toggling layer ${layerId} visibility:`, error);
    return false;
  }
};

/**
 * Initialize all map layers
 */
export const initializeAllLayers = (map: mapboxgl.Map): boolean => {
  if (!map || !map.isStyleLoaded()) {
    console.warn('Map style not loaded, cannot initialize layers');
    return false;
  }
  
  let success = true;
  
  // Add DEM source
  if (!addDemSource(map)) {
    success = false;
  }
  
  // Add topographical layers
  if (!addTopographicalLayers(map)) {
    success = false;
  }
  
  return success;
};
