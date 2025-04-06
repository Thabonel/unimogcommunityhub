
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapLocations } from './map/hooks/useMapLocations';
import MapTokenInput from './map/token-input';
import MapErrorDisplay from './map/MapErrorDisplay';
import MapContainer from './map/MapContainer';
import { useMapInitialization } from './map/useMapInitialization';
import { useEffect, useState } from 'react';
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
  
  // Helper function to create a valid tuple
  const createLocationTuple = (lat: number, lng: number): [number, number] => {
    return [lng, lat];
  };
  
  // Determine initial center with proper typing
  // First priority: explicit userLocation prop
  // Second priority: location from user profile
  // No default fallback - let the map component handle it
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

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (hasToken) {
        setIsValidatingToken(true);
        try {
          const isValid = await validateMapboxToken();
          if (!isValid) {
            console.warn('Mapbox token validation failed. Map may not display correctly.');
            toast.warning('Your Mapbox token may be invalid. Map functionality might be limited.');
          }
        } catch (err) {
          console.error('Error validating token:', err);
        } finally {
          setIsValidatingToken(false);
        }
      }
    };
    
    validateToken();
  }, [hasToken]);

  // Add debugging logs
  useEffect(() => {
    console.log('TripMap rendering with:', { 
      hasToken, 
      isLoading, 
      error, 
      mapExists: !!map,
      startLocation,
      endLocation,
      waypoints,
      tokenCheck: hasMapboxToken(),
      isValidatingToken,
      userLocation,
      hookLocation: location,
      initialCenter,
      isLocationLoading
    });
  }, [hasToken, isLoading, error, map, startLocation, endLocation, waypoints, isValidatingToken, location, userLocation, initialCenter, isLocationLoading]);

  // Use the locations hook to manage map locations and routes
  useMapLocations({
    map,
    startLocation,
    endLocation,
    waypoints,
    isLoading: isLoading || isValidatingToken || isLocationLoading,
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
      isLoading={isLoading || isValidatingToken || isLocationLoading} 
      mapContainerRef={mapContainer} 
      onMapClick={handleMapClick}
    />
  );
};

export default TripMap;
