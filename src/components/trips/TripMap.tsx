
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
  const { location } = useUserLocation();
  
  // Prioritize passed userLocation over useUserLocation hook
  // Ensure we explicitly create a tuple type with 2 elements
  const initialCenter: [number, number] | undefined = userLocation 
    ? [userLocation.longitude, userLocation.latitude] 
    : location 
      ? [location.longitude, location.latitude] 
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
      initialCenter
    });
  }, [hasToken, isLoading, error, map, startLocation, endLocation, waypoints, isValidatingToken, location, userLocation, initialCenter]);

  // Use the locations hook to manage map locations and routes
  useMapLocations({
    map,
    startLocation,
    endLocation,
    waypoints,
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
