
import { useMapLoaded } from './useMapLoaded';
import { useLayerVisibility } from './useLayerVisibility';
import { useSectionExpand } from './useSectionExpand';
import { useLayerInitialization } from './useLayerInitialization';
import mapboxgl from 'mapbox-gl';

interface UseLayerControlProps {
  map: mapboxgl.Map | null;
}

/**
 * Main hook that composes other layer-related hooks for the map controls
 */
export const useLayerControl = ({ map }: UseLayerControlProps) => {
  // Use our smaller, focused hooks
  const { mapLoaded } = useMapLoaded({ map });
  
  const { visibleLayers, setVisibleLayers, toggleLayer } = useLayerVisibility({ map });
  
  const { expandedSection, toggleSection } = useSectionExpand('topographical');
  
  const { layersInitialized, initializeLayersManually } = useLayerInitialization({ 
    map, 
    mapLoaded 
  });
  
  // Return all the state and handlers
  return {
    visibleLayers,
    setVisibleLayers,
    toggleLayer,
    expandedSection,
    toggleSection,
    mapLoaded,
    layersInitialized,
    initializeLayersManually
  };
};

export default useLayerControl;
