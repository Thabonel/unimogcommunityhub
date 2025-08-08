import mapboxgl from 'mapbox-gl';
import { toggleLayerVisibility } from '../../utils';
import { toast } from 'sonner';

interface UseLayerToggleProps {
  map: mapboxgl.Map | null;
  visibleLayers: Record<string, boolean>;
  setVisibleLayers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  toggleLayer?: (layerId: string) => void;
}

const useLayerToggle = ({
  map,
  visibleLayers,
  setVisibleLayers,
  toggleLayer
}: UseLayerToggleProps) => {
  // Toggle layer visibility
  const handleToggleLayer = (layerId: string) => {
    // If an external toggleLayer function is provided, use it
    if (toggleLayer) {
      toggleLayer(layerId);
      return;
    }

    // Otherwise, use our internal implementation
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
    handleToggleLayer
  };
};

export default useLayerToggle;
