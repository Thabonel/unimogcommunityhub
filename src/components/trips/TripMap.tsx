
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import { hasMapboxToken, validateMapboxToken } from './map/mapConfig';
import { useUserLocation } from '@/hooks/use-user-location';
import { useMapInitialization } from './map/useMapInitialization';
import MapTokenInput from './map/token-input';
import MapErrorDisplay from './map/MapErrorDisplay';
import MapContainer from './map/MapContainer';
import { useMapLocations } from './map/useMapLocations';

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
  const mapInitializedRef = useRef(false);
  const didValidateTokenRef = useRef(false);
  
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
    initialCenter,
    enableTerrain: true
  });

  // Validate token on component mount only once
  useEffect(() => {
    let isMounted = true;
    
    const validateToken = async () => {
      if (hasToken && isMounted && !didValidateTokenRef.current) {
        didValidateTokenRef.current = true;
        setIsValidatingToken(true);
        try {
          const isValid = await validateMapboxToken();
          if (!isValid && isMounted) {
            console.warn('Mapbox token validation failed. Map may not display correctly.');
            toast.warning('Your Mapbox token may be invalid. Map functionality might be limited.');
          }
          if (isMounted) {
            mapInitializedRef.current = true;
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

  // Update props ref when props change to prevent unnecessary re-renders
  useEffect(() => {
    prevPropsRef.current = { startLocation, endLocation, waypoints };
  }, [startLocation, endLocation, waypoints]);

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
