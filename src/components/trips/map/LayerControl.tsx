
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import { useLayerControl } from './hooks';

// Import the section components
import MapStylesSection from './controls/MapStylesSection';
import TrackManagementSection from './controls/TrackManagementSection';

interface LayerControlProps {
  map: mapboxgl.Map | null;
  onStyleChange?: (style: string) => void;
  onTracksChange?: (tracks: any[]) => void;
}

export const LayerControl = ({ map, onStyleChange, onTracksChange }: LayerControlProps) => {
  // Use our custom hook to manage state and effects
  const { 
    visibleLayers, 
    setVisibleLayers, 
    toggleLayer,
    expandedSection, 
    toggleSection, 
    mapLoaded,
    layersInitialized,
    initializeLayersManually
  } = useLayerControl({ map });

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="px-4 py-2">
        <CardTitle className="text-sm flex items-center">
          <Layers className="h-4 w-4 mr-2" />
          Map Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2 space-y-4">
        <MapStylesSection 
          onStyleChange={onStyleChange}
          expanded={expandedSection === "styles"}
          onToggleExpand={() => toggleSection("styles")}
        />
        
        <TrackManagementSection 
          expanded={expandedSection === "tracks"}
          onToggleExpand={() => toggleSection("tracks")}
          onTracksChange={onTracksChange}
        />
      </CardContent>
    </Card>
  );
};

export default LayerControl;
