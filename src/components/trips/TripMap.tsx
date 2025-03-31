
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, AlertTriangle } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Configure Mapbox with the access token
mapboxgl.accessToken = 'pk.eyJ1IjoidGhhYm9uZWwiLCJhIjoiY204d3l5NGpwMDBpZDJqb2IzaXF6Ym4weCJ9.ZS6nu4vUyINjg2wKRg0yqQ';

interface TripMapProps {
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  onMapClick?: () => void;
}

const TripMap = ({ 
  startLocation, 
  endLocation,
  waypoints = [],
  onMapClick 
}: TripMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackFeatureUse } = useAnalytics();
  
  useEffect(() => {
    // Initialize the map only once when the component mounts
    if (!mapContainer.current) return;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12', // Outdoor style is good for trip planning
        center: [0, 0], // Default center, will be updated based on locations
        zoom: 2
      });
      
      // Add navigation controls (zoom in/out, compass)
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current.on('load', () => {
        setIsLoading(false);
        trackFeatureUse('map_view', { action: 'loaded' });
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map resources');
        setIsLoading(false);
      });
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [trackFeatureUse]);
  
  // Update map when start or end location changes
  useEffect(() => {
    if (!map.current || isLoading || error) return;
    
    const updateMapForLocations = async () => {
      if (!startLocation && !endLocation) return;
      
      try {
        // This would be replaced with actual geocoding in a production app
        // For now we'll just simulate moving the map
        if (startLocation && endLocation) {
          // Simulate a route between two points
          map.current?.flyTo({
            center: [-98.5795, 39.8283], // Center of US as example
            zoom: 4,
            speed: 0.8
          });
        } else if (startLocation) {
          // Simulate zooming to start location
          map.current?.flyTo({
            center: [-100.5795, 40.8283], // Example location
            zoom: 6,
            speed: 0.8
          });
        }
      } catch (err) {
        console.error('Error updating map for locations:', err);
      }
    };
    
    updateMapForLocations();
  }, [startLocation, endLocation, isLoading, error]);
  
  const handleMapClick = () => {
    if (onMapClick) {
      onMapClick();
    } else {
      trackFeatureUse('map_interaction', { action: 'click' });
    }
  };
  
  if (error) {
    return (
      <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <p>Failed to load map: {error}</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="relative overflow-hidden">
      {isLoading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <div 
          ref={mapContainer}
          className="h-[300px] w-full"
          onClick={handleMapClick}
        />
      )}
    </Card>
  );
};

export default TripMap;
