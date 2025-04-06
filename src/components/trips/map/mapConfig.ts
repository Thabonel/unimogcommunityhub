
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
  TERRAIN: 'mapbox://styles/mapbox/terrain-v2'
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

// Add DEM source and enable terrain
export const addTopographicalLayers = (map: mapboxgl.Map): void => {
  // Skip if already added
  if (map.getSource('mapbox-dem')) return;

  try {
    // Add DEM source for terrain
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });
  } catch (error) {
    console.error('Error adding DEM source:', error);
  }
};

// Toggle layer visibility
export const toggleLayerVisibility = (map: mapboxgl.Map, layerId: string): boolean => {
  try {
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
        });
        return true;
      } else if (layerId === TOPO_LAYERS.CONTOUR) {
        map.addLayer({
          id: TOPO_LAYERS.CONTOUR,
          type: 'line',
          source: 'mapbox-dem',
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
        });
        return true;
      }
      return false;
    }
    
    // Layer exists, toggle visibility
    const visibility = map.getLayoutProperty(layerId, 'visibility');
    const newVisibility = visibility === 'visible' ? 'none' : 'visible';
    map.setLayoutProperty(layerId, 'visibility', newVisibility);
    
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
