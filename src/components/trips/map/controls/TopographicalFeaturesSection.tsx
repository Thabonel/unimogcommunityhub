
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader, Mountain, AlertCircle } from 'lucide-react';
import { TOPO_LAYERS, toggleLayerVisibility, addTopographicalLayers } from '../utils/layerUtils';
import { enableTerrain, disableTerrain } from '../utils/terrainUtils';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';

interface TopographicalFeaturesSectionProps {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  layersInitialized?: boolean;
  visibleLayers: Record<string, boolean>;
  setVisibleLayers: (layers: Record<string, boolean>) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

const TopographicalFeaturesSection = ({
  map,
  mapLoaded,
  layersInitialized = false,
  visibleLayers,
  setVisibleLayers,
  expanded,
  onToggleExpand,
}: TopographicalFeaturesSectionProps) => {
  const [toggleInProgress, setToggleInProgress] = useState<string | null>(null);
  
  // Fix for ensuring layers are added when component mounts or map loads
  useEffect(() => {
    if (map && mapLoaded && !layersInitialized) {
      try {
        console.log('Adding topographical layers from component');
        addTopographicalLayers(map);
      } catch (error) {
        console.error('Error adding topographical layers:', error);
      }
    }
  }, [map, mapLoaded, layersInitialized]);
  
  const checkMapReadiness = () => {
    if (!map) {
      toast.error("Map not initialized");
      return false;
    }

    if (!mapLoaded) {
      toast.warning("Map is still loading. Please try again in a moment.");
      return false;
    }
    
    if (!map.isStyleLoaded()) {
      toast.warning("Map style is still loading. Please try again in a moment.");
      return false;
    }
    
    return true;
  };
  
  const handleLayerToggle = (layerId: string) => {
    if (!checkMapReadiness()) return;
    
    // Prevent multiple toggles at once
    if (toggleInProgress) return;
    
    setToggleInProgress(layerId);
    
    try {
      console.log(`Toggling layer: ${layerId}`);
      
      // Try up to 3 times with delays to toggle the layer
      const attemptToggle = (attempt: number = 1) => {
        try {
          // Toggle layer visibility and get new state
          const isNowVisible = toggleLayerVisibility(map!, layerId);
          
          console.log(`Layer ${layerId} toggled: ${isNowVisible ? 'visible' : 'hidden'}`);
          
          // Update state after successful toggle
          setVisibleLayers({
            ...visibleLayers,
            [layerId]: isNowVisible
          });
          
          setToggleInProgress(null);
        } catch (error) {
          console.error(`Error toggling layer ${layerId} (attempt ${attempt}):`, error);
          
          if (attempt < 3) {
            // Try again after a delay
            setTimeout(() => attemptToggle(attempt + 1), 500);
          } else {
            toast.error(`Could not toggle ${layerId}`);
            setToggleInProgress(null);
          }
        }
      };
      
      attemptToggle();
    } catch (error) {
      console.error(`Error toggling layer ${layerId}:`, error);
      toast.error(`Could not toggle ${layerId}`);
      setToggleInProgress(null);
    }
  };

  // Handle 3D terrain toggle specially
  const handle3DTerrainToggle = () => {
    if (!checkMapReadiness()) return;
    
    // Prevent multiple toggles at once
    if (toggleInProgress) return;
    
    setToggleInProgress(TOPO_LAYERS.TERRAIN_3D);
    
    const isCurrently3D = visibleLayers[TOPO_LAYERS.TERRAIN_3D];
    
    try {
      console.log(`Toggling 3D terrain: current state = ${isCurrently3D}`);
      let success = false;
      
      if (isCurrently3D) {
        // Disable terrain
        success = disableTerrain(map!);
      } else {
        // Enable terrain
        success = enableTerrain(map!);
      }
      
      if (success) {
        // Only update state if operation was successful
        setVisibleLayers({
          ...visibleLayers,
          [TOPO_LAYERS.TERRAIN_3D]: !isCurrently3D
        });
        console.log(`3D terrain toggled to: ${!isCurrently3D}`);
      } else {
        toast.error("Failed to toggle 3D terrain");
      }
      
      setToggleInProgress(null);
    } catch (error) {
      console.error('Error toggling 3D terrain:', error);
      toast.error("Error toggling 3D terrain");
      setToggleInProgress(null);
    }
  };

  const isToggleInProgress = (layerId: string) => toggleInProgress === layerId;

  return (
    <div className="space-y-2">
      <Button 
        variant="ghost" 
        className="w-full justify-start px-2 py-1 h-auto text-sm"
        onClick={onToggleExpand}
      >
        <Mountain className="h-4 w-4 mr-2" />
        Topographical Features
      </Button>
      
      {expanded && (
        <div className="ml-6 space-y-2">
          {!mapLoaded && (
            <div className="flex items-center text-amber-500 text-xs mb-2 bg-amber-50 p-2 rounded-md">
              <AlertCircle className="h-3 w-3 mr-1" />
              Map is still loading. Features will be available soon.
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terrain-3d" 
              checked={visibleLayers[TOPO_LAYERS.TERRAIN_3D]} 
              onCheckedChange={() => handle3DTerrainToggle()}
              disabled={!mapLoaded || isToggleInProgress(TOPO_LAYERS.TERRAIN_3D)}
              className={isToggleInProgress(TOPO_LAYERS.TERRAIN_3D) ? "opacity-50" : ""}
            />
            <Label htmlFor="terrain-3d" className="text-sm cursor-pointer flex items-center">
              3D Terrain
              {isToggleInProgress(TOPO_LAYERS.TERRAIN_3D) && (
                <span className="flex items-center ml-2 text-xs text-muted-foreground">
                  <Loader className="h-3 w-3 mr-1 animate-spin" />
                  toggling
                </span>
              )}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hillshade" 
              checked={visibleLayers[TOPO_LAYERS.HILLSHADE]} 
              onCheckedChange={() => handleLayerToggle(TOPO_LAYERS.HILLSHADE)}
              disabled={!mapLoaded || isToggleInProgress(TOPO_LAYERS.HILLSHADE)}
              className={isToggleInProgress(TOPO_LAYERS.HILLSHADE) ? "opacity-50" : ""}
            />
            <Label htmlFor="hillshade" className="text-sm cursor-pointer flex items-center">
              Hillshade
              {isToggleInProgress(TOPO_LAYERS.HILLSHADE) && (
                <span className="flex items-center ml-2 text-xs text-muted-foreground">
                  <Loader className="h-3 w-3 mr-1 animate-spin" />
                  toggling
                </span>
              )}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="contour" 
              checked={visibleLayers[TOPO_LAYERS.CONTOUR]} 
              onCheckedChange={() => handleLayerToggle(TOPO_LAYERS.CONTOUR)}
              disabled={!mapLoaded || isToggleInProgress(TOPO_LAYERS.CONTOUR)}
              className={isToggleInProgress(TOPO_LAYERS.CONTOUR) ? "opacity-50" : ""}
            />
            <Label htmlFor="contour" className="text-sm cursor-pointer flex items-center">
              Contour Lines
              {isToggleInProgress(TOPO_LAYERS.CONTOUR) && (
                <span className="flex items-center ml-2 text-xs text-muted-foreground">
                  <Loader className="h-3 w-3 mr-1 animate-spin" />
                  toggling
                </span>
              )}
            </Label>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopographicalFeaturesSection;
