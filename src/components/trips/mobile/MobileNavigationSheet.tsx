import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Navigation, MapPin, Clock, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistance, formatDuration } from '@/services/mapboxDirections';

interface MobileNavigationSheetProps {
  currentRoute: {
    distance: number;
    duration: number;
    geometry?: any;
  } | null;
  waypoints: any[];
  isNavigating?: boolean;
  onStartNavigation?: () => void;
  onStopNavigation?: () => void;
  onAddWaypoint?: () => void;
}

export const MobileNavigationSheet: React.FC<MobileNavigationSheetProps> = ({
  currentRoute,
  waypoints,
  isNavigating = false,
  onStartNavigation,
  onStopNavigation,
  onAddWaypoint
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasRoute = currentRoute && waypoints.length >= 2;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 z-50 ${
        isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-140px)]'
      }`}
      style={{ maxHeight: '80vh' }}
    >
      {/* Drag Handle */}
      <div
        className="flex justify-center py-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>

      {/* Collapsed View - Route Summary */}
      <div className="px-4 pb-4">
        {hasRoute ? (
          <div className="space-y-3">
            {/* Route Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-blue-600" />
                  <span className="text-lg font-bold text-gray-900">
                    {formatDistance(currentRoute.distance)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-base text-gray-600">
                    {formatDuration(currentRoute.duration)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                {isExpanded ? (
                  <ChevronDown className="h-6 w-6 text-gray-600" />
                ) : (
                  <ChevronUp className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>

            {/* Action Buttons */}
            {!isExpanded && (
              <div className="flex gap-2">
                {!isNavigating ? (
                  <Button
                    onClick={onStartNavigation}
                    className="flex-1 h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                  >
                    <Navigation className="h-5 w-5 mr-2" />
                    Start Navigation
                  </Button>
                ) : (
                  <Button
                    onClick={onStopNavigation}
                    variant="destructive"
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    Stop Navigation
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Plan Your Route
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tap the map to add waypoints and create your route
            </p>
            <Button
              onClick={onAddWaypoint}
              className="w-full h-12 text-base font-semibold"
            >
              <MapPin className="h-5 w-5 mr-2" />
              Add Waypoint
            </Button>
          </div>
        )}
      </div>

      {/* Expanded View - Detailed Info */}
      {isExpanded && hasRoute && (
        <div className="px-4 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          <div className="space-y-4">
            {/* Waypoints List */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Route Waypoints</h4>
              <div className="space-y-2">
                {waypoints.map((waypoint, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {index === 0 ? 'A' : index === waypoints.length - 1 ? 'B' : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {waypoint.name || `Waypoint ${index + 1}`}
                      </p>
                      {waypoint.coords && (
                        <p className="text-xs text-gray-500 mt-1">
                          {waypoint.coords[1].toFixed(4)}, {waypoint.coords[0].toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              {!isNavigating ? (
                <Button
                  onClick={onStartNavigation}
                  className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700"
                >
                  <Navigation className="h-5 w-5 mr-2" />
                  Start Navigation
                </Button>
              ) : (
                <Button
                  onClick={onStopNavigation}
                  variant="destructive"
                  className="w-full h-12 text-base font-semibold"
                >
                  Stop Navigation
                </Button>
              )}
              <Button
                onClick={onAddWaypoint}
                variant="outline"
                className="w-full h-12 text-base"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Add Another Waypoint
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
