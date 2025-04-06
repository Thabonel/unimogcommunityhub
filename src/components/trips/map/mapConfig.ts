import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/config/env';

// Define map styles enum
export const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v11',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11',
  TERRAIN: 'mapbox://styles/mapbox/outdoors-v12' // Changed from terrain-v2 which is causing 404 errors
};

// Define topographical layers
export const TOPO_LAYERS = {
  HILLSHADE: 'hillshade',
  CONTOUR: 'contour-lines',
  TERRAIN_3D: 'terrain-3d'
};

// Get the active Mapbox token, either from environment or local storage
export const getMapboxToken = (): string | null => {
  return localStorage.getItem('mapbox-token') || MAPBOX_CONFIG.accessToken || null;
};

// Check if token exists
export const hasMapboxToken = (): boolean => {
  return !!getMapboxToken();
};

// Validate token format (simple check)
export const isValidTokenFormat = (token: string): boolean => {
  return /^pk\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/.test(token);
};

// Validate token with Mapbox API
export const validateMapboxToken = async (token?: string): Promise<boolean> => {
  const tokenToValidate = token || getMapboxToken();
  
  if (!tokenToValidate) return false;
  
  try {
    // Try to fetch a simple style to validate the token
    const response = await fetch(
      `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${tokenToValidate}`
    );
    
    return response.status === 200;
  } catch (error) {
    console.error('Error validating Mapbox token:', error);
    return false;
  }
};

// Safely add the DEM source if it doesn't exist
export const addDemSource = (map: mapboxgl.Map): boolean => {
  if (!map || !map.loaded()) {
    console.log('Map not loaded yet, cannot add DEM source');
    return false;
  }

  try {
    // Check if the source already exists to avoid errors
    if (!map.getSource('mapbox-dem')) {
      console.log('Adding mapbox-dem source');
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
  if (!map || !map.loaded()) {
    console.log('Map not loaded yet, cannot add topographical layers');
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

// Safe way to enable 3D terrain that doesn't throw errors
export const enableTerrain = (map: mapboxgl.Map): boolean => {
  if (!map || !map.loaded()) {
    console.log('Map not loaded yet, cannot enable terrain');
    return false;
  }

  try {
    // First ensure the DEM source exists
    const sourceAdded = addDemSource(map);
    if (!sourceAdded) {
      console.warn('Could not add DEM source, cannot enable terrain');
      return false;
    }

    // Enable terrain with exaggeration
    map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
    console.log('Terrain enabled successfully');
    return true;
  } catch (error) {
    console.error('Error enabling terrain:', error);
    return false;
  }
};

// Safe way to disable 3D terrain that doesn't throw errors
export const disableTerrain = (map: mapboxgl.Map): boolean => {
  if (!map || !map.loaded()) {
    console.log('Map not loaded yet, cannot disable terrain');
    return false;
  }

  try {
    map.setTerrain(null);
    console.log('Terrain disabled successfully');
    return true;
  } catch (error) {
    console.error('Error disabling terrain:', error);
    return false;
  }
};

// Toggle layer visibility with better error handling and source creation
export const toggleLayerVisibility = (map: mapboxgl.Map, layerId: string): boolean => {
  if (!map || !map.loaded()) {
    console.log('Map not loaded yet, cannot toggle layer visibility');
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

// Fit map to bounds with padding
export const fitMapToBounds = (
  map: mapboxgl.Map, 
  coordinates: [number, number][], 
  padding: number = 100
): void => {
  try {
    const bounds = new mapboxgl.LngLatBounds();
    
    coordinates.forEach(coord => {
      bounds.extend(coord);
    });
    
    map.fitBounds(bounds, { padding });
  } catch (error) {
    console.error('Error fitting map to bounds:', error);
  }
};

// Fly to a specific location
export const flyToLocation = (
  map: mapboxgl.Map, 
  coordinates: [number, number], 
  zoom: number = 12
): void => {
  try {
    map.flyTo({
      center: coordinates,
      zoom,
      essential: true
    });
  } catch (error) {
    console.error('Error flying to location:', error);
  }
};
