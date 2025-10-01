import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map, List, Navigation, Wrench } from 'lucide-react';
import TripMap from './TripMap';
import MapComponent from '../MapComponent';
import TripListItem from './TripListItem';
import { TripCardProps } from './TripCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useMapMarkers } from './map/hooks/useMapMarkers';
import { useUserLocation } from '@/hooks/use-user-location';
import EnhancedTripsSidebar from './EnhancedTripsSidebar';
import { parseGpxFile } from './map/utils/tracks/parsers';
import mapboxgl from 'mapbox-gl';
import { EnhancedBarryChat } from '../knowledge/EnhancedBarryChat';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

interface FullScreenTripMapProps {
  trips: TripCardProps[];
  onTripSelect: (trip: TripCardProps) => void;
  onCreateTrip: () => void;
  isLoading: boolean;
}

const FullScreenTripMap: React.FC<FullScreenTripMapProps> = ({
  trips,
  onTripSelect,
  onCreateTrip,
  isLoading
}) => {
  const [activeTrip, setActiveTrip] = useState<string | null>(null);
  const [showList, setShowList] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [allTracks, setAllTracks] = useState<any[]>([]);
  const [uploadedTracks, setUploadedTracks] = useState<any[]>([]);
  const [showBarryChat, setShowBarryChat] = useState(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const { location } = useUserLocation();
  
  // Function to handle map load completion
  const handleMapLoad = (map: mapboxgl.Map) => {
    setMapLoaded(true);
    mapRef.current = map;
    console.log('Map fully loaded');
    
    // If we have user location, center the map and add marker
    if (location) {
      console.log('Centering map on user location:', location);
      map.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 10,
        essential: true
      });
      
      // Note: User location is now handled by GeolocateControl in the map initialization
      // The blue dot and compass functionality are provided by the built-in Mapbox control
      console.log('🗺️ User location will be handled by GeolocateControl');
    }
  };
  
  // Handle trip click in the list
  const handleTripClick = (trip: TripCardProps) => {
    setActiveTrip(trip.id);
    onTripSelect(trip);
    
    // If we have a map reference and the map supports flyTo
    if (mapRef.current && trip.startLocation) {
      try {
        // Parse coordinates from string
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
    console.log('FullScreenTripMap rendering with:', { 
      tripCount: trips.length, 
      isLoading, 
      mapLoaded,
      userLocation: location 
    });
  }, [trips, isLoading, mapLoaded, location]);

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
        />
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
              })),
              ...uploadedTracks
            ]}
            isLoading={isLoading}
            onTrackToggle={(trackId) => {
              // Handle track visibility toggle
              console.log('Toggle track:', trackId);
            }}
            onTrackSave={(trackId) => {
              // Handle saving uploaded track as trip
              console.log('Save track as trip:', trackId);
            }}
            onSearch={(query) => {
              // Handle search
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

export default FullScreenTripMap;
