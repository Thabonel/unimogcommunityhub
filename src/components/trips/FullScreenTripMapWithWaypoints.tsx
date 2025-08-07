import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map, List, MapPin, Layers, Save, Car, Footprints, Bike, Trash2, Mountain } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MapComponent from '../MapComponent';
import { TripCardProps } from './TripCard';
import { useMapMarkers } from './map/hooks/useMapMarkers';
import { useUserLocation } from '@/hooks/use-user-location';
import EnhancedTripsSidebar from './EnhancedTripsSidebar';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { savePlannedRoute } from '@/services/trackService';
import { useAuth } from '@/contexts/AuthContext';
import { getDirections, formatDistance, formatDuration, DirectionsRoute } from '@/services/mapboxDirections';
import { Waypoint } from '@/types/waypoint';
import { Difficulty } from '@/hooks/use-trip-planning';

// Map styles configuration
const MAP_STYLES = {
  STREETS: 'mapbox://styles/mapbox/streets-v12',
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12',
  SATELLITE: 'mapbox://styles/mapbox/satellite-v9',
  SATELLITE_STREETS: 'mapbox://styles/mapbox/satellite-streets-v12',
};

interface FullScreenTripMapProps {
  trips: TripCardProps[];
  onTripSelect: (trip: TripCardProps) => void;
  onCreateTrip: () => void;
  isLoading: boolean;
}

