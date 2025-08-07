import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { useUserLocation } from '@/hooks/use-user-location';
import { useMemo, useCallback, memo, useEffect, useState } from 'react';
import MapInitializer from './map/MapInitializer';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Route, MapPin, Trash2 } from 'lucide-react';
import { useWaypointManager } from '@/hooks/use-waypoint-manager';
import { toast } from 'sonner';
import WaypointFeedback from './map/WaypointFeedback';

interface TripMapProps {
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  onMapClick?: () => void;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onRouteChange?: (waypoints: any[]) => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
        <div>
          <h3 className="text-sm font-medium">Map Error</h3>
          <div className="mt-2 text-sm">
            <p>There was a problem loading the map component.</p>
            <p className="mt-1 font-mono text-xs text-red-700">
              {error.message}
            </p>
          </div>
          <div className="mt-4">
            <Button size="sm" variant="outline" onClick={resetErrorBoundary}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inner component that receives the map instance and integrates waypoint manager
const TripMapWithWaypoints = ({ 
  map, 
  onRouteChange 
}: { 
  map: mapboxgl.Map | null; 
  onRouteChange?: (waypoints: any[]) => void; 
}) => {
  console.log('TripMapWithWaypoints rendering with map:', map);
  
  // Don't initialize waypoint manager if map is not ready
  const waypointManager = map ? useWaypointManager({
    map,
    onRouteUpdate: onRouteChange
  }) : null;

  const {
    waypoints = [],
    manualWaypoints = [],
    isAddingMode = false,
    isManualMode = false,
    currentRoute = null,
    routeProfile = 'driving',
    isLoadingRoute = false,
    setIsAddingMode = () => {},
    setIsManualMode = () => {},
    setRouteProfile = () => {},
    clearMarkers = () => {},
    setWaypoints = () => {},
    setManualWaypoints = () => {}
  } = waypointManager || {};

  // Toggle adding mode
  const toggleAddingMode = useCallback(() => {
    setIsAddingMode(!isAddingMode);
    if (isManualMode) setIsManualMode(false); // Turn off manual mode if on
    toast.info(isAddingMode ? 'Route planning disabled' : 'Click map to add waypoints');
  }, [isAddingMode, isManualMode, setIsAddingMode, setIsManualMode]);

  // Toggle manual mode for POIs
  const toggleManualMode = useCallback(() => {
    setIsManualMode(!isManualMode);
    if (isAddingMode) setIsAddingMode(false); // Turn off adding mode if on
    toast.info(isManualMode ? 'POI marking disabled' : 'Click map to mark points of interest');
  }, [isManualMode, isAddingMode, setIsManualMode, setIsAddingMode]);

  // Clear all markers and waypoints
  const handleClearAll = useCallback(() => {
    clearMarkers();
    setWaypoints([]);
    setManualWaypoints([]);
    toast.success('All waypoints cleared');
  }, [clearMarkers, setWaypoints, setManualWaypoints]);

  // Change route profile
  const handleProfileChange = useCallback((profile: 'driving' | 'walking' | 'cycling') => {
    setRouteProfile(profile);
    toast.info(`Route profile changed to ${profile}`);
  }, [setRouteProfile]);

  // Always render the controls, even if map isn't ready
  return (
    <div className="relative w-full h-full">
      {/* Beautiful Unified Control Panel - Always visible */}
      <div className="absolute top-4 left-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-4 w-64">
          
          {/* Route Planning Section */}
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Route Planning
            </div>

            {/* Route Profile Selection */}
            {waypoints.length > 0 && (
              <div className="grid grid-cols-3 gap-1">
                <Button
                  size="sm"
                  variant={routeProfile === 'driving' ? "default" : "outline"}
                  className="text-xs px-2"
                  onClick={() => handleProfileChange('driving')}
                  title="Driving route"
                >
                  🚗
                </Button>
                <Button
                  size="sm"
                  variant={routeProfile === 'walking' ? "default" : "outline"}
                  className="text-xs px-2"
                  onClick={() => handleProfileChange('walking')}
                  title="Walking route"
                >
                  🚶
                </Button>
                <Button
                  size="sm"
                  variant={routeProfile === 'cycling' ? "default" : "outline"}
                  className="text-xs px-2"
                  onClick={() => handleProfileChange('cycling')}
                  title="Cycling route"
                >
                  🚴
                </Button>
              </div>
            )}
          
            {/* Add Route Points Button */}
            <Button
              variant={isAddingMode ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={toggleAddingMode}
              title="Add waypoints that connect in a route (A → B → C)"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isAddingMode ? 'Stop Adding' : 'Add Route Points'}
            </Button>

            {/* Mark POIs Button */}
            <Button
              variant={isManualMode ? "default" : "outline"}
              size="sm"
              className="w-full justify-start"
              onClick={toggleManualMode}
              title="Mark points of interest without creating a route"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {isManualMode ? 'Stop Marking' : 'Mark POIs'}
            </Button>

            {/* Route Stats Display */}
            {currentRoute && (
              <div className="bg-blue-50 rounded-md p-2 space-y-1">
                <div className="flex items-center text-xs font-medium">
                  <Route className="h-3 w-3 mr-1" />
                  Route Details
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div>Distance: {Math.round(currentRoute.distance / 1000)} km</div>
                  <div>Duration: {Math.round(currentRoute.duration / 60)} min</div>
                  <div className="capitalize">Profile: {routeProfile}</div>
                </div>
              </div>
            )}

            {/* Waypoint Count */}
            {(waypoints.length > 0 || manualWaypoints.length > 0) && (
              <div className="text-xs text-muted-foreground">
                {waypoints.length} waypoints
                {manualWaypoints.length > 0 && 
                  ` + ${manualWaypoints.length} manual`}
              </div>
            )}

            {/* Clear All Button */}
            {(waypoints.length > 0 || manualWaypoints.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive"
                onClick={handleClearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>


      {/* Waypoint Feedback Overlay */}
      <WaypointFeedback
        isAddingMode={isAddingMode}
        isManualMode={isManualMode}
        waypointCount={waypoints.length}
        manualCount={manualWaypoints.length}
      />
    </div>
  );
};

const TripMap = ({ 
  startLocation, 
  endLocation,
  waypoints = [],
  onMapClick,
  userLocation,
  onRouteChange
}: TripMapProps) => {
  const { location, isLoading: isLocationLoading } = useUserLocation();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  
  // Helper function to create a valid tuple
  const createLocationTuple = useCallback((lat: number, lng: number): [number, number] => {
    return [lng, lat];
  }, []);
  
  // Determine initial center with proper typing - only compute this once
  const initialCenter = useMemo(() => {
    if (userLocation) {
      return createLocationTuple(userLocation.latitude, userLocation.longitude);
    } else if (location) {
      return createLocationTuple(location.latitude, location.longitude);
    }
    return undefined;
  }, [userLocation, location, createLocationTuple]);
  
  // Handle map ready callback
  const handleMapReady = useCallback((mapInstance: mapboxgl.Map | null) => {
    console.log('TripMap handleMapReady called with:', mapInstance);
    setMap(mapInstance);
  }, []);
  
  // Stabilize props with memoization to prevent unnecessary re-renders
  const mapProps = useMemo(() => ({
    startLocation,
    endLocation,
    waypoints,
    onMapClick,
    initialCenter,
    // Set enableTerrain to false to avoid the error with hillshade layers
    enableTerrain: false,
    onMapReady: handleMapReady
  }), [startLocation, endLocation, waypoints, onMapClick, initialCenter, handleMapReady]);
  
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        console.log('Error boundary reset in TripMap');
      }}
    >
      <div className="relative w-full h-full">
        <MapInitializer {...mapProps} />
        <TripMapWithWaypoints map={map} onRouteChange={onRouteChange} />
      </div>
    </ErrorBoundary>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(TripMap);