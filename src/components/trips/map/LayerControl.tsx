
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Mountain, Map, Route } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import mapboxgl from 'mapbox-gl';
import { TOPO_LAYERS, toggleLayerVisibility } from './mapConfig';

interface LayerControlProps {
  map: mapboxgl.Map | null;
  onStyleChange?: (style: string) => void;
}

export const LayerControl = ({ map, onStyleChange }: LayerControlProps) => {
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    [TOPO_LAYERS.HILLSHADE]: false,
    [TOPO_LAYERS.CONTOUR]: false,
    [TOPO_LAYERS.TERRAIN_3D]: true,
  });

  const [expandedSection, setExpandedSection] = useState<string | null>("topographical");

  const handleLayerToggle = (layerId: string) => {
    if (!map) return;
    
    const isNowVisible = toggleLayerVisibility(map, layerId);
    
    setVisibleLayers(prev => ({
      ...prev,
      [layerId]: isNowVisible
    }));
  };

  // Handle 3D terrain toggle specially
  const handle3DTerrainToggle = () => {
    if (!map) return;
    
    const isCurrently3D = visibleLayers[TOPO_LAYERS.TERRAIN_3D];
    
    // Toggle terrain
    if (isCurrently3D) {
      map.setTerrain(null);
    } else {
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
    }
    
    setVisibleLayers(prev => ({
      ...prev,
      [TOPO_LAYERS.TERRAIN_3D]: !isCurrently3D
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Ensure layers are added to the map
  useEffect(() => {
    if (!map) return;
    
    // Need to wait for the map to be loaded
    if (!map.loaded()) {
      map.on('load', () => {
        // Initialization might take a moment, so wait a bit
        setTimeout(() => {
          try {
            // Initialize 3D terrain by default
            map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
          } catch (error) {
            console.error('Error initializing terrain:', error);
          }
        }, 100);
      });
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
                  onClick={() => onStyleChange?.('mapbox://styles/mapbox/outdoors-v12')}
                >
                  Outdoors
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-green-600 hover:bg-green-700"
                  onClick={() => onStyleChange?.('mapbox://styles/mapbox/satellite-streets-v12')}
                >
                  Satellite Streets
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-slate-700 hover:bg-slate-800"
                  onClick={() => onStyleChange?.('mapbox://styles/mapbox/satellite-v9')}
                >
                  Satellite
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-amber-600 hover:bg-amber-700"
                  onClick={() => onStyleChange?.('mapbox://styles/mapbox/terrain-v2')}
                >
                  Terrain
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-slate-900 hover:bg-black"
                  onClick={() => onStyleChange?.('mapbox://styles/mapbox/dark-v11')}
                >
                  Dark
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-gray-200 text-gray-900 hover:bg-gray-300"
                  onClick={() => onStyleChange?.('mapbox://styles/mapbox/light-v11')}
                >
                  Light
                </Badge>
                <Badge 
                  className="mr-1 mb-1 cursor-pointer bg-slate-500 hover:bg-slate-600"
                  onClick={() => onStyleChange?.('mapbox://styles/mapbox/streets-v11')}
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
