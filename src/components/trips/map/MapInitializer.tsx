
import React, { memo, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useMapInitialization } from './hooks/useMapInitialization';
import { useMapValidation } from './hooks/useMapValidation';
import { useMapLocation } from './hooks/useMapLocation';
import MapTokenInput from './MapTokenInput';
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
}

const MapInitializer = ({
  startLocation,
  endLocation,
  waypoints = [],
  onMapClick,
  initialCenter = [0, 0] // Default center if none provided
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
    enableTerrain: true,
    retryCount
  });

  // Retry initialization if it fails
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Validate token
  const { isValidatingToken, error: validationError } = useMapValidation();

  // Handle map locations and routes only when map is ready
  const { 
    isLocationUpdating, 
    locationError,
    handleClearRoute 
  } = useMapLocation({
    map,
    startLocation,
    endLocation,
    waypoints,
    isLoading: mapLoading || isValidatingToken,
    error: mapError || validationError
  });

  // Combined error state
  const error = mapError || validationError || locationError;

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
              <span>{error.message || 'Error loading map'}</span>
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
      />
      
      {/* Map controls */}
      {map && !error && !isLoading && (
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
          <button 
            onClick={handleClearRoute}
            className="bg-white dark:bg-gray-800 p-2 rounded shadow-md text-xs"
          >
            Clear Route
          </button>
        </div>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MapInitializer);
