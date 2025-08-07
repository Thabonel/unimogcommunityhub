
import React, { memo } from "react";
import { Loader2 } from "lucide-react";

interface MapContainerProps {
  isLoading: boolean;
  mapContainerRef: React.RefObject<HTMLDivElement>;
  onMapClick?: () => void;
}

const MapContainer = ({ isLoading, mapContainerRef, onMapClick }: MapContainerProps) => {
  const handleClick = () => {
    if (onMapClick) {
      onMapClick();
    }
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <div 
        ref={mapContainerRef} 
        className="h-full w-full" 
        onClick={handleClick}
        style={{ minHeight: '100%' }}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
            <p className="text-xs text-muted-foreground">Features will be available soon</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(MapContainer);
