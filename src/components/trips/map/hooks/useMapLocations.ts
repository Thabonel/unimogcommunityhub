
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Trip } from '@/types/trip';
import { useTripsContext } from '@/contexts/TripsContext';
import { MAPBOX_CONFIG } from '@/config/env';
import { hasMapboxToken } from '../mapConfig';

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
  const { trips } = useTripsContext();
  
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isTripSelected, setIsTripSelected] = useState(false);
  const [mapInitError, setMapInitError] = useState<string | null>(null);

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
    // Check for token before attempting to initialize
    if (!hasMapboxToken()) {
      console.error('No Mapbox token available. Map cannot be initialized.');
      setMapInitError('Mapbox access token is missing. Please check your environment variables or enter a token manually.');
      return null;
    }

    try {
      console.log('Initializing map with token:', MAPBOX_CONFIG.accessToken ? 'Available' : 'Missing');
      
      mapboxgl.accessToken = MAPBOX_CONFIG.accessToken || localStorage.getItem('mapbox_access_token') || '';

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
        console.log('Map loaded successfully');
        if (trips && trips.length > 0) {
          loadTripsOnMap(map);
        }
      });

      // Map error handling
      map.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapInitError('Map encountered an error: ' + (e.error?.message || 'Unknown error'));
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
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapInitError('Failed to initialize map: ' + (error instanceof Error ? error.message : 'Unknown error'));
      return null;
    }
  }, [trips]);

  // Load trips on the map
  const loadTripsOnMap = useCallback((map: mapboxgl.Map) => {
    if (!trips || trips.length === 0) {
      console.log("No trips to load on the map.");
      return;
    }

    // Clear any existing markers first
    const existingMarkers = document.querySelectorAll('.marker');
    existingMarkers.forEach(marker => marker.remove());

    console.log(`Loading ${trips.length} trips on the map`);
    
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
      } else {
        console.warn(`Trip ${trip.id} has no valid start location coordinates`);
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
    if (mapRef.current && trips && trips.length > 0) {
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
    mapInitError,
  };
};
