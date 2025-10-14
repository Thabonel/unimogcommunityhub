import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronUp, ChevronDown, MapPin, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WaypointItem {
  coords: [number, number];
  name: string;
  type?: 'origin' | 'destination' | 'intermediate';
}

interface WaypointListPanelProps {
  waypoints: WaypointItem[];
  onRemoveWaypoint: (index: number) => void;
  onReorderWaypoint: (fromIndex: number, toIndex: number) => void;
  onWaypointClick: (coords: [number, number]) => void;
  onAddWaypoint: () => void;
  className?: string;
}

export const WaypointListPanel: React.FC<WaypointListPanelProps> = ({
  waypoints,
  onRemoveWaypoint,
  onReorderWaypoint,
  onWaypointClick,
  onAddWaypoint,
  className
}) => {
  const getWaypointLabel = (index: number, total: number): string => {
    if (index === 0) return 'A';
    if (index === total - 1) return 'B';
    return index.toString();
  };

  const getWaypointIcon = (index: number, total: number) => {
    if (index === 0) {
      return (
        <div className="w-6 h-6 rounded-full bg-military-green text-white flex items-center justify-center text-xs font-bold">
          A
        </div>
      );
    }
    if (index === total - 1) {
      return (
        <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">
          B
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
        {index}
      </div>
    );
  };

  const canMoveUp = (index: number) => index > 1;
  const canMoveDown = (index: number, total: number) => index > 0 && index < total - 2;
  const canRemove = (index: number, total: number) => index !== 0 && index !== total - 1;

  const handleMoveUp = (index: number) => {
    if (canMoveUp(index)) {
      onReorderWaypoint(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (canMoveDown(index, waypoints.length)) {
      onReorderWaypoint(index, index + 1);
    }
  };

  const truncateName = (name: string, maxLength: number = 30): string => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  if (waypoints.length === 0) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="text-center text-muted-foreground">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No waypoints added</p>
          <p className="text-xs mt-1">Search and click locations to create a route</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          Route Waypoints
        </h3>
        <span className="text-xs text-muted-foreground">
          {waypoints.length} / 25 points
        </span>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {waypoints.map((waypoint, index) => (
          <div
            key={`waypoint-${index}-${waypoint.coords[0]}-${waypoint.coords[1]}`}
            className={cn(
              "flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors",
              "border border-border/50"
            )}
          >
            {getWaypointIcon(index, waypoints.length)}

            <button
              onClick={() => onWaypointClick(waypoint.coords)}
              className="flex-1 text-left text-sm hover:text-military-green transition-colors"
              title="Click to center map on this location"
            >
              <div className="font-medium">{getWaypointLabel(index, waypoints.length)}: {truncateName(waypoint.name)}</div>
              <div className="text-xs text-muted-foreground">
                {waypoint.coords[1].toFixed(5)}, {waypoint.coords[0].toFixed(5)}
              </div>
            </button>

            <div className="flex items-center gap-1">
              {canMoveUp(index) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveUp(index)}
                  className="h-7 w-7 p-0"
                  title="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              )}

              {canMoveDown(index, waypoints.length) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveDown(index)}
                  className="h-7 w-7 p-0"
                  title="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}

              {canRemove(index, waypoints.length) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveWaypoint(index)}
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Remove waypoint"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {waypoints.length < 25 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAddWaypoint}
          className="w-full mt-3"
        >
          <MapPin className="h-3 w-3 mr-2" />
          Add Waypoint
        </Button>
      )}

      {waypoints.length >= 25 && (
        <div className="mt-3 text-xs text-center text-muted-foreground">
          Maximum waypoints reached (25)
        </div>
      )}
    </Card>
  );
};
