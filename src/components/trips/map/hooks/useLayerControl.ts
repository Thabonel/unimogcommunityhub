
import { useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { TOPO_LAYERS, initializeAllLayers, toggleLayerVisibility } from '../utils/layerUtils';
import { toast } from 'sonner';

interface UseLayerControlProps {
  map: mapboxgl.Map | null;
}

export const useLayerControl = ({ map }: UseLayerControlProps) => {
  // Track which layers are visible
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    [TOPO_LAYERS.TERRAIN_3D]: false,
    [TOPO_LAYERS.HILLSHADE]: false,
    [TOPO_LAYERS.CONTOUR]: false
  });
  
  // Track which section is expanded
  const [expandedSection, setExpandedSection] = useState<string | null>('topographical');
  
  // Track if the map is loaded
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  
  // Track if the layers are initialized
  const [layersInitialized, setLayersInitialized] = useState<boolean>(false);
  
  // Toggle section expand/collapse
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  // Initialize layers manually
  const initializeLayersManually = useCallback(() => {
    if (!map) {
      toast.error('Map not available');
      return;
    }
    
    // If map style is not loaded, wait for it
    if (!map.isStyleLoaded()) {
      toast.info('Waiting for map style to load...');
      
      // Set up one-time listener for style.load
      map.once('style.load', () => {
        const success = initializeAllLayers(map);
        if (success) {
          setLayersInitialized(true);
          toast.success('Layers initialized successfully');
        } else {
          toast.error('Failed to initialize layers');
        }
      });
      
      return;
    }
    
    // Try to initialize layers
    const success = initializeAllLayers(map);
    if (success) {
      setLayersInitialized(true);
      toast.success('Layers initialized successfully');
    } else {
      toast.error('Failed to initialize layers');
    }
  }, [map]);
  
  // Listen for map load
  useEffect(() => {
    if (!map) return;
    
    const handleMapLoad = () => {
      console.log('Map loaded in useLayerControl');
      setMapLoaded(true);
      
      // Try to initialize layers
      const success = initializeAllLayers(map);
      if (success) {
        setLayersInitialized(true);
      }
    };
    
    const handleStyleLoad = () => {
      console.log('Map style loaded in useLayerControl');
      
      // Try to initialize layers when style loads
      const success = initializeAllLayers(map);
      if (success) {
        setLayersInitialized(true);
      }
    };
    
    // Check if map is already loaded
    if (map.loaded()) {
      handleMapLoad();
    } else {
      map.on('load', handleMapLoad);
    }
    
    // Listen for style changes
    map.on('style.load', handleStyleLoad);
    
    return () => {
      // Clean up event listeners
      map.off('load', handleMapLoad);
      map.off('style.load', handleStyleLoad);
    };
  }, [map]);
  
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
