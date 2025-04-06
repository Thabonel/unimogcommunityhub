
import { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { TOPO_LAYERS } from '../mapConfig';

interface UseLayerControlProps {
  map: mapboxgl.Map | null;
}

export const useLayerControl = ({ map }: UseLayerControlProps) => {
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    [TOPO_LAYERS.HILLSHADE]: false,
    [TOPO_LAYERS.CONTOUR]: false,
    [TOPO_LAYERS.TERRAIN_3D]: false,
  });

  const [expandedSection, setExpandedSection] = useState<string | null>("topographical");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadingCheckCount, setLoadingCheckCount] = useState<number>(0);

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Improved map load check
  useEffect(() => {
    if (!map) return;
    
    const maxAttempts = 20; // Prevent infinite checking
    
    const checkIfLoaded = () => {
      setLoadingCheckCount(prev => prev + 1);
      
      // Check if map is fully loaded
      if (map.loaded() && map.isStyleLoaded()) {
        console.log('Map is now fully loaded and ready for layer control');
        setMapLoaded(true);
        return;
      }

      // If map still not loaded after 20 attempts (10 seconds), consider it "loaded" anyway
      if (loadingCheckCount >= maxAttempts) {
        console.log('Map loading check timeout reached, continuing anyway');
        setMapLoaded(true);
        return;
      }
      
      console.log('Map not yet loaded, waiting...');
      setTimeout(checkIfLoaded, 500);
    };
    
    // Also listen for the map's 'load' and 'idle' events for more reliable detection
    const handleMapLoad = () => {
      console.log('Map load event fired');
      // Don't set loaded state yet - wait for style.load too
    };
    
    const handleStyleLoad = () => {
      console.log('Map style.load event fired');
      setMapLoaded(true);
    };
    
    const handleIdle = () => {
      console.log('Map idle event fired');
      setMapLoaded(true);
    };
    
    map.on('load', handleMapLoad);
    map.on('style.load', handleStyleLoad);
    map.on('idle', handleIdle);
    
    // Start the loading check
    checkIfLoaded();
    
    return () => {
      map.off('load', handleMapLoad);
      map.off('style.load', handleStyleLoad);
      map.off('idle', handleIdle);
    };
  }, [map, loadingCheckCount]);

  // Initialize state based on map state when component mounts and map is loaded
  useEffect(() => {
    if (!map || !mapLoaded) return;
    
    try {
      console.log('Initializing layer control state from map');
      
      // Check if terrain is enabled
      const terrain = map.getTerrain();
      const is3DEnabled = !!terrain;
      
      // Check layer visibility
      let hillshadeVisibility = false;
      let contourVisibility = false;
      
      // Safely check for layer visibility
      try {
        if (map.getLayer(TOPO_LAYERS.HILLSHADE)) {
          hillshadeVisibility = map.getLayoutProperty(TOPO_LAYERS.HILLSHADE, 'visibility') === 'visible';
        }
      } catch (e) {
        console.warn('Error checking hillshade visibility:', e);
      }
      
      try {
        if (map.getLayer(TOPO_LAYERS.CONTOUR)) {
          contourVisibility = map.getLayoutProperty(TOPO_LAYERS.CONTOUR, 'visibility') === 'visible';
        }
      } catch (e) {
        console.warn('Error checking contour visibility:', e);
      }
      
      console.log('Current layer state:', { 
        terrain: is3DEnabled, 
        hillshade: hillshadeVisibility, 
        contour: contourVisibility 
      });
      
      setVisibleLayers({
        [TOPO_LAYERS.HILLSHADE]: hillshadeVisibility,
        [TOPO_LAYERS.CONTOUR]: contourVisibility,
        [TOPO_LAYERS.TERRAIN_3D]: is3DEnabled
      });
    } catch (error) {
      console.error('Error initializing layer control state:', error);
    }
  }, [map, mapLoaded]);

  return {
    visibleLayers,
    setVisibleLayers,
    expandedSection,
    toggleSection,
    mapLoaded,
  };
};

export default useLayerControl;
