
// Instead of using wildcard exports which can cause conflicts,
// we'll explicitly re-export the needed functions from each file

// From layerUtils
export { toggleLayerVisibility, initializeAllLayers, TOPO_LAYERS } from './layerUtils';

// From terrainUtils
export { addDemSource, addTopographicalLayers, addTerrainLayer } from './terrainUtils';

// From tokenUtils - this has isMapboxSupported
export { 
  getMapboxToken, 
  saveMapboxToken, 
  validateMapboxToken, 
  isTokenFormatValid, 
  validateAndTestCurrentToken,
  getActiveToken,
  hasMapboxToken
} from './tokenUtils';

// Specifically export isMapboxSupported only from tokenUtils to avoid conflict
export { isMapboxSupported } from './tokenUtils';

// From mapInitUtils - we won't export its isMapboxSupported function
export { 
  initializeMap, 
  cleanupMap, 
  addDefaultControls 
} from './mapInitUtils';

// From styleUtils
export { MAP_STYLES } from './styleUtils';