const FullScreenTripMapWithWaypoints: React.FC<FullScreenTripMapProps> = ({
  trips,
  onTripSelect,
  onCreateTrip,
  isLoading
}) => {
  const [activeTrip, setActiveTrip] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentMapStyle, setCurrentMapStyle] = useState<string>(MAP_STYLES.OUTDOORS);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [isAddingWaypoints, setIsAddingWaypoints] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<DirectionsRoute | null>(null);
  const [routeProfile, setRouteProfile] = useState<'driving' | 'walking' | 'cycling'>('driving');
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  
  // Route planning fields
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const waypointMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const routeLayerId = useRef<string>('route-layer');
  const clickListenerRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(null);
  
  const { location } = useUserLocation();
  const { user } = useAuth();
  
  // Function to update waypoint labels
  const updateWaypointLabels = useCallback(() => {
    waypointMarkersRef.current.forEach((marker, index) => {
      const element = marker.getElement();
      if (element) {
        const label = element.querySelector('.waypoint-label') as HTMLElement;
        if (label) {
          // First waypoint is A, last is B, middle ones are numbered
          if (index === 0) {
            label.textContent = 'A';
          } else if (index === waypointMarkersRef.current.length - 1) {
            label.textContent = 'B';
          } else {
            label.textContent = index.toString();
          }
        }
      }
    });
  }, []);
  
  // Function to fetch and display route
  const fetchRoute = useCallback(async () => {
    if (!mapRef.current || waypoints.length < 2) return;
    
    setIsLoadingRoute(true);
    try {
      const route = await getDirections(waypoints, routeProfile);
      if (route) {
        setCurrentRoute(route);
        
        // Remove existing route layer
        if (mapRef.current.getLayer(routeLayerId.current)) {
          mapRef.current.removeLayer(routeLayerId.current);
        }
        if (mapRef.current.getSource(routeLayerId.current)) {
          mapRef.current.removeSource(routeLayerId.current);
        }
        
        // Add new route
        mapRef.current.addSource(routeLayerId.current, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        });
        
        mapRef.current.addLayer({
          id: routeLayerId.current,
          type: 'line',
          source: routeLayerId.current,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#00ff00',
            'line-width': 4,
            'line-opacity': 0.75
          }
        });
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      toast.error('Failed to calculate route');
    } finally {
      setIsLoadingRoute(false);
    }
  }, [waypoints, routeProfile]);
  
  // Update route when waypoints or profile changes
  useEffect(() => {
    if (waypoints.length >= 2) {
      fetchRoute();
    }
  }, [waypoints, routeProfile, fetchRoute]);
  
  // Function to handle map click for waypoints
  const handleMapClickForWaypoints = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (!isAddingWaypoints || !mapRef.current) return;
    
    const newWaypoint: Waypoint = {
      id: Date.now().toString(),
      coords: [e.lngLat.lng, e.lngLat.lat],
      name: waypoints.length === 0 ? 'A' : 'B',
      type: 'waypoint'
    };
    
    // Create custom marker element with label
    const el = document.createElement('div');
    el.className = 'waypoint-marker';
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.position = 'relative';
    
    // Create the pin
    const pin = document.createElement('div');
    pin.style.width = '100%';
    pin.style.height = '100%';
    pin.style.backgroundColor = '#FF0000';
    pin.style.borderRadius = '50% 50% 50% 0';
    pin.style.transform = 'rotate(-45deg)';
    pin.style.border = '2px solid white';
    pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    el.appendChild(pin);
    
    // Create the label
    const label = document.createElement('div');
    label.className = 'waypoint-label';
    label.style.position = 'absolute';
    label.style.top = '50%';
    label.style.left = '50%';
    label.style.transform = 'translate(-50%, -50%) rotate(45deg)';
    label.style.color = 'white';
    label.style.fontWeight = 'bold';
    label.style.fontSize = '12px';
    label.style.pointerEvents = 'none';
    label.textContent = waypoints.length === 0 ? 'A' : 'B';
    pin.appendChild(label);
    
    // Add marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat([e.lngLat.lng, e.lngLat.lat])
      .addTo(mapRef.current);
    
    waypointMarkersRef.current.push(marker);
    setWaypoints(prev => {
      const updated = [...prev, newWaypoint];
      // Update all labels after adding new waypoint
      setTimeout(updateWaypointLabels, 0);
      return updated;
    });
    
    console.log('Added waypoint:', newWaypoint);
  }, [isAddingWaypoints, waypoints, updateWaypointLabels]);
  
  // Function to handle map load completion
  const handleMapLoad = useCallback((map: mapboxgl.Map) => {
    console.log('Map fully loaded');
    setMapLoaded(true);
    mapRef.current = map;
    
    // Set up click handler for waypoints
    clickListenerRef.current = handleMapClickForWaypoints;
    map.on('click', clickListenerRef.current);
    
    // Change cursor when in waypoint mode
    map.on('mousemove', () => {
      if (isAddingWaypoints) {
        map.getCanvas().style.cursor = 'crosshair';
      } else {
        map.getCanvas().style.cursor = '';
      }
    });
    
    // Add user location marker if available
    if (location) {
      console.log('Centering map on user location:', location);
      map.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 10,
        essential: true
      });
      
      // Add user location marker
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }
      
      const el = document.createElement('div');
      el.className = 'user-location-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#4F46E5';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      
      userMarkerRef.current = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .addTo(map);
    }
  }, [location, handleMapClickForWaypoints, isAddingWaypoints]);
  
  // Update click listener when mode changes
  useEffect(() => {
    if (mapRef.current && clickListenerRef.current) {
      mapRef.current.off('click', clickListenerRef.current);
      clickListenerRef.current = handleMapClickForWaypoints;
      mapRef.current.on('click', clickListenerRef.current);
      
      // Update cursor - check if canvas exists
      const canvas = mapRef.current.getCanvas();
      if (canvas) {
        if (isAddingWaypoints) {
          canvas.style.cursor = 'crosshair';
        } else {
          canvas.style.cursor = '';
        }
      }
    }
  }, [isAddingWaypoints, handleMapClickForWaypoints]);
  
  // Handle trip click in the list
  const handleTripClick = (trip: TripCardProps) => {
    setActiveTrip(trip.id);
    onTripSelect(trip);
    
    // Fly to location if map is ready
    if (mapRef.current && trip.startLocation) {
      try {
        const coords = trip.startLocation.split(',').map(Number);
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          mapRef.current.flyTo({
            center: [coords[1], coords[0]], // [lng, lat]
            zoom: 10,
            essential: true
          });
        }
      } catch (err) {
        console.error('Error flying to location:', err);
      }
    }
  };

  // Toggle list view
  const toggleView = () => {
    setShowList(!showList);
  };

  // Toggle waypoint adding mode
  const toggleWaypointMode = () => {
    setIsAddingWaypoints(!isAddingWaypoints);
    if (!isAddingWaypoints) {
      toast.info('Click on the map to add waypoints');
    }
  };

  // Clear all waypoints
  const clearWaypoints = () => {
    waypointMarkersRef.current.forEach(marker => marker.remove());
    waypointMarkersRef.current = [];
    setWaypoints([]);
    setCurrentRoute(null);
    
    // Remove route from map
    if (mapRef.current) {
      if (mapRef.current.getLayer(routeLayerId.current)) {
        mapRef.current.removeLayer(routeLayerId.current);
      }
      if (mapRef.current.getSource(routeLayerId.current)) {
        mapRef.current.removeSource(routeLayerId.current);
      }
    }
  };

  // Handle map style change
  const handleStyleChange = useCallback((style: string) => {
    console.log('Changing map style to:', style);
    setCurrentMapStyle(style);
    if (mapRef.current) {
      mapRef.current.setStyle(style);
      // Re-add markers and route after style change
      mapRef.current.once('style.load', () => {
        // Re-add waypoint markers
        waypointMarkersRef.current.forEach((marker, index) => {
          if (waypoints[index]) {
            marker.addTo(mapRef.current!);
          }
        });
        // Re-add user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.addTo(mapRef.current!);
        }
        // Re-add route if exists
        if (currentRoute && waypoints.length >= 2) {
          fetchRoute();
        }
      });
    }
  }, [waypoints, currentRoute, fetchRoute]);
  
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
        setIsAddingWaypoints(false);
        // Reload trips to show the new saved route
        window.location.reload();
      }
    } catch (error) {
      console.error('Save route error:', error);
      toast.error('Failed to save route');
    }
  };

  // Use the map markers hook
  const { updateMapMarkers, flyToTrip } = useMapMarkers(
    mapRef.current,
    trips,
    activeTrip,
    handleTripClick,
    mapLoaded
  );

  // Effect for logging render info
  useEffect(() => {
    console.log('FullScreenTripMapWithWaypoints rendering with:', { 
      tripCount: trips.length, 
      isLoading, 
      mapLoaded,
      userLocation: location,
      waypointCount: waypoints.length
    });
  }, [trips, isLoading, mapLoaded, location, waypoints]);

  return (
    <div className="h-full w-full relative">
      {/* Map View */}
      <div className="absolute inset-0">
        <MapComponent 
          height="100%" 
          width="100%"
          onMapLoad={handleMapLoad}
          center={location ? [location.longitude, location.latitude] : undefined}
          zoom={10}
          style={currentMapStyle}
          hideControls={true}
        />
      </div>

      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-4 w-80">
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
                variant={currentMapStyle === 'mapbox://styles/mapbox/outdoors-v11' ? "default" : "outline"}
                className="text-xs"
                onClick={() => handleStyleChange('mapbox://styles/mapbox/outdoors-v11')}
              >
                Terrain
              </Button>
            </div>
          </div>

          {/* Route Planning Section */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Route Planning
            </div>
            
            {/* Route Input Fields */}
            <div className="space-y-2 mb-3">
              {/* Starting Point */}
              <div>
                <Label htmlFor="start-location" className="text-xs">Starting Point</Label>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <Input 
                    id="start-location"
                    type="text"
                    placeholder="Enter starting location" 
                    value={startLocation} 
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
              
              {/* Destination */}
              <div>
                <Label htmlFor="end-location" className="text-xs">Destination</Label>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <Input 
                    id="end-location"
                    type="text"
                    placeholder="Enter destination" 
                    value={endLocation} 
                    onChange={(e) => setEndLocation(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
              
              {/* Difficulty Level */}
              <div>
                <Label htmlFor="difficulty" className="text-xs">Difficulty Level</Label>
                <div className="flex items-center space-x-1">
                  <Mountain className="h-3 w-3 text-muted-foreground" />
                  <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                    <SelectTrigger id="difficulty" className="h-7 text-xs">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (Graded Roads)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (Rough Tracks)</SelectItem>
                      <SelectItem value="advanced">Advanced (Technical Terrain)</SelectItem>
                      <SelectItem value="expert">Expert (Extreme Conditions)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Route Profile Selection */}
            {(waypoints.length > 0 || (startLocation && endLocation)) && (
              <div className="grid grid-cols-3 gap-1 mb-2">
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
            
            {/* Waypoint Controls */}
            <div className="space-y-2">
              <Button
                size="sm"
                variant={isAddingWaypoints ? "default" : "outline"}
                className="w-full text-xs"
                onClick={toggleWaypointMode}
              >
                <MapPin className="h-3 w-3 mr-1" />
                {isAddingWaypoints ? 'Stop Adding Waypoints' : 'Add Waypoints (Click Map)'}
              </Button>
              
              {waypoints.length > 0 && (
                <>
                  <div className="text-xs text-muted-foreground">
                    {waypoints.length} waypoint{waypoints.length !== 1 ? 's' : ''} added
                  </div>
                  
                  {currentRoute && (
                    <div className="bg-blue-50 rounded p-2 text-xs space-y-1">
                      <div>Distance: {formatDistance(currentRoute.distance)}</div>
                      <div>Duration: {formatDuration(currentRoute.duration)}</div>
                    </div>
                  )}
                  
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
            </div>
          </div>
        </div>
      </div>

      {/* Toggle View Button */}
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-white border shadow-md"
          onClick={toggleView}
          type="button"
        >
          {showList ? <Map className="h-4 w-4" /> : <List className="h-4 w-4" />}
          <span className="ml-2">{showList ? 'Map' : 'List'}</span>
        </Button>
      </div>

      {/* Enhanced Trip List Sidebar */}
      {showList && (
        <div className="absolute top-16 right-4 bottom-24 z-10">
          <EnhancedTripsSidebar
            userLocation={location}
            tracks={[
              ...trips.map(trip => ({
                id: trip.id,
                name: trip.title,
                type: 'saved' as const,
                visible: true,
                startLocation: trip.startLocation ? {
                  lat: parseFloat(trip.startLocation.split(',')[0]),
                  lon: parseFloat(trip.startLocation.split(',')[1])
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

      {/* Create Trip Button - Hidden for now, using integrated route planning instead */}
      {/* <div className="absolute bottom-8 right-8 z-10">
        <Button
          onClick={onCreateTrip}
          size="lg"
          className="rounded-full h-14 w-14 p-0 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div> */}
    </div>
  );
};

export default FullScreenTripMapWithWaypoints;