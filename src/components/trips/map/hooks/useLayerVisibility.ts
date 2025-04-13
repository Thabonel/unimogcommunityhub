
import { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { TOPO_LAYERS, toggleLayerVisibility } from '../utils/layerUtils';
import { toast } from 'sonner';

interface UseLayerVisibilityProps {
  map: mapboxgl.Map | null;
}

/**
 * Hook to manage the visibility state of map layers
 */
export const useLayerVisibility = ({ map }: UseLayerVisibilityProps) => {
  // Track which layers are visible
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    [TOPO_LAYERS.TERRAIN_3D]: false,
    [TOPO_LAYERS.CONTOUR]: false
  });
  
  // Toggle layer visibility
  const toggleLayer = (layerId: string) => {
    if (!map) {
      toast.error('Map not available');
      return;
    }
    
    const newVisibility = !visibleLayers[layerId];
    
    // Try to toggle the layer
    const success = toggleLayerVisibility(map, layerId, newVisibility);
    
    if (success) {
      // Update state only if the toggle was successful
      setVisibleLayers(prev => ({
        ...prev,
        [layerId]: newVisibility
      }));
    } else {
      toast.error(`Failed to toggle ${layerId} layer`);
    }
  };
  
  return {
    visibleLayers,
    setVisibleLayers,
    toggleLayer
  };
};

export default useLayerVisibility;
