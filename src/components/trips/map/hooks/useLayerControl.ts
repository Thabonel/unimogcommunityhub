
import { useState, useEffect } from 'react';
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
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Improved map load detection
  useEffect(() => {
    if (!map) return;
    
    const handleMapLoad = () => {
      console.log('Map load event detected');
      
      // Don't set loaded state yet - first verify we can access the map's style
      if (map.isStyleLoaded()) {
        handleStyleLoad();
      }
    };
    
    const handleStyleLoad = () => {
      console.log('Map style loaded, map is ready for layer control');
      setMapLoaded(true);
      
      // Initialize topographical layers now that the map is loaded
      try {
        addTopographicalLayers(map);
        setLayersInitialized(true);
        console.log('Added topographical layers successfully');
      } catch (err) {
        console.error('Error initializing topographical layers:', err);
      }
    };
    
    const handleIdle = () => {
      // Another chance to check if the map is loaded
      if (!mapLoaded && map.isStyleLoaded()) {
        console.log('Map idle event detected, map appears to be loaded now');
        setMapLoaded(true);
        
        // Initialize topographical layers if not already done
        if (!layersInitialized) {
          try {
            addTopographicalLayers(map);
            setLayersInitialized(true);
            console.log('Added topographical layers on idle');
          } catch (err) {
            console.error('Error initializing topographical layers on idle:', err);
          }
        }
      }
    };
    
    const handleError = (e: any) => {
      console.error('Map error:', e);
      
      // If we get a style-not-ready error but the mapLoaded is true, reset it
      if (e.error && e.error.message && e.error.message.includes('style is not done loading')) {
        setMapLoaded(false);
      }
    };
    
    // Register event listeners for different stages of map loading
    map.on('load', handleMapLoad);
    map.on('style.load', handleStyleLoad);
    map.on('idle', handleIdle);
    map.on('error', handleError);
    
    // If the map is already loaded when this effect runs, initialize immediately
    if (map.loaded() && map.isStyleLoaded()) {
      console.log('Map was already loaded when hook initialized');
      setMapLoaded(true);
      
      try {
        addTopographicalLayers(map);
        setLayersInitialized(true);
        console.log('Added topographical layers on init');
      } catch (err) {
        console.error('Error initializing topographical layers on init:', err);
      }
    }
    
    // Clean up event listeners on unmount
    return () => {
      if (map) {
        map.off('load', handleMapLoad);
        map.off('style.load', handleStyleLoad);
        map.off('idle', handleIdle);
        map.off('error', handleError);
      }
    };
  }, [map]);

  // Initialize state based on map state when component mounts and map is loaded
  useEffect(() => {
    if (!map || !mapLoaded || !layersInitialized) return;
    
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
  }, [map, mapLoaded, layersInitialized]);

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
