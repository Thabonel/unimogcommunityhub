
import { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { TOPO_LAYERS, addTopographicalLayers } from '../utils/layerUtils';
import { toast } from 'sonner';

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
  const [layersInitialized, setLayersInitialized] = useState<boolean>(false);
  const mapLoadAttempts = useRef(0);
  const maxLoadAttempts = 5;
  const loadCheckTimerRef = useRef<number | null>(null);
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Force the map to be considered as loaded after a timeout
  useEffect(() => {
    if (!map || mapLoaded) return;
    
    const forceLoadTimeout = setTimeout(() => {
      if (!mapLoaded && map) {
        console.log('Force considering map as loaded after timeout');
        setMapLoaded(true);
      }
    }, 5000); // Force loaded state after 5 seconds
    
    return () => clearTimeout(forceLoadTimeout);
  }, [map, mapLoaded]);

  // Improved map load detection
  useEffect(() => {
    if (!map) return;
    
    // Check if map is already loaded
    if (map.loaded()) {
      console.log('Map already loaded on hook initialization');
      setMapLoaded(true);
      return; // No need to add listeners if already loaded
    }
    
    const checkMapLoaded = () => {
      if (!map) return false;
      
      mapLoadAttempts.current++;
      console.log(`Checking map loaded (attempt ${mapLoadAttempts.current}/${maxLoadAttempts})`);
      
      if (map.loaded()) {
        console.log('Map fully loaded!');
        setMapLoaded(true);
        
        if (loadCheckTimerRef.current) {
          window.clearInterval(loadCheckTimerRef.current);
          loadCheckTimerRef.current = null;
        }
        return true;
      }
      
      // Give up after max attempts and force consider it loaded
      if (mapLoadAttempts.current >= maxLoadAttempts) {
        console.log('Reached max load check attempts, forcing loaded state');
        setMapLoaded(true);
        
        if (loadCheckTimerRef.current) {
          window.clearInterval(loadCheckTimerRef.current);
          loadCheckTimerRef.current = null;
        }
        return true;
      }
      
      return false;
    };
    
    const handleMapLoad = () => {
      console.log('Map load event detected');
      setMapLoaded(true);
    };
    
    const handleStyleLoad = () => {
      console.log('Style load event detected');
      setMapLoaded(true);
      
      // Initialize layers with a slight delay to ensure style is fully loaded
      setTimeout(() => {
        if (map && map.isStyleLoaded()) {
          try {
            initializeLayers();
          } catch (err) {
            console.error('Error initializing layers after style load:', err);
          }
        }
      }, 500);
    };
    
    const handleIdle = () => {
      console.log('Map idle event detected');
      if (!mapLoaded) {
        setMapLoaded(true);
      }
      
      // Try to initialize layers if not already done
      if (!layersInitialized && map.isStyleLoaded()) {
        try {
          initializeLayers();
        } catch (err) {
          console.error('Error initializing layers on idle:', err);
        }
      }
    };

    // Helper function to initialize layers
    const initializeLayers = () => {
      if (!map || layersInitialized) return;
      
      try {
        addTopographicalLayers(map);
        setLayersInitialized(true);
        console.log('Topographical layers initialized successfully');
        
        // Update layer visibility state after initialization
        updateLayerVisibilityState();
      } catch (err) {
        console.error('Failed to initialize layers:', err);
      }
    };
    
    // Helper function to update layer visibility state
    const updateLayerVisibilityState = () => {
      if (!map) return;
      
      try {
        // Check if terrain is enabled
        const terrain = map.getTerrain();
        const is3DEnabled = !!terrain;
        
        // Check layer visibility safely
        const getLayerVisibility = (layerId: string): boolean => {
          try {
            // First check if the layer exists
            if (!map.getLayer(layerId)) {
              console.log(`Layer ${layerId} does not exist yet`);
              return false;
            }
            // Then check visibility
            return map.getLayoutProperty(layerId, 'visibility') === 'visible';
          } catch (e) {
            console.warn(`Error checking ${layerId} visibility:`, e);
            return false;
          }
        };
        
        // Check each layer safely
        const hillshadeVisible = map.getLayer(TOPO_LAYERS.HILLSHADE) ? 
          getLayerVisibility(TOPO_LAYERS.HILLSHADE) : false;
          
        const contourVisible = map.getLayer(TOPO_LAYERS.CONTOUR) ? 
          getLayerVisibility(TOPO_LAYERS.CONTOUR) : false;
        
        // Update state
        setVisibleLayers({
          [TOPO_LAYERS.HILLSHADE]: hillshadeVisible,
          [TOPO_LAYERS.CONTOUR]: contourVisible,
          [TOPO_LAYERS.TERRAIN_3D]: is3DEnabled
        });
        
        console.log('Layer visibility updated:', {
          hillshade: hillshadeVisible,
          contour: contourVisible,
          terrain3D: is3DEnabled
        });
      } catch (error) {
        console.error('Error updating layer visibility state:', error);
      }
    };
    
    // Start the interval check right away
    if (!mapLoaded && !loadCheckTimerRef.current) {
      loadCheckTimerRef.current = window.setInterval(checkMapLoaded, 500);
    }
    
    // Register event listeners for different stages of map loading
    map.on('load', handleMapLoad);
    map.on('style.load', handleStyleLoad);
    map.on('idle', handleIdle);
    
    // Clean up event listeners and interval on unmount
    return () => {
      if (map) {
        map.off('load', handleMapLoad);
        map.off('style.load', handleStyleLoad);
        map.off('idle', handleIdle);
      }
      
      if (loadCheckTimerRef.current) {
        window.clearInterval(loadCheckTimerRef.current);
        loadCheckTimerRef.current = null;
      }
    };
  }, [map, mapLoaded, layersInitialized]);

  // Expose a function to manually initialize layers
  const initializeLayersManually = () => {
    if (!map || !mapLoaded || layersInitialized) return;
    
    console.log('Manually initializing topographical layers');
    try {
      addTopographicalLayers(map);
      setLayersInitialized(true);
      console.log('Layers manually initialized');
    } catch (err) {
      console.error('Error manually initializing layers:', err);
    }
  };

  return {
    visibleLayers,
    setVisibleLayers,
    expandedSection,
    toggleSection,
    mapLoaded,
    layersInitialized,
    initializeLayersManually
  };
};

export default useLayerControl;
