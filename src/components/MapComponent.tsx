
import React, { useState, useEffect } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG } from '@/config/env';
import { useUserLocation } from '@/hooks/use-user-location';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { validateAndTestCurrentToken, isTokenFormatValid } from './trips/map/utils/tokenUtils';

interface MapComponentProps {
  className?: string;
  height?: string;
  width?: string;
  showControls?: boolean;
  onMapLoad?: () => void;
}

const MapComponent = ({
  className,
  height = '600px',
  width = '100%',
  showControls = true,
  onMapLoad
}: MapComponentProps) => {
  const mapboxToken = MAPBOX_CONFIG.accessToken;
  const { location, isLoading } = useUserLocation();
  const [testingToken, setTestingToken] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  
  const [viewport, setViewport] = useState({
    longitude: 9.1829, // Stuttgart, Germany as default
    latitude: 48.7758,
    zoom: 4
  });
  
  // Test if the token is valid on mount
  useEffect(() => {
    const checkToken = async () => {
      if (mapboxToken) {
        // Only warn about format, don't block rendering
        if (!isTokenFormatValid(mapboxToken)) {
          console.warn('Mapbox token format appears invalid - should start with pk.*');
        }
      }
    };
    
    checkToken();
  }, [mapboxToken]);
  
  // Update viewport when location changes
  useEffect(() => {
    if (location && location.longitude && location.latitude) {
      setViewport(prev => ({
        ...prev,
        longitude: location.longitude,
        latitude: location.latitude
      }));
    }
  }, [location]);

  // Test the token when requested
  const handleTestToken = async () => {
    setTestingToken(true);
    try {
      const isValid = await validateAndTestCurrentToken();
      setTokenValid(isValid);
    } finally {
      setTestingToken(false);
    }
  };

  if (!mapboxToken) {
    console.error('Mapbox token is missing!');
    return <div className={cn("flex items-center justify-center bg-muted rounded-md", className)} style={{ width, height }}>
      <p className="text-muted-foreground">Mapbox token is missing. Please check your environment variables.</p>
    </div>;
  }

  if (isLoading) {
    return <Skeleton className={cn("rounded-md", className)} style={{ width, height }} />;
  }

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="rounded-lg overflow-hidden" style={{ width, height }}>
        <Map
          initialViewState={viewport}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken={mapboxToken}
          onMove={(evt) => setViewport(evt.viewState)}
          attributionControl={showControls}
          onLoad={() => {
            if (onMapLoad) onMapLoad();
            console.log('Map loaded successfully');
          }}
        >
          {showControls && (
            <NavigationControl position="top-right" />
          )}
          {location && (
            <Marker 
              longitude={location.longitude} 
              latitude={location.latitude} 
              color="#FF0000"
            />
          )}
        </Map>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleTestToken}
          disabled={testingToken}
        >
          {testingToken ? 'Testing...' : 'Test Mapbox Token'}
        </Button>
        
        {tokenValid !== null && (
          <span className={cn(
            "flex items-center text-sm",
            tokenValid ? "text-green-600" : "text-red-600"
          )}>
            {tokenValid ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Token valid
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-1" />
                Token invalid
              </>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
