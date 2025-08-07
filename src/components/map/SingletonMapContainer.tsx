import React from 'react';
import { useMapSingleton } from '@/hooks/use-map-singleton';
import MapTokenInput from '../trips/map/token-input/MapTokenInput';
import { getMapboxTokenStorageKey } from '@/utils/mapbox-helper';
import { hasMapboxToken } from '../trips/map/mapConfig';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface SingletonMapContainerProps {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
  style?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

const SingletonMapContainer: React.FC<SingletonMapContainerProps> = React.memo(({
  height = '100%',
  width = '100%',
  center,
  zoom,
  style,
  onMapLoad
}) => {
  const [hasToken, setHasToken] = React.useState(hasMapboxToken());
  const { containerRef, map, isLoading, error, setStyle: updateStyle } = useMapSingleton({
    center,
    zoom,
    style,
    onMapLoad
  });

  // Handle token save
  const handleTokenSave = (token: string) => {
    const storageKey = getMapboxTokenStorageKey();
    localStorage.setItem(storageKey, token);
    setHasToken(true);
    window.location.reload(); // Reload to initialize map with token
  };

  // Handle style change from parent
  React.useEffect(() => {
    if (style && map) {
      updateStyle(style);
    }
  }, [style, map, updateStyle]);

  if (!hasToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg" style={{ width, height }}>
        <div className="w-full max-w-md">
          <MapTokenInput onTokenSave={handleTokenSave} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      <div ref={containerRef} className="w-full h-full rounded-lg" />
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute top-4 left-4 right-4 z-20">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="text-sm">Map Error: {error}</p>
          </div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if essential props change
  return (
    prevProps.height === nextProps.height &&
    prevProps.width === nextProps.width &&
    prevProps.style === nextProps.style &&
    prevProps.zoom === nextProps.zoom &&
    // For center, do a deep comparison
    JSON.stringify(prevProps.center) === JSON.stringify(nextProps.center) &&
    // For callbacks, we assume they don't change frequently
    prevProps.onMapLoad === nextProps.onMapLoad
  );
});

SingletonMapContainer.displayName = 'SingletonMapContainer';

export default SingletonMapContainer;