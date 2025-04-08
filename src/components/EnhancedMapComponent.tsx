
import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG } from '@/config/env';
import { useUserLocation } from '@/hooks/use-user-location';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { isTokenFormatValid } from './trips/map/utils/tokenUtils';
import LayerControl from './trips/map/LayerControl';
import { addTopographicalLayers, MAP_STYLES } from './trips/map/mapConfig';
import mapboxgl from 'mapbox-gl';
import { Track } from '@/types/track';
import MapActionBar from './map/MapActionBar';
import TrackRenderer from './map/TrackRenderer';

interface EnhancedMapComponentProps {
  className?: string;
  height?: string;
  width?: string;
  showControls?: boolean;
  onMapLoad?: (map: mapboxgl.Map) => void;
  tracks?: Track[];
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;
    bearing?: number;
  };
  showLayerControls?: boolean;
}

const EnhancedMapComponent = ({
  className,
  height = '600px',
  width = '100%',
  showControls = true,
  onMapLoad,
  tracks = [],
  initialViewState,
  showLayerControls = true
}: EnhancedMapComponentProps) => {
  const mapboxToken = MAPBOX_CONFIG.accessToken;
  const { location, isLoading } = useUserLocation();
  const [mapStyle, setMapStyle] = useState(MAP_STYLES.OUTDOORS);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  
  const [viewport, setViewport] = useState({
    longitude: initialViewState?.longitude || 9.1829, // Stuttgart, Germany as default
    latitude: initialViewState?.latitude || 48.7758,
    zoom: initialViewState?.zoom || 4,
    pitch: initialViewState?.pitch || 0,
    bearing: initialViewState?.bearing || 0
  });

  // Handle map style change
  const handleStyleChange = (style: string) => {
    setMapStyle(style);
    toast.success("Map style updated");
  };
  
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
    if (location && location.longitude && location.latitude && !initialViewState) {
      setViewport(prev => ({
        ...prev,
        longitude: location.longitude,
        latitude: location.latitude
      }));
    }
  }, [location, initialViewState]);

  // Initialize the topographical layers when the map is loaded
  const handleMapLoad = (event: { target: mapboxgl.Map }) => {
    mapRef.current = event.target;
    
    // Add the topographical layers
    addTopographicalLayers(event.target);
    
    // Call the onMapLoad callback if provided
    if (onMapLoad) {
      onMapLoad(event.target);
    }
    
    console.log('Map loaded successfully with topographical layers');
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
      <div className="flex space-x-2 mb-2">
        {showLayerControls && mapRef.current && (
          <div className="w-48">
            <LayerControl 
              map={mapRef.current}
              onStyleChange={handleStyleChange}
            />
          </div>
        )}
        
        <div className="rounded-lg overflow-hidden flex-1" style={{ width: showLayerControls ? 'calc(100% - 12rem)' : width, height }}>
          <Map
            initialViewState={viewport}
            style={{ width: '100%', height: '100%' }}
            mapStyle={mapStyle}
            mapboxAccessToken={mapboxToken}
            onMove={(evt) => setViewport(evt.viewState)}
            attributionControl={showControls}
            onLoad={handleMapLoad}
            terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
          >
            {showControls && (
              <NavigationControl position="bottom-left" />
            )}
            {location && (
              <Marker 
                longitude={location.longitude} 
                latitude={location.latitude} 
                color="#FF0000"
              />
            )}
            
            {/* Render tracks using the TrackRenderer component */}
            <TrackRenderer tracks={tracks} />
          </Map>
        </div>
      </div>
      
      {/* Use the MapActionBar component for the bottom controls */}
      <MapActionBar tracks={tracks} />
    </div>
  );
};

export default EnhancedMapComponent;
