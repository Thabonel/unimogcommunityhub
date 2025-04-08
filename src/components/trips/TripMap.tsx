
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapLocations } from './map/hooks/useMapLocations';
import MapTokenInput from './map/token-input';
import MapErrorDisplay from './map/MapErrorDisplay';
import MapContainer from './map/MapContainer';
import { useMapInitialization } from './map/useMapInitialization';
import { useEffect, useState, useRef } from 'react';
import { hasMapboxToken, validateMapboxToken } from './map/mapConfig';
import { toast } from 'sonner';
import { useUserLocation } from '@/hooks/use-user-location';

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
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const { location, isLoading: isLocationLoading } = useUserLocation();
  const prevPropsRef = useRef({ startLocation, endLocation, waypoints });
  
  // Helper function to create a valid tuple
  const createLocationTuple = (lat: number, lng: number): [number, number] => {
    return [lng, lat];
  };
  
  // Determine initial center with proper typing
  const initialCenter: [number, number] | undefined = userLocation 
    ? createLocationTuple(userLocation.latitude, userLocation.longitude)
    : location 
      ? createLocationTuple(location.latitude, location.longitude) 
      : undefined;
  
  const {
    mapContainer,
    map,
    isLoading,
    error,
    hasToken,
    handleTokenSave,
    handleResetToken,
    handleMapClick
  } = useMapInitialization({ 
    onMapClick,
    initialCenter
  });

  // Validate token on component mount only once
  useEffect(() => {
    let isMounted = true;
    
    const validateToken = async () => {
      if (hasToken && isMounted) {
        setIsValidatingToken(true);
        try {
          const isValid = await validateMapboxToken();
          if (!isValid && isMounted) {
            console.warn('Mapbox token validation failed. Map may not display correctly.');
            toast.warning('Your Mapbox token may be invalid. Map functionality might be limited.');
          }
        } catch (err) {
          console.error('Error validating token:', err);
        } finally {
          if (isMounted) setIsValidatingToken(false);
        }
      }
    };
    
    validateToken();
    
    return () => {
      isMounted = false;
    };
  }, [hasToken]);

  // Memoize inputs to useMapLocations to prevent infinite re-renders
  useEffect(() => {
    prevPropsRef.current = { startLocation, endLocation, waypoints };
  }, [startLocation, endLocation, waypoints]);

  // Use the locations hook to manage map locations and routes
  useMapLocations({
    map,
    startLocation: prevPropsRef.current.startLocation,
    endLocation: prevPropsRef.current.endLocation,
    waypoints: prevPropsRef.current.waypoints,
    isLoading: isLoading || isValidatingToken,
    error
  });
  
  if (!hasToken) {
    return <MapTokenInput onTokenSave={handleTokenSave} />;
  }
  
  if (error) {
    return <MapErrorDisplay error={error} onResetToken={handleResetToken} />;
  }
  
  return (
    <MapContainer 
      isLoading={isLoading || isValidatingToken} 
      mapContainerRef={mapContainer} 
      onMapClick={handleMapClick}
    />
  );
};

export default TripMap;
