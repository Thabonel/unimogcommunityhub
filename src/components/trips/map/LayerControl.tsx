
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Mountain, Map, Route } from 'lucide-react';
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

  const handleLayerToggle = (layerId: string) => {
    if (!map) {
      toast.error("Map not initialized");
      return;
    }
    
    try {
      // Use the exported toggleLayerVisibility function
      const isNowVisible = toggleLayerVisibility(map, layerId);
      
      setVisibleLayers(prev => ({
        ...prev,
        [layerId]: isNowVisible
      }));
    } catch (error) {
      console.error(`Error toggling layer ${layerId}:`, error);
      toast.error(`Could not toggle ${layerId}`);
    }
  };

  // Handle 3D terrain toggle specially
  const handle3DTerrainToggle = () => {
    if (!map) {
      toast.error("Map not initialized");
      return;
    }
    
    const isCurrently3D = visibleLayers[TOPO_LAYERS.TERRAIN_3D];
    
    try {
      let success = false;
      
      if (isCurrently3D) {
        // Disable terrain
        success = disableTerrain(map);
      } else {
        // Enable terrain
        success = enableTerrain(map);
      }
      
      if (success) {
        setVisibleLayers(prev => ({
          ...prev,
          [TOPO_LAYERS.TERRAIN_3D]: !isCurrently3D
        }));
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

  // Initialize state based on map state when component mounts
  useEffect(() => {
    if (!map || !map.loaded()) return;
    
    try {
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
      
      setVisibleLayers({
        [TOPO_LAYERS.HILLSHADE]: hillshadeVisibility,
        [TOPO_LAYERS.CONTOUR]: contourVisibility,
        [TOPO_LAYERS.TERRAIN_3D]: is3DEnabled
      });
    } catch (error) {
      console.error('Error initializing layer control state:', error);
    }
  }, [map]);

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
                />
                <Label htmlFor="terrain-3d" className="text-sm cursor-pointer">
                  3D Terrain
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hillshade" 
                  checked={visibleLayers[TOPO_LAYERS.HILLSHADE]} 
                  onCheckedChange={() => handleLayerToggle(TOPO_LAYERS.HILLSHADE)}
                />
                <Label htmlFor="hillshade" className="text-sm cursor-pointer">
                  Hillshade
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contour" 
                  checked={visibleLayers[TOPO_LAYERS.CONTOUR]} 
                  onCheckedChange={() => handleLayerToggle(TOPO_LAYERS.CONTOUR)}
                />
                <Label htmlFor="contour" className="text-sm cursor-pointer">
                  Contour Lines
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
