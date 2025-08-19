
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MountainSnow, ChevronRight, ChevronDown } from 'lucide-react';
import MapStateContent from './MapStateContent';
import useLayerInitialization from './useLayerInitialization';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';

interface TopographicalFeaturesSectionProps {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  layersInitialized: boolean;
  visibleLayers: Record<string, boolean>;
  setVisibleLayers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  expanded: boolean;
  onToggleExpand: () => void;
  initializeLayersManually?: () => void;
  toggleLayer?: (layerId: string) => void;
}

export const TopographicalFeaturesSection = ({
  map,
  mapLoaded,
  layersInitialized,
  visibleLayers,
  setVisibleLayers,
  expanded,
  onToggleExpand,
  initializeLayersManually,
  toggleLayer
}: TopographicalFeaturesSectionProps) => {
  // Use the layer initialization hook
  const { handleForceInitialize } = useLayerInitialization({
    map,
    mapLoaded,
    layersInitialized,
    initializeLayersManually
  });
  
  // Handle layer toggling
  const handleToggleLayer = useCallback((layerId: string) => {
    if (toggleLayer) {
      toggleLayer(layerId);
    } else if (map) {
      // Fallback implementation if toggleLayer is not provided
      toast.error("Layer toggle operation not available");
    } else {
      toast.error("Map is not available");
    }
  }, [map, toggleLayer]);

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className="flex w-full justify-between px-2 py-1 h-auto"
        onClick={onToggleExpand}
      >
        <span className="flex items-center">
          <MountainSnow className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Topographical Features</span>
        </span>
        {expanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      {expanded && (
        <div className="px-2 py-1">
          <MapStateContent
            mapLoaded={mapLoaded}
            layersInitialized={layersInitialized}
            visibleLayers={visibleLayers}
            onForceInitialize={handleForceInitialize}
            onToggleLayer={handleToggleLayer}
          />
        </div>
      )}
    </div>
  );
};

export default TopographicalFeaturesSection;
