import { Button } from '@/components/ui/button';
import { PanelLeft, Layers, Mountain, MapPin, List, Route, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import TrackImporter from './TrackImporter';
import mapboxgl from 'mapbox-gl';
import { Track } from '@/types/track';

interface MapControlsProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  terrainEnabled?: boolean;
  toggleTerrain?: () => void;
  map?: mapboxgl.Map | null;
  onTrackImported?: (track: Track) => void;
  tracks?: Track[];
}

const MapControls = ({ 
  sidebarOpen, 
  toggleSidebar, 
  terrainEnabled = true,
  toggleTerrain,
  map,
  onTrackImported,
  tracks = []
}: MapControlsProps) => {
  const handleImportError = (error: string) => {
    console.error('Track import error:', error);
  };

  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col space-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "bg-white/80 backdrop-blur-sm hover:bg-white",
                sidebarOpen && "bg-primary/20 hover:bg-primary/30"
              )}
              onClick={toggleSidebar}
            >
              <PanelLeft className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{sidebarOpen ? 'Hide' : 'Show'} trips sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Layers className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Map layers</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {toggleTerrain && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "bg-white/80 backdrop-blur-sm hover:bg-white",
                  terrainEnabled && "bg-primary/20 hover:bg-primary/30"
                )}
                onClick={toggleTerrain}
              >
                <Mountain className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{terrainEnabled ? 'Disable' : 'Enable'} 3D terrain</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <MapPin className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Find my location</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <List className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Trip details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <Route className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Route planning</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* GPX Track Importer */}
      <div className="pt-4">
        <TrackImporter 
          map={map} 
          onTrackImported={onTrackImported || (() => {})}
          onImportError={handleImportError}
          tracks={tracks} 
        />
      </div>
    </div>
  );
};

export default MapControls;
