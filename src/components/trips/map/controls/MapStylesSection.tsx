
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Map } from 'lucide-react';
import { MAP_STYLES } from '../mapConfig';

interface MapStylesSectionProps {
  onStyleChange?: (style: string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

const MapStylesSection = ({
  onStyleChange,
  expanded,
  onToggleExpand,
}: MapStylesSectionProps) => {
  return (
    <div className="space-y-2">
      <Button 
        variant="ghost" 
        className="w-full justify-start px-2 py-1 h-auto text-sm"
        onClick={onToggleExpand}
      >
        <Map className="h-4 w-4 mr-2" />
        Map Styles
      </Button>
      
      {expanded && (
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
  );
};

export default MapStylesSection;
