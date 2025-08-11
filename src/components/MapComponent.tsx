
import { useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapContainer from './map/MapContainer';
import mapboxgl from 'mapbox-gl';

interface MapComponentProps {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
  onMapLoad?: (map: mapboxgl.Map) => void;
  style?: string;
  hideControls?: boolean;
  shouldAutoCenter?: boolean;
}

const MapComponent = ({
  height = '600px',
  width = '100%',
  center = [9.1829, 48.7758], // Default to Stuttgart, Germany
  zoom = 5,
  onMapLoad,
  style,
  hideControls,
  shouldAutoCenter
}: MapComponentProps) => {
  return (
    <MapContainer
      height={height}
      width={width}
      center={center}
      zoom={zoom}
      onMapLoad={onMapLoad}
      style={style}
      hideControls={hideControls}
      shouldAutoCenter={shouldAutoCenter}
    />
  );
};

export default MapComponent;
