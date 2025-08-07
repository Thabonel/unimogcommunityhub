import React, { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Layers, Save, Car, Footprints, Bike, Trash2, Navigation, List, Map } from 'lucide-react';
import MapComponent from '../MapComponent';
import { useWaypointManager } from '@/hooks/use-waypoint-manager';
import { formatDistance, formatDuration } from '@/services/mapboxDirections';
import { savePlannedRoute } from '@/services/trackService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import EnhancedTripsSidebar from './EnhancedTripsSidebar';
import { useUserLocation } from '@/hooks/use-user-location';
import { useTripsContext } from '@/contexts/TripsContext';

// Map styles
const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12',
};

interface ProperWaypointMapProps {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
}

const ProperWaypointMap: React.FC<ProperWaypointMapProps> = ({
  height = '100%',
  width = '100%',
  center = [9.1829, 48.7758],
  zoom = 10
}) => {
  const { user } = useAuth();
  const [currentMapStyle, setCurrentMapStyle] = useState<string>(MAP_STYLES.OUTDOORS);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [showTracksList, setShowTracksList] = useState(false);
  const { location } = useUserLocation();
  const { trips, isLoading } = useTripsContext();
  
  // Use the ACTUAL waypoint manager hook
  const waypointManager = useWaypointManager({
    map: mapInstance,
    onRouteUpdate: (waypoints) => {
      console.log('Route updated with waypoints:', waypoints);
    }
  });
  
  const {
    waypoints,
    isAddingMode,
    currentRoute,
    routeProfile,
    isLoadingRoute,
    setIsAddingMode,
    setRouteProfile,
    clearWaypoints
  } = waypointManager;
  
  // Handle map load
  const handleMapLoad = useCallback((map: mapboxgl.Map) => {
    console.log('Map loaded in ProperWaypointMap');
    setMapInstance(map);
  }, []);
  
  // Handle map style change
  const handleStyleChange = useCallback((style: string) => {
    console.log('Changing map style to:', style);
    setCurrentMapStyle(style);
    if (mapInstance) {
      mapInstance.setStyle(style);
    }
  }, [mapInstance]);
  
  // Save route handler
  const handleSaveRoute = async () => {
    if (!user) {
      toast.error('Please sign in to save routes');
      return;
    }
    
    if (waypoints.length < 2) {
      toast.error('Need at least 2 waypoints to save a route');
      return;
    }
    
    try {
      const savedTrack = await savePlannedRoute(
        waypoints,
        currentRoute,
        user.id,
        routeProfile
      );
      
      if (savedTrack) {
        clearWaypoints();
        setIsAddingMode(false);
        toast.success('Route saved successfully!');
        window.location.reload();
      }
    } catch (error) {
      console.error('Save route error:', error);
      toast.error('Failed to save route');
    }
  };
  
  // Toggle waypoint mode
  const toggleWaypointMode = () => {
    setIsAddingMode(!isAddingMode);
    if (!isAddingMode) {
      toast.info('🎯 Click on the map to add waypoints');
    } else {
      toast.info('Waypoint mode disabled');
    }
  };

  // Toggle tracks list
  const toggleTracksList = () => {
    setShowTracksList(!showTracksList);
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
      
      {/* Toggle Tracks List Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-white border shadow-md"
          onClick={toggleTracksList}
          type="button"
        >
          {showTracksList ? <Map className="h-4 w-4" /> : <List className="h-4 w-4" />}
          <span className="ml-2">{showTracksList ? 'Map' : 'Tracks'}</span>
        </Button>
      </div>

      {/* Enhanced Tracks Sidebar */}
      {showTracksList && (
        <div className="absolute top-16 right-4 bottom-4 z-40">
          <EnhancedTripsSidebar
            userLocation={location}
            tracks={[
              ...trips.map(trip => ({
                id: trip.id,
                name: trip.title,
                type: 'saved' as const,
                visible: true,
                startLocation: trip.start_location ? {
                  lat: trip.start_location.latitude,
                  lon: trip.start_location.longitude
                } : undefined,
                difficulty: trip.difficulty,
                length: trip.distance
              }))
            ]}
            isLoading={isLoading}
            onTrackToggle={(trackId) => {
              console.log('Toggle track:', trackId);
            }}
            onTrackSave={(trackId) => {
              console.log('Save track as trip:', trackId);
            }}
            onSearch={(query) => {
              console.log('Search:', query);
            }}
          />
        </div>
      )}
      
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
            
            {/* Add Waypoints Button */}
            <Button
              size="sm"
              variant={isAddingMode ? "default" : "outline"}
              className="w-full text-xs"
              onClick={toggleWaypointMode}
            >
              <MapPin className="h-3 w-3 mr-1" />
              {isAddingMode ? 'Stop Adding' : 'Add Waypoints'}
            </Button>
            
            {/* Route Profile Selection */}
            {waypoints.length > 0 && (
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
            
            {/* Waypoint info */}
            {waypoints.length > 0 && (
              <>
                <div className="text-xs text-muted-foreground">
                  {waypoints.length} waypoint{waypoints.length !== 1 ? 's' : ''} added
                </div>
                
                {/* Route info */}
                {currentRoute && (
                  <div className="bg-blue-50 rounded p-2 text-xs space-y-1">
                    <div className="font-medium">Route Details</div>
                    <div>Distance: {formatDistance(currentRoute.distance)}</div>
                    <div>Duration: {formatDuration(currentRoute.duration)}</div>
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
                  {waypoints.length >= 2 && (
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
            
            {/* Status feedback */}
            {isAddingMode && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
                <div className="flex items-center text-yellow-800">
                  <MapPin className="h-3 w-3 mr-1 text-yellow-600" />
                  Click on the map to add waypoints
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProperWaypointMap;