
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
 * Enables or disables terrain on the map
 * @param map The Mapbox GL map instance
 * @param enable Whether to enable or disable terrain
 * @returns boolean indicating success
 */
export const toggleTerrain = (map: mapboxgl.Map, enable: boolean): boolean => {
  if (!map) return false;
  
  try {
    if (enable) {
      // Make sure we have the DEM source
      const hasSource = map.getSource('mapbox-dem') !== undefined;
      
      if (!hasSource) {
        addDemSource(map);
      }
      
      // Enable terrain
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    } else {
      // Disable terrain
      map.setTerrain(null);
    }
    
    return true;
  } catch (err) {
    console.error('Error toggling terrain:', err);
    return false;
  }
};
