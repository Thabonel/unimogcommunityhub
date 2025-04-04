
import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Map, Plus, List, Layers, Navigation, Filter, Search, X, 
  ChevronLeft, ChevronRight, Compass
} from 'lucide-react';
import { TripCardProps } from './TripCard';
import { useUserLocation } from '@/hooks/use-user-location';
import TripListItem from './TripListItem';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface FullScreenTripMapProps {
  trips: TripCardProps[];
  onTripSelect: (trip: TripCardProps) => void;
  onCreateTrip: () => void;
}

const FullScreenTripMap = ({ trips, onTripSelect, onCreateTrip }: FullScreenTripMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { location } = useUserLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTrip, setActiveTrip] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markerRefs = useRef<{[key: string]: mapboxgl.Marker}>({});

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current) return; // Map already initialized
    
    // Try to get token from local storage or use default
    const token = localStorage.getItem('mapbox-token') || 
                  'pk.eyJ1IjoidGhhYm9uZWwiLCJhIjoiY204d3lwMnhwMDBmdTJqb2JzdWgzdmZ2YyJ9.0wyj48txMJAJht1kYfyOdQ';
    
    if (!token) {
      console.error('No Mapbox token available');
      return;
    }

    mapboxgl.accessToken = token;

    const initMap = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/outdoors-v12', // Outdoors style good for off-road routes
      center: location ? [location.longitude, location.latitude] : [-95.7129, 37.0902],
      zoom: location ? 9 : 3,
    });

    // Add navigation controls
    initMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
    // Add scale control
    initMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
    
    // Add user location control
    initMap.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }),
      'bottom-right'
    );

    // When the map is loaded, add markers
    initMap.on('load', () => {
      setMapLoaded(true);
      
      // Add user's location marker if available
      if (location) {
        new mapboxgl.Marker({ color: '#3880ff' })
          .setLngLat([location.longitude, location.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <h3 class="text-sm font-bold">Your Location</h3>
            <p class="text-xs">${location.city}, ${location.country}</p>
          `))
          .addTo(initMap);
      }
    });

    map.current = initMap;

    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [location]);

  // Add trip markers to the map
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers first
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};
    
    // Add markers for each trip
    trips.forEach(trip => {
      // For a real app, we would geocode these locations
      // Here we'll use mock coordinates based on the location string
      
      // Simple mock geocoding for demo purposes
      const getCoordinates = (location: string): [number, number] => {
        if (location.includes('Swiss') || location.includes('Zurich')) 
          return [8.5417, 47.3769]; // Swiss coordinates
        if (location.includes('Sahara') || location.includes('Marrakech')) 
          return [-7.9811, 31.6295]; // Morocco coordinates
        return [0, 0]; // Default
      };

      const coords = getCoordinates(trip.location);
      
      // Create a custom HTML element for the marker
      const el = document.createElement('div');
      el.className = 'flex items-center justify-center';
      el.innerHTML = `
        <div class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center
          ${activeTrip === trip.id ? 'ring-4 ring-primary ring-opacity-50' : ''}"
          style="box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          <span class="text-xs font-bold">U</span>
        </div>
      `;

      // Create the marker and popup
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(coords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <h3 class="text-sm font-bold">${trip.title}</h3>
          <p class="text-xs">${trip.description}</p>
          <p class="text-xs mt-1">${trip.startDate} - ${trip.endDate || 'Ongoing'}</p>
        `))
        .addTo(map.current);
        
      // Store the marker reference
      markerRefs.current[trip.id] = marker;
      
      // If this is the active trip, open its popup
      if (activeTrip === trip.id) {
        marker.togglePopup();
      }
    });
  }, [trips, activeTrip, mapLoaded]);

  // Filter trips based on search query
  const filteredTrips = trips.filter(trip => 
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.terrainTypes.some(terrain => 
      terrain.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // When a trip is selected from the list
  const handleTripSelect = (trip: TripCardProps) => {
    setActiveTrip(trip.id);
    onTripSelect(trip);
    
    // Fly to the trip location
    if (map.current) {
      // Simple mock geocoding for demo purposes
      const getCoordinates = (location: string): [number, number] => {
        if (location.includes('Swiss') || location.includes('Zurich')) 
          return [8.5417, 47.3769]; // Swiss coordinates
        if (location.includes('Sahara') || location.includes('Marrakech')) 
          return [-7.9811, 31.6295]; // Morocco coordinates
        return [0, 0]; // Default
      };

      const coords = getCoordinates(trip.location);
      
      map.current.flyTo({
        center: coords,
        zoom: 9,
        essential: true
      });
      
      // Open the popup for this marker
      if (markerRefs.current[trip.id]) {
        markerRefs.current[trip.id].togglePopup();
      }
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />
      
      {/* Top control bar */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-10 p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <Map size={24} className="text-primary mr-2" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Unimog Trip Explorer</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search size={16} className="absolute left-2 top-2.5 text-gray-500" />
            <Input 
              placeholder="Search trips..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
          
          <Button 
            size="sm" 
            className="bg-primary flex items-center gap-1"
            onClick={onCreateTrip}
          >
            <Plus size={16} />
            <span>New Trip</span>
          </Button>
        </div>
      </div>
      
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-20 left-0 z-20 bg-white dark:bg-gray-800 p-1 shadow-md rounded-r-lg"
      >
        {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
      
      {/* Sidebar */}
      <div className={cn(
        "absolute top-16 left-0 bottom-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm z-10 transition-all duration-300 shadow-md",
        sidebarOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full"
      )}>
        <div className="p-4 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <List size={18} className="text-primary mr-2" />
              <h2 className="font-semibold">Your Trips</h2>
            </div>
            <div className="flex gap-1">
              <Badge variant="outline" className="text-xs">
                {filteredTrips.length} trips
              </Badge>
            </div>
          </div>
          
          {filteredTrips.length > 0 ? (
            <div className="space-y-3">
              {filteredTrips.map((trip) => (
                <TripListItem
                  key={trip.id}
                  trip={trip}
                  isActive={activeTrip === trip.id}
                  onSelect={() => handleTripSelect(trip)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Compass size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No trips found</p>
              <p className="text-gray-400 text-sm">Try adjusting your search</p>
            </div>
          )}
          
          {/* Create new trip card */}
          <Card 
            className="mt-4 border-dashed hover:border-primary/50 cursor-pointer transition-colors" 
            onClick={onCreateTrip}
          >
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Plus size={24} className="text-primary mb-2" />
              <p className="text-sm font-medium">Plan New Trip</p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Map control buttons */}
      <div className="absolute top-20 right-4 z-10 flex flex-col space-y-2">
        <Button size="icon" variant="outline" className="bg-white/90 dark:bg-gray-800/90 shadow-md">
          <Layers size={18} />
        </Button>
        <Button size="icon" variant="outline" className="bg-white/90 dark:bg-gray-800/90 shadow-md">
          <Navigation size={18} />
        </Button>
      </div>
    </div>
  );
};

export default FullScreenTripMap;
