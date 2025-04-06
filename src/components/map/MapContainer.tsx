
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MapTokenInput from '../trips/map/token-input/MapTokenInput';
import LayerControl from '../trips/map/LayerControl';
import MapErrorDisplay from './MapErrorDisplay';
import { useMapInitialization } from './hooks/useMapInitialization';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapContainerProps {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

const MapContainer = ({
  height = '600px',
  width = '100%',
  center = [9.1829, 48.7758], // Default to Stuttgart, Germany
  zoom = 5,
  onMapLoad
}: MapContainerProps) => {
  const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/outdoors-v12');
  
  const {
    mapContainer,
    map,
    error,
    hasToken,
    isMapLoaded,
    setHasToken
  } = useMapInitialization({
    center,
    zoom,
    mapStyle,
    onMapLoad
  });

  // Handle token save
  const handleTokenSave = (token: string) => {
    localStorage.setItem('mapbox-token', token);
    setHasToken(true);
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
          {error && <MapErrorDisplay error={error} />}
          {isMapLoaded && map && (
            <div className="absolute top-4 left-4 z-10">
              <LayerControl 
                map={map} 
                onStyleChange={(style) => setMapStyle(style)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MapContainer;
