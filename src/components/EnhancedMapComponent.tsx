
import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, NavigationControl, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG } from '@/config/env';
import { useUserLocation } from '@/hooks/use-user-location';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { AlertCircle, Check, Upload, Download, MapPin, Compass, MountainSnow } from 'lucide-react';
import { toast } from 'sonner';
import { validateAndTestCurrentToken, isTokenFormatValid } from './trips/map/utils/tokenUtils';
import LayerControl from './trips/map/LayerControl';
import { addTopographicalLayers, MAP_STYLES } from './trips/map/mapConfig';
import mapboxgl from 'mapbox-gl';
import { Track } from '@/types/track';

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
  const [testingToken, setTestingToken] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
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

  // Function to handle GPX/KML file uploads
  const handleFileUpload = () => {
    // For now, just show a toast since we'll implement the full functionality later
    toast("File upload functionality coming soon");
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
              <NavigationControl position="top-right" />
            )}
            {location && (
              <Marker 
                longitude={location.longitude} 
                latitude={location.latitude} 
                color="#FF0000"
              />
            )}
            
            {/* Track data would be rendered here */}
            {tracks.map((track, trackIndex) => (
              track.segments && track.segments.map((segment, segIndex) => {
                // Convert track data to GeoJSON
                const coordinates = segment.points.map(point => [
                  point.longitude,
                  point.latitude,
                  point.elevation || 0
                ]);
                
                const geojson = {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates
                  }
                };
                
                return (
                  <Source
                    key={`${track.id}-${segIndex}`}
                    id={`track-${track.id}-${segIndex}`}
                    type="geojson"
                    data={geojson as any}
                  >
                    <Layer
                      id={`track-line-${track.id}-${segIndex}`}
                      type="line"
                      paint={{
                        'line-color': track.color || '#FF0000',
                        'line-width': 3
                      }}
                    />
                  </Source>
                );
              })
            ))}
          </Map>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
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
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFileUpload}
          >
            <Upload className="h-4 w-4 mr-1" />
            Upload Track
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={tracks.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            Export Tracks
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMapComponent;
