
import React from 'react';
import LoadingState from './LoadingState';
import InitializingState from './InitializingState';
import LayerControls from './LayerControls';

interface MapStateContentProps {
  mapLoaded: boolean;
  layersInitialized: boolean;
  visibleLayers: Record<string, boolean>;
  onForceInitialize: () => void;
  onToggleLayer: (layerId: string) => void;
}

const MapStateContent = ({
  mapLoaded,
  layersInitialized,
  visibleLayers,
  onForceInitialize,
  onToggleLayer
}: MapStateContentProps) => {
  // If map isn't loaded yet, show loading state
  if (!mapLoaded) {
    return <LoadingState />;
  }

  // If layers aren't initialized, show initializing state
  if (!layersInitialized) {
    return <InitializingState onForceInitialize={onForceInitialize} />;
  }

  // Map is loaded and layers are initialized, show the layer controls
  return (
    <LayerControls
      visibleLayers={visibleLayers}
      onToggleLayer={onToggleLayer}
    />
  );
};

export default MapStateContent;
