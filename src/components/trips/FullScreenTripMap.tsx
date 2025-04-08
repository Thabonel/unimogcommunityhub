import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map, List } from 'lucide-react';
import TripMap from './TripMap';
import MapComponent from '../MapComponent';
import TripListItem from './TripListItem';
import { TripCardProps } from './TripCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useMapMarkers } from './map/hooks/useMapMarkers';
import { useUserLocation } from '@/hooks/use-user-location';

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
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { location } = useUserLocation();
  
  // Function to handle map load completion
  const handleMapLoad = (map: mapboxgl.Map) => {
    setMapLoaded(true);
    mapRef.current = map;
    console.log('Map fully loaded');
    
    // If we have user location, center the map
    if (location) {
      console.log('Centering map on user location:', location);
      map.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 10,
        essential: true
      });
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
