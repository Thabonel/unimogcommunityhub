
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';
import { useUserLocation } from '@/hooks/use-user-location';
import { Skeleton } from './ui/skeleton';
import { MAPBOX_CONFIG } from '@/config/env';

// Set the Mapbox access token from environment variables
mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

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
  const [mapError, setMapError] = useState<string | null>(null);
  const { location, isLoading: isLoadingLocation } = useUserLocation();

  useEffect(() => {
    // Early return if there's no container
    if (!mapContainer.current) return;
    
    // Prevent multiple map instances
    if (map.current) return;
    
    try {
      // Determine map center with fallback options
      const defaultCenter: [number, number] = [-74.5, 40];
      
      // Use provided center first, then user location if available, then default
      const mapCenter = center || 
                        (location && location.longitude && location.latitude ? 
                          [location.longitude, location.latitude] as [number, number] : 
                          defaultCenter);
                
      console.log('Initializing SimpleMap with center:', mapCenter);
      
      // Make sure we have valid coordinates before initializing the map
      if (!isNaN(mapCenter[0]) && !isNaN(mapCenter[1])) {
        // Initialize map
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: mapCenter,
          zoom: zoom
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add user location marker if we have the data
        if (location && !isNaN(location.longitude) && !isNaN(location.latitude)) {
          new mapboxgl.Marker({ color: '#FF0000' })
            .setLngLat([location.longitude, location.latitude])
            .addTo(map.current);
        }

        console.log('Mapbox map initialized successfully');
      } else {
        console.error('Invalid map center coordinates:', mapCenter);
        setMapError('Invalid coordinates for map center');
      }
    } catch (error) {
      console.error('Error initializing Mapbox map:', error);
      setMapError('Failed to initialize map');
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
      {mapError ? (
        <div className="flex items-center justify-center bg-muted" style={{ width, height }}>
          <p className="text-sm text-muted-foreground">
            {mapError}. Please try again later.
          </p>
        </div>
      ) : isLoadingLocation ? (
        <Skeleton style={{ width, height }} />
      ) : (
        <div 
          ref={mapContainer} 
          style={{ width, height }}
          className="relative"
          data-testid="simple-mapbox-container" 
        />
      )}
    </Card>
  );
};

export default SimpleMap;
