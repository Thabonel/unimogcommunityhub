
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { clearMapMarkers, addLocationMarkers } from '../utils/mapMarkerUtils';
import { TripCardProps } from '../../TripCard';

/**
 * Hook to manage map markers
 */
export const useMapMarkers = (
  map: mapboxgl.Map | null = null,
  trips: TripCardProps[] = [],
  activeTrip: string | null = null,
  onTripSelect?: (trip: TripCardProps) => void,
  mapLoaded: boolean = false
) => {
  
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
  
  // Fly to a trip location
  const flyToTrip = useCallback((trip: TripCardProps) => {
    if (!map || !trip.startLocation) return;
    
    try {
      // Parse coordinates from string
      const coords = trip.startLocation.split(',').map(Number);
      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        map.flyTo({
          center: [coords[1], coords[0]], // [lng, lat]
          zoom: 10,
          essential: true
        });
      }
    } catch (err) {
      console.error('Error flying to location:', err);
    }
  }, [map]);
  
  return { updateMapMarkers, flyToTrip };
};
