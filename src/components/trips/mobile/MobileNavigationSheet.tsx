import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Navigation, MapPin, Clock, Route, Mountain, Save, Trash2, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistance, formatDuration } from '@/services/mapboxDirections';
import { ElevationProfile } from '../ElevationProfile';

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
  onSaveRoute?: () => void;
  onClearRoute?: () => void;
  onViewSavedTrips?: () => void;
  elevationData?: Array<{ distance: number; elevation: number }>;
}

export const MobileNavigationSheet: React.FC<MobileNavigationSheetProps> = ({
  currentRoute,
  waypoints,
  isNavigating = false,
  onStartNavigation,
  onStopNavigation,
  onAddWaypoint,
  onSaveRoute,
  onClearRoute,
  onViewSavedTrips,
  elevationData
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showElevation, setShowElevation] = useState(false);

  const hasRoute = currentRoute && waypoints.length >= 2;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 z-50 ${
        isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-140px)]'
      }`}
      style={{ maxHeight: '80vh' }}
    >
      {/* Header with Drag Handle and View Saved Trips */}
      <div className="flex items-center justify-between px-4 py-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onViewSavedTrips}
          className="h-8 px-2 text-xs"
        >
          <List className="h-4 w-4 mr-1" />
          Saved Trips
        </Button>

        {/* Drag Handle */}
        <div
          className="flex justify-center flex-1 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Spacer for symmetry */}
        <div className="w-24"></div>
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

            {/* Waypoint Count & Elevation Toggle */}
            {!isExpanded && (
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{waypoints.length} waypoint{waypoints.length !== 1 ? 's' : ''}</span>
                {elevationData && elevationData.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowElevation(!showElevation)}
                    className="h-7 px-2 text-xs"
                  >
                    <Mountain className="h-3 w-3 mr-1" />
                    {showElevation ? 'Hide' : 'Show'} Elevation
                  </Button>
                )}
              </div>
            )}

            {/* Elevation Profile - Collapsed View */}
            {!isExpanded && showElevation && elevationData && elevationData.length > 0 && currentRoute && (
              <div className="mt-2">
                <ElevationProfile
                  elevationData={elevationData}
                  totalDistance={currentRoute.distance}
                  className="text-xs"
                />
              </div>
            )}

            {/* Action Buttons */}
            {!isExpanded && (
              <div className="space-y-2">
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
                <Button
                  onClick={onSaveRoute}
                  variant="outline"
                  className="w-full h-10 text-sm"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Trip
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="px-4 pb-4">
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
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Route Waypoints ({waypoints.length})
              </h4>
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

            {/* Elevation Profile - Expanded View */}
            {elevationData && elevationData.length > 0 && currentRoute && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-700">Elevation Profile</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowElevation(!showElevation)}
                    className="h-7 px-2 text-xs"
                  >
                    <Mountain className="h-3 w-3 mr-1" />
                    {showElevation ? 'Hide' : 'Show'}
                  </Button>
                </div>
                {showElevation && (
                  <ElevationProfile
                    elevationData={elevationData}
                    totalDistance={currentRoute.distance}
                    className="text-xs"
                  />
                )}
              </div>
            )}

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
                onClick={onSaveRoute}
                variant="outline"
                className="w-full h-10 text-sm"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Trip
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={onAddWaypoint}
                  variant="outline"
                  className="flex-1 h-10 text-sm"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Add Waypoint
                </Button>
                <Button
                  onClick={onClearRoute}
                  variant="outline"
                  className="flex-1 h-10 text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Route
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
