
import mapboxgl from 'mapbox-gl';

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
 */
export const addDemSource = (map: mapboxgl.Map): void => {
  try {
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });
  } catch (err) {
    console.error('Error adding DEM source:', err);
    // Source might already exist, continue
  }
};

/**
 * Add topographical layers to map
 */
export const addTopographicalLayers = (map: mapboxgl.Map): void => {
  try {
    // Add sky layer
    if (!map.getLayer('sky')) {
      map.addLayer({
        'id': 'sky',
        'type': 'sky',
        'paint': {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15
        }
      });
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
            'line-cap': 'round'
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
    
    map.setTerrain(null);
  } catch (err) {
    console.error('Error removing topographical layers:', err);
  }
};
