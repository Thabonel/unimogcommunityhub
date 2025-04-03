
import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';
import { useUserLocation } from '@/hooks/use-user-location';

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
  center,
  zoom = 9
}: SimpleMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { location, isLoading: isLoadingLocation } = useUserLocation();

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      try {
        // Use provided center or user's location if available, or default
        const mapCenter = center || 
                          (location ? [location.longitude, location.latitude] as [number, number]) : 
                          [-74.5, 40];

        console.log('Initializing SimpleMap with center:', mapCenter);
                
        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12', // Default street style
          center: mapCenter,
          zoom: zoom
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add user location marker if we have the data
        if (location) {
          new mapboxgl.Marker({ color: '#FF0000' })
            .setLngLat([location.longitude, location.latitude])
            .addTo(map.current);
        }

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
  }, [center, zoom, location]);

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
