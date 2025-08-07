import React, { useEffect, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Layers, 
  Save, 
  Car, 
  Footprints, 
  Bike, 
  Trash2, 
  Navigation,
  Flag,
  Share2,
  Info
} from 'lucide-react';
import MapComponent from '../MapComponent';
import { useMapEventHandlers } from '@/hooks/use-map-event-handlers';
import { useRouteRenderer } from '@/hooks/use-route-renderer';
import useWaypointStore from '@/stores/waypointStore';
import { formatDistance, formatDuration } from '@/services/mapboxDirections';
import { savePlannedRoute } from '@/services/trackService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';

// Map styles configuration
const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12',
};

interface WaypointMapControllerProps {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
}

const WaypointMapController: React.FC<WaypointMapControllerProps> = ({
  height = '100%',
  width = '100%',
  center = [9.1829, 48.7758],
  zoom = 10
}) => {
  const { user } = useAuth();
  const [currentMapStyle, setCurrentMapStyle] = React.useState<string>(MAP_STYLES.OUTDOORS);
  const [mapInstance, setMapInstance] = React.useState<mapboxgl.Map | null>(null);
  
  // Get store state and actions with selectors to prevent re-renders
  const isAddingWaypoints = useWaypointStore(state => state.isAddingWaypoints);
  const isAddingPOI = useWaypointStore(state => state.isAddingPOI);
  const waypointOrder = useWaypointStore(state => state.waypointOrder);
  const currentRoute = useWaypointStore(state => state.currentRoute);
  const routeProfile = useWaypointStore(state => state.routeProfile);
  const isLoadingRoute = useWaypointStore(state => state.isLoadingRoute);
  
  // Get actions (these are stable)
  const setAddingWaypoints = useWaypointStore(state => state.setAddingWaypoints);
  const setAddingPOI = useWaypointStore(state => state.setAddingPOI);
  const setRouteProfile = useWaypointStore(state => state.setRouteProfile);
  const clearWaypoints = useWaypointStore(state => state.clearWaypoints);
  const setMap = useWaypointStore(state => state.setMap);
  const getOrderedWaypoints = useWaypointStore(state => state.getOrderedWaypoints);
  
  // Handle map load
  const handleMapLoad = useCallback((map: mapboxgl.Map) => {
    console.log('Map loaded in WaypointMapController');
    setMapInstance(map);
    setMap(map);
  }, [setMap]);
  
  // Set up event handlers
  useMapEventHandlers({ 
    map: mapInstance, 
    enabled: true 
  });
  
  // Set up route rendering
  useRouteRenderer({ 
    map: mapInstance, 
    enabled: true 
  });
  
  // Handle map style change
  const handleStyleChange = useCallback((style: string) => {
    console.log('Changing map style to:', style);
    setCurrentMapStyle(style);
    
    if (mapInstance) {
      mapInstance.setStyle(style);
      
      // Re-add markers after style change
      mapInstance.once('style.load', () => {
        // Markers will be re-added by the store
        console.log('Style loaded, markers should be re-added');
      });
    }
  }, [mapInstance]);
  
  // Save route handler
  const handleSaveRoute = async () => {
    if (!user) {
      toast.error('Please sign in to save routes');
      return;
    }
    
    const orderedWaypoints = getOrderedWaypoints();
    if (orderedWaypoints.length < 2) {
      toast.error('Need at least 2 waypoints to save a route');
      return;
    }
    
    try {
      const savedTrack = await savePlannedRoute(
        orderedWaypoints,
        currentRoute,
        user.id,
        routeProfile
      );
      
      if (savedTrack) {
        clearWaypoints();
        setAddingWaypoints(false);
        toast.success('Route saved successfully!');
        // Optionally reload the page or update the tracks list
        window.location.reload();
      }
    } catch (error) {
      console.error('Save route error:', error);
      toast.error('Failed to save route');
    }
  };
  
  // Toggle waypoint mode
  const toggleWaypointMode = () => {
    setAddingWaypoints(!isAddingWaypoints);
    if (!isAddingWaypoints) {
      toast.info('Click on the map to add waypoints');
    }
  };
  
  // Toggle POI mode
  const togglePOIMode = () => {
    setAddingPOI(!isAddingPOI);
    if (!isAddingPOI) {
      toast.info('Click on the map to add a Point of Interest');
    }
  };
  
  return (
    <div className="relative w-full h-full">
      {/* Map */}
      <MapComponent
        height={height}
        width={width}
        center={center}
        zoom={zoom}
        style={currentMapStyle}
        onMapLoad={handleMapLoad}
        hideControls={true}
      />
      
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-4 w-72">
          {/* Map Styles Section */}
          <div>
            <div className="text-sm font-medium mb-2 flex items-center">
              <Layers className="h-4 w-4 mr-2" />
              Map Styles
            </div>
            <div className="grid grid-cols-2 gap-1">
              <Button
                size="sm"
                variant={currentMapStyle === MAP_STYLES.OUTDOORS ? "default" : "outline"}
                className="text-xs"
                onClick={() => handleStyleChange(MAP_STYLES.OUTDOORS)}
              >
                Outdoors
              </Button>
              <Button
                size="sm"
                variant={currentMapStyle === MAP_STYLES.SATELLITE_STREETS ? "default" : "outline"}
                className="text-xs"
                onClick={() => handleStyleChange(MAP_STYLES.SATELLITE_STREETS)}
              >
                Satellite
              </Button>
              <Button
                size="sm"
                variant={currentMapStyle === MAP_STYLES.STREETS ? "default" : "outline"}
                className="text-xs"
                onClick={() => handleStyleChange(MAP_STYLES.STREETS)}
              >
                Streets
              </Button>
              <Button
                size="sm"
                variant={currentMapStyle === MAP_STYLES.SATELLITE ? "default" : "outline"}
                className="text-xs"
                onClick={() => handleStyleChange(MAP_STYLES.SATELLITE)}
              >
                Terrain
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" />

          {/* Route Planning Section */}
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center">
              <Navigation className="h-4 w-4 mr-2" />
              Route Planning
            </div>
            
            {/* Mode buttons */}
            <div className="grid grid-cols-2 gap-1">
              <Button
                size="sm"
                variant={isAddingWaypoints ? "default" : "outline"}
                className="text-xs"
                onClick={toggleWaypointMode}
                title="Add route waypoints"
              >
                <MapPin className="h-3 w-3 mr-1" />
                Waypoints
              </Button>
              <Button
                size="sm"
                variant={isAddingPOI ? "default" : "outline"}
                className="text-xs"
                onClick={togglePOIMode}
                title="Add points of interest"
              >
                <Flag className="h-3 w-3 mr-1" />
                POI
              </Button>
            </div>
            
            {/* Route Profile Selection */}
            {waypointOrder.length > 0 && (
              <div className="grid grid-cols-3 gap-1">
                <Button
                  size="sm"
                  variant={routeProfile === 'driving' ? "default" : "outline"}
                  className="text-xs px-2"
                  onClick={() => setRouteProfile('driving')}
                  title="Driving route"
                >
                  <Car className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={routeProfile === 'walking' ? "default" : "outline"}
                  className="text-xs px-2"
                  onClick={() => setRouteProfile('walking')}
                  title="Walking route"
                >
                  <Footprints className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant={routeProfile === 'cycling' ? "default" : "outline"}
                  className="text-xs px-2"
                  onClick={() => setRouteProfile('cycling')}
                  title="Cycling route"
                >
                  <Bike className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {/* Waypoint count and route info */}
            {waypointOrder.length > 0 && (
              <>
                <div className="text-xs text-muted-foreground">
                  {waypointOrder.length} waypoint{waypointOrder.length !== 1 ? 's' : ''} added
                </div>
                
                {currentRoute && (
                  <div className="bg-blue-50 rounded p-2 text-xs space-y-1">
                    <div className="flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      Route Details
                    </div>
                    <div>Distance: {formatDistance(currentRoute.distance)}</div>
                    <div>Duration: {formatDuration(currentRoute.duration)}</div>
                    <div>Profile: {routeProfile}</div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={clearWaypoints}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                  {waypointOrder.length >= 2 && (
                    <Button
                      size="sm"
                      variant="default"
                      className="flex-1 text-xs"
                      onClick={handleSaveRoute}
                      disabled={isLoadingRoute || !user}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Status feedback */}
          {(isAddingWaypoints || isAddingPOI) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-1 text-yellow-600" />
                <span className="text-yellow-800">
                  Click on the map to add {isAddingWaypoints ? 'waypoints' : 'POI'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(WaypointMapController);