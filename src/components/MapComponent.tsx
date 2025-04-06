
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { hasMapboxToken } from './trips/map/mapConfig';
import MapTokenInput from './trips/map/token-input/MapTokenInput';
import { 
  addTopographicalLayers, 
  MAP_STYLES,
  enableTerrain
} from './trips/map/mapConfig';
import LayerControl from './trips/map/LayerControl';
import { toast } from 'sonner';

interface MapComponentProps {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

const MapComponent = ({
  height = '600px',
  width = '100%',
  center = [9.1829, 48.7758], // Default to Stuttgart, Germany
  zoom = 5,
  onMapLoad
}: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<string>(MAP_STYLES.OUTDOORS);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState<boolean>(hasMapboxToken());
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!hasToken) {
      console.log('No Mapbox token found, showing token input');
      return;
    }

    if (map.current) return; // Map already initialized

    try {
      console.log('Initializing Mapbox map with center:', center);
      const token = localStorage.getItem('mapbox-token') || '';
      
      if (!token) {
        setError('No Mapbox token found in localStorage');
        setHasToken(false);
        return;
      }

      mapboxgl.accessToken = token;
      
      if (!mapContainer.current) {
        console.error('Map container ref is null');
        return;
      }

      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: center,
        zoom: zoom,
        attributionControl: true
      });

      // Add navigation controls - CHANGED FROM top-right TO bottom-left
      map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
      
      // Scale control
      map.current.addControl(new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }), 'bottom-right');

      // Wait for map to load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setIsMapLoaded(true);
        
        if (map.current) {
          // Add DEM source for terrain
          try {
            map.current.addSource('mapbox-dem', {
              'type': 'raster-dem',
              'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
              'tileSize': 512,
              'maxzoom': 14
            });
            console.log('DEM source added successfully');
            
            // Add topographical layers after ensuring source exists
            setTimeout(() => {
              if (map.current) {
                addTopographicalLayers(map.current);
              }
            }, 500);
          } catch (err) {
            console.error('Error adding DEM source:', err);
          }
        }
        
        // Call onMapLoad callback if provided
        if (onMapLoad && map.current) {
          onMapLoad(map.current);
        }
      });

      // Error handling
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError(`Error loading map: ${e.error?.message || 'Unknown error'}`);
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [hasToken, mapStyle, center, zoom, onMapLoad]);

  // Update map position when center or zoom changes
  useEffect(() => {
    if (map.current && isMapLoaded && center) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        essential: true
      });
    }
  }, [center, zoom, isMapLoaded]);

  // Update map style when it changes
  useEffect(() => {
    if (map.current && isMapLoaded) {
      try {
        console.log('Changing map style to:', mapStyle);
        map.current.setStyle(mapStyle);
        
        // Re-add terrain after style change
        map.current.once('style.load', () => {
          if (map.current) {
            console.log('Style loaded, re-adding terrain features');
            // Re-add the DEM source after style change
            try {
              if (!map.current.getSource('mapbox-dem')) {
                console.log('Re-adding mapbox-dem source');
                map.current.addSource('mapbox-dem', {
                  'type': 'raster-dem',
                  'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                  'tileSize': 512,
                  'maxzoom': 14
                });
              }
              
              // Re-add the topographical layers with a delay to ensure style is fully loaded
              setTimeout(() => {
                if (map.current) {
                  addTopographicalLayers(map.current);
                }
              }, 500);
            } catch (err) {
              console.error('Error re-adding DEM source after style change:', err);
            }
          }
        });
      } catch (err) {
        console.error('Error changing map style:', err);
        toast.error('Failed to change map style');
      }
    }
  }, [mapStyle, isMapLoaded]);

  // Handle token save
  const handleTokenSave = (token: string) => {
    localStorage.setItem('mapbox-token', token);
    setHasToken(true);
    setError(null);
  };

  return (
    <div className="relative" style={{ width, height }}>
      {!hasToken ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="w-full max-w-md">
            <MapTokenInput onTokenSave={handleTokenSave} />
          </div>
        </div>
      ) : (
        <>
          <div 
            ref={mapContainer} 
            className="w-full h-full rounded-lg"
          />
          {error && (
            <Alert variant="destructive" className="absolute top-4 left-4 right-4 z-50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {isMapLoaded && (
            <div className="absolute top-4 left-4 z-10">
              <LayerControl 
                map={map.current} 
                onStyleChange={(style) => setMapStyle(style)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapComponent;
