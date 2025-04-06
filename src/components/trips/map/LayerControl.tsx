
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { TOPO_LAYERS } from './mapConfig';
import { toast } from 'sonner';

// Import the new section components
import TopographicalFeaturesSection from './controls/TopographicalFeaturesSection';
import MapStylesSection from './controls/MapStylesSection';
import TrackManagementSection from './controls/TrackManagementSection';

interface LayerControlProps {
  map: mapboxgl.Map | null;
  onStyleChange?: (style: string) => void;
}

export const LayerControl = ({ map, onStyleChange }: LayerControlProps) => {
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    [TOPO_LAYERS.HILLSHADE]: false,
    [TOPO_LAYERS.CONTOUR]: false,
    [TOPO_LAYERS.TERRAIN_3D]: false,
  });

  const [expandedSection, setExpandedSection] = useState<string | null>("topographical");
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [loadingCheckCount, setLoadingCheckCount] = useState<number>(0);

  // Improved map load check
  useEffect(() => {
    if (!map) return;
    
    const maxAttempts = 20; // Prevent infinite checking
    
    const checkIfLoaded = () => {
      setLoadingCheckCount(prev => prev + 1);
      
      if (map.loaded()) {
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
    
    // Also listen for the map's 'load' event directly
    const handleMapLoad = () => {
      console.log('Map load event fired');
      setMapLoaded(true);
    };
    
    map.on('load', handleMapLoad);
    
    // Start the loading check
    checkIfLoaded();
    
    return () => {
      map.off('load', handleMapLoad);
    };
  }, [map, loadingCheckCount]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Initialize state based on map state when component mounts and map is loaded
  useEffect(() => {
    if (!map || !mapLoaded) return;
    
    try {
      console.log('Initializing layer control state from map');
      
      // Check if terrain is enabled
      const terrain = map.getTerrain();
      const is3DEnabled = !!terrain;
      
      // Check layer visibility
      const hillshadeVisibility = map.getLayer(TOPO_LAYERS.HILLSHADE) 
        ? map.getLayoutProperty(TOPO_LAYERS.HILLSHADE, 'visibility') === 'visible'
        : false;
        
      const contourVisibility = map.getLayer(TOPO_LAYERS.CONTOUR)
        ? map.getLayoutProperty(TOPO_LAYERS.CONTOUR, 'visibility') === 'visible'
        : false;
      
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

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-sm flex items-center">
          <Layers className="h-4 w-4 mr-2" />
          Map Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2 space-y-4">
        <TopographicalFeaturesSection 
          map={map}
          mapLoaded={mapLoaded}
          visibleLayers={visibleLayers}
          setVisibleLayers={setVisibleLayers}
          expanded={expandedSection === "topographical"}
          onToggleExpand={() => toggleSection("topographical")}
        />
        
        <MapStylesSection 
          onStyleChange={onStyleChange}
          expanded={expandedSection === "styles"}
          onToggleExpand={() => toggleSection("styles")}
        />
        
        <TrackManagementSection 
          expanded={expandedSection === "tracks"}
          onToggleExpand={() => toggleSection("tracks")}
        />
      </CardContent>
    </Card>
  );
};

export default LayerControl;
