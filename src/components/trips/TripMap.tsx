
import 'mapbox-gl/dist/mapbox-gl.css';
import { useUserLocation } from '@/hooks/use-user-location';
import { useMemo, useCallback, memo } from 'react';
import MapInitializer from './map/MapInitializer';

interface TripMapProps {
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  onMapClick?: () => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

const TripMap = ({ 
  startLocation, 
  endLocation,
  waypoints = [],
  onMapClick,
  userLocation
}: TripMapProps) => {
  const { location, isLoading: isLocationLoading } = useUserLocation();
  
  // Helper function to create a valid tuple
  const createLocationTuple = useCallback((lat: number, lng: number): [number, number] => {
    return [lng, lat];
  }, []);
  
  // Determine initial center with proper typing - only compute this once
  const initialCenter = useMemo(() => {
    if (userLocation) {
      return createLocationTuple(userLocation.latitude, userLocation.longitude);
    } else if (location) {
      return createLocationTuple(location.latitude, location.longitude);
    }
    return undefined;
  }, [userLocation, location, createLocationTuple]);
  
  // Stabilize props with memoization to prevent unnecessary re-renders
  const mapProps = useMemo(() => ({
    startLocation,
    endLocation,
    waypoints,
    onMapClick,
    initialCenter
  }), [startLocation, endLocation, waypoints, onMapClick, initialCenter]);
  
  return <MapInitializer {...mapProps} />;
};

// Memoize to prevent unnecessary re-renders
export default memo(TripMap);
