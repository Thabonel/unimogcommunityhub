
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { clearMapMarkers, addLocationMarkers } from '../utils/mapMarkerUtils';

/**
 * Hook to manage map markers
 */
export const useMapMarkers = () => {
  
  // Add markers for locations
  const updateMapMarkers = useCallback((
    map: mapboxgl.Map | null,
    startLocation: string | undefined,
    startCoords: [number, number] | null,
    endLocation: string | undefined,
    endCoords: [number, number] | null
  ) => {
    if (!map) return;
    
    // Clear existing markers
    clearMapMarkers(map);
    
    // Add markers if we have coordinates
    if (startLocation && startCoords) {
      addLocationMarkers(map, startLocation, startCoords, endLocation, endCoords || undefined);
    }
  }, []);
  
  return { updateMapMarkers };
};
