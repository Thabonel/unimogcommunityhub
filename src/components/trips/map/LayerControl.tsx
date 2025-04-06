
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Mountain, Map, Route, Loader } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import mapboxgl from 'mapbox-gl';
import { TOPO_LAYERS, MAP_STYLES, toggleLayerVisibility, enableTerrain, disableTerrain } from './mapConfig';
import { toast } from 'sonner';

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
  }, [map]);

  const handleLayerToggle = (layerId: string) => {
    if (!map) {
      toast.error("Map not initialized");
      return;
    }

    if (!mapLoaded) {
      toast.warning("Map is still loading. Please try again in a moment.");
      return;
    }
    
    try {
      console.log(`Toggling layer: ${layerId}`);
      // Use the exported toggleLayerVisibility function
      const isNowVisible = toggleLayerVisibility(map, layerId);
      
      // Update state after successful toggle
      setVisibleLayers(prev => ({
        ...prev,
        [layerId]: isNowVisible
      }));
      
      console.log(`Layer ${layerId} toggled: ${isNowVisible ? 'visible' : 'hidden'}`);
    } catch (error) {
      console.error(`Error toggling layer ${layerId}:`, error);
      toast.error(`Could not toggle ${layerId}`);
      
      // Roll back the state change in case of error
      setVisibleLayers(prev => ({...prev}));
    }
  };

  // Handle 3D terrain toggle specially
  const handle3DTerrainToggle = () => {
    if (!map) {
      toast.error("Map not initialized");
      return;
    }

    if (!mapLoaded) {
      toast.warning("Map is still loading. Please try again in a moment.");
      return;
    }
    
    const isCurrently3D = visibleLayers[TOPO_LAYERS.TERRAIN_3D];
    
    try {
      console.log(`Toggling 3D terrain: current state = ${isCurrently3D}`);
      let success = false;
      
      if (isCurrently3D) {
        // Disable terrain
        success = disableTerrain(map);
      } else {
        // Enable terrain
        success = enableTerrain(map);
      }
      
      if (success) {
        // Only update state if operation was successful
        setVisibleLayers(prev => ({
          ...prev,
          [TOPO_LAYERS.TERRAIN_3D]: !isCurrently3D
        }));
        console.log(`3D terrain toggled to: ${!isCurrently3D}`);
      } else {
        toast.error("Failed to toggle 3D terrain");
      }
    } catch (error) {
      console.error('Error toggling 3D terrain:', error);
      toast.error("Error toggling 3D terrain");
    }
  };

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
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start px-2 py-1 h-auto text-sm"
            onClick={() => toggleSection("topographical")}
          >
            <Mountain className="h-4 w-4 mr-2" />
            Topographical Features
          </Button>
          
          {expandedSection === "topographical" && (
            <div className="ml-6 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terrain-3d" 
                  checked={visibleLayers[TOPO_LAYERS.TERRAIN_3D]} 
                  onCheckedChange={() => handle3DTerrainToggle()}
                  disabled={!mapLoaded}
                />
                <Label htmlFor="terrain-3d" className="text-sm cursor-pointer flex items-center">
                  3D Terrain
                  {!mapLoaded && (
                    <span className="flex items-center ml-2 text-xs text-muted-foreground">
                      <Loader className="h-3 w-3 mr-1 animate-spin" />
                      loading
                    </span>
                  )}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hillshade" 
                  checked={visibleLayers[TOPO_LAYERS.HILLSHADE]} 
                  onCheckedChange={() => handleLayerToggle(TOPO_LAYERS.HILLSHADE)}
                  disabled={!mapLoaded}
                />
                <Label htmlFor="hillshade" className="text-sm cursor-pointer flex items-center">
                  Hillshade
                  {!mapLoaded && (
                    <span className="flex items-center ml-2 text-xs text-muted-foreground">
                      <Loader className="h-3 w-3 mr-1 animate-spin" />
                      loading
                    </span>
                  )}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contour" 
                  checked={visibleLayers[TOPO_LAYERS.CONTOUR]} 
                  onCheckedChange={() => handleLayerToggle(TOPO_LAYERS.CONTOUR)}
                  disabled={!mapLoaded}
                />
                <Label htmlFor="contour" className="text-sm cursor-pointer flex items-center">
                  Contour Lines
                  {!mapLoaded && (
                    <span className="flex items-center ml-2 text-xs text-muted-foreground">
                      <Loader className="h-3 w-3 mr-1 animate-spin" />
                      loading
                    </span>
                  )}
                </Label>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start px-2 py-1 h-auto text-sm"
            onClick={() => toggleSection("styles")}
          >
            <Map className="h-4 w-4 mr-2" />
            Map Styles
          </Button>
          
          {expandedSection === "styles" && (
            <ScrollArea className="h-32 ml-6">
              <div className="space-y-1">
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-blue-500 hover:bg-blue-600"
                  onClick={() => onStyleChange?.(MAP_STYLES.OUTDOORS)}
                >
                  Outdoors
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-green-600 hover:bg-green-700"
                  onClick={() => onStyleChange?.(MAP_STYLES.SATELLITE_STREETS)}
                >
                  Satellite Streets
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-slate-700 hover:bg-slate-800"
                  onClick={() => onStyleChange?.(MAP_STYLES.SATELLITE)}
                >
                  Satellite
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-amber-600 hover:bg-amber-700"
                  onClick={() => onStyleChange?.(MAP_STYLES.OUTDOORS)}
                >
                  Terrain
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-slate-900 hover:bg-black"
                  onClick={() => onStyleChange?.(MAP_STYLES.DARK)}
                >
                  Dark
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-gray-200 text-gray-900 hover:bg-gray-300"
                  onClick={() => onStyleChange?.(MAP_STYLES.LIGHT)}
                >
                  Light
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-slate-500 hover:bg-slate-600"
                  onClick={() => onStyleChange?.(MAP_STYLES.STREETS)}
                >
                  Streets
                </Badge>
              </div>
            </ScrollArea>
          )}
        </div>
        
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start px-2 py-1 h-auto text-sm"
            onClick={() => toggleSection("tracks")}
          >
            <Route className="h-4 w-4 mr-2" />
            Track Management
          </Button>
          
          {expandedSection === "tracks" && (
            <div className="ml-6 space-y-2">
              <Button size="sm" variant="outline" className="w-full text-xs">
                Upload GPX/KML
              </Button>
              <p className="text-xs text-muted-foreground">
                No tracks uploaded yet. Upload a track to display it on the map.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerControl;
