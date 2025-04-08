
import React, { memo, useEffect } from 'react';
import { toast } from 'sonner';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useMapValidation } from './hooks/useMapValidation';
import { useMapLocation } from './hooks/useMapLocation';
import MapTokenInput from './token-input';
import MapErrorDisplay from './MapErrorDisplay';
import MapContainer from './MapContainer';
import { MAPBOX_CONFIG } from '@/config/env';

interface MapInitializerProps {
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  onMapClick?: () => void;
  initialCenter?: [number, number];
}

const MapInitializer = ({
  startLocation,
  endLocation,
  waypoints = [],
  onMapClick,
  initialCenter
}: MapInitializerProps) => {
  // Check for environment token on first render
  useEffect(() => {
    if (MAPBOX_CONFIG.accessToken) {
      console.log('Found Mapbox token in environment variables');
    }
  }, []);

  // Initialize map with improved error handling
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

  // Validate token
  const { isValidatingToken } = useMapValidation();

  // Handle map locations and routes only when map is ready
  const { isLocationUpdating } = useMapLocation({
    map,
    startLocation,
    endLocation,
    waypoints,
    isLoading: isLoading || isValidatingToken,
    error
  });

  // Show combined loading state
  const showLoading = isLoading || isValidatingToken || isLocationUpdating;

  // Render token input if no token
  if (!hasToken) {
    return <MapTokenInput onTokenSave={handleTokenSave} />;
  }

  // Render error display if error
  if (error) {
    return <MapErrorDisplay error={error} onResetToken={handleResetToken} />;
  }

  // Render map container
  return (
    <MapContainer
      isLoading={showLoading}
      mapContainerRef={mapContainer}
      onMapClick={handleMapClick}
    />
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MapInitializer);
