import React from 'react';
import { MapPin, Plus, Crosshair } from 'lucide-react';

interface WaypointFeedbackProps {
  isAddingMode: boolean;
  isManualMode: boolean;
  waypointCount: number;
  manualCount: number;
}

const WaypointFeedback: React.FC<WaypointFeedbackProps> = ({
  isAddingMode,
  isManualMode,
  waypointCount,
  manualCount
}) => {
  if (!isAddingMode && !isManualMode) return null;

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-black/80 text-white px-4 py-2 rounded-full flex items-center gap-2 animate-pulse">
        {isAddingMode ? (
          <>
            <Crosshair className="h-5 w-5" />
            <span className="text-sm font-medium">
              Click to add route waypoint {waypointCount > 0 && `(${waypointCount} added)`}
            </span>
          </>
        ) : isManualMode ? (
          <>
            <MapPin className="h-5 w-5" />
            <span className="text-sm font-medium">
              Click to mark POI {manualCount > 0 && `(${manualCount} marked)`}
            </span>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default WaypointFeedback;