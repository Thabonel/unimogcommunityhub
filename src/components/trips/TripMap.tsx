
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, AlertTriangle } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';

// In a real implementation, we would use Mapbox GL JS
const TripMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackFeatureUse } = useAnalytics();
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      trackFeatureUse('map_view', { action: 'loaded' });
      
      // In a real implementation, we would initialize Mapbox here
      // For now, we're just mocking the map functionality
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [trackFeatureUse]);
  
  const handleMapClick = () => {
    trackFeatureUse('map_interaction', { action: 'click' });
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
          className="h-[300px] w-full bg-muted flex items-center justify-center cursor-pointer"
          onClick={handleMapClick}
        >
          <div className="w-full h-full flex items-center justify-center relative">
            {/* This is a placeholder for the actual map */}
            <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10"></div>
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-primary" />
              <p className="text-sm text-muted-foreground">
                Interactive map will be displayed here<br />
                (Mapbox integration required)
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TripMap;
