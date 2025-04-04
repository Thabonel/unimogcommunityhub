
import React, { useState, useEffect } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MAPBOX_CONFIG } from '@/config/env';

const MapComponent = () => {
  const mapboxToken = MAPBOX_CONFIG.accessToken;
  
  // Log the environment variable directly
  useEffect(() => {
    console.log('Direct environment variable:', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);
    console.log('MAPBOX_CONFIG.accessToken:', mapboxToken);
  }, [mapboxToken]);

  const [viewport, setViewport] = useState({
    longitude: 133.7751,
    latitude: -25.2744,
    zoom: 4
  });

  if (!mapboxToken) {
    console.error('Mapbox token is missing!');
    return <div>Error: Mapbox token is missing!</div>;
  }

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Map
        initialViewState={viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapboxToken}
        onMove={(evt) => setViewport(evt.viewState)}
      >
        <Marker longitude={133.7751} latitude={-25.2744} />
      </Map>
    </div>
  );
};

export default MapComponent;
