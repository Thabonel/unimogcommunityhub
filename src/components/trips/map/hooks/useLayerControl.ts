import { useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { 
  TOPO_LAYERS, 
  initializeAllLayers, 
  toggleLayerVisibility 
} from '../utils/layerUtils';
import { toast } from 'sonner';

interface UseLayerControlProps {
  map: mapboxgl.Map | null;
}

/**
 * Hook to manage map layer controls
 */
export const useLayerControl = ({ map }: UseLayerControlProps) => {
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    [TOPO_LAYERS.HILLSHADE]: false,
    [TOPO_LAYERS.CONTOUR]: false,
    [TOPO_LAYERS.TERRAIN_3D]: false
  });
  
  const [expandedSection, setExpandedSection] = useState<string | null>("topographical");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layersInitialized, setLayersInitialized] = useState(false);
  const [initializationAttempts, setInitializationAttempts] = useState(0);

  // Toggle a section open/closed
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  }, [expandedSection]);

  // Initialize layers when map is loaded
  useEffect(() => {
    if (!map) return;

    // Check if map is loaded
    const checkMapLoaded = () => {
      if (map.loaded()) {
        console.log('Map is loaded, ready for layer initialization');
        setMapLoaded(true);
        return true;
      }
      return false;
    };

    // If map is already loaded, mark as loaded
    if (checkMapLoaded()) {
      return;
    }

    // Otherwise, set up event listener for load event
    const onLoad = () => {
      console.log('Map load event fired');
      setMapLoaded(true);
    };

    map.on('load', onLoad);
    
    // Also listen for style.load events which happen after style changes
    map.on('style.load', () => {
      console.log('Map style loaded event fired');
      // When style changes, layers need to be reinitialized
      setLayersInitialized(false);
      
      // Attempt to initialize layers after style load
      // Slight delay to ensure map is ready
      setTimeout(() => {
        initializeLayersManually();
      }, 300);
    });

    return () => {
      map.off('load', onLoad);
    };
  }, [map]);

  // Initialize layers once map is loaded
  useEffect(() => {
    if (!map || !mapLoaded || layersInitialized) return;

    console.log('Attempting to initialize layers automatically');
    
    try {
      const success = initializeAllLayers(map);
      
      if (success) {
        console.log('Layers initialized successfully');
        setLayersInitialized(true);
      } else {
        console.warn('Layer initialization unsuccessful, will retry');
        // Retry with increasing delays
        const retryDelay = Math.min(2000, 500 * (initializationAttempts + 1));
        
        const timer = setTimeout(() => {
          setInitializationAttempts(prev => prev + 1);
          
          // Try again with the manual initialization
          initializeLayersManually();
        }, retryDelay);
        
        return () => clearTimeout(timer);
      }
    } catch (err) {
      console.error('Error initializing layers:', err);
    }
  }, [map, mapLoaded, layersInitialized, initializationAttempts]);

  // Function to manually trigger layer initialization
  const initializeLayersManually = useCallback(() => {
    if (!map) {
      console.warn('Cannot initialize layers: Map not available');
      return false;
    }
    
    if (!map.loaded()) {
      console.warn('Cannot initialize layers: Map not fully loaded');
      return false;
    }
    
    console.log('Manually initializing layers');
    
    try {
      const success = initializeAllLayers(map);
      
      if (success) {
        console.log('Manual layer initialization successful');
        setLayersInitialized(true);
        return true;
      } else {
        console.warn('Manual layer initialization unsuccessful');
        return false;
      }
    } catch (err) {
      console.error('Error in manual layer initialization:', err);
      return false;
    }
  }, [map]);

  // Toggle visibility of a layer
  const toggleLayer = useCallback((layerId: string) => {
    if (!map) {
      toast.error('Map is not available');
      return;
    }
    
    if (!mapLoaded) {
      toast.warning('Map is still loading');
      return;
    }
    
    try {
      let isVisible = false;
      
      // Handle special case for 3D terrain
      if (layerId === TOPO_LAYERS.TERRAIN_3D) {
        // Toggle terrain
        if (visibleLayers[TOPO_LAYERS.TERRAIN_3D]) {
          map.setTerrain(null);
        } else {
          map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        }
        isVisible = !visibleLayers[TOPO_LAYERS.TERRAIN_3D];
      } else {
        // For regular layers
        isVisible = toggleLayerVisibility(map, layerId);
      }
      
      // Update visibility state
      setVisibleLayers(prev => ({
        ...prev,
        [layerId]: isVisible
      }));
    } catch (err) {
      console.error(`Error toggling layer ${layerId}:`, err);
      toast.error(`Error toggling layer: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [map, mapLoaded, visibleLayers]);

  return {
    visibleLayers,
    setVisibleLayers,
    expandedSection,
    toggleSection,
    mapLoaded,
    layersInitialized,
    initializeLayersManually,
    toggleLayer
  };
};
