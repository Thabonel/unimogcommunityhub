
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Trip } from '@/types/trip';
import { loadTripsOnMap } from '../utils/mapMarkerUtils';

/**
 * Hook to manage map markers for trips
 */
export const useMapMarkerController = () => {
  // Load trips on the map
  const loadTrips = useCallback((map: mapboxgl.Map | null, trips: Trip[] = []) => {
    if (!map || !trips.length) return;
    loadTripsOnMap(map, trips);
  }, []);
  
  return { loadTrips };
};
