
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { initializeMap } from './map/mapConfig';
import { useMapLocations } from './map/useMapLocations';

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
  
  // Initialize the map
  useEffect(() => {
    // Initialize the map only once when the component mounts
    if (!mapContainer.current) return;
    
    try {
      map.current = initializeMap(mapContainer.current);
      
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
  
  // Use the locations hook to manage map locations and routes
  useMapLocations({
    map: map.current,
    startLocation,
    endLocation,
    isLoading,
    error
  });
  
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
