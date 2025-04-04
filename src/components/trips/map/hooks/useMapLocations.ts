
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Trip } from '@/types/trip';
import { useTrips } from '@/contexts/TripsContext';

// Define a type for coordinates
interface Coordinates {
  latitude: number;
  longitude: number;
}

// Define a type for the map bounds
interface MapBounds {
  _sw: Coordinates; // Southwest coordinates
  _ne: Coordinates; // Northeast coordinates
}

interface UseMapLocationsProps {
  map: mapboxgl.Map | null;
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  isLoading: boolean;
  error: string | null;
}

// Custom hook for managing map locations and interactions
export const useMapLocations = (props?: UseMapLocationsProps) => {
  const { trips } = useTrips();
  
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isTripSelected, setIsTripSelected] = useState(false);

  // Default zoom level
  const defaultZoom = 2;

  // If props are provided, update the map with route info
  useEffect(() => {
    if (props && props.map && !props.isLoading && !props.error) {
      // Store the map reference
      mapRef.current = props.map;
      
      // Handle route display logic via the useMapLocations.ts file in parent directory
      // This is kept separate to maintain compatibility with both usages
      const handleRouteDisplay = async () => {
        if (props.startLocation || props.endLocation) {
          console.log('Displaying route between:', props.startLocation, 'and', props.endLocation);
          console.log('Waypoints:', props.waypoints);
          // The actual route display logic is in the parent directory's implementation
        }
      };
      
      handleRouteDisplay();
    }
  }, [props?.map, props?.startLocation, props?.endLocation, props?.waypoints, props?.isLoading, props?.error]);

  // Initialize map
  const initializeMap = useCallback((container: HTMLDivElement) => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    const map = new mapboxgl.Map({
      container: container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-99.5, 40.0], // Default center
      zoom: defaultZoom,
    });

    mapRef.current = map;

    // Add navigation control (zoom buttons)
    const navigationControl = new mapboxgl.NavigationControl();
    map.addControl(navigationControl, 'top-right');

    // Add geolocate control (find user location)
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
    });
    map.addControl(geolocateControl, 'top-left');

    // Event listener for geolocate activation
    map.on('geolocate', () => {
      console.log('A geolocate event has occurred.');
    });

    // Error handling for geolocation
    geolocateControl.on('error', (error) => {
      console.error('Geolocation error:', error);
    });

    // Load trips when the map is loaded
    map.on('load', () => {
      loadTripsOnMap(map);
    });

    // Update map bounds on move
    map.on('moveend', () => {
      if (map.getBounds()) {
        const bounds = map.getBounds();
        setMapBounds({
          _sw: { latitude: bounds.getSouth(), longitude: bounds.getWest() },
          _ne: { latitude: bounds.getNorth(), longitude: bounds.getEast() }
        });
      }
    });

    return map;
  }, []);

  // Load trips on the map
  const loadTripsOnMap = useCallback((map: mapboxgl.Map) => {
    if (!trips || trips.length === 0) {
      console.log("No trips to load on the map.");
      return;
    }

    trips.forEach(trip => {
      if (trip.start_location?.latitude && trip.start_location?.longitude) {
        // Create a DOM element for each trip marker
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundImage = `url(${trip.image_url || '/img/default-unimog-marker.png'})`;
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = 'cover';
        el.style.borderRadius = '50%';

        // Add a popup for each marker
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <h3>${trip.title}</h3>
            <p>${trip.description}</p>
            <img src="${trip.image_url || '/img/default-unimog-marker.png'}" alt="${trip.title}" style="width: 200px; height: auto;">
          `);

        // Add a marker for each trip
        new mapboxgl.Marker(el)
          .setLngLat([trip.start_location.longitude, trip.start_location.latitude])
          .setPopup(popup) // sets a popup on this marker
          .addTo(map);
      }
    });
  }, [trips]);

  // Function to update the map view based on coordinates and zoom
  const updateMapView = (coordinates: Coordinates, zoom?: number) => {
    if (!mapRef.current) return;
  
    mapRef.current.flyTo({
      center: [coordinates.longitude, coordinates.latitude],
      zoom: zoom || defaultZoom,
      essential: true
    });
  };

  // Effect to load trips when trips data changes
  useEffect(() => {
    if (mapRef.current) {
      loadTripsOnMap(mapRef.current);
    }
  }, [trips, loadTripsOnMap]);

  // Function to handle trip selection
  const handleTripSelection = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsTripSelected(true);

    if (trip.start_location?.latitude && trip.start_location?.longitude) {
      updateMapView(trip.start_location, 10);
    }
  };

  // Function to handle clearing the selected trip
  const clearSelectedTrip = () => {
    setSelectedTrip(null);
    setIsTripSelected(false);
    updateMapView({ latitude: 40.0, longitude: -99.5 }, defaultZoom); // Reset to default view
  };

  return {
    mapRef,
    mapBounds,
    initializeMap,
    handleTripSelection,
    clearSelectedTrip,
    selectedTrip,
    isTripSelected,
  };
};
