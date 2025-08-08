import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Map, List, MapPin, Layers, Save, Car, Footprints, Bike, Trash2, Navigation, Share2 } from 'lucide-react';
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
import { SaveRouteModal, SaveRouteData } from './SaveRouteModal';
import { AddPOIModal } from './AddPOIModal';
import { getPOIsInBounds, POI_ICONS } from '@/services/poiService';
import { searchPlaces, getCountryFromCoordinates } from '@/services/mapboxGeocoding';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useWaypointManager } from '@/hooks/use-waypoint-manager';
import { runCompleteDiagnostics } from '@/utils/mapbox-diagnostics';

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
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isAddingPOI, setIsAddingPOI] = useState(false);
  const [showPOIModal, setShowPOIModal] = useState(false);
  const [poiCoordinates, setPOICoordinates] = useState<[number, number] | null>(null);
  const [pois, setPOIs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [searchMarkersRef] = useState<React.MutableRefObject<mapboxgl.Marker[]>>({ current: [] });
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const poiMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const clickListenerRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(null);
  
  const { location } = useUserLocation();
  const { user } = useAuth();

  // Track map loaded state for waypoint manager
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  
  // Use the waypoint manager for all waypoint operations
  const waypointManager = useWaypointManager({ 
    map: mapInstance,
    onRouteUpdate: (waypoints) => {
      console.log('Route updated with waypoints:', waypoints.length);
    }
  });
  
  const {
    waypoints,
    currentRoute, 
    routeProfile,
    isLoadingRoute,
    isAddingMode: isAddingWaypoints,
    setIsAddingMode: setIsAddingWaypoints,
    setRouteProfile,
    addWaypointAtLocation,
    clearMarkers
  } = waypointManager;

  // Detect user's country from their location
  useEffect(() => {
    if (location && !userCountry) {
      getCountryFromCoordinates(location.longitude, location.latitude)
        .then(country => {
          if (country) {
            setUserCountry(country);
            console.log('Detected user country:', country);
          }
        })
        .catch(error => {
          console.error('Failed to detect country:', error);
        });
    }
  }, [location, userCountry]);
  
  
  
  
  
  // Function to handle map load completion
  const handleMapLoad = useCallback((map: mapboxgl.Map) => {
    console.log('Map fully loaded');
    setMapLoaded(true);
    mapRef.current = map;
    setMapInstance(map);
    
    // Don't set up click handler here, do it in useEffect
    
    // Don't set cursor here, do it in a separate effect
    
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
  }, [location]);
  
  // Store refs for the current state values
  const isAddingPOIRef = useRef(isAddingPOI);
  
  // Update refs when values change
  useEffect(() => {
    isAddingPOIRef.current = isAddingPOI;
  }, [isAddingPOI]);
  
  // Set up click listener ONCE after map loads
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    
    const handleClick = (e: mapboxgl.MapMouseEvent) => {
      // Handle POI click using ref
      if (isAddingPOIRef.current) {
        setPOICoordinates([e.lngLat.lng, e.lngLat.lat]);
        setShowPOIModal(true);
        setIsAddingPOI(false);
        return;
      }
      
      // Waypoint handling is now managed by useWaypointManager
      // The hook handles click events internally
    };
    
    mapRef.current.on('click', handleClick);
    clickListenerRef.current = handleClick;
    
    return () => {
      if (mapRef.current && clickListenerRef.current) {
        mapRef.current.off('click', clickListenerRef.current);
      }
    };
  }, [mapLoaded]); // Only depend on mapLoaded
  
  // Update cursor separately
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      const canvas = mapRef.current.getCanvas();
      if (canvas) {
        if (isAddingWaypoints || isAddingPOI) {
          canvas.style.cursor = 'crosshair';
        } else {
          canvas.style.cursor = '';
        }
      }
    }
  }, [mapLoaded, isAddingWaypoints, isAddingPOI]);
  
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
    setIsAddingPOI(false); // Disable POI mode
    if (!isAddingWaypoints) {
      toast.info('Click on the map to add waypoints');
    }
  };

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
    setPOIs(prev => [...prev, poi]);
    
    // Create POI marker
    if (mapRef.current) {
      const config = POI_ICONS[poi.type];
      
      const el = document.createElement('div');
      el.innerHTML = config.icon;
      el.style.fontSize = '20px';
      el.style.cursor = 'pointer';
      el.title = `${poi.name} (${config.label})`;
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat(poi.coordinates)
        .addTo(mapRef.current);
      
      poiMarkersRef.current.push(marker);
    }
  };

  // Clear all waypoints using waypoint manager
  const clearWaypoints = () => {
    clearMarkers(); // Use waypoint manager's clear function
    clearSearchResults(); // Also clear search results
  };

  // Handle map style change
  const handleStyleChange = useCallback((style: string) => {
    console.log('Changing map style to:', style);
    setCurrentMapStyle(style);
    if (mapRef.current) {
      mapRef.current.setStyle(style);
      // Re-add markers after style change
      mapRef.current.once('style.load', () => {
        // Re-add user marker
        if (userMarkerRef.current) {
          userMarkerRef.current.addTo(mapRef.current!);
        }
        // Waypoint manager handles its own markers and routes
        // They will be automatically re-added by the manager
      });
    }
  }, []);
  
  // Save route handler (basic save, opens modal)
  const handleSaveRoute = async () => {
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

  // Enhanced save route with metadata
  const handleSaveRouteWithData = async (data: SaveRouteData) => {
    if (!user) {
      toast.error('Please sign in to save routes');
      return;
    }
    
    try {
      const savedTrack = await savePlannedRoute(
        waypoints,
        currentRoute,
        user.id,
        routeProfile,
        data
      );
      
      if (savedTrack) {
        clearWaypoints();
        setIsAddingWaypoints(false);
        toast.success(`Route "${data.name}" saved successfully!`);
        // Reload trips to show the new saved route
        window.location.reload();
      }
    } catch (error) {
      console.error('Save route error:', error);
      toast.error('Failed to save route');
    }
  };

  // Share route handler
  const handleShareRoute = () => {
    if (!user) {
      toast.error('Please sign in to share routes');
      return;
    }
    
    if (waypoints.length < 2) {
      toast.error('Need at least 2 waypoints to share a route');
      return;
    }
    
    // For now, just copy route info to clipboard
    const routeInfo = `Route with ${waypoints.length} waypoints${currentRoute ? `, ${formatDistance(currentRoute.distance)} long` : ''}`;
    navigator.clipboard.writeText(routeInfo);
    toast.success('Route details copied to clipboard!');
  };

  // Debug: Run routing diagnostics
  const handleRunDiagnostics = async () => {
    toast.info('Running Mapbox routing diagnostics...');
    
    const diagnosticWaypoints = waypoints.map(wp => ({
      lng: wp.coords[0],
      lat: wp.coords[1]
    }));
    
    console.log('🔧 Manual diagnostics triggered with waypoints:', diagnosticWaypoints);
    await runCompleteDiagnostics(diagnosticWaypoints);
  };

  // Debounced search for autocomplete
  const debouncedSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchPlaces(query, {
        limit: 5,
        country: userCountry || undefined, // Filter by user's country
        proximity: location ? [location.longitude, location.latitude] : undefined,
        types: ['place', 'locality', 'address', 'poi']
      });

      if (results && results.length > 0) {
        setSearchResults(results);
        setShowSuggestions(true);
      } else {
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  }, [userCountry, location]);

  // Handle search input change with debouncing
  const handleSearchInputChange = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    if (query.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        debouncedSearch(query);
      }, 300); // 300ms delay
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearch]);

  // Add search result markers to map
  const showSearchResultsOnMap = useCallback((results: any[]) => {
    if (!mapRef.current) return;

    // Clear existing search markers
    searchMarkersRef.current.forEach(marker => marker.remove());
    searchMarkersRef.current = [];
    
    // Add search result markers
    results.forEach((result, index) => {
      if (index < 5) { // Show max 5 results
        const el = document.createElement('div');
        el.className = 'search-result-marker';
        el.style.width = '25px';
        el.style.height = '25px';
        el.style.backgroundColor = '#007cbf';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid white';
        el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'white';
        el.style.fontSize = '12px';
        el.style.fontWeight = 'bold';
        el.textContent = (index + 1).toString();
        
        const marker = new mapboxgl.Marker(el)
          .setLngLat([result.center[0], result.center[1]])
          .addTo(mapRef.current!);
        
        // Add click handler to convert search result to waypoint
        el.onclick = () => handleSearchResultClick(result);
        
        searchMarkersRef.current.push(marker);
      }
    });
    
    // Fit map to show all results
    if (results.length === 1) {
      mapRef.current.flyTo({
        center: [results[0].center[0], results[0].center[1]],
        zoom: 12,
        essential: true
      });
    } else if (results.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      results.slice(0, 5).forEach(result => {
        bounds.extend([result.center[0], result.center[1]]);
      });
      mapRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, []);

  // Handle clicking on search result (from dropdown or map pin)
  const handleSearchResultClick = (result: any) => {
    if (!mapRef.current) return;
    
    // Clear search results and markers
    clearSearchResults();
    
    // Add waypoint using waypoint manager
    addWaypointAtLocation({
      lng: result.center[0],
      lat: result.center[1]
    });
    
    toast.success(`Added "${result.place_name}" as waypoint`);
  };

  // Handle selecting search result from dropdown
  const handleSearchSuggestionSelect = (result: any) => {
    // Just fill in the search box and show the result
    setSearchQuery(result.place_name);
    setShowSuggestions(false);
    
    // Add single marker without excessive map movements
    if (!mapRef.current) return;
    
    // Clear existing search markers
    searchMarkersRef.current.forEach(marker => marker.remove());
    searchMarkersRef.current = [];
    
    // Add single result marker
    const el = document.createElement('div');
    el.className = 'search-result-marker';
    el.style.width = '25px';
    el.style.height = '25px';
    el.style.backgroundColor = '#007cbf';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    el.style.cursor = 'pointer';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.color = 'white';
    el.style.fontSize = '12px';
    el.style.fontWeight = 'bold';
    el.textContent = '1';
    
    const marker = new mapboxgl.Marker(el)
      .setLngLat([result.center[0], result.center[1]])
      .addTo(mapRef.current);
    
    // Add click handler to convert search result to waypoint
    el.onclick = () => handleSearchResultClick(result);
    
    searchMarkersRef.current.push(marker);
    
    // Gentle fly to location without aggressive zooming
    mapRef.current.flyTo({
      center: [result.center[0], result.center[1]],
      zoom: Math.max(mapRef.current.getZoom(), 10), // Don't zoom out, only in if needed
      essential: true
    });
  };

  // Clear search results
  const clearSearchResults = () => {
    searchMarkersRef.current.forEach(marker => marker.remove());
    searchMarkersRef.current = [];
    setSearchResults([]);
    setSearchQuery('');
    setShowSuggestions(false);
    
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Clear timeouts
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Clean up search markers
      searchMarkersRef.current.forEach(marker => marker.remove());
      searchMarkersRef.current = [];
    };
  }, []);

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
          style={MAP_STYLES.OUTDOORS} // Keep initial style constant, use setStyle to change
          hideControls={true}
        />
      </div>

      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for places to add as waypoints..."
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow clicking on them
                setTimeout(() => setShowSuggestions(false), 200);
              }}
              className="pl-10 pr-10 bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg"
              disabled={isSearching}
            />
            {searchQuery && (
              <button
                onClick={clearSearchResults}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          
          {/* Search Results List */}
          {showSuggestions && searchResults.length > 0 && (
            <div className="mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
              {searchResults.slice(0, 5).map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSearchSuggestionSelect(result)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from firing before onClick
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                >
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {result.text}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {result.place_name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Control Panel */}
      <div className="absolute top-24 left-4 z-50">
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
            
            {/* Route Profile Selection */}
            {waypoints.length > 0 && (
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
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={handleShareRoute}
                          disabled={isLoadingRoute || !user}
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
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
                      </>
                    )}
                  </div>
                  
                  {/* Debug diagnostics button */}
                  {waypoints.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs"
                      onClick={handleRunDiagnostics}
                    >
                      🔧 Debug Routing
                    </Button>
                  )}
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
        onClose={() => setShowPOIModal(false)}
        coordinates={poiCoordinates}
        onSave={handlePOISave}
      />
    </div>
  );
};

export default FullScreenTripMapWithWaypoints;