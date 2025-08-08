
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

interface UseMapLocationProps {
  map: mapboxgl.Map | null;
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  isLoading?: boolean;
  error?: string | null;
}

export const useMapLocation = ({
  map,
  startLocation,
  endLocation,
  waypoints = [],
  isLoading,
  error
}: UseMapLocationProps) => {
  const [isLocationUpdating, setIsLocationUpdating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Clear routes and markers
  const handleClearRoute = () => {
    if (!map) return;
    
    // Remove markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Remove map layers and sources
    if (map.getLayer('route-line')) {
      map.removeLayer('route-line');
    }
    
    if (map.getLayer('route-line-casing')) {
      map.removeLayer('route-line-casing');
    }
    
    if (map.getSource('route')) {
      map.removeSource('route');
    }
  };
  
  // Update map when locations change
  useEffect(() => {
    if (!map || isLoading || error) return;
    
    const fetchGeocode = async () => {
      // Implementation would go here
      // For now this is just a stub
    };
    
    if (startLocation || endLocation) {
      setIsLocationUpdating(true);
      fetchGeocode()
        .catch(err => {
          console.error('Error geocoding locations:', err);
          setLocationError('Failed to load location data');
        })
        .finally(() => {
          setIsLocationUpdating(false);
        });
    }
  }, [map, startLocation, endLocation, waypoints, isLoading, error]);
  
  return {
    isLocationUpdating,
    locationError,
    handleClearRoute
  };
};
