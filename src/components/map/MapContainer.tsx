
import { useState, useEffect, MutableRefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MapTokenInput from '../trips/map/token-input/MapTokenInput';
import LayerControl from '../trips/map/LayerControl';
import MapErrorDisplay from './MapErrorDisplay';
import WebGLErrorFallback from '../trips/map/WebGLErrorFallback';
import { useMapInitialization } from './hooks/useMapInitialization';
import { getMapboxTokenStorageKey } from '@/utils/mapbox-helper';
import { getInitialMapView } from '@/utils/countryCenters';
import { isMapboxSupported } from '../trips/map/utils/tokenUtils';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
  onMapLoad?: (map: mapboxgl.Map) => void;
  mapContainerRef?: MutableRefObject<HTMLDivElement>;
  onMapClick?: () => void;
  isLoading?: boolean;
  style?: string;
  hideControls?: boolean;
  shouldAutoCenter?: boolean;
}

const MapContainer = ({
  height = '600px',
  width = '100%',
  center,
  zoom,
  onMapLoad,
  mapContainerRef,
  onMapClick,
  isLoading,
  style = 'mapbox://styles/mapbox/outdoors-v12',
  hideControls = false,
  shouldAutoCenter = true
}: MapContainerProps) => {
  // Use smart default if no center/zoom provided
  const defaultView = getInitialMapView();
  const finalCenter = center || defaultView.center;
  const finalZoom = zoom || defaultView.zoom;
  const [mapStyle, setMapStyle] = useState<string>(style);
  
  const {
    mapContainer: defaultMapContainer,
    map,
    error,
    hasToken,
    isMapLoaded,
    setHasToken
  } = useMapInitialization({
    center: finalCenter,
    zoom: finalZoom,
    mapStyle,
    onMapLoad,
    shouldAutoCenter
  });
  
  // Update mapStyle when style prop changes - AFTER map is defined
  useEffect(() => {
    if (style && style !== mapStyle) {
      setMapStyle(style);
      if (map) {
        map.setStyle(style);
      }
    }
  }, [style, map, mapStyle]);

  // Use provided container ref or default
  const containerRef = mapContainerRef || defaultMapContainer;

  // Handle token save
  const handleTokenSave = (token: string) => {
    const storageKey = getMapboxTokenStorageKey();
    localStorage.setItem(storageKey, token);
    setHasToken(true);
  };

  // Handle map click
  const handleMapClick = () => {
    if (onMapClick) {
      onMapClick();
    }
  };

  // Check WebGL support first
  if (!isMapboxSupported()) {
    return (
      <div className="relative" style={{ width, height }}>
        <WebGLErrorFallback 
          error="WebGL is not supported in your browser. Please enable WebGL or try a different browser."
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Show WebGL error if detected in error message
  if (error && (error.toLowerCase().includes('webgl') || error.toLowerCase().includes('context'))) {
    return (
      <div className="relative" style={{ width, height }}>
        <WebGLErrorFallback 
          error={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

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
            ref={containerRef} 
            className="w-full h-full rounded-lg"
            onClick={handleMapClick}
          />
          {error && <MapErrorDisplay error={error} />}
          {/* Show LayerControl only if not hidden by parent */}
          {isMapLoaded && map && !hideControls && (
            <div className="absolute top-4 left-4 z-10">
              <LayerControl 
                map={map} 
                onStyleChange={(style) => setMapStyle(style)}
              />
            </div>
          )}
          {isLoading && (
            <div className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapContainer;
