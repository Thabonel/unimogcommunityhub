import React from 'react';
import { MapPin, Layers, Crosshair, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface MobileMapControlsProps {
  onAddWaypoint?: () => void;
  onChangeStyle?: () => void;
  onRecenter?: () => void;
  onSaveRoute?: () => void;
  onClearRoute?: () => void;
  hasRoute?: boolean;
  isAddingWaypoints?: boolean;
}

export const MobileMapControls: React.FC<MobileMapControlsProps> = ({
  onAddWaypoint,
  onChangeStyle,
  onRecenter,
  onSaveRoute,
  onClearRoute,
  hasRoute = false,
  isAddingWaypoints = false
}) => {
  return (
    <div className="fixed bottom-32 right-4 z-40 flex flex-col gap-3">
      {/* Recenter on Location */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            onClick={onRecenter}
            className="w-14 h-14 rounded-full shadow-lg bg-white text-gray-700 hover:bg-gray-50 p-0"
          >
            <Crosshair className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Center on your location</p>
        </TooltipContent>
      </Tooltip>

      {/* Add Waypoint */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            onClick={onAddWaypoint}
            className={`w-14 h-14 rounded-full shadow-lg p-0 ${
              isAddingWaypoints
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MapPin className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>{isAddingWaypoints ? 'Stop adding waypoints' : 'Add waypoint'}</p>
        </TooltipContent>
      </Tooltip>

      {/* Change Map Style */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="lg"
            onClick={onChangeStyle}
            className="w-14 h-14 rounded-full shadow-lg bg-white text-gray-700 hover:bg-gray-50 p-0"
          >
            <Layers className="h-6 w-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Change map style</p>
        </TooltipContent>
      </Tooltip>

      {/* Save Route (only show if route exists) */}
      {hasRoute && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                onClick={onSaveRoute}
                className="w-14 h-14 rounded-full shadow-lg bg-green-600 text-white hover:bg-green-700 p-0"
              >
                <Save className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Save route</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="lg"
                onClick={onClearRoute}
                className="w-14 h-14 rounded-full shadow-lg bg-red-600 text-white hover:bg-red-700 p-0"
              >
                <Trash2 className="h-6 w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Clear route</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
};
