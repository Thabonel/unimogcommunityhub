
import { useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { TOPO_LAYERS, toggleLayerVisibility, initializeAllLayers, enableTerrain, disableTerrain } from '../../utils';
import { toast } from 'sonner';

interface UseLayerToggleProps {
  map: mapboxgl.Map | null;
  mapLoaded: boolean;
  visibleLayers: Record<string, boolean>;
  setVisibleLayers: (layers: Record<string, boolean>) => void;
  initializeLayersWithRetry: () => boolean;
}

export const useLayerToggle = ({
  map,
  mapLoaded,
  visibleLayers,
  setVisibleLayers,
  initializeLayersWithRetry
}: UseLayerToggleProps) => {
  const [isToggling, setIsToggling] = useState<Record<string, boolean>>({});

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

  const handleToggleLayer = useCallback((layerId: string) => {
    if (!map) {
      toast.error("Map is not available. Please refresh the page.");
      return;
    }

    if (!mapLoaded) {
      toast.error("Map is still loading. Please wait a moment.");
      return;
    }

    // Set this specific layer to toggling state
    setIsToggling(prev => ({ ...prev, [layerId]: true }));

    // Use a timeout to ensure UI updates
    setTimeout(() => {
      try {
        // Check if map style is loaded
        if (!map.isStyleLoaded()) {
          console.log(`Map style not loaded, attempting to force initialize layers before toggling ${layerId}`);
          
          // Try to force initialize layers
          initializeLayersWithRetry();
          
          // Show warning to user
          toast.warning("Map layers are still initializing. Please try again in a moment.");
          setIsToggling(prev => ({ ...prev, [layerId]: false }));
          return;
        }
        
        let success = false;
        
        // Special handling for 3D Terrain
        if (layerId === TOPO_LAYERS.TERRAIN_3D) {
          if (visibleLayers[TOPO_LAYERS.TERRAIN_3D]) {
            success = disableTerrain(map);
          } else {
            success = enableTerrain(map);
          }
        } else {
          // For regular layers, initialize if they don't exist
          if (!map.getLayer(layerId) && initializeLayersWithRetry()) {
            console.log(`Layer ${layerId} initialized successfully`);
          }
          
          // Now toggle the layer visibility
          if (map.getLayer(layerId)) {
            // Pass all required parameters to toggleLayerVisibility
            success = toggleLayerVisibility(
              map, 
              layerId, 
              !visibleLayers[layerId]
            );
          } else {
            console.error(`Layer ${layerId} still does not exist after initialization attempt`);
            toast.error(`Cannot toggle ${getLayerName(layerId)}, layer not available`);
            setIsToggling(prev => ({ ...prev, [layerId]: false }));
            return;
          }
        }
        
        // Update the visible layers state
        setVisibleLayers({
          ...visibleLayers,
          [layerId]: layerId === TOPO_LAYERS.TERRAIN_3D 
            ? !visibleLayers[TOPO_LAYERS.TERRAIN_3D] 
            : !visibleLayers[layerId]
        });
      } catch (error) {
        console.error(`Error toggling ${layerId}:`, error);
        toast.error(`Failed to toggle ${getLayerName(layerId)}`);
      } finally {
        setIsToggling(prev => ({ ...prev, [layerId]: false }));
      }
    }, 100);
  }, [map, mapLoaded, visibleLayers, setVisibleLayers, initializeLayersWithRetry]);

  return {
    isToggling,
    handleToggleLayer,
    getLayerName
  };
};

export default useLayerToggle;
