
import React, { useState } from 'react';
import { TOPO_LAYERS } from '../../utils';
import LayerStateDisplay from './LayerStateDisplay';

interface LayerControlsProps {
  visibleLayers: Record<string, boolean>;
  onToggleLayer: (layerId: string) => void;
}

const LayerControls = ({ 
  visibleLayers, 
  onToggleLayer 
}: LayerControlsProps) => {
  const [togglingLayers, setTogglingLayers] = useState<Record<string, boolean>>({});

  // Wrapper for toggle that tracks toggling state
  const handleLayerToggle = (layerId: string) => {
    setTogglingLayers(prev => ({ ...prev, [layerId]: true }));
    
    // Call the actual toggle handler
    onToggleLayer(layerId);
    
    // Reset toggling state after a delay
    setTimeout(() => {
      setTogglingLayers(prev => ({ ...prev, [layerId]: false }));
    }, 500);
  };

  const getLayerName = (layerId: string): string => {
    switch (layerId) {
      case TOPO_LAYERS.CONTOUR:
        return 'Contour Lines';
      case TOPO_LAYERS.TERRAIN_3D:
        return '3D Terrain';
      default:
        return layerId;
    }
  };

  return (
    <div className="space-y-2">
      {/* 3D Terrain Toggle */}
      <LayerStateDisplay
        layerId={TOPO_LAYERS.TERRAIN_3D}
        label={getLayerName(TOPO_LAYERS.TERRAIN_3D)}
        isVisible={visibleLayers[TOPO_LAYERS.TERRAIN_3D]}
        isToggling={togglingLayers[TOPO_LAYERS.TERRAIN_3D]}
        onToggleLayer={handleLayerToggle}
      />

      {/* Contour Lines Toggle */}
      <LayerStateDisplay
        layerId={TOPO_LAYERS.CONTOUR}
        label={getLayerName(TOPO_LAYERS.CONTOUR)}
        isVisible={visibleLayers[TOPO_LAYERS.CONTOUR]} 
        isToggling={togglingLayers[TOPO_LAYERS.CONTOUR]}
        onToggleLayer={handleLayerToggle}
      />
    </div>
  );
};

export default LayerControls;
