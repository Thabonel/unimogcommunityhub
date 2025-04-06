
// Re-export all functionality from the modular utilities
// This maintains backward compatibility with existing code

import mapboxgl from 'mapbox-gl';

// Re-export from styleUtils
export { MAP_STYLES } from './utils/styleUtils';

// Re-export from layerUtils
export { TOPO_LAYERS, addDemSource, addTopographicalLayers, toggleLayerVisibility } from './utils/layerUtils';

// Re-export from terrainUtils
export { enableTerrain, disableTerrain } from './utils/terrainUtils';

// Re-export from navigationUtils
export { fitMapToBounds, flyToLocation } from './utils/navigationUtils';

// Re-export from tokenUtils
export { 
  getMapboxToken, 
  hasMapboxToken, 
  isValidTokenFormat,
  isTokenFormatValid,
  validateMapboxToken 
} from './utils/tokenUtils';
