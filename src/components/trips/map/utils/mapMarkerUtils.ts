
import mapboxgl from 'mapbox-gl';
import { addStartMarker, addEndMarker } from '../createMapMarkers';

/**
 * Clear existing markers from the map
 */
export const clearMapMarkers = (map: mapboxgl.Map): void => {
  const existingStartMarker = document.getElementById('start-marker');
  if (existingStartMarker) existingStartMarker.remove();
  
  const existingEndMarker = document.getElementById('end-marker');
  if (existingEndMarker) existingEndMarker.remove();
};

/**
 * Add location markers to the map
 */
export const addLocationMarkers = (
  map: mapboxgl.Map,
  startLocation: string | undefined, 
  startCoords: [number, number],
  endLocation: string | undefined,
  endCoords: [number, number]
): void => {
  // Add markers for start and end if we have coordinates
  if (startLocation) {
    addStartMarker(map, startLocation, startCoords);
  }
  
  if (endLocation) {
    addEndMarker(map, endLocation, endCoords);
  }
};
