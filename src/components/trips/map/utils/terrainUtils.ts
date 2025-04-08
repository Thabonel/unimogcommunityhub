
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
    
    // Add the DEM source
    map.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
      tileSize: 512,
      maxzoom: 14
    });
    
    // Set the terrain property
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    
    return true;
  } catch (err) {
    console.error('Error adding DEM source:', err);
    return false;
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
      addDemSource(map);
    }
    
    // Enable terrain with exaggeration
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    
    return true;
  } catch (err) {
    console.error('Error enabling terrain:', err);
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
    
    // Add contour lines if they don't exist
    if (!map.getLayer('contour')) {
      map.addLayer({
        id: 'contour',
        source: 'mapbox-dem',
        type: 'line',
        layout: {
          visibility: 'none',
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#877b59',
          'line-width': 1,
          'line-opacity': 0.8
        }
      });
    }
    
    return true;
  } catch (err) {
    console.error('Error adding topographical layers:', err);
    return false;
  }
};
