import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { GeoJSONFeature } from '@/services/trailService';
import 'mapbox-gl/dist/mapbox-gl.css';

interface TrailMapDisplayProps {
  trail: GeoJSONFeature;
  height?: string;
}

export function TrailMapDisplay({ trail, height = '400px' }: TrailMapDisplayProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const sourceId = 'trail-source';
  const layerId = 'trail-layer';

  useEffect(() => {
    if (!mapContainer.current) return;

    const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!token) {
      console.error('Mapbox token not configured');
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: trail.geometry.coordinates[0] as [number, number],
      zoom: 12
    });

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.addSource(sourceId, {
        type: 'geojson',
        data: trail
      });

      map.current.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3498db',
          'line-width': 4
        }
      });

      const coordinates = trail.geometry.coordinates;
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number])
      );

      map.current.fitBounds(bounds, { padding: 50 });

      new mapboxgl.Marker()
        .setLngLat(coordinates[0] as [number, number])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Start</h3>'))
        .addTo(map.current);

      new mapboxgl.Marker({ color: '#e74c3c' })
        .setLngLat(coordinates[coordinates.length - 1] as [number, number])
        .setPopup(new mapboxgl.Popup().setHTML('<h3>End</h3>'))
        .addTo(map.current);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [trail]);

  return (
    <div
      ref={mapContainer}
      style={{ height, width: '100%' }}
      className="rounded-lg overflow-hidden border"
    />
  );
}
