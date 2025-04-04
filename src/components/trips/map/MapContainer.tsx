
import { useRef, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Map as MapIcon } from 'lucide-react';

interface MapContainerProps {
  isLoading: boolean;
  mapContainerRef: React.RefObject<HTMLDivElement>;
  onMapClick?: () => void;
}

const MapContainer = ({ isLoading, mapContainerRef, onMapClick }: MapContainerProps) => {
  // Keep a reference to the DOM node for troubleshooting
  const nodeRef = useRef<HTMLDivElement | null>(null);
  
  // Debug the map container's dimensions to catch layout issues
  useEffect(() => {
    if (mapContainerRef.current) {
      nodeRef.current = mapContainerRef.current;
      const { clientWidth, clientHeight } = mapContainerRef.current;
      console.log('Map container dimensions:', { width: clientWidth, height: clientHeight });
      
      // Force a layout recalculation if the container is too small
      if (clientWidth < 10 || clientHeight < 10) {
        console.warn('Map container is too small, forcing layout update');
        setTimeout(() => {
          if (mapContainerRef.current) {
            mapContainerRef.current.style.display = 'none';
            // Force a reflow
            void mapContainerRef.current.offsetHeight;
            mapContainerRef.current.style.display = 'block';
            
            // Check dimensions again after reflow
            const { clientWidth, clientHeight } = mapContainerRef.current;
            console.log('Updated map container dimensions:', { width: clientWidth, height: clientHeight });
          }
        }, 100);
      }
    }
  }, [mapContainerRef]);

  return (
    <Card className="relative overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-[400px] w-full bg-muted">
          <div className="flex flex-col items-center text-muted-foreground space-y-2">
            <MapIcon size={32} className="animate-pulse" />
            <p>Loading map...</p>
            <p className="text-xs text-muted-foreground">This may take a moment</p>
          </div>
        </div>
      ) : (
        <CardContent className="p-0">
          <div 
            ref={mapContainerRef}
            className="h-[400px] w-full"
            onClick={onMapClick}
            data-testid="mapbox-container"
            style={{ 
              position: 'relative', 
              minHeight: '400px',
              minWidth: '100%'
            }}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default MapContainer;
