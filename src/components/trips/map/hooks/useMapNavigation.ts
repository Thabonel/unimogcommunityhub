
import { useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { useUserLocation } from '@/hooks/use-user-location';

interface UseMapNavigationProps {
  map: mapboxgl.Map | null;
  onMapClick?: () => void;
  defaultZoom?: number;
  defaultCenter?: [number, number];
}

/**
 * Hook to handle map navigation and view configuration
 */
export const useMapNavigation = ({
  map,
  onMapClick,
  defaultZoom = 5,
  defaultCenter = [-99.5, 40.0]
}: UseMapNavigationProps) => {
  const { location } = useUserLocation();

  // Configure map view when map and location are available
  useEffect(() => {
    if (!map || map.isMoving()) return;
    
    // Use user location or default center
    const center = location 
      ? [location.longitude, location.latitude] as [number, number] 
      : defaultCenter;
    
    // Fly to initial location with animation
    map.flyTo({
      center,
      zoom: defaultZoom,
      essential: true
    });
    
    // Add map click handler if provided
    if (onMapClick) {
      map.on('click', onMapClick);
    }
    
    // Clean up handlers on unmount
    return () => {
      if (map && onMapClick) {
        map.off('click', onMapClick);
      }
    };
  }, [map, location, defaultCenter, defaultZoom, onMapClick]);

  // Handle map click - use the callback to avoid unnecessary re-renders
  const handleMapClick = useCallback(() => {
    if (onMapClick) onMapClick();
  }, [onMapClick]);

  return {
    handleMapClick
  };
};
