
import { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapContainer from './map/MapContainer';
import mapboxgl from 'mapbox-gl';
import { getInitialMapView } from '@/utils/countryCenters';

interface MapComponentProps {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
  onMapLoad?: (map: mapboxgl.Map) => void;
  style?: string;
  hideControls?: boolean;
  shouldAutoCenter?: boolean;
  userLocation?: { latitude: number; longitude: number } | null;
}

const MapComponent = ({
  height = '600px',
  width = '100%',
  center,
  zoom,
  onMapLoad,
  style,
  hideControls,
  shouldAutoCenter,
  userLocation
}: MapComponentProps) => {
  // Use smart initial view based on user location if not explicitly provided
  const initialView = getInitialMapView(userLocation);
  const finalCenter = center || initialView.center;
  const finalZoom = zoom || initialView.zoom;

  return (
    <MapContainer
      height={height}
      width={width}
      center={finalCenter}
      zoom={finalZoom}
      onMapLoad={onMapLoad}
      style={style}
      hideControls={hideControls}
      shouldAutoCenter={shouldAutoCenter}
    />
  );
};

export default MapComponent;
