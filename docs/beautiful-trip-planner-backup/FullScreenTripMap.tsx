import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map, List } from 'lucide-react';
import TripMap from './TripMap';
import { TripCardProps } from './TripCard';
import { useUserLocation } from '@/hooks/use-user-location';
import EnhancedTripsSidebar from './EnhancedTripsSidebar';
import mapboxgl from 'mapbox-gl';

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
  const [routeWaypoints, setRouteWaypoints] = useState<any[]>([]);
  const { location } = useUserLocation();
  
  // Handle trip click in the list
  const handleTripClick = (trip: TripCardProps) => {
    setActiveTrip(trip.id);
    onTripSelect(trip);
  };

  // Toggle list view
  const toggleView = () => {
    setShowList(!showList);
  };

  // Handle route changes from TripMap
  const handleRouteChange = (waypoints: any[]) => {
    console.log('Route changed:', waypoints);
    setRouteWaypoints(waypoints);
  };

  // Effect for logging render info
  useEffect(() => {
    console.log('FullScreenTripMap rendering with:', { 
      tripCount: trips.length, 
      isLoading,
      userLocation: location 
    });
  }, [trips, isLoading, location]);

  return (
    <div className="h-full w-full relative">
      {/* Map View with TripMap component */}
      <div className="absolute inset-0">
        <TripMap 
          userLocation={location ? {
            latitude: location.latitude,
            longitude: location.longitude
          } : undefined}
          onRouteChange={handleRouteChange}
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
            tracks={trips.map(trip => ({
              id: trip.id,
              name: trip.title,
              type: 'saved' as const,
              data: null,
              created_at: trip.startDate,
              visible: false,
              distance: trip.distance,
              difficulty: trip.difficulty,
              length: trip.distance
            }))}
            isLoading={isLoading}
            onTrackToggle={(trackId) => {
              console.log('Toggle track:', trackId);
            }}
            onTrackSave={(trackId) => {
              console.log('Save track as trip:', trackId);
            }}
            onTracksLoad={(tracks) => {
              console.log('Tracks loaded:', tracks);
            }}
            onSearch={(query) => {
              console.log('Search:', query);
            }}
          />
        </div>
      )}

      {/* Create Trip Button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={onCreateTrip}
          className="shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Plan New Trip
        </Button>
      </div>
    </div>
  );
};

export default FullScreenTripMap;