
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader, Mountain } from 'lucide-react';
import { TOPO_LAYERS, toggleLayerVisibility, enableTerrain, disableTerrain } from '../mapConfig';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';

interface TopographicalFeaturesSectionProps {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  visibleLayers: Record<string, boolean>;
  setVisibleLayers: (layers: Record<string, boolean>) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

const TopographicalFeaturesSection = ({
  map,
  mapLoaded,
  visibleLayers,
  setVisibleLayers,
  expanded,
  onToggleExpand,
}: TopographicalFeaturesSectionProps) => {
  
  const handleLayerToggle = (layerId: string) => {
    if (!map) {
      toast.error("Map not initialized");
      return;
    }

    if (!mapLoaded) {
      toast.warning("Map is still loading. Please try again in a moment.");
      return;
    }
    
    try {
      console.log(`Toggling layer: ${layerId}`);
      // Use the exported toggleLayerVisibility function
      const isNowVisible = toggleLayerVisibility(map, layerId);
      
      // Update state after successful toggle
      setVisibleLayers({
        ...visibleLayers,
        [layerId]: isNowVisible
      });
      
      console.log(`Layer ${layerId} toggled: ${isNowVisible ? 'visible' : 'hidden'}`);
    } catch (error) {
      console.error(`Error toggling layer ${layerId}:`, error);
      toast.error(`Could not toggle ${layerId}`);
    }
  };

  // Handle 3D terrain toggle specially
  const handle3DTerrainToggle = () => {
    if (!map) {
      toast.error("Map not initialized");
      return;
    }

    if (!mapLoaded) {
      toast.warning("Map is still loading. Please try again in a moment.");
      return;
    }
    
    const isCurrently3D = visibleLayers[TOPO_LAYERS.TERRAIN_3D];
    
    try {
      console.log(`Toggling 3D terrain: current state = ${isCurrently3D}`);
      let success = false;
      
      if (isCurrently3D) {
        // Disable terrain
        success = disableTerrain(map);
      } else {
        // Enable terrain
        success = enableTerrain(map);
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
    } catch (error) {
      console.error('Error toggling 3D terrain:', error);
      toast.error("Error toggling 3D terrain");
    }
  };

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
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terrain-3d" 
              checked={visibleLayers[TOPO_LAYERS.TERRAIN_3D]} 
              onCheckedChange={handle3DTerrainToggle}
              disabled={!mapLoaded}
            />
            <Label htmlFor="terrain-3d" className="text-sm cursor-pointer flex items-center">
              3D Terrain
              {!mapLoaded && (
                <span className="flex items-center ml-2 text-xs text-muted-foreground">
                  <Loader className="h-3 w-3 mr-1 animate-spin" />
                  loading
                </span>
              )}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hillshade" 
              checked={visibleLayers[TOPO_LAYERS.HILLSHADE]} 
              onCheckedChange={() => handleLayerToggle(TOPO_LAYERS.HILLSHADE)}
              disabled={!mapLoaded}
            />
            <Label htmlFor="hillshade" className="text-sm cursor-pointer flex items-center">
              Hillshade
              {!mapLoaded && (
                <span className="flex items-center ml-2 text-xs text-muted-foreground">
                  <Loader className="h-3 w-3 mr-1 animate-spin" />
                  loading
                </span>
              )}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="contour" 
              checked={visibleLayers[TOPO_LAYERS.CONTOUR]} 
              onCheckedChange={() => handleLayerToggle(TOPO_LAYERS.CONTOUR)}
              disabled={!mapLoaded}
            />
            <Label htmlFor="contour" className="text-sm cursor-pointer flex items-center">
              Contour Lines
              {!mapLoaded && (
                <span className="flex items-center ml-2 text-xs text-muted-foreground">
                  <Loader className="h-3 w-3 mr-1 animate-spin" />
                  loading
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
