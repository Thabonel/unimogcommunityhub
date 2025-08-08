
import { useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { flyToLocation } from '../utils/mapNavigationUtils';

interface UseMapNavigationProps {
  map: mapboxgl.Map | null;
  onMapClick?: () => void;
  defaultZoom?: number;
  defaultCenter?: [number, number];
}

/**
 * Hook to handle map navigation and interaction
 */
export const useMapNavigation = ({
  map,
  onMapClick,
  defaultZoom = 5,
  defaultCenter = [-99.5, 40.0]
}: UseMapNavigationProps) => {
  
  // Handle map click
  const handleMapClick = useCallback(() => {
    if (onMapClick) {
      onMapClick();
    }
  }, [onMapClick]);
  
  // Navigate to a specific location
  const navigateTo = useCallback((coordinates: [number, number], zoom?: number) => {
    if (map) {
      flyToLocation(map, coordinates, zoom);
    }
  }, [map]);
  
  // Reset to default view
  const resetView = useCallback(() => {
    if (map) {
      flyToLocation(map, defaultCenter, defaultZoom);
    }
  }, [map, defaultCenter, defaultZoom]);
  
  return {
    handleMapClick,
    navigateTo,
    resetView
  };
};
