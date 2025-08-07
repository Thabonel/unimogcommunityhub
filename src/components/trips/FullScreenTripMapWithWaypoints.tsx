import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map, List, MapPin, Layers, Save, Car, Footprints, Bike, Trash2, Mountain, Navigation } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LocationAutocomplete } from '@/components/ui/location-autocomplete';
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
import { SaveRouteModal, SaveRouteData } from './SaveRouteModal';
import { AddPOIModal } from './AddPOIModal';
import { getPOIsInBounds, POI_ICONS } from '@/services/poiService';

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
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isAddingPOI, setIsAddingPOI] = useState(false);
  const [showPOIModal, setShowPOIModal] = useState(false);
  const [poiCoordinates, setPOICoordinates] = useState<[number, number] | null>(null);
  const [pois, setPOIs] = useState<any[]>([]);
  const poiMarkersRef = useRef<mapboxgl.Marker[]>([]);
  
  // Refs for accessing current state values in stable callbacks
  const isAddingWaypointsRef = useRef(isAddingWaypoints);
  const isAddingPOIRef = useRef(isAddingPOI);
  const waypointsRef = useRef(waypoints);
  
  // Update refs when state changes
  useEffect(() => {
    isAddingWaypointsRef.current = isAddingWaypoints;
  }, [isAddingWaypoints]);
  
  useEffect(() => {
    isAddingPOIRef.current = isAddingPOI;
  }, [isAddingPOI]);
  
  useEffect(() => {
    waypointsRef.current = waypoints;
  }, [waypoints]);
  
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
  
  // Load POIs when map loads or bounds change
  const loadPOIs = useCallback(async () => {
    if (!mapRef.current) return;
    
    const bounds = mapRef.current.getBounds();
    const poisInBounds = await getPOIsInBounds({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest()
    });
    
    // Clear existing POI markers
    poiMarkersRef.current.forEach(marker => marker.remove());
    poiMarkersRef.current = [];
    
    // Add new POI markers
    poisInBounds.forEach(poi => {
      if (!mapRef.current) return;
      
      const el = document.createElement('div');
      el.className = 'poi-marker';
      el.innerHTML = `<div style="font-size: 24px;">${POI_ICONS[poi.type]?.icon || '📍'}</div>`;
      el.style.cursor = 'pointer';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(poi.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${poi.name}</h3>
            ${poi.description ? `<p style="font-size: 14px; color: #666;">${poi.description}</p>` : ''}
            <p style="font-size: 12px; color: #999; margin-top: 4px;">Type: ${POI_ICONS[poi.type]?.label}</p>
          </div>
        `))
        .addTo(mapRef.current);
      
      poiMarkersRef.current.push(marker);
    });
    
    setPOIs(poisInBounds);
  }, []);

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
  
  
  // Function to handle map load completion - stable version
  const handleMapLoad = useCallback((map: mapboxgl.Map) => {
    console.log('Map fully loaded');
    setMapLoaded(true);
    mapRef.current = map;
    
    // Set up click handler for waypoints and POIs
    const clickHandler = (e: mapboxgl.MapMouseEvent) => {
      if (!mapRef.current) return;
      
      // Handle POI click using ref
      if (isAddingPOIRef.current) {
        setPOICoordinates([e.lngLat.lng, e.lngLat.lat]);
        setShowPOIModal(true);
        setIsAddingPOI(false);
        return;
      }
      
      // Handle waypoint click using ref
      if (!isAddingWaypointsRef.current) return;
      
      const currentWaypoints = waypointsRef.current;
      const newWaypoint: Waypoint = {
        id: Date.now().toString(),
        coords: [e.lngLat.lng, e.lngLat.lat],
        name: currentWaypoints.length === 0 ? 'A' : 'B',
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
      label.textContent = currentWaypoints.length === 0 ? 'A' : 'B';
      pin.appendChild(label);
      
      // Add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(mapRef.current!);
      
      waypointMarkersRef.current.push(marker);
      setWaypoints(prev => {
        const updated = [...prev, newWaypoint];
        // Update all labels after adding new waypoint
        setTimeout(() => {
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
        }, 0);
        return updated;
      });
    };
    
    clickListenerRef.current = clickHandler;
    map.on('click', clickHandler);
    
    // Change cursor when in waypoint or POI mode using refs
    const mouseMoveHandler = () => {
      if (isAddingWaypointsRef.current || isAddingPOIRef.current) {
        map.getCanvas().style.cursor = 'crosshair';
      } else {
        map.getCanvas().style.cursor = '';
      }
    };
    
    map.on('mousemove', mouseMoveHandler);
  }, []);
  
  // Load POIs when map is ready
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      // Load POIs initially
      loadPOIs();
      
      // Set up move end listener for loading POIs with debounce
      let debounceTimer: NodeJS.Timeout;
      const moveEndHandler = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          loadPOIs();
        }, 500); // 500ms debounce
      };
      
      mapRef.current.on('moveend', moveEndHandler);
      
      // Cleanup
      return () => {
        clearTimeout(debounceTimer);
        if (mapRef.current) {
          mapRef.current.off('moveend', moveEndHandler);
        }
      };
    }
  }, [mapLoaded, loadPOIs]);

  // Update cursor when mode changes
  useEffect(() => {
    if (mapRef.current) {
      const canvas = mapRef.current.getCanvas();
      if (canvas) {
        if (isAddingWaypoints || isAddingPOI) {
          canvas.style.cursor = 'crosshair';
        } else {
          canvas.style.cursor = '';
        }
      }
    }
  }, [isAddingWaypoints, isAddingPOI]);

  // Add user location marker when location is available
  useEffect(() => {
    if (mapLoaded && mapRef.current && location) {
      console.log('Adding user location marker:', location);
      
      // Remove existing user marker
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
        .addTo(mapRef.current);
      
      // Center map on user location only once
      const currentCenter = mapRef.current.getCenter();
      const distance = Math.abs(currentCenter.lng - location.longitude) + Math.abs(currentCenter.lat - location.latitude);
      
      // Only fly to location if we're more than 0.001 degrees away (roughly 100m)
      if (distance > 0.001) {
        mapRef.current.flyTo({
          center: [location.longitude, location.latitude],
          zoom: 10,
          essential: true
        });
      }
    }
  }, [mapLoaded, location]);
  
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
  
  // Toggle POI adding mode
  const togglePOIMode = () => {
    setIsAddingPOI(!isAddingPOI);
    setIsAddingWaypoints(false); // Disable waypoint mode
    if (!isAddingPOI) {
      toast.info('Click on the map to add a Point of Interest');
    }
  };

  // Handle POI save
  const handlePOISave = (poi: any) => {
    if (!mapRef.current) return;
    
    // Add POI marker to map
    const el = document.createElement('div');
    el.className = 'poi-marker';
    el.innerHTML = `<div style="font-size: 24px;">${POI_ICONS[poi.type]?.icon || '📍'}</div>`;
    el.style.cursor = 'pointer';
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat(poi.coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(`
        <div style="padding: 8px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${poi.name}</h3>
          ${poi.description ? `<p style="font-size: 14px; color: #666;">${poi.description}</p>` : ''}
          <p style="font-size: 12px; color: #999; margin-top: 4px;">Type: ${POI_ICONS[poi.type]?.label}</p>
        </div>
      `))
      .addTo(mapRef.current);
    
    poiMarkersRef.current.push(marker);
    setPOIs(prev => [...prev, poi]);
    toast.success('Point of Interest added!');
  };

  // Save route handler - opens the save modal
  const handleSaveRoute = () => {
    if (!user) {
      toast.error('Please sign in to save routes');
      return;
    }
    
    if (waypoints.length < 2) {
      toast.error('Need at least 2 waypoints to save a route');
      return;
    }
    
    setShowSaveModal(true);
  };

  // Handle saving route with additional data
  const handleSaveRouteWithData = async (data: SaveRouteData) => {
    if (!user) return;
    
    try {
      const savedTrack = await savePlannedRoute(
        waypoints,
        currentRoute,
        user.id,
        routeProfile,
        {
          name: data.name,
          description: data.description,
          difficulty: data.difficulty,
          isPublic: data.isPublic,
          imageUrl: data.imageUrl,
          notes: data.notes
        }
      );
      
      if (savedTrack) {
        clearWaypoints();
        setIsAddingWaypoints(false);
        setShowSaveModal(false);
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

  // Memoize the map component to prevent re-renders - only re-create when style changes
  const memoizedMap = useMemo(() => (
    <MapComponent 
      height="100%" 
      width="100%"
      onMapLoad={handleMapLoad}
      center={undefined} // Let map use default center, we'll set user location separately
      zoom={10}
      style={currentMapStyle}
      hideControls={true}
    />
  ), [currentMapStyle]); // Only re-render when map style changes

  return (
    <div className="h-full w-full relative">
      {/* Map View */}
      <div className="absolute inset-0">
        {memoizedMap}
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
                <LocationAutocomplete
                  id="start-location"
                  value={startLocation}
                  onChange={setStartLocation}
                  onLocationSelect={(location) => {
                    // Add a waypoint at the start location if in waypoint mode
                    if (isAddingWaypoints && mapRef.current && waypoints.length === 0) {
                      const newWaypoint: Waypoint = {
                        id: Date.now().toString(),
                        coords: location.coordinates,
                        name: 'A',
                        type: 'waypoint'
                      };
                      
                      // Create marker for start point
                      const el = document.createElement('div');
                      el.className = 'waypoint-marker';
                      el.style.width = '30px';
                      el.style.height = '30px';
                      el.style.position = 'relative';
                      
                      const pin = document.createElement('div');
                      pin.style.width = '100%';
                      pin.style.height = '100%';
                      pin.style.backgroundColor = '#FF0000';
                      pin.style.borderRadius = '50% 50% 50% 0';
                      pin.style.transform = 'rotate(-45deg)';
                      pin.style.border = '2px solid white';
                      pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                      el.appendChild(pin);
                      
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
                      label.textContent = 'A';
                      pin.appendChild(label);
                      
                      const marker = new mapboxgl.Marker(el)
                        .setLngLat(location.coordinates)
                        .addTo(mapRef.current);
                      
                      waypointMarkersRef.current.push(marker);
                      setWaypoints([newWaypoint]);
                    }
                  }}
                  placeholder="Enter starting location"
                  className="h-7 text-xs"
                  userLocation={location}
                />
              </div>
              
              {/* Destination */}
              <div>
                <Label htmlFor="end-location" className="text-xs">Destination</Label>
                <LocationAutocomplete
                  id="end-location"
                  value={endLocation}
                  onChange={setEndLocation}
                  onLocationSelect={(location) => {
                    // Add a waypoint at the end location if in waypoint mode
                    if (isAddingWaypoints && mapRef.current && waypoints.length >= 1) {
                      const newWaypoint: Waypoint = {
                        id: Date.now().toString(),
                        coords: location.coordinates,
                        name: 'B',
                        type: 'waypoint'
                      };
                      
                      // Create marker for end point
                      const el = document.createElement('div');
                      el.className = 'waypoint-marker';
                      el.style.width = '30px';
                      el.style.height = '30px';
                      el.style.position = 'relative';
                      
                      const pin = document.createElement('div');
                      pin.style.width = '100%';
                      pin.style.height = '100%';
                      pin.style.backgroundColor = '#FF0000';
                      pin.style.borderRadius = '50% 50% 50% 0';
                      pin.style.transform = 'rotate(-45deg)';
                      pin.style.border = '2px solid white';
                      pin.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                      el.appendChild(pin);
                      
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
                      label.textContent = 'B';
                      pin.appendChild(label);
                      
                      const marker = new mapboxgl.Marker(el)
                        .setLngLat(location.coordinates)
                        .addTo(mapRef.current);
                      
                      // If we already have waypoints, update the last one to be B
                      if (waypointMarkersRef.current.length > 1) {
                        waypointMarkersRef.current[waypointMarkersRef.current.length - 1].remove();
                        waypointMarkersRef.current[waypointMarkersRef.current.length - 1] = marker;
                        setWaypoints(prev => [...prev.slice(0, -1), newWaypoint]);
                      } else {
                        waypointMarkersRef.current.push(marker);
                        setWaypoints(prev => [...prev, newWaypoint]);
                      }
                      
                      setTimeout(updateWaypointLabels, 0);
                    }
                  }}
                  placeholder="Enter destination"
                  className="h-7 text-xs"
                  userLocation={location}
                />
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
            
            {/* Waypoint and POI Controls */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <Button
                  size="sm"
                  variant={isAddingWaypoints ? "default" : "outline"}
                  className="text-xs"
                  onClick={toggleWaypointMode}
                  disabled={isAddingPOI}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {isAddingWaypoints ? 'Stop' : 'Waypoints'}
                </Button>
                <Button
                  size="sm"
                  variant={isAddingPOI ? "default" : "outline"}
                  className="text-xs"
                  onClick={togglePOIMode}
                  disabled={isAddingWaypoints}
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  {isAddingPOI ? 'Stop' : 'Add POI'}
                </Button>
              </div>
              
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

      {/* Save Route Modal */}
      <SaveRouteModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        waypoints={waypoints}
        route={currentRoute}
        routeProfile={routeProfile}
        onSave={handleSaveRouteWithData}
      />

      {/* Add POI Modal */}
      <AddPOIModal
        isOpen={showPOIModal}
        onClose={() => {
          setShowPOIModal(false);
          setPOICoordinates(null);
        }}
        coordinates={poiCoordinates}
        onSave={handlePOISave}
      />
    </div>
  );
};

export default FullScreenTripMapWithWaypoints;