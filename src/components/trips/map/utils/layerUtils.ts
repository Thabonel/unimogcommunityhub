
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
    // First check if the map is actually loaded
    if (!map.loaded()) {
      console.log('Map not fully loaded yet, will try to add DEM source anyway');
    }

    // Check if the source already exists to avoid errors
    if (!map.getSource('mapbox-dem')) {
      console.log('Adding mapbox-dem source');
      
      // Try to add the source even if map is not fully loaded
      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      
      console.log('Added mapbox-dem source successfully');
      return true;
    } else {
      console.log('mapbox-dem source already exists');
      return true;
    }
  } catch (error) {
    console.error('Error adding mapbox-dem source:', error);
    return false;
  }
};

// Add DEM source and enable terrain
export const addTopographicalLayers = (map: mapboxgl.Map): void => {
  if (!map) {
    console.log('Map is null, cannot add topographical layers');
    return;
  }

  try {
    // First ensure the DEM source exists
    const sourceAdded = addDemSource(map);
    if (!sourceAdded) {
      console.warn('Could not add DEM source, skipping topographical layers');
      return;
    }

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
      } catch (error) {
        console.error('Error adding contour lines layer:', error);
      }
    }
  } catch (error) {
    console.error('Error setting up topographical layers:', error);
  }
};

// Toggle layer visibility with better error handling and source creation
export const toggleLayerVisibility = (map: mapboxgl.Map, layerId: string): boolean => {
  if (!map) {
    console.log('Map is null, cannot toggle layer visibility');
    return false;
  }

  try {
    // Special handling for layers that may require sources
    if (layerId === TOPO_LAYERS.HILLSHADE) {
      // Ensure source exists for hillshade
      if (!addDemSource(map)) {
        console.error('Cannot toggle hillshade: Failed to add DEM source');
        return false;
      }
    }
    
    if (!map.getLayer(layerId)) {
      // Layer doesn't exist yet, create it
      if (layerId === TOPO_LAYERS.HILLSHADE) {
        map.addLayer({
          id: TOPO_LAYERS.HILLSHADE,
          type: 'hillshade',
          source: 'mapbox-dem',
          layout: { visibility: 'visible' },
          paint: {
            'hillshade-illumination-anchor': 'viewport',
            'hillshade-exaggeration': 0.5
          }
        }, 'waterway-label');
        return true;
      } else if (layerId === TOPO_LAYERS.CONTOUR) {
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
            visibility: 'visible'
          },
          paint: {
            'line-color': '#8c8c8c',
            'line-width': 1
          }
        }, 'waterway-label');
        return true;
      }
      return false;
    }
    
    // Layer exists, toggle visibility
    const visibility = map.getLayoutProperty(layerId, 'visibility');
    const newVisibility = visibility === 'visible' ? 'none' : 'visible';
    map.setLayoutProperty(layerId, 'visibility', newVisibility);
    
    console.log(`Layer ${layerId} visibility set to: ${newVisibility}`);
    return newVisibility === 'visible';
  } catch (error) {
    console.error(`Error toggling ${layerId} visibility:`, error);
    return false;
  }
};
