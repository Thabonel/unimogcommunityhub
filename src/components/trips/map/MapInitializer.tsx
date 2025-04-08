
import React, { memo } from 'react';
import { toast } from 'sonner';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useMapValidation } from './hooks/useMapValidation';
import { useMapLocation } from './hooks/useMapLocation';
import MapTokenInput from './token-input';
import MapErrorDisplay from './MapErrorDisplay';
import MapContainer from './MapContainer';

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
  // Initialize map
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

  // Handle map locations and routes
  useMapLocation({
    map,
    startLocation,
    endLocation,
    waypoints,
    isLoading: isLoading || isValidatingToken,
    error
  });

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
      isLoading={isLoading || isValidatingToken}
      mapContainerRef={mapContainer}
      onMapClick={handleMapClick}
    />
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MapInitializer);
