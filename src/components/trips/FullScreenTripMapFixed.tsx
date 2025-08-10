import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map, List, MapPin, Layers, Wrench } from 'lucide-react';
import TripMap from './TripMap';
import MapComponent from '../MapComponent';
import { TripCardProps } from './TripCard';
import { useMapMarkers } from './map/hooks/useMapMarkers';
import { useUserLocation } from '@/hooks/use-user-location';
import EnhancedTripsSidebar from './EnhancedTripsSidebar';
import mapboxgl from 'mapbox-gl';
import { EnhancedBarryChat } from '../knowledge/EnhancedBarryChat';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

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

const FullScreenTripMapFixed: React.FC<FullScreenTripMapProps> = ({
  trips,
  onTripSelect,
  onCreateTrip,
  isLoading
}) => {
  const [activeTrip, setActiveTrip] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentMapStyle, setCurrentMapStyle] = useState<string>(MAP_STYLES.OUTDOORS);
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [isAddingWaypoints, setIsAddingWaypoints] = useState(false);
  const [showBarryChat, setShowBarryChat] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const waypointMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const { location } = useUserLocation();
  
  // Function to handle map load completion
  const handleMapLoad = useCallback((map: mapboxgl.Map) => {
    console.log('Map fully loaded');
    setMapLoaded(true);
    mapRef.current = map;
    
    // Set up click handler for waypoints AFTER map is loaded
    map.on('click', (e) => {
      if (isAddingWaypoints) {
        const newWaypoint = {
          id: Date.now().toString(),
          lng: e.lngLat.lng,
          lat: e.lngLat.lat
        };
        
        // Add marker
        const marker = new mapboxgl.Marker({ color: '#FF0000' })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map);
        
        waypointMarkersRef.current.push(marker);
        setWaypoints(prev => [...prev, newWaypoint]);
        console.log('Added waypoint:', newWaypoint);
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
  }, [isAddingWaypoints, location]);
  
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
    
    // Clear waypoints when toggling off
    if (isAddingWaypoints) {
      waypointMarkersRef.current.forEach(marker => marker.remove());
      waypointMarkersRef.current = [];
      setWaypoints([]);
    }
  };

  // Clear all waypoints
  const clearWaypoints = () => {
    waypointMarkersRef.current.forEach(marker => marker.remove());
    waypointMarkersRef.current = [];
    setWaypoints([]);
  };

  // Handle map style change
  const handleStyleChange = useCallback((style: string) => {
    console.log('Changing map style to:', style);
    setCurrentMapStyle(style);
    if (mapRef.current) {
      mapRef.current.setStyle(style);
      // Re-add markers after style change
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
      });
    }
  }, [waypoints]);

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
    console.log('FullScreenTripMapFixed rendering with:', { 
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
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-4 w-64">
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

          {/* Waypoint Controls */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Route Planning
            </div>
            <div className="space-y-2">
              <Button
                size="sm"
                variant={isAddingWaypoints ? "default" : "outline"}
                className="w-full text-xs"
                onClick={toggleWaypointMode}
              >
                {isAddingWaypoints ? 'Stop Adding' : 'Add Waypoints'}
              </Button>
              {waypoints.length > 0 && (
                <>
                  <div className="text-xs text-muted-foreground">
                    {waypoints.length} waypoint{waypoints.length !== 1 ? 's' : ''} added
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                    onClick={clearWaypoints}
                  >
                    Clear Waypoints
                  </Button>
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

      {/* Barry AI Chat Button */}
      <div className="absolute bottom-8 right-16 z-10">
        <Button
          onClick={() => setShowBarryChat(true)}
          size="lg"
          className="rounded-full h-14 w-14 p-0 shadow-lg bg-unimog-500 hover:bg-unimog-600 border-2 border-white"
          title="Chat with Barry - AI Mechanic"
        >
          <div className="relative w-10 h-10">
            <img
              src="/barry-avatar.png"
              alt="Barry"
              className="w-full h-full rounded-full object-cover"
            />
            <Wrench className="h-4 w-4 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 text-unimog-500" />
          </div>
        </Button>
      </div>

      {/* Barry AI Chat Modal */}
      <Dialog open={showBarryChat} onOpenChange={setShowBarryChat}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 flex flex-col">
          <DialogHeader className="p-6 pb-0 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/barry-avatar.png"
                  alt="Barry the AI Mechanic"
                  className="w-12 h-12 rounded-full border-2 border-unimog-500"
                />
                <Wrench className="h-4 w-4 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 text-unimog-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-unimog-800 dark:text-unimog-200">
                  Barry - AI Mechanic with Manual Access
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ask Barry about maintenance, repairs, or any technical questions about your Unimog
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto min-h-0">
            <EnhancedBarryChat className="h-full" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FullScreenTripMapFixed;