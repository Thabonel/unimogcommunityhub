
import { useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Map as MapIcon } from 'lucide-react';

interface MapContainerProps {
  isLoading: boolean;
  mapContainerRef: React.RefObject<HTMLDivElement>;
  onMapClick?: () => void;
}

const MapContainer = ({ isLoading, mapContainerRef, onMapClick }: MapContainerProps) => {
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
          />
        </CardContent>
      )}
    </Card>
  );
};

export default MapContainer;
