
import mapboxgl from 'mapbox-gl';

// Define topo layer IDs
export const TOPO_LAYERS = {
  TERRAIN: 'terrain-3d',
  HILLSHADE: 'hillshading',
  CONTOUR: 'contour-lines',
};

/**
 * Add DEM source to map for terrain
 */
export const addDemSource = (map: mapboxgl.Map): void => {
  if (!map) return;
  
  // Add DEM source if it doesn't exist
  if (!map.getSource('mapbox-dem')) {
    try {
      map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      console.log('DEM source added successfully');
    } catch (err) {
      console.error('Error adding DEM source:', err);
    }
  }
};

/**
 * Add topographical layers to the map
 */
export const addTopographicalLayers = (map: mapboxgl.Map): void => {
  if (!map) return;
  
  // Make sure the DEM source exists
  addDemSource(map);
  
  // Add terrain layer if it doesn't exist
  if (!map.getLayer(TOPO_LAYERS.TERRAIN)) {
    try {
      map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      console.log('Terrain added successfully');
    } catch (err) {
      console.error('Error adding terrain:', err);
    }
  }
  
  // Add hillshade layer if it doesn't exist
  if (!map.getLayer(TOPO_LAYERS.HILLSHADE)) {
    try {
      map.addLayer({
        'id': TOPO_LAYERS.HILLSHADE,
        'source': 'mapbox-dem',
        'type': 'hillshade',
        'layout': { 'visibility': 'visible' },
        'paint': {
          'hillshade-illumination-direction': 315,
          'hillshade-shadow-color': 'rgba(0, 0, 0, 0.25)',
          'hillshade-highlight-color': 'rgba(255, 255, 255, 0.15)',
          'hillshade-accent-color': 'rgba(0, 0, 0, 0.1)'
        }
      });
      console.log('Hillshade layer added successfully');
    } catch (err) {
      console.error('Error adding hillshade layer:', err);
    }
  }
  
  // Add contour lines if they don't exist
  if (!map.getLayer(TOPO_LAYERS.CONTOUR)) {
    try {
      map.addLayer({
        'id': TOPO_LAYERS.CONTOUR,
        'type': 'line',
        'source': {
          'type': 'vector',
          'url': 'mapbox://mapbox.mapbox-terrain-v2'
        },
        'source-layer': 'contour',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        'paint': {
          'line-color': '#8c7c7a',
          'line-width': 1,
          'line-opacity': 0.5
        }
      });
      console.log('Contour layer added successfully');
    } catch (err) {
      console.error('Error adding contour layer:', err);
    }
  }
};

/**
 * Toggle visibility of a layer
 */
export const toggleLayerVisibility = (map: mapboxgl.Map, layerId: string): boolean => {
  if (!map || !map.getLayer(layerId)) return false;
  
  const visibility = map.getLayoutProperty(layerId, 'visibility');
  const isVisible = visibility !== 'none';
  
  map.setLayoutProperty(
    layerId,
    'visibility',
    isVisible ? 'none' : 'visible'
  );
  
  return !isVisible;
};
