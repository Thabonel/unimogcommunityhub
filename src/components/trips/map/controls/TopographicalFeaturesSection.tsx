
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, ChevronDown, ChevronUp, MountainSnow } from 'lucide-react';
import { TOPO_LAYERS, toggleLayerVisibility } from '../utils/layerUtils';
import { enableTerrain, disableTerrain } from '../utils/terrainUtils';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';

interface TopographicalFeaturesSectionProps {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  layersInitialized: boolean;
  visibleLayers: Record<string, boolean>;
  setVisibleLayers: (layers: Record<string, boolean>) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

const TopographicalFeaturesSection = ({
  map,
  mapLoaded,
  layersInitialized,
  visibleLayers,
  setVisibleLayers,
  expanded,
  onToggleExpand
}: TopographicalFeaturesSectionProps) => {
  const [isToggling, setIsToggling] = useState<Record<string, boolean>>({});

  const handleToggleLayer = (layerId: string) => {
    if (!map || !mapLoaded) {
      toast.error("Map is not yet loaded. Please wait a moment.");
      return;
    }

    // Set this specific layer to toggling state
    setIsToggling(prev => ({ ...prev, [layerId]: true }));

    // Use a timeout to ensure UI updates
    setTimeout(() => {
      try {
        let success = false;
        
        // Special handling for 3D Terrain
        if (layerId === TOPO_LAYERS.TERRAIN_3D) {
          if (visibleLayers[TOPO_LAYERS.TERRAIN_3D]) {
            success = disableTerrain(map);
          } else {
            success = enableTerrain(map);
          }
        } else {
          // Handle regular layers (hillshade, contour)
          success = toggleLayerVisibility(map, layerId);
        }
        
        if (success !== undefined) {
          // Update the visible layers state
          setVisibleLayers({
            ...visibleLayers,
            [layerId]: layerId === TOPO_LAYERS.TERRAIN_3D 
              ? !visibleLayers[TOPO_LAYERS.TERRAIN_3D] 
              : success
          });
        }
      } catch (error) {
        console.error(`Error toggling ${layerId}:`, error);
        toast.error(`Failed to toggle ${getLayerName(layerId)}`);
      } finally {
        setIsToggling(prev => ({ ...prev, [layerId]: false }));
      }
    }, 100);
  };

  const getLayerName = (layerId: string): string => {
    switch (layerId) {
      case TOPO_LAYERS.HILLSHADE:
        return 'Hillshade';
      case TOPO_LAYERS.CONTOUR:
        return 'Contour Lines';
      case TOPO_LAYERS.TERRAIN_3D:
        return '3D Terrain';
      default:
        return layerId;
    }
  };

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
          {!mapLoaded ? (
            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Map is loading... Features will be available soon.
            </div>
          ) : (
            <div className="space-y-2">
              {/* 3D Terrain Toggle */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terrain-toggle" 
                  checked={visibleLayers[TOPO_LAYERS.TERRAIN_3D]} 
                  disabled={isToggling[TOPO_LAYERS.TERRAIN_3D]}
                  onCheckedChange={() => handleToggleLayer(TOPO_LAYERS.TERRAIN_3D)}
                />
                <label 
                  htmlFor="terrain-toggle" 
                  className="text-sm cursor-pointer flex items-center"
                >
                  3D Terrain
                  {isToggling[TOPO_LAYERS.TERRAIN_3D] && (
                    <Loader2 className="h-3 w-3 ml-2 animate-spin" />
                  )}
                </label>
              </div>

              {/* Hillshade Toggle */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hillshade-toggle" 
                  checked={visibleLayers[TOPO_LAYERS.HILLSHADE]} 
                  disabled={isToggling[TOPO_LAYERS.HILLSHADE]}
                  onCheckedChange={() => handleToggleLayer(TOPO_LAYERS.HILLSHADE)}
                />
                <label 
                  htmlFor="hillshade-toggle" 
                  className="text-sm cursor-pointer flex items-center"
                >
                  Hillshade
                  {isToggling[TOPO_LAYERS.HILLSHADE] && (
                    <Loader2 className="h-3 w-3 ml-2 animate-spin" />
                  )}
                </label>
              </div>

              {/* Contour Lines Toggle */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contour-toggle" 
                  checked={visibleLayers[TOPO_LAYERS.CONTOUR]} 
                  disabled={isToggling[TOPO_LAYERS.CONTOUR]}
                  onCheckedChange={() => handleToggleLayer(TOPO_LAYERS.CONTOUR)}
                />
                <label 
                  htmlFor="contour-toggle" 
                  className="text-sm cursor-pointer flex items-center"
                >
                  Contour Lines
                  {isToggling[TOPO_LAYERS.CONTOUR] && (
                    <Loader2 className="h-3 w-3 ml-2 animate-spin" />
                  )}
                </label>
              </div>

              {!layersInitialized && (
                <p className="text-xs text-muted-foreground mt-2">
                  Initializing map layers...
                </p>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default TopographicalFeaturesSection;
