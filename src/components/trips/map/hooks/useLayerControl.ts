
import { useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { TOPO_LAYERS, initializeAllLayers } from '../utils/layerUtils';

interface UseLayerControlProps {
  map: mapboxgl.Map | null;
}

export const useLayerControl = ({ map }: UseLayerControlProps) => {
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    [TOPO_LAYERS.HILLSHADE]: false,
    [TOPO_LAYERS.CONTOUR]: false,
    [TOPO_LAYERS.TERRAIN_3D]: false
  });
  
  const [expandedSection, setExpandedSection] = useState<string | null>("topographical");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [layersInitialized, setLayersInitialized] = useState<boolean>(false);
  const [initializationAttempts, setInitializationAttempts] = useState<number>(0);
  
  // Toggle section expanded state
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  // Initialize layers
  const initializeLayersManually = useCallback(() => {
    if (!map) return;
    
    console.log(`Manual layer initialization attempt #${initializationAttempts + 1}`);
    setInitializationAttempts(prev => prev + 1);
    
    // Try to initialize all layers
    const success = initializeAllLayers(map);
    
    if (success) {
      console.log('Layer initialization successful');
      setLayersInitialized(true);
    } else {
      console.log('Layer initialization failed, will retry later');
    }
  }, [map, initializationAttempts]);
  
  // Detect when map is loaded
  useEffect(() => {
    if (!map) return;
    
    // Check if the map style is already loaded
    if (map.isStyleLoaded()) {
      console.log('Map style already loaded');
      setMapLoaded(true);
      
      // Try to initialize layers
      const success = initializeAllLayers(map);
      setLayersInitialized(success);
    } else {
      // Listen for the style.load event
      const handleStyleLoad = () => {
        console.log('Map style loaded');
        setMapLoaded(true);
        
        // Try to initialize layers
        setTimeout(() => {
          const success = initializeAllLayers(map);
          setLayersInitialized(success);
        }, 500);
      };
      
      map.once('style.load', handleStyleLoad);
      
      // Also listen for the load event as a fallback
      map.once('load', () => {
        console.log('Map loaded');
        setMapLoaded(true);
        
        // Only initialize if not already done
        if (!layersInitialized) {
          setTimeout(() => {
            const success = initializeAllLayers(map);
            setLayersInitialized(success);
          }, 500);
        }
      });
      
      // Cleanup
      return () => {
        map.off('style.load', handleStyleLoad);
      };
    }
  }, [map, layersInitialized]);
  
  // Auto-retry initialization
  useEffect(() => {
    if (!map || !mapLoaded || layersInitialized || initializationAttempts >= 3) return;
    
    const timer = setTimeout(() => {
      console.log(`Auto-retrying layer initialization #${initializationAttempts + 1}`);
      initializeLayersManually();
    }, 1000 * (initializationAttempts + 1)); // Increase delay with each attempt
    
    return () => clearTimeout(timer);
  }, [map, mapLoaded, layersInitialized, initializationAttempts, initializeLayersManually]);
  
  // Re-initialize layers on style change
  useEffect(() => {
    if (!map) return;
    
    const handleStyleChange = () => {
      console.log('Style changed, reinitializing layers');
      setLayersInitialized(false);
      
      // Wait for the style to load before reinitializing
      map.once('style.load', () => {
        setTimeout(() => {
          const success = initializeAllLayers(map);
          setLayersInitialized(success);
          
          // Restore visibility state of layers
          Object.entries(visibleLayers).forEach(([layerId, isVisible]) => {
            if (isVisible && layerId !== TOPO_LAYERS.TERRAIN_3D) {
              try {
                map.setLayoutProperty(layerId, 'visibility', 'visible');
              } catch (e) {
                console.error(`Couldn't restore visibility for ${layerId}:`, e);
              }
            }
          });
          
          // Restore terrain if needed
          if (visibleLayers[TOPO_LAYERS.TERRAIN_3D]) {
            try {
              map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
            } catch (e) {
              console.error('Couldn\'t restore terrain:', e);
            }
          }
        }, 500);
      });
    };
    
    map.on('style.load', handleStyleChange);
    
    return () => {
      map.off('style.load', handleStyleChange);
    };
  }, [map, visibleLayers]);
  
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
