
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map, List } from 'lucide-react';
import TripMap from './TripMap';
import MapComponent from '../MapComponent';
import TripListItem from './TripListItem';
import { TripCardProps } from './TripCard';
import { Skeleton } from '@/components/ui/skeleton';

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
  
  const handleTripClick = (trip: TripCardProps) => {
    setActiveTrip(trip.id);
    onTripSelect(trip);
  };

  const toggleView = () => {
    setShowList(!showList);
  };

  useEffect(() => {
    // Log for debugging
    console.log('FullScreenTripMap rendering with:', { 
      tripCount: trips.length, 
      isLoading, 
      mapLoaded 
    });
  }, [trips, isLoading, mapLoaded]);

  const handleMapLoad = () => {
    setMapLoaded(true);
    console.log('Map fully loaded');
  };

  return (
    <div className="h-full w-full relative">
      {/* Map View */}
      <div className="absolute inset-0">
        {trips.length > 0 ? (
          <TripMap
            startLocation={trips[0]?.startLocation}
            endLocation={trips[0]?.endLocation}
          />
        ) : (
          <MapComponent 
            height="100%" 
            width="100%"
            onMapLoad={handleMapLoad}
          />
        )}
      </div>

      {/* Toggle View Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/80 backdrop-blur-sm hover:bg-white"
          onClick={toggleView}
        >
          {showList ? <Map className="h-4 w-4" /> : <List className="h-4 w-4" />}
          <span className="ml-2">{showList ? 'Map' : 'List'}</span>
        </Button>
      </div>

      {/* Trip List Sidebar */}
      {showList && (
        <div className="absolute top-16 right-4 bottom-24 z-10 w-64 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-y-auto p-3">
          <h3 className="font-semibold mb-3">Your Trips</h3>
          
          {isLoading ? (
            // Loading state
            <div className="space-y-2">
              <Skeleton className="h-24 w-full rounded" />
              <Skeleton className="h-24 w-full rounded" />
              <Skeleton className="h-24 w-full rounded" />
            </div>
          ) : trips.length > 0 ? (
            // Trips list
            <div className="space-y-2">
              {trips.map(trip => (
                <TripListItem
                  key={trip.id}
                  trip={trip}
                  isActive={trip.id === activeTrip}
                  onSelect={() => handleTripClick(trip)}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-8 text-muted-foreground">
              <p>No trips found</p>
              <p className="text-sm mt-1">Create your first trip!</p>
            </div>
          )}
        </div>
      )}

      {/* Create Trip Button */}
      <div className="absolute bottom-8 right-8 z-10">
        <Button
          onClick={onCreateTrip}
          size="lg"
          className="rounded-full h-14 w-14 p-0 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default FullScreenTripMap;
