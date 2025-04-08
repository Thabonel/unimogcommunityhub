
import LayerToggle from './LayerToggle';
import LoadingState from './LoadingState';
import InitializingState from './InitializingState';
import mapboxgl from 'mapbox-gl';
import { TOPO_LAYERS } from '../../utils';

interface TopographicalContentProps {
  isLoading: boolean;
  isInitializing: boolean;
  map: mapboxgl.Map | null;
  visibleLayers: Record<string, boolean>;
  isToggling: Record<string, boolean>;
  onToggleLayer: (layerId: string) => void;
  onForceInitialize: () => void;
}

const TopographicalContent = ({
  isLoading,
  isInitializing,
  map,
  visibleLayers,
  isToggling,
  onToggleLayer,
  onForceInitialize
}: TopographicalContentProps) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (isInitializing) {
    return <InitializingState onForceInitialize={onForceInitialize} />;
  }

  return (
    <div className="space-y-2">
      {/* 3D Terrain Toggle */}
      <LayerToggle
        id="terrain-toggle"
        label="3D Terrain"
        checked={visibleLayers[TOPO_LAYERS.TERRAIN_3D] || false}
        disabled={!map}
        isToggling={isToggling[TOPO_LAYERS.TERRAIN_3D] || false}
        onCheckedChange={() => onToggleLayer(TOPO_LAYERS.TERRAIN_3D)}
      />

      {/* Hillshade Toggle */}
      <LayerToggle
        id="hillshade-toggle"
        label="Hillshade"
        checked={visibleLayers[TOPO_LAYERS.HILLSHADE] || false}
        disabled={!map}
        isToggling={isToggling[TOPO_LAYERS.HILLSHADE] || false}
        onCheckedChange={() => onToggleLayer(TOPO_LAYERS.HILLSHADE)}
      />

      {/* Contour Lines Toggle */}
      <LayerToggle
        id="contour-toggle"
        label="Contour Lines"
        checked={visibleLayers[TOPO_LAYERS.CONTOUR] || false}
        disabled={!map}
        isToggling={isToggling[TOPO_LAYERS.CONTOUR] || false}
        onCheckedChange={() => onToggleLayer(TOPO_LAYERS.CONTOUR)}
      />
    </div>
  );
};

export default TopographicalContent;
