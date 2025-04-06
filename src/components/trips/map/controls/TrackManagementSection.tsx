
import { Button } from '@/components/ui/button';
import { Route } from 'lucide-react';

interface TrackManagementSectionProps {
  expanded: boolean;
  onToggleExpand: () => void;
}

const TrackManagementSection = ({
  expanded,
  onToggleExpand,
}: TrackManagementSectionProps) => {
  return (
    <div className="space-y-2">
      <Button 
        variant="ghost" 
        className="w-full justify-start px-2 py-1 h-auto text-sm"
        onClick={onToggleExpand}
      >
        <Route className="h-4 w-4 mr-2" />
        Track Management
      </Button>
      
      {expanded && (
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
  );
};

export default TrackManagementSection;
