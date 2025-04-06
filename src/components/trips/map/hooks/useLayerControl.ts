
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
        
        // Try to initialize layers anyway
        if (!layersInitialized && map.isStyleLoaded()) {
          try {
            addTopographicalLayers(map);
            setLayersInitialized(true);
            console.log('Force initialized topographical layers');
          } catch (err) {
            console.error('Error force initializing layers:', err);
          }
        }
      }
    }, 5000); // Force loaded state after 5 seconds
    
    return () => clearTimeout(forceLoadTimeout);
  }, [map, mapLoaded, layersInitialized]);

  // Improved map load detection
  useEffect(() => {
    if (!map) return;
    
    // Check if map is already loaded and has style
    if (map.loaded() && map.isStyleLoaded()) {
      console.log('Map already loaded on hook initialization');
      setMapLoaded(true);
      
      // Initialize layers if not done already
      if (!layersInitialized) {
        try {
          addTopographicalLayers(map);
          setLayersInitialized(true);
          console.log('Initialized topo layers on already loaded map');
        } catch (err) {
          console.error('Error initializing topo layers on init:', err);
        }
      }
      return; // No need to add listeners if already loaded
    }
    
    const checkMapLoaded = () => {
      if (!map) return false;
      
      mapLoadAttempts.current++;
      console.log(`Checking map loaded (attempt ${mapLoadAttempts.current}/${maxLoadAttempts})`);
      
      if (map.loaded() && map.isStyleLoaded()) {
        console.log('Map fully loaded!');
        setMapLoaded(true);
        
        // Initialize topo layers
        try {
          addTopographicalLayers(map);
          setLayersInitialized(true);
          console.log('Added topographical layers after load check');
        } catch (err) {
          console.error('Error adding topo layers after load check:', err);
        }
        
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
        
        // Try to initialize anyway if the style appears to be loaded
        if (map.isStyleLoaded()) {
          try {
            addTopographicalLayers(map);
            setLayersInitialized(true);
            console.log('Added topo layers after max attempts');
          } catch (err) {
            console.error('Error adding topo layers after max attempts:', err);
          }
        }
        
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
      // Don't immediately trust the load event; verify style is also loaded
      setTimeout(() => {
        if (map.isStyleLoaded()) {
          console.log('Map style verified as loaded after load event');
          setMapLoaded(true);
          
          // Initialize topographical layers with a slight delay
          setTimeout(() => {
            try {
              addTopographicalLayers(map);
              setLayersInitialized(true);
              console.log('Added topographical layers after load event');
            } catch (err) {
              console.error('Error initializing topo layers after load:', err);
            }
          }, 300);
        } else {
          // Start polling if style not ready yet
          if (!loadCheckTimerRef.current && !mapLoaded) {
            loadCheckTimerRef.current = window.setInterval(checkMapLoaded, 500);
          }
        }
      }, 100);
    };
    
    const handleStyleLoad = () => {
      console.log('Style load event detected');
      setMapLoaded(true);
      
      // Initialize layers with a slight delay
      setTimeout(() => {
        try {
          addTopographicalLayers(map);
          setLayersInitialized(true);
          console.log('Added topographical layers after style load');
        } catch (err) {
          console.error('Error initializing layers after style load:', err);
        }
      }, 300);
      
      // Clear interval if running
      if (loadCheckTimerRef.current) {
        window.clearInterval(loadCheckTimerRef.current);
        loadCheckTimerRef.current = null;
      }
    };
    
    const handleIdle = () => {
      console.log('Map idle event detected');
      if (!mapLoaded && map.isStyleLoaded()) {
        console.log('Map confirmed loaded on idle');
        setMapLoaded(true);
        
        // Initialize layers if not already done
        if (!layersInitialized) {
          try {
            addTopographicalLayers(map);
            setLayersInitialized(true);
            console.log('Added topographical layers on idle');
          } catch (err) {
            console.error('Error initializing layers on idle:', err);
          }
        }
        
        // Clear interval if running
        if (loadCheckTimerRef.current) {
          window.clearInterval(loadCheckTimerRef.current);
          loadCheckTimerRef.current = null;
        }
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

  // Update layer visibility state based on map state when component mounts
  useEffect(() => {
    if (!map || !mapLoaded) return;
    
    try {
      // Check if terrain is enabled
      const terrain = map.getTerrain();
      const is3DEnabled = !!terrain;
      
      // Check layer visibility safely
      const getLayerVisibility = (layerId: string): boolean => {
        try {
          if (map.getLayer(layerId)) {
            return map.getLayoutProperty(layerId, 'visibility') === 'visible';
          }
        } catch (e) {
          console.warn(`Error checking ${layerId} visibility:`, e);
        }
        return false;
      };
      
      const hillshadeVisibility = getLayerVisibility(TOPO_LAYERS.HILLSHADE);
      const contourVisibility = getLayerVisibility(TOPO_LAYERS.CONTOUR);
      
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
    layersInitialized,
  };
};

export default useLayerControl;
