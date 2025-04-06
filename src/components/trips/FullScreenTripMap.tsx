
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { useMapMarkers } from './map/hooks/useMapMarkers';
import { TripCardProps } from './TripCard';

interface FullScreenTripMapProps {
  trips: TripCardProps[];
  onTripSelect: (trip: TripCardProps) => void;
  onCreateTrip: () => void;
  isLoading?: boolean;
}

const FullScreenTripMap: React.FC<FullScreenTripMapProps> = ({ 
  trips, 
  onTripSelect, 
  onCreateTrip,
  isLoading = false
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeTrip, setActiveTrip] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1haSIsImEiOiJjbHYwMnc2cXMwcW16MmpzOHl2cDk0YTdrIn0.-GGa9ys-f9e6M9Jp3_Xtig'; 

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [9.1829, 48.7758], // Default to Stuttgart
      zoom: 5
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Use the markers hook
  const { flyToTrip } = useMapMarkers(
    map.current, 
    trips, 
    activeTrip, 
    (trip) => {
      setActiveTrip(trip.id);
      onTripSelect(trip);
    },
    mapLoaded
  );

  // Effect to handle active trip changes - fly to the trip
  useEffect(() => {
    if (activeTrip && map.current) {
      const trip = trips.find(t => t.id === activeTrip);
      if (trip) {
        flyToTrip(trip);
      }
    }
  }, [activeTrip, trips, flyToTrip]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Overlay when loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Loading trips...</p>
          </div>
        </div>
      )}

      {/* Create trip button */}
      <div className="absolute bottom-6 right-6 z-10">
        <Button 
          size="lg" 
          className="shadow-lg flex items-center gap-2" 
          onClick={onCreateTrip}
        >
          <Plus className="h-5 w-5" />
          <span>Create Trip</span>
        </Button>
      </div>
    </div>
  );
};

export default FullScreenTripMap;
