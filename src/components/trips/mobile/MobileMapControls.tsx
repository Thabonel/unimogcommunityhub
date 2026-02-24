import React from 'react';
import { MapPin, Layers, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileTooltip } from '@/components/ui/mobile-tooltip';

interface MobileMapControlsProps {
  onAddWaypoint?: () => void;
  onChangeStyle?: () => void;
  onSaveRoute?: () => void;
  onClearRoute?: () => void;
  hasRoute?: boolean;
  isAddingWaypoints?: boolean;
}

export const MobileMapControls: React.FC<MobileMapControlsProps> = ({
  onAddWaypoint,
  onChangeStyle,
  onSaveRoute,
  onClearRoute,
  hasRoute = false,
  isAddingWaypoints = false
}) => {
  return (
    <div className="fixed bottom-32 right-4 z-40 flex flex-col gap-3">
      {/* Add Waypoint */}
      <MobileTooltip content={isAddingWaypoints ? 'Stop adding waypoints' : 'Add waypoint'}>
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
      </MobileTooltip>

      {/* Change Map Style */}
      <MobileTooltip content="Change map style">
        <Button
          size="lg"
          onClick={onChangeStyle}
          className="w-14 h-14 rounded-full shadow-lg bg-white text-gray-700 hover:bg-gray-50 p-0"
        >
          <Layers className="h-6 w-6" />
        </Button>
      </MobileTooltip>

      {/* Save Route (only show if route exists) */}
      {hasRoute && (
        <>
          <MobileTooltip content="Save route">
            <Button
              size="lg"
              onClick={onSaveRoute}
              className="w-14 h-14 rounded-full shadow-lg bg-green-600 text-white hover:bg-green-700 p-0"
            >
              <Save className="h-6 w-6" />
            </Button>
          </MobileTooltip>

          <MobileTooltip content="Clear route">
            <Button
              size="lg"
              onClick={onClearRoute}
              className="w-14 h-14 rounded-full shadow-lg bg-red-600 text-white hover:bg-red-700 p-0"
            >
              <Trash2 className="h-6 w-6" />
            </Button>
          </MobileTooltip>
        </>
      )}
    </div>
  );
};
