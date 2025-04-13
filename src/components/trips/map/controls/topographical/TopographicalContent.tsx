
import { TOPO_LAYERS } from '../../utils';
import LayerToggle from './LayerToggle';
import LoadingState from './LoadingState';
import InitializingState from './InitializingState';
import useLayerToggle from './useLayerToggle';
import mapboxgl from 'mapbox-gl';
import { useState } from 'react';

interface TopographicalContentProps {
  map: mapboxgl.Map | null;
  visibleLayers: Record<string, boolean>;
  setVisibleLayers: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  mapLoaded: boolean;
  layersInitialized: boolean;
  onForceInitialize: () => void;
  toggleLayer?: (layerId: string) => void;
}

const TopographicalContent = ({
  map,
  visibleLayers,
  setVisibleLayers,
  mapLoaded,
  layersInitialized,
  onForceInitialize,
  toggleLayer
}: TopographicalContentProps) => {
  const [togglingLayers, setTogglingLayers] = useState<Record<string, boolean>>({});
  
  // Use our custom hook for toggle functionality
  const { handleToggleLayer } = useLayerToggle({
    map,
    visibleLayers,
    setVisibleLayers,
    toggleLayer
  });

  // Wrapper for toggle that tracks toggling state
  const handleLayerToggle = (layerId: string) => {
    setTogglingLayers(prev => ({ ...prev, [layerId]: true }));
    
    // Call the actual toggle handler
    handleToggleLayer(layerId);
    
    // Reset toggling state after a delay
    setTimeout(() => {
      setTogglingLayers(prev => ({ ...prev, [layerId]: false }));
    }, 500);
  };

  // If map isn't loaded yet, show loading state
  if (!mapLoaded) {
    return <LoadingState />;
  }

  // If layers aren't initialized, show initializing state
  if (!layersInitialized) {
    return <InitializingState onForceInitialize={onForceInitialize} />;
  }

  return (
    <div className="space-y-2">
      <LayerToggle
        layerId={TOPO_LAYERS.TERRAIN_3D}
        label="3D Terrain"
        isVisible={visibleLayers[TOPO_LAYERS.TERRAIN_3D]}
        onToggle={handleLayerToggle}
        isToggling={togglingLayers[TOPO_LAYERS.TERRAIN_3D]}
      />
      <LayerToggle
        layerId={TOPO_LAYERS.HILLSHADE}
        label="Hill Shading"
        isVisible={visibleLayers[TOPO_LAYERS.HILLSHADE]}
        onToggle={handleLayerToggle}
        isToggling={togglingLayers[TOPO_LAYERS.HILLSHADE]}
      />
      <LayerToggle
        layerId={TOPO_LAYERS.CONTOUR}
        label="Contour Lines"
        isVisible={visibleLayers[TOPO_LAYERS.CONTOUR]}
        onToggle={handleLayerToggle}
        isToggling={togglingLayers[TOPO_LAYERS.CONTOUR]}
      />
    </div>
  );
};

export default TopographicalContent;
