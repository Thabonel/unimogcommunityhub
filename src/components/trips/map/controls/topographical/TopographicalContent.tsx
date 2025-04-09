
import { TOPO_LAYERS } from '../../utils';
import LayerToggle from './LayerToggle';
import LoadingState from './LoadingState';
import InitializingState from './InitializingState';
import useLayerToggle from './useLayerToggle';
import mapboxgl from 'mapbox-gl';

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
  // Use our custom hook for toggle functionality
  const { handleToggleLayer } = useLayerToggle({
    map,
    visibleLayers,
    setVisibleLayers,
    toggleLayer
  });

  // If map isn't loaded yet, show loading state
  if (!mapLoaded) {
    return <LoadingState />;
  }

  // If layers aren't initialized, show initializing state
  if (!layersInitialized) {
    return <InitializingState onInitialize={onForceInitialize} />;
  }

  return (
    <div className="space-y-2">
      <LayerToggle
        layerId={TOPO_LAYERS.TERRAIN_3D}
        label="3D Terrain"
        isVisible={visibleLayers[TOPO_LAYERS.TERRAIN_3D]}
        onToggle={handleToggleLayer}
      />
      <LayerToggle
        layerId={TOPO_LAYERS.HILLSHADE}
        label="Hill Shading"
        isVisible={visibleLayers[TOPO_LAYERS.HILLSHADE]}
        onToggle={handleToggleLayer}
      />
      <LayerToggle
        layerId={TOPO_LAYERS.CONTOUR}
        label="Contour Lines"
        isVisible={visibleLayers[TOPO_LAYERS.CONTOUR]}
        onToggle={handleToggleLayer}
      />
    </div>
  );
};

export default TopographicalContent;
