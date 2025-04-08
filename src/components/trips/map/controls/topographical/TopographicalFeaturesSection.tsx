
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, MountainSnow } from 'lucide-react';
import { TOPO_LAYERS } from '../../utils';
import mapboxgl from 'mapbox-gl';
import TopographicalContent from './TopographicalContent';
import useLayerToggle from './useLayerToggle';
import useLayerInitialization from './useLayerInitialization';

interface TopographicalFeaturesSectionProps {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  layersInitialized: boolean;
  visibleLayers: Record<string, boolean>;
  setVisibleLayers: (layers: Record<string, boolean>) => void;
  expanded: boolean;
  onToggleExpand: () => void;
  initializeLayersManually?: () => void;
}

const TopographicalFeaturesSection = ({
  map,
  mapLoaded,
  layersInitialized,
  visibleLayers,
  setVisibleLayers,
  expanded,
  onToggleExpand,
  initializeLayersManually
}: TopographicalFeaturesSectionProps) => {
  const { 
    initializeLayersWithRetry, 
    handleForceInitialize 
  } = useLayerInitialization({
    map,
    mapLoaded,
    layersInitialized,
    initializeLayersManually
  });

  const { 
    isToggling, 
    handleToggleLayer 
  } = useLayerToggle({
    map,
    mapLoaded,
    visibleLayers,
    setVisibleLayers,
    initializeLayersWithRetry
  });

  // Determine if the component should show loading state
  const isLoading = !mapLoaded;
  const isInitializing = mapLoaded && !layersInitialized;

  return (
    <Card className="w-full border-0 shadow-none bg-transparent">
      <Button
        variant="ghost"
        size="sm"
        className="w-full flex items-center justify-between p-2 h-auto"
        onClick={onToggleExpand}
      >
        <div className="flex items-center">
          <MountainSnow className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Topographical Features</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {expanded && (
        <CardContent className="p-2 pt-0">
          <TopographicalContent
            isLoading={isLoading}
            isInitializing={isInitializing}
            map={map}
            visibleLayers={visibleLayers}
            isToggling={isToggling}
            onToggleLayer={handleToggleLayer}
            onForceInitialize={handleForceInitialize}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default TopographicalFeaturesSection;
