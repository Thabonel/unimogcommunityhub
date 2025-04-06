import mapboxgl from 'mapbox-gl';

// Define topographical layers
export const TOPO_LAYERS = {
  HILLSHADE: 'hillshade',
  CONTOUR: 'contour-lines',
  TERRAIN_3D: 'terrain-3d'
};

// Safely add the DEM source if it doesn't exist
export const addDemSource = (map: mapboxgl.Map): boolean => {
  if (!map) {
    console.log('Map is null, cannot add DEM source');
    return false;
  }

  try {
    // Check if the map is actually loaded
    if (!map.isStyleLoaded()) {
      console.log('Map style not fully loaded yet, cannot add DEM source');
      return false;
    }

    // Check if the source already exists to avoid errors
    if (!map.getSource('mapbox-dem')) {
      console.log('Adding mapbox-dem source');
      
      try {
        // Add the source
        map.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        
        console.log('Added mapbox-dem source successfully');
        return true;
      } catch (err) {
        console.error('Error adding DEM source:', err);
        return false;
      }
    } else {
      console.log('mapbox-dem source already exists');
      return true;
    }
  } catch (error) {
    console.error('Error adding mapbox-dem source:', error);
    return false;
  }
};

// Add topographical layers with better error handling
export const addTopographicalLayers = (map: mapboxgl.Map): boolean => {
  if (!map) {
    console.log('Map is null, cannot add topographical layers');
    return false;
  }

  try {
    // Ensure the map style is loaded
    if (!map.isStyleLoaded()) {
      console.log('Map style not fully loaded, cannot add topo layers');
      return false;
    }

    // First ensure the DEM source exists
    const sourceAdded = addDemSource(map);
    if (!sourceAdded) {
      console.warn('Could not add DEM source, skipping topographical layers');
      return false;
    }

    let layersAdded = false;

    // Add hillshade layer if it doesn't exist
    if (!map.getLayer(TOPO_LAYERS.HILLSHADE)) {
      try {
        map.addLayer({
          id: TOPO_LAYERS.HILLSHADE,
          type: 'hillshade',
          source: 'mapbox-dem',
          layout: { visibility: 'none' }, // Start hidden
          paint: {
            'hillshade-illumination-anchor': 'viewport',
            'hillshade-exaggeration': 0.5
          }
        }, 'waterway-label'); // Insert before labels for better visibility

        console.log('Added hillshade layer successfully');
        layersAdded = true;
      } catch (error) {
        console.error('Error adding hillshade layer:', error);
      }
    }

    // Add contour lines layer if it doesn't exist
    if (!map.getLayer(TOPO_LAYERS.CONTOUR)) {
      try {
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
            visibility: 'none' // Start hidden
          },
          paint: {
            'line-color': '#8c8c8c',
            'line-width': 1
          }
        }, 'waterway-label'); // Insert before labels

        console.log('Added contour lines layer successfully');
        layersAdded = true;
      } catch (error) {
        console.error('Error adding contour lines layer:', error);
      }
    }

    return layersAdded;
  } catch (error) {
    console.error('Error setting up topographical layers:', error);
    return false;
  }
};

// Improved layer toggle function with better error handling
export const toggleLayerVisibility = (map: mapboxgl.Map, layerId: string): boolean => {
  if (!map) {
    console.log('Map is null, cannot toggle layer visibility');
    return false;
  }

  try {
    if (!map.isStyleLoaded()) {
      console.log('Map style not fully loaded, cannot toggle layer');
      return false;
    }
    
    // Ensure the DEM source exists for hillshade and contour layers
    if ((layerId === TOPO_LAYERS.HILLSHADE || layerId === TOPO_LAYERS.CONTOUR) && !map.getSource('mapbox-dem')) {
      console.log(`Cannot toggle ${layerId}: DEM source missing, attempting to add`);
      const added = addDemSource(map);
      if (!added) {
        console.error(`Failed to add DEM source for ${layerId}`);
        return false;
      }
    }
    
    // For hillshade and contour layers
    // Check if the layer exists, if not, try to create topographical layers
    if (!map.getLayer(layerId)) {
      console.log(`Layer ${layerId} not found, trying to create topographical layers`);
      addTopographicalLayers(map);
      
      // Check again after attempting to add
      if (!map.getLayer(layerId)) {
        console.error(`Layer ${layerId} still doesn't exist after attempted creation`);
        return false;
      }
    }
    
    // Layer exists, toggle visibility
    let visibility;
    try {
      visibility = map.getLayoutProperty(layerId, 'visibility');
    } catch (err) {
      console.error(`Error checking visibility for ${layerId}:`, err);
      // Assume it's not visible
      visibility = 'none';
    }
    
    const newVisibility = visibility === 'visible' ? 'none' : 'visible';
    
    try {
      map.setLayoutProperty(layerId, 'visibility', newVisibility);
      console.log(`Layer ${layerId} visibility set to: ${newVisibility}`);
      return newVisibility === 'visible';
    } catch (err) {
      console.error(`Error setting visibility for ${layerId}:`, err);
      return false;
    }
  } catch (error) {
    console.error(`Error toggling ${layerId} visibility:`, error);
    return false;
  }
};
