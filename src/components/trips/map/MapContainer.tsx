
import { useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface MapContainerProps {
  isLoading: boolean;
  mapContainerRef: React.RefObject<HTMLDivElement>;
  onMapClick?: () => void;
}

const MapContainer = ({ isLoading, mapContainerRef, onMapClick }: MapContainerProps) => {
  return (
    <Card className="relative overflow-hidden">
      {isLoading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <CardContent className="p-0">
          <div 
            ref={mapContainerRef}
            className="h-[300px] w-full"
            onClick={onMapClick}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default MapContainer;
