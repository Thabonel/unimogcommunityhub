
import mapboxgl from 'mapbox-gl';

// Define layer IDs
export const TOPO_LAYERS = {
  HILLSHADE: 'hillshade',
  CONTOUR: 'contours',
  TERRAIN_3D: 'terrain-3d'
};

/**
 * Add 3D terrain layer to map
 */
export const addTerrainLayer = (map: mapboxgl.Map): void => {
  if (!map.getSource('mapbox-dem')) {
    addDemSource(map);
  }
  
  if (!map.getTerrain()) {
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
  }
  
  addTopographicalLayers(map);
};

/**
 * Add DEM source for terrain
 * Returns true if successful, false otherwise
 */
export const addDemSource = (map: mapboxgl.Map): boolean => {
  try {
    if (map.getSource('mapbox-dem')) {
      console.log('DEM source already exists');
      return true;
    }
    
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });
    console.log('DEM source added successfully');
    return true;
  } catch (err) {
    console.error('Error adding DEM source:', err);
    // Source might already exist
    return false;
  }
};

/**
 * Add topographical layers to map
 */
export const addTopographicalLayers = (map: mapboxgl.Map): void => {
  try {
    // Check if map style is loaded
    if (!map.isStyleLoaded()) {
      console.warn('Map style not fully loaded, cannot add topographical layers yet');
      
      // Set up a one-time listener to add layers when style loads
      map.once('style.load', () => {
        console.log('Style loaded, adding topographical layers');
        addTopographicalLayers(map);
      });
      return;
    }
    
    // Add sky layer
    if (!map.getLayer('sky')) {
      try {
        map.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });
      } catch (err) {
        console.error('Error adding sky layer:', err);
      }
    }
    
    // Add contour lines
    if (!map.getLayer('contours') && !map.getSource('contours')) {
      try {
        map.addSource('contours', {
          type: 'vector',
          url: 'mapbox://mapbox.mapbox-terrain-v2'
        });
        
        map.addLayer({
          'id': 'contours',
          'type': 'line',
          'source': 'contours',
          'source-layer': 'contour',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'none'
          },
          'paint': {
            'line-color': '#8b6b4c',
            'line-width': 1,
            'line-opacity': 0.4
          }
        });
      } catch (err) {
        console.error('Error adding contour layers:', err);
      }
    }
    
    // Add hillshade layer
    if (!map.getLayer(TOPO_LAYERS.HILLSHADE) && !map.getSource('hillshade')) {
      try {
        map.addSource('hillshade', {
          type: 'raster',
          url: 'mapbox://mapbox.terrain-rgb'
        });
        
        map.addLayer({
          'id': TOPO_LAYERS.HILLSHADE,
          'type': 'raster',
          'source': 'hillshade',
          'layout': {
            'visibility': 'none'
          },
          'paint': {
            'raster-opacity': 0.3
          }
        }, 'contours');
      } catch (err) {
        console.error('Error adding hillshade layer:', err);
      }
    }
  } catch (err) {
    console.error('Error adding topographical layers:', err);
  }
};

/**
 * Remove topographical layers from map
 */
export const removeTopographicalLayers = (map: mapboxgl.Map): void => {
  try {
    if (map.getLayer('sky')) {
      map.removeLayer('sky');
    }
    
    if (map.getLayer('contours')) {
      map.removeLayer('contours');
    }
    
    if (map.getSource('contours')) {
      map.removeSource('contours');
    }
    
    if (map.getLayer(TOPO_LAYERS.HILLSHADE)) {
      map.removeLayer(TOPO_LAYERS.HILLSHADE);
    }
    
    if (map.getSource('hillshade')) {
      map.removeSource('hillshade');
    }
    
    map.setTerrain(null);
  } catch (err) {
    console.error('Error removing topographical layers:', err);
  }
};

/**
 * Toggle visibility of a specific layer
 * Returns the new visibility state (true if visible, false if hidden)
 */
export const toggleLayerVisibility = (map: mapboxgl.Map, layerId: string): boolean => {
  try {
    if (!map.getLayer(layerId)) {
      console.warn(`Layer ${layerId} does not exist`);
      return false;
    }
    
    const visibility = map.getLayoutProperty(layerId, 'visibility');
    const newVisibility = visibility === 'visible' ? 'none' : 'visible';
    
    map.setLayoutProperty(layerId, 'visibility', newVisibility);
    
    return newVisibility === 'visible';
  } catch (err) {
    console.error(`Error toggling layer ${layerId}:`, err);
    return false;
  }
};

/**
 * Initialize all map layers
 * Returns true if successful, false otherwise
 */
export const initializeAllLayers = (map: mapboxgl.Map): boolean => {
  if (!map.isStyleLoaded()) {
    console.warn('Map style not fully loaded, cannot initialize layers');
    return false;
  }
  
  try {
    // Add DEM source for 3D terrain
    if (!map.getSource('mapbox-dem')) {
      addDemSource(map);
    }
    
    // Add contour lines if not already added
    if (!map.getLayer(TOPO_LAYERS.CONTOUR) && !map.getSource('contours')) {
      try {
        map.addSource('contours', {
          type: 'vector',
          url: 'mapbox://mapbox.mapbox-terrain-v2'
        });
        
        map.addLayer({
          'id': TOPO_LAYERS.CONTOUR,
          'type': 'line',
          'source': 'contours',
          'source-layer': 'contour',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'none' // Initially hidden
          },
          'paint': {
            'line-color': '#8b6b4c',
            'line-width': 1,
            'line-opacity': 0.4
          }
        });
      } catch (err) {
        console.error('Error adding contour layers:', err);
      }
    }
    
    // Add hillshade layer if not already added
    if (!map.getLayer(TOPO_LAYERS.HILLSHADE) && !map.getSource('hillshade')) {
      try {
        map.addSource('hillshade', {
          type: 'raster',
          url: 'mapbox://mapbox.terrain-rgb'
        });
        
        map.addLayer({
          'id': TOPO_LAYERS.HILLSHADE,
          'type': 'raster',
          'source': 'hillshade',
          'layout': {
            'visibility': 'none' // Initially hidden
          },
          'paint': {
            'raster-opacity': 0.3
          }
        });
      } catch (err) {
        console.error('Error adding hillshade layer:', err);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error initializing layers:', err);
    return false;
  }
};
