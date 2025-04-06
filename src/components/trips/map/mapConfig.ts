
import mapboxgl from 'mapbox-gl';
import { MAPBOX_CONFIG } from '@/config/env';
import { isTokenFormatValid, getActiveToken, testMapboxToken } from './utils/tokenUtils';

/**
 * Available map styles
 */
export const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v11',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12',
  TERRAIN: 'mapbox://styles/mapbox/terrain-v2',
  LIGHT: 'mapbox://styles/mapbox/light-v11',
  DARK: 'mapbox://styles/mapbox/dark-v11',
};

/**
 * Available map layers for topographical data
 */
export const TOPO_LAYERS = {
  TERRAIN_3D: 'terrain-3d',
  HILLSHADE: 'hillshade',
  CONTOUR: 'contour',
  ELEVATION: 'elevation',
};

/**
 * Check if a Mapbox token is available
 */
export const hasMapboxToken = (): boolean => {
  return !!localStorage.getItem('mapbox-token') || !!MAPBOX_CONFIG.accessToken;
};

/**
 * Get the Mapbox token from localStorage or env
 */
export const getMapboxToken = (): string | null => {
  return getActiveToken();
};

/**
 * Save a Mapbox token to localStorage
 */
export const saveMapboxToken = (token: string): void => {
  localStorage.setItem('mapbox-token', token);
};

/**
 * Clear the saved Mapbox token
 */
export const clearMapboxToken = (): void => {
  localStorage.removeItem('mapbox-token');
};

/**
 * Validate a Mapbox token by making a test request
 */
export const validateMapboxToken = async (token?: string): Promise<boolean> => {
  const tokenToValidate = token || getMapboxToken();
  
  if (!tokenToValidate) return false;
  
  return await testMapboxToken(tokenToValidate);
};

/**
 * Add topographical layers to the map
 */
export const addTopographicalLayers = (map: mapboxgl.Map): void => {
  // Only add layers if they don't already exist
  if (map.getSource('mapbox-dem')) return;
  
  try {
    // Add terrain elevation data source
    map.addSource('mapbox-dem', {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
      'tileSize': 512,
      'maxzoom': 14
    });
    
    // Set terrain with elevation data
    map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    
    // Add hillshade layer
    map.addLayer({
      'id': TOPO_LAYERS.HILLSHADE,
      'type': 'hillshade',
      'source': 'mapbox-dem',
      'layout': { 'visibility': 'none' },
      'paint': {
        'hillshade-shadow-color': '#000000',
        'hillshade-highlight-color': '#FFFFFF',
        'hillshade-accent-color': '#FFFFFF',
        'hillshade-illumination-direction': 270,
        'hillshade-exaggeration': 0.5
      }
    });
    
    // Add contour lines
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
        'visibility': 'none',
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#8a7343',
        'line-width': 1,
        'line-opacity': 0.6
      }
    });
    
    console.log('Topographical layers added successfully');
  } catch (error) {
    console.error('Error adding topographical layers:', error);
  }
};

/**
 * Toggle visibility of a specific layer
 */
export const toggleLayerVisibility = (map: mapboxgl.Map, layerId: string): boolean => {
  if (!map) return false;
  
  const visibility = map.getLayoutProperty(layerId, 'visibility');
  const isVisible = visibility !== 'none';
  
  map.setLayoutProperty(
    layerId,
    'visibility',
    isVisible ? 'none' : 'visible'
  );
  
  return !isVisible;
};

/**
 * Makes the map fly to a specific location
 */
export const flyToLocation = (map: mapboxgl.Map, coordinates: [number, number], zoom?: number): void => {
  if (!map) return;
  
  map.flyTo({
    center: coordinates,
    zoom: zoom || map.getZoom(),
    essential: true // Animation will happen even if user has "prefers-reduced-motion" enabled
  });
};

/**
 * Fits the map view to include all provided coordinates
 */
export const fitMapToBounds = (map: mapboxgl.Map, coordinates: [number, number][]): void => {
  if (!map || coordinates.length === 0) return;
  
  const bounds = new mapboxgl.LngLatBounds();
  
  // Add each coordinate to the bounds
  coordinates.forEach(coord => {
    bounds.extend(coord);
  });
  
  // Fit the map to the bounds with padding
  map.fitBounds(bounds, {
    padding: 50, // Add padding around the bounds
    maxZoom: 15, // Don't zoom in too far
    duration: 1000 // Animation duration in milliseconds
  });
};
