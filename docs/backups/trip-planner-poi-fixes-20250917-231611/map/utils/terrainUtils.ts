
import mapboxgl from 'mapbox-gl';

/**
 * Adds a Digital Elevation Model (DEM) source to the map for terrain rendering
 * @param map The Mapbox GL map instance
 * @returns boolean indicating success
 */
export const addDemSource = (map: mapboxgl.Map): boolean => {
  if (!map) return false;
  
  try {
    // Check if the source already exists
    if (map.getSource('mapbox-dem')) {
      console.log('DEM source already exists');
      return true;
    }
    
    // Add the DEM source - using terrain-rgb which is more widely available
    map.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.terrain-rgb',
      tileSize: 256
    });
    
    console.log('DEM source added successfully');
    return true;
  } catch (err) {
    console.warn('Could not add DEM source (terrain features may be limited):', err);
    // Return true to allow the app to continue without terrain
    return true;
  }
};

/**
 * Enables terrain on the map
 * @param map The Mapbox GL map instance
 * @returns boolean indicating success
 */
export const enableTerrain = (map: mapboxgl.Map): boolean => {
  if (!map) return false;
  
  try {
    // Make sure we have the DEM source
    const hasSource = map.getSource('mapbox-dem') !== undefined;
    
    if (!hasSource) {
      const sourceAdded = addDemSource(map);
      if (!sourceAdded) {
        console.warn('Could not add DEM source, terrain will not be available');
        return false;
      }
    }
    
    // Enable terrain with exaggeration
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    
    return true;
  } catch (err) {
    console.warn('Could not enable 3D terrain:', err);
    // Don't treat as critical error
    return false;
  }
};

/**
 * Disables terrain on the map
 * @param map The Mapbox GL map instance
 * @returns boolean indicating success
 */
export const disableTerrain = (map: mapboxgl.Map): boolean => {
  if (!map) return false;
  
  try {
    // Disable terrain
    map.setTerrain(null);
    
    return true;
  } catch (err) {
    console.error('Error disabling terrain:', err);
    return false;
  }
};

/**
 * Enables or disables terrain on the map
 * @param map The Mapbox GL map instance
 * @param enable Whether to enable or disable terrain
 * @returns boolean indicating success
 */
export const toggleTerrain = (map: mapboxgl.Map, enable: boolean): boolean => {
  if (!map) return false;
  
  try {
    if (enable) {
      return enableTerrain(map);
    } else {
      return disableTerrain(map);
    }
  } catch (err) {
    console.error('Error toggling terrain:', err);
    return false;
  }
};

/**
 * Adds a terrain layer to the map
 * @param map The Mapbox GL map instance
 * @returns boolean indicating success
 */
export const addTerrainLayer = (map: mapboxgl.Map): boolean => {
  if (!map) return false;
  
  try {
    // Make sure we have the DEM source
    if (!map.getSource('mapbox-dem')) {
      addDemSource(map);
    }
    
    // Add terrain layer
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    
    return true;
  } catch (err) {
    console.error('Error adding terrain layer:', err);
    return false;
  }
};

/**
 * Adds topographical layers to the map
 * @param map The Mapbox GL map instance
 * @returns boolean indicating success
 */
export const addTopographicalLayers = (map: mapboxgl.Map): boolean => {
  if (!map) return false;
  
  try {
    // Make sure we have the DEM source
    if (!map.getSource('mapbox-dem')) {
      addDemSource(map);
    }
    
    // Add hillshade layers if they don't exist
    if (!map.getLayer('hillshade')) {
      map.addLayer({
        id: 'hillshade',
        source: 'mapbox-dem',
        type: 'hillshade',
        layout: { visibility: 'none' },
        paint: {
          'hillshade-illumination-direction': 270,
          'hillshade-shadow-color': 'rgba(0, 0, 0, 0.3)',
          'hillshade-highlight-color': 'rgba(255, 255, 255, 0.15)',
          'hillshade-accent-color': 'rgba(0, 0, 0, 0.1)'
        }
      });
    }
    
    // Note: Contour lines removed as raster-dem sources can only be used with hillshade layers
    // If contour lines are needed, they would require a vector tile source instead
    
    return true;
  } catch (err) {
    console.error('Error adding topographical layers:', err);
    return false;
  }
};
