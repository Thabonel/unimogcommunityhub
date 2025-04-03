
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';

// Set the Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoidGhhYm9uZWwiLCJhIjoiY204d3lwMnhwMDBmdTJqb2JsdWgzdmZ2YyJ9.0wyj48txMJAJht1kYfyOdQ';

interface SimpleMapProps {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
}

const SimpleMap = ({
  height = '400px',
  width = '100%',
  center = [-74.5, 40],
  zoom = 9
}: SimpleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      try {
        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12', // Default street style
          center: center,
          zoom: zoom
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        console.log('Mapbox map initialized successfully');
      } catch (error) {
        console.error('Error initializing Mapbox map:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom]);

  return (
    <Card className="overflow-hidden">
      <div 
        ref={mapContainer} 
        style={{ width, height }}
        className="relative"
        data-testid="simple-mapbox-container" 
      />
    </Card>
  );
};

export default SimpleMap;
