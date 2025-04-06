
import React, { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG } from '@/config/env';
import { useUserLocation } from '@/hooks/use-user-location';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MapComponentProps {
  className?: string;
  height?: string;
  width?: string;
  showControls?: boolean;
}

const MapComponent = ({
  className,
  height = '600px',
  width = '100%',
  showControls = true
}: MapComponentProps) => {
  const mapboxToken = MAPBOX_CONFIG.accessToken;
  const { location, isLoading } = useUserLocation();
  
  const [viewport, setViewport] = useState({
    longitude: 9.1829, // Stuttgart, Germany as default
    latitude: 48.7758,
    zoom: 4
  });
  
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
    <div className={cn("rounded-lg overflow-hidden", className)} style={{ width, height }}>
      <Map
        initialViewState={viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapboxToken}
        onMove={(evt) => setViewport(evt.viewState)}
        attributionControl={showControls}
        navigationControl={showControls}
      >
        {location && (
          <Marker 
            longitude={location.longitude} 
            latitude={location.latitude} 
            color="#FF0000"
          />
        )}
      </Map>
    </div>
  );
};

export default MapComponent;
