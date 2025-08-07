import React, { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useMapValidation } from './hooks/useMapValidation';
import { useMapLocation } from './hooks/useMapLocation';
import MapTokenInput from './token-input/MapTokenInput';
import MapErrorDisplay from './MapErrorDisplay';
import MapContainer from './MapContainer';
import { MAPBOX_CONFIG } from '@/config/env';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MapInitializerProps {
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  onMapClick?: () => void;
  initialCenter?: [number, number];
  enableTerrain?: boolean;
  onMapReady?: (map: mapboxgl.Map | null) => void;
}

const MapInitializer = ({
  startLocation,
  endLocation,
  waypoints = [],
  onMapClick,
  initialCenter = [0, 0], // Default center if none provided
  enableTerrain = false,  // Default to false to avoid terrain-related errors
  onMapReady
}: MapInitializerProps) => {
  const [retryCount, setRetryCount] = useState(0);
  
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
    isLoading: mapLoading,
    error: mapError,
    hasToken,
    handleTokenSave,
    handleResetToken,
    handleMapClick
  } = useMapInitialization({
    onMapClick,
    initialCenter,
    enableTerrain
  });

  // Retry initialization if it fails
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Validate token
  const { isValidatingToken } = useMapValidation();

  // Handle map locations and routes only when map is ready
  const { isLocationUpdating } = useMapLocation({
    map,
    startLocation,
    endLocation,
    waypoints,
    isLoading: mapLoading || isValidatingToken,
    error: mapError
  });

  // Notify parent when map is ready
  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  // Combined error state
  const error = mapError;

  // Show combined loading state
  const isLoading = mapLoading || isValidatingToken || isLocationUpdating;

  // Render token input if no token
  if (!hasToken) {
    return <MapTokenInput onTokenSave={handleTokenSave} />;
  }

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* Overlay loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 z-10 flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">
            {isValidatingToken ? 'Validating map token...' : 
             mapLoading ? 'Initializing map...' : 
             'Loading route data...'}
          </p>
        </div>
      )}
      
      {/* Error message */}
      {error && !isLoading && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription className="flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={handleRetry}
                className="text-xs underline hover:text-destructive-foreground"
              >
                Retry
              </button>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Main map container */}
      <MapContainer
        mapContainerRef={mapContainer}
        onMapClick={handleMapClick}
        isLoading={isLoading}
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MapInitializer);