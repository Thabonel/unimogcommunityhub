import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Map, List, MapPin, Layers, Save, Car, Footprints, Bike, Trash2, Navigation, Share2, Wrench, Crosshair, Mountain, ArrowLeft, Compass, Info, ChevronDown, ChevronUp } from 'lucide-react';
import MapComponent from '../MapComponent';
import MapOptionsDropdown from './map/MapOptionsDropdown';
import { TripCardProps } from './TripCard';
import { useMapMarkers } from './map/hooks/useMapMarkers';
import { useUserLocation } from '@/hooks/use-user-location';
import EnhancedTripsSidebar from './EnhancedTripsSidebar';
import mapboxgl from 'mapbox-gl';
import { toast } from 'sonner';
import { savePlannedRoute, fetchUserTracks, deleteTrack } from '@/services/trackService';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDirections, formatDistance, formatDuration, DirectionsRoute } from '@/services/mapboxDirections';
import { Waypoint } from '@/types/waypoint';
import { SaveRouteModal, SaveRouteData } from './SaveRouteModal';
import { AddPOIModal } from './AddPOIModal';
import { getPOIsInBounds, POI_ICONS } from '@/services/poiService';
import { searchPlaces, getCountryFromCoordinates } from '@/services/mapboxGeocoding';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
// Mapbox GL Directions Plugin - Official Implementation
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
import '@/styles/directions-optimized.css';
import { runCompleteDiagnostics } from '@/utils/mapbox-diagnostics';
import { ErrorBoundary } from '@/components/error-boundary';
import { EnhancedBarryChat } from '../knowledge/EnhancedBarryChat';
import { SendToButton } from '../navigation/SendToButton';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { ElevationProfile } from './ElevationProfile';

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
  onTripsRefresh?: () => Promise<void>;
}

const FullScreenTripMapWithWaypoints: React.FC<FullScreenTripMapProps> = ({
  trips,
  onTripSelect,
  onCreateTrip,
  isLoading,
  onTripsRefresh
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
  const [showBarryChat, setShowBarryChat] = useState(false);
  const [userHasMovedMap, setUserHasMovedMap] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [shouldAutoCenter, setShouldAutoCenter] = useState(true);
  const [hasInitiallyCentered, setHasInitiallyCentered] = useState(false);
  const [userTracks, setUserTracks] = useState<any[]>([]);
  const [loadedTracks, setLoadedTracks] = useState<Map<string, any>>(new window.Map());
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [showElevationProfile, setShowElevationProfile] = useState(false);
  const [showMapHelp, setShowMapHelp] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Back button handler
  const handleBack = () => {
    navigate('/');
  };
  
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const poiMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const clickListenerRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(null);
  
  const { location } = useUserLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Track map loaded state for plugin
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  
  // Mapbox GL Directions plugin state
  const directionsRef = useRef<MapboxDirections | null>(null);
  const [pluginInitialized, setPluginInitialized] = useState(false);
  const [pluginError, setPluginError] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [currentRoute, setCurrentRoute] = useState<any>(null);
  const [routeProfile, setRouteProfile] = useState<'driving' | 'walking' | 'cycling'>('driving');
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [elevationData, setElevationData] = useState<any[]>([]);
  const [isAddingWaypoints, setIsAddingWaypoints] = useState(false);

  // Plugin health check and recovery
  const checkPluginHealth = useCallback(() => {
    if (!mapRef.current) return false;
    
    try {
      // Check if plugin exists and is functional
      if (directionsRef.current && pluginInitialized) {
        // Try to access plugin methods to verify it's working
        const waypoints = directionsRef.current.getWaypoints();
        console.log('✅ Plugin health check passed:', waypoints.length, 'waypoints');
        return true;
      } else {
        console.log('⚠️ Plugin health check failed: not initialized');
        return false;
      }
    } catch (error) {
      console.error('❌ Plugin health check failed:', error);
      setPluginError(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setPluginInitialized(false);
      return false;
    }
  }, [pluginInitialized]);

  // Recovery mechanism to reinitialize plugin
  const recoverPlugin = useCallback(() => {
    if (!mapRef.current) {
      console.log('⚠️ Cannot recover plugin: no map available');
      return;
    }
    
    console.log('🔄 Attempting plugin recovery...');
    
    // Clean up existing plugin
    if (directionsRef.current) {
      try {
        mapRef.current.removeControl(directionsRef.current);
      } catch (error) {
        console.log('⚠️ Error removing old plugin during recovery:', error);
      }
      directionsRef.current = null;
    }
    
    // Reset state
    setPluginInitialized(false);
    setPluginError(null);
    
    // Reinitialize
    setTimeout(() => {
      if (mapRef.current) {
        // Reinitialize plugin (this will be the function we already created)
        const initializeDirectionsPlugin = () => {
          // ... (same initialization logic as above)
          console.log('🔄 Plugin recovery initialization...');
          // We'll call the existing initialization function
        };
        initializeDirectionsPlugin();
      }
    }, 1000);
  }, []);

  // Periodic health check (optional)
  useEffect(() => {
    if (!pluginInitialized) return;
    
    const healthCheckInterval = setInterval(() => {
      if (!checkPluginHealth()) {
        console.log('🚨 Plugin unhealthy, attempting recovery...');
        clearInterval(healthCheckInterval);
        // Don't auto-recover to avoid loops, just log
        // recoverPlugin();
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(healthCheckInterval);
  }, [pluginInitialized, checkPluginHealth]);

  // Fetch user tracks on mount
  useEffect(() => {
    if (user) {
      loadUserTracks();
    }
  }, [user]);

  const loadUserTracks = async () => {
    if (!user) return;
    
    setIsLoadingTracks(true);
    try {
      const tracks = await fetchUserTracks(user.id);
      console.log('Fetched user tracks:', tracks);
      setUserTracks(tracks);
    } catch (error) {
      console.error('Error loading tracks:', error);
      toast.error('Failed to load saved tracks');
    } finally {
      setIsLoadingTracks(false);
    }
  };

  // Handle track toggle - load/unload track on map
  const handleTrackToggle = async (trackId: string) => {
    console.log('Toggling track:', trackId);
    
    // Find the track data
    const track = userTracks.find(t => t.id === trackId);
    if (!track) {
      console.error('Track not found:', trackId);
      return;
    }
    
    // Check if track is already loaded
    if (loadedTracks.has(trackId)) {
      // Track is already visible - just re-center on it
      if (mapRef.current && track.segments?.bounds) {
        const { minLat, maxLat, minLon, maxLon } = track.segments.bounds;
        mapRef.current.fitBounds(
          [[minLon, minLat], [maxLon, maxLat]],
          { padding: 50, duration: 1000 }
        );
        toast.info(`Centered on: ${track.name}`);
      }
      
      // Optionally, if you want clicking again to hide it, uncomment below:
      // loadedTracks.delete(trackId);
      // setLoadedTracks(new Map(loadedTracks));
      // clearMarkers();
      // toast.info('Track removed from map');
      return;
    }
    
    // Load track waypoints to map using plugin
    if (track.segments && directionsRef.current) {
      try {
        // First, clear other tracks (optional - for single track view)
        // clearMarkers();
        // loadedTracks.clear();
        
        // Load track points as waypoints using plugin
        const points = track.segments.points;
        if (points && points.length >= 2) {
          directionsRef.current.setOrigin([points[0].lon, points[0].lat]);
          directionsRef.current.setDestination([points[points.length - 1].lon, points[points.length - 1].lat]);
          
          // Add intermediate waypoints if needed (limit to avoid too many)
          const maxWaypoints = Math.min(23, points.length - 2); // Plugin supports max 25 total
          const step = Math.max(1, Math.floor(points.length / maxWaypoints));
          for (let i = step; i < points.length - step; i += step) {
            directionsRef.current.addWaypoint(i / step, [points[i].lon, points[i].lat]);
          }
        }
        loadedTracks.set(trackId, track);
        setLoadedTracks(new Map(loadedTracks));
        toast.success(`Loaded track: ${track.name}`);
        
        // Fit map to track bounds if available
        if (mapRef.current && track.segments.bounds) {
          const { minLat, maxLat, minLon, maxLon } = track.segments.bounds;
          mapRef.current.fitBounds(
            [[minLon, minLat], [maxLon, maxLat]],
            { padding: 50, duration: 1000 }
          );
        }
      } catch (error) {
        console.error('Error loading track:', error);
        toast.error('Failed to load track on map');
      }
    }
  };

  // Handle track save - duplicate and save as new
  const handleTrackSave = async (trackId: string) => {
    console.log('Saving track as new trip:', trackId);
    
    // Find the track data
    const track = userTracks.find(t => t.id === trackId);
    if (!track) {
      console.error('Track not found:', trackId);
      return;
    }
    
    // Load track to map if not already loaded
    if (!loadedTracks.has(trackId)) {
      handleTrackToggle(trackId);
    }
    
    // Open save modal with track name as base
    setShowSaveModal(true);
    // The save modal will handle the actual saving with waypoints from the map
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete tracks');
      return;
    }

    const track = userTracks.find(t => t.id === trackId);
    if (!track) {
      toast.error('Track not found');
      return;
    }

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete "${track.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const success = await deleteTrack(trackId, user.id);
      if (success) {
        // Remove from loaded tracks if it's currently displayed
        if (loadedTracks.has(trackId)) {
          loadedTracks.delete(trackId);
          setLoadedTracks(new window.Map(loadedTracks));
          clearWaypoints();
        }
        
        // Refresh the tracks list
        await loadUserTracks();
        toast.success('Track deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting track:', error);
      toast.error('Failed to delete track');
    }
  };

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
    
    // Only auto-center once on initial load when location is available
    if (location && !hasInitiallyCentered && shouldAutoCenter) {
      console.log('Initial load: Centering map on user location:', location);
      setTimeout(() => {
        map.flyTo({
          center: [location.longitude, location.latitude],
          zoom: 12,
          duration: 2500, // 2.5 second smooth animation
          essential: true
        });
        setHasInitiallyCentered(true);
        setShouldAutoCenter(false);
      }, 1000); // Wait a bit longer for the map to settle
    }
    
    // Set up map move listeners to detect user interaction
    const handleMapMove = () => {
      setUserHasMovedMap(true);
      setShouldAutoCenter(false);
    };
    
    // Listen for user-initiated map movements
    map.on('dragstart', handleMapMove);
    map.on('zoomstart', handleMapMove);
    map.on('pitchstart', handleMapMove);
    map.on('rotatestart', handleMapMove);
    
    // Note: User location is now handled by GeolocateControl in the map initialization
    // The blue dot and compass functionality are provided by the built-in Mapbox control
    console.log('🗺️ User location will be handled by GeolocateControl');
    
    // Initialize Mapbox GL Directions plugin - Simplified and Fixed
    const initializeDirectionsPlugin = () => {
      console.log('🔄 Initializing Mapbox GL Directions plugin...');
      
      try {
        // Check if already initialized
        if (directionsRef.current) {
          console.log('✅ Plugin already initialized');
          return;
        }

        // Ensure map is completely loaded and ready
        if (!map.loaded() || !map.getStyle()) {
          console.log('⏳ Map not fully ready, retrying in 500ms...');
          setTimeout(() => initializeDirectionsPlugin(), 500);
          return;
        }

        console.log('🗺️ Map ready, creating Mapbox Directions plugin...');
        
        const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        console.log('🔑 Mapbox token available:', mapboxToken ? 'YES' : 'NO');
        console.log('🔑 Token starts with:', mapboxToken ? mapboxToken.substring(0, 10) : 'N/A');

        // Create directions plugin with proper configuration
        const directions = new MapboxDirections({
          accessToken: mapboxToken,
          unit: 'metric',
          profile: 'mapbox/driving',
          interactive: true,
          controls: {
            inputs: true,        // Enable A/B input boxes
            instructions: false, // Hide turn-by-turn instructions  
            profileSwitcher: false
          },
          flyTo: false, // Prevent automatic map movements
          placeholderOrigin: 'Choose a starting place',
          placeholderDestination: 'Choose destination'
        });

        console.log('📦 Plugin created, adding to map...');
        
        // Add global error handler for map to catch layer query errors
        map.on('error', (e) => {
          if (e.error && e.error.message) {
            const errorMsg = e.error.message;
            if (errorMsg.includes('does not exist') && errorMsg.includes('layer')) {
              console.warn('Map layer error (suppressed):', errorMsg);
              return; // Don't propagate layer errors
            }
          }
          console.error('Map error:', e.error);
        });

        // Override queryRenderedFeatures to handle missing layers gracefully
        const originalQueryRenderedFeatures = map.queryRenderedFeatures.bind(map);
        map.queryRenderedFeatures = function(pointOrBox, options) {
          try {
            // Check if layers exist before querying
            if (options && options.layers) {
              const existingLayers = options.layers.filter(layerId => {
                try {
                  return map.getLayer(layerId) !== undefined;
                } catch (e) {
                  console.warn(`Layer ${layerId} does not exist, skipping query`);
                  return false;
                }
              });
              
              if (existingLayers.length === 0) {
                console.warn('No valid layers to query, returning empty array');
                return [];
              }
              
              // Update options with only existing layers
              options = { ...options, layers: existingLayers };
            }
            
            return originalQueryRenderedFeatures(pointOrBox, options);
          } catch (error) {
            console.warn('queryRenderedFeatures error caught:', error.message);
            return [];
          }
        };

        // Add to map with error handling
        try {
          map.addControl(directions, 'top-left');
          directionsRef.current = directions;
          console.log('✅ Directions plugin added to map successfully');
          console.log('🎯 Plugin should now show A/B input boxes at top-left');
          console.log('📋 Plugin configuration:', {
            interactive: directions.options.interactive,
            controls: directions.options.controls,
            profile: directions.options.profile
          });
          
          // Check if the DOM element was created
          setTimeout(() => {
            const directionsElement = document.querySelector('.mapbox-directions-component');
            const inputsElement = document.querySelector('.mapbox-directions-inputs');
            console.log('🔍 DOM check:', {
              directionsComponent: directionsElement ? 'FOUND' : 'NOT FOUND',
              inputsContainer: inputsElement ? 'FOUND' : 'NOT FOUND',
              directionsDisplay: directionsElement ? getComputedStyle(directionsElement).display : 'N/A',
              inputsDisplay: inputsElement ? getComputedStyle(inputsElement).display : 'N/A'
            });
          }, 1000);
          
        } catch (controlError) {
          console.error('❌ Failed to add directions plugin:', controlError);
          setPluginError(controlError.message);
          throw controlError;
        }
        
        // Enhanced event listeners with error handling
        directions.on('route', (e) => {
          console.log('✅ Route calculated:', e.route[0]);
          const route = e.route[0];
          if (route) {
            setCurrentRoute({
              distance: route.distance,
              duration: route.duration,
              geometry: route.geometry
            });
            const waypointsFromPlugin = directions.getWaypoints();
            console.log('📊 Waypoints from plugin:', waypointsFromPlugin);
            console.log('📊 Waypoints count:', waypointsFromPlugin.length);
            console.log('📊 Waypoints structure:', JSON.stringify(waypointsFromPlugin, null, 2));
            setWaypoints(waypointsFromPlugin);
            toast.success(`Route found: ${(route.distance / 1000).toFixed(1)}km`);
          }
        });
        
        directions.on('clear', () => {
          console.log('🧹 Route cleared');
          setCurrentRoute(null);
          setWaypoints([]);
        });
        
        directions.on('error', (e) => {
          console.error('🚨 Routing error:', e.error);
          // Don't show user errors for layer-related issues or query errors
          if (e.error && e.error.message) {
            const errorMsg = e.error.message.toLowerCase();
            if (!errorMsg.includes('layer') && 
                !errorMsg.includes('does not exist') && 
                !errorMsg.includes('cannot be queried')) {
              toast.error(`Route error: ${e.error.message}`);
            } else {
              // Just log layer errors, don't show to user
              console.warn('Layer-related error (suppressed):', e.error.message);
            }
          }
        });

        // Listen for layer-related errors and handle gracefully
        directions.on('origin', () => {
          console.log('📍 Origin set');
        });

        directions.on('destination', () => {
          console.log('🎯 Destination set');
        });
        
        setPluginInitialized(true);
        setPluginError(null);
        console.log('🎉 Directions plugin initialized successfully!');
        console.log('✅ A/B input boxes should now be visible at top-left of map');
        console.log('✅ Plugin ready for typing and autocomplete');
        
      } catch (error) {
        console.error('❌ Plugin initialization failed:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown plugin error';
        setPluginError(errorMessage);
        setPluginInitialized(false);
        
        // Try to clean up if initialization partially succeeded
        try {
          if (directionsRef.current && map) {
            map.removeControl(directionsRef.current);
          }
        } catch (cleanupError) {
          console.log('⚠️ Cleanup error (non-critical):', cleanupError);
        }
        directionsRef.current = null;
      }
    };
    
    // Simplified plugin initialization
    console.log('🚀 Starting plugin initialization...');
    
    if (map.loaded() && map.isStyleLoaded()) {
      console.log('🗺️ Map ready immediately, initializing plugin');
      setTimeout(() => initializeDirectionsPlugin(), 100);
    } else {
      console.log('⏳ Waiting for map to be ready...');
      const onReady = () => {
        console.log('✅ Map ready event fired, initializing plugin');
        map.off('styledata', onReady);
        setTimeout(() => initializeDirectionsPlugin(), 200);
      };
      map.on('styledata', onReady);
    }
    
  }, [location, hasInitiallyCentered, shouldAutoCenter, routeProfile]);
  
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

  // Toggle waypoint adding mode with plugin availability checks
  const toggleWaypointMode = () => {
    const newMode = !isAddingWaypoints;
    setIsAddingWaypoints(newMode);
    setIsAddingPOI(false); // Disable POI mode
    setShouldAutoCenter(false); // Prevent auto-centering when in waypoint mode
    
    // Check plugin availability
    if (!pluginInitialized || pluginError || !directionsRef.current) {
      if (newMode) {
        toast.error('Route planning currently unavailable. Please refresh the page.');
        console.log('⚠️ Plugin not available:', { pluginInitialized, pluginError, hasRef: !!directionsRef.current });
      }
      return;
    }
    
    // Control plugin interactivity
    try {
      if (newMode) {
        // Enable plugin click-to-add functionality
        directionsRef.current.interactive = true;
        toast.info('🗺️ Click map to add waypoints A→B, drag route to modify');
      } else {
        // Keep plugin functional but reduce interactivity if needed
        toast.info('Waypoint mode disabled');
      }
    } catch (error) {
      console.error('❌ Error toggling waypoint mode:', error);
      toast.error('Error controlling waypoint mode');
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

  // Clear all waypoints using plugin with fallback
  const clearWaypoints = () => {
    // Clear local state regardless of plugin status
    setWaypoints([]);
    setCurrentRoute(null);
    setIsLoadingRoute(false);
    
    // Try to clear plugin routes if available
    if (pluginInitialized && directionsRef.current) {
      try {
        directionsRef.current.removeRoutes();
        console.log('🗺️ Plugin routes cleared');
        toast.info('Route cleared');
      } catch (error) {
        console.error('❌ Error clearing plugin routes:', error);
        toast.warn('Route cleared locally');
      }
    } else {
      console.log('⚠️ Plugin not available for clearing routes');
      toast.info('Route cleared');
    }
    
    clearSearchResults(); // Also clear search results
  };

  // Update route profile in plugin with fallback
  const updateRouteProfile = (profile: 'driving' | 'walking' | 'cycling') => {
    setRouteProfile(profile);
    
    if (!pluginInitialized || !directionsRef.current) {
      console.log('⚠️ Plugin not available, profile updated locally only');
      toast.info(`Route profile set to ${profile}`);
      return;
    }
    
    try {
      directionsRef.current.setProfile(`mapbox/${profile}`);
      console.log(`🗺️ Plugin profile updated to: ${profile}`);
      toast.info(`Route profile changed to ${profile}`);
    } catch (error) {
      console.error('❌ Error updating plugin profile:', error);
      toast.warn(`Profile set to ${profile} (plugin update failed)`);
    }
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

  // Manual center on user location
  const centerOnUserLocation = useCallback(() => {
    if (mapRef.current && location) {
      console.log('Manual centering on user location:', location);
      mapRef.current.flyTo({
        center: [location.longitude, location.latitude],
        zoom: 12,
        duration: 1500, // 1.5 second smooth animation
        essential: true
      });
      toast.info('Centered on your location');
    } else {
      toast.error('Location not available');
    }
  }, [location]);

  // Center on user location AND add as A waypoint
  const centerOnUserLocationAndAddWaypoint = useCallback(() => {
    if (!location) {
      toast.warn('Location not available');
      return;
    }

    if (!pluginInitialized || pluginError || !directionsRef.current) {
      toast.error('Route planning currently unavailable. Please refresh the page.');
      return;
    }

    try {
      // Center on user location first
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: [location.longitude, location.latitude],
          zoom: 12,
          duration: 1500,
          essential: true
        });
      }

      // Add user location as first waypoint (A point)
      directionsRef.current.setOrigin([location.longitude, location.latitude]);
      console.log('📍 Added user location as A waypoint:', location);
      toast.success('Added your location as starting point (A)');

      // Enable waypoint mode if not already active
      if (!isAddingWaypoints) {
        setIsAddingWaypoints(true);
        directionsRef.current.interactive = true;
        toast.info('🗺️ Click map to add destination (B)');
      }
    } catch (error) {
      console.error('❌ Error adding user location as waypoint:', error);
      toast.error('Failed to add location as waypoint');
    }
  }, [location, pluginInitialized, pluginError, isAddingWaypoints]);
  
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
      console.error('❌ No user found when trying to save route');
      toast.error('Please sign in to save routes');
      return;
    }
    
    console.log('🗺️ handleSaveRouteWithData called with:', {
      waypointCount: waypoints.length,
      hasRoute: !!currentRoute,
      userId: user.id,
      routeProfile,
      data
    });

    try {
      console.log('💾 Calling savePlannedRoute...');
      const savedTrack = await savePlannedRoute(
        waypoints,
        currentRoute,
        user.id,
        routeProfile,
        data
      );
      
      console.log('📋 savePlannedRoute returned:', savedTrack);
      
      if (savedTrack) {
        console.log('✅ Route saved successfully, cleaning up...');
        clearWaypoints();
        setIsAddingWaypoints(false);
        toast.success(`Route "${data.name}" saved successfully!`);
        
        // Refresh trips list to show the new saved route
        if (onTripsRefresh) {
          console.log('🔄 Refreshing trips list...');
          try {
            await onTripsRefresh();
            console.log('✅ Trips list refreshed');
          } catch (refreshError) {
            console.error('⚠️ Error refreshing trips list:', refreshError);
            // Don't fail the whole operation for this
          }
        }
        
        // Also refresh our local tracks list
        await loadUserTracks();
        
        // Close the save modal
        setShowSaveModal(false);
        console.log('🏁 Save process completed successfully');
      } else {
        console.error('❌ savePlannedRoute returned null/undefined');
        toast.error('Failed to save route - no data returned');
      }
    } catch (error) {
      console.error('❌ Save route error in handleSaveRouteWithData:', error);
      
      // More detailed error messages
      if (error instanceof Error) {
        toast.error(`Failed to save route: ${error.message}`);
      } else {
        toast.error('Failed to save route - unknown error');
      }
      
      // Re-throw error so modal can handle it too
      throw error;
    }
  };

  // Smart export route handler with platform detection
  const handleExportRoute = () => {
    if (waypoints.length < 2) {
      toast.error('Need at least 2 waypoints to export a route');
      return;
    }

    // Get origin and destination from plugin
    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    
    if (!origin || !destination || !origin.coords || !destination.coords) {
      toast.error('Invalid waypoint data for export');
      return;
    }

    // Platform detection
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMobile = isIOS || isAndroid;

    // Build waypoint list for URL
    const waypointCoords = waypoints
      .filter(wp => wp.coords && wp.coords.length === 2)
      .map(wp => `${wp.coords[1]},${wp.coords[0]}`) // lat,lng format
      .join('|');

    // Export options
    const exportOptions = [
      {
        name: 'Google Maps',
        action: () => {
          const googleUrl = `https://www.google.com/maps/dir/${waypointCoords}`;
          window.open(googleUrl, '_blank');
        },
        available: true
      },
      {
        name: 'Apple Maps',
        action: () => {
          if (isIOS) {
            const appleUrl = `http://maps.apple.com/?daddr=${destination.coords[1]},${destination.coords[0]}&saddr=${origin.coords[1]},${origin.coords[0]}`;
            window.open(appleUrl, '_blank');
          } else {
            toast.warn('Apple Maps is only available on iOS devices');
          }
        },
        available: isIOS
      },
      {
        name: 'Waze',
        action: () => {
          const wazeUrl = `https://waze.com/ul?ll=${destination.coords[1]},${destination.coords[0]}&navigate=yes`;
          window.open(wazeUrl, '_blank');
        },
        available: true
      },
      {
        name: 'Copy Coordinates',
        action: () => {
          const coordText = waypoints
            .map((wp, index) => `Point ${index + 1}: ${wp.coords[1].toFixed(6)}, ${wp.coords[0].toFixed(6)}`)
            .join('\n');
          navigator.clipboard.writeText(coordText);
          toast.success('Coordinates copied to clipboard!');
        },
        available: true
      },
      {
        name: 'Download GPX',
        action: () => {
          generateGPXDownload();
        },
        available: true
      }
    ];

    // Show export options
    if (isMobile) {
      // On mobile, show a simple selection
      const availableOptions = exportOptions.filter(opt => opt.available);
      if (availableOptions.length === 1) {
        availableOptions[0].action();
      } else {
        // Create a simple prompt for mobile
        const optionNames = availableOptions.map((opt, index) => `${index + 1}. ${opt.name}`).join('\n');
        const choice = prompt(`Choose export option:\n${optionNames}\n\nEnter number (1-${availableOptions.length}):`);
        const selectedIndex = parseInt(choice) - 1;
        if (selectedIndex >= 0 && selectedIndex < availableOptions.length) {
          availableOptions[selectedIndex].action();
        }
      }
    } else {
      // On desktop, show all available options
      showExportDialog(exportOptions);
    }
  };

  // Generate GPX file download
  const generateGPXDownload = () => {
    if (!waypoints.length) return;

    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Unimog Community Hub">
  <trk>
    <name>Route Export - ${new Date().toLocaleDateString()}</name>
    <trkseg>
      ${waypoints.map(wp => `
        <trkpt lat="${wp.coords[1]}" lon="${wp.coords[0]}">
          <name>${wp.name || 'Waypoint'}</name>
        </trkpt>`).join('')}
    </trkseg>
  </trk>
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `route-export-${Date.now()}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('GPX file downloaded!');
  };

  // Show export dialog (for desktop)
  const showExportDialog = (options) => {
    // For now, just show the first available option
    // In a real implementation, you'd show a proper modal
    const availableOptions = options.filter(opt => opt.available);
    if (availableOptions.length > 0) {
      // Default to Google Maps for simplicity
      availableOptions[0].action();
      toast.info(`Exported to ${availableOptions[0].name}`);
    }
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
    
    // Check plugin availability
    if (!pluginInitialized || !directionsRef.current) {
      toast.error('Route planning currently unavailable. Please refresh the page.');
      console.log('⚠️ Cannot add waypoint - plugin not available');
      return;
    }
    
    // Add waypoint using plugin
    try {
      const existingWaypoints = directionsRef.current.getWaypoints();
      console.log('📍 Current waypoints:', existingWaypoints.length);
      
      if (existingWaypoints.length === 0) {
        // First waypoint - set as origin
        directionsRef.current.setOrigin([result.center[0], result.center[1]]);
        console.log('📍 Set origin:', result.place_name);
      } else if (existingWaypoints.length === 1) {
        // Second waypoint - set as destination
        directionsRef.current.setDestination([result.center[0], result.center[1]]);
        console.log('📍 Set destination:', result.place_name);
      } else if (existingWaypoints.length < 23) { // Plugin limit is 25 total waypoints
        // Additional waypoints - add as intermediate
        directionsRef.current.addWaypoint(existingWaypoints.length, [result.center[0], result.center[1]]);
        console.log('📍 Added waypoint:', result.place_name);
      } else {
        toast.warn('Maximum waypoints reached (23)');
        return;
      }
      
      toast.success(`Added "${result.place_name}" as waypoint`);
    } catch (error) {
      console.error('❌ Error adding waypoint:', error);
      toast.error('Failed to add waypoint');
    }
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
    <ErrorBoundary 
      fallback={
        <div className="h-full w-full flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Trip Map Error</h2>
            <p className="text-gray-600 mb-4">Unable to load the trip planning map. Please try refreshing the page.</p>
            <Button onClick={() => window.location.reload()}>Refresh Map</Button>
          </div>
        </div>
      }
    >
      <div className="h-full w-full relative">
        {/* Map View */}
        <div className="absolute inset-0">
          <MapComponent 
            height="100%" 
            width="100%"
            onMapLoad={handleMapLoad}
            userLocation={location}
            // Don't pass center prop to allow smart country-level initial view
            // Exact location centering is handled in handleMapLoad with smooth transition
            style={MAP_STYLES.OUTDOORS} // Keep initial style constant, use setStyle to change
            hideControls={true}
            shouldAutoCenter={shouldAutoCenter}
          />
        </div>


      {/* Search Bar - Hide when plugin is active to prevent conflicts */}
      {!pluginInitialized && (
      <div className="absolute top-16 left-4 right-4 z-50">
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
      )}

      {/* Control Panel */}
      <div className="absolute top-36 left-4 z-50">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-4 w-72 overflow-hidden">

          {/* Waypoint Controls */}
          <div className="border-t pt-3">
            <div className="text-sm font-medium mb-2 flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Route Planning
              </div>
              {/* Plugin status indicator */}
              <div className="flex items-center gap-1">
                {pluginInitialized ? (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Route planning ready" />
                ) : pluginError ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={recoverPlugin}
                        className="w-2 h-2 bg-red-500 rounded-full hover:w-3 hover:h-3 transition-all"
                        title="Click to retry initialization"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Plugin error - Click to retry</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Initializing..." />
                )}
              </div>
            </div>
            
            {/* Route Profile Selection */}
            {(waypoints.length > 0 || isAddingWaypoints) && (
              <div className="grid grid-cols-3 gap-1 mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={routeProfile === 'driving' ? "default" : "outline"}
                      className="text-xs px-2"
                      onClick={() => updateRouteProfile('driving')}
                    >
                      <Car className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Driving route</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={routeProfile === 'walking' ? "default" : "outline"}
                      className="text-xs px-2"
                      onClick={() => updateRouteProfile('walking')}
                    >
                      <Footprints className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Walking route</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={routeProfile === 'cycling' ? "default" : "outline"}
                      className="text-xs px-2"
                      onClick={() => updateRouteProfile('cycling')}
                    >
                      <Bike className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Cycling route</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
            
            <div className="space-y-2">
              {/* Route Planning Module - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-1">
                {/* Top Row */}
                <Button
                  size="sm"
                  variant={isAddingWaypoints ? "default" : "outline"}
                  className="text-xs"
                  onClick={toggleWaypointMode}
                  disabled={isAddingPOI || (!pluginInitialized && !pluginError)}
                  title={!pluginInitialized ? (pluginError ? 'Plugin error - check status indicator' : 'Initializing...') : ''}
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {!pluginInitialized ? (pluginError ? 'Error' : 'Loading...') : (isAddingWaypoints ? 'Stop' : 'Waypoints')}
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
                
                {/* Bottom Row */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={centerOnUserLocationAndAddWaypoint}
                      disabled={!location}
                    >
                      <Crosshair className="h-3 w-3 mr-1" />
                      CENTER ON A
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Center map on your location and add as starting point (A)</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SendToButton
                      waypoints={waypoints}
                      route={currentRoute}
                      disabled={isLoadingRoute || waypoints.length < 2}
                      className="text-xs"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Export route to navigation apps or download as file</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {currentRoute && (
                <>
                  {waypoints.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {waypoints.length} waypoint{waypoints.length !== 1 ? 's' : ''} added
                    </div>
                  )}
                  
                  <div className="bg-blue-50 rounded p-2 text-xs space-y-1">
                    <div>Distance: {formatDistance(currentRoute.distance)}</div>
                    <div>Duration: {formatDuration(currentRoute.duration)}</div>
                    {elevationData && elevationData.length > 0 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="w-full text-xs h-6 p-1 mt-1"
                        onClick={() => setShowElevationProfile(!showElevationProfile)}
                      >
                        <Mountain className="h-3 w-3 mr-1" />
                        {showElevationProfile ? 'Hide' : 'Show'} Elevation
                      </Button>
                    )}
                  </div>
                  
                  {/* Elevation Profile */}
                  {showElevationProfile && elevationData && elevationData.length > 0 && currentRoute && (
                    <ElevationProfile
                      elevationData={elevationData}
                      totalDistance={currentRoute.distance}
                      className="text-xs"
                    />
                  )}
                  
                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={clearWaypoints}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Clear
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Clear all waypoints</p>
                      </TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs"
                          onClick={handleExportRoute}
                          disabled={isLoadingRoute}
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export to navigation apps</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  {/* Save trip button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full text-xs bg-primary hover:bg-primary/90"
                        onClick={handleSaveRoute}
                        disabled={isLoadingRoute || !user}
                      >
                        <Save className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">Save Trip to List</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{!user ? "Sign in to save trips" : "Save this trip to your list"}</p>
                    </TooltipContent>
                  </Tooltip>
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
              // Add user's saved tracks from database
              ...userTracks.map(track => ({
                id: track.id,
                name: track.name,
                type: 'saved' as const,
                visible: loadedTracks.has(track.id),
                data: track.segments,
                startLocation: track.segments?.points?.[0] ? {
                  lat: track.segments.points[0].lat,
                  lon: track.segments.points[0].lon
                } : undefined,
                difficulty: track.difficulty || 'moderate',
                length: track.distance_km || 0
              })),
              // Also include trips from props (if any)
              ...trips.map(trip => ({
                id: trip.id,
                name: trip.title,
                type: 'saved' as const,
                visible: false,
                startLocation: trip.startLocation ? {
                  lat: parseFloat(trip.startLocation.split(',')[0]),
                  lon: parseFloat(trip.startLocation.split(',')[1])
                } : undefined,
                difficulty: trip.difficulty,
                length: trip.distance
              }))
            ]}
            isLoading={isLoading || isLoadingTracks}
            onTrackToggle={handleTrackToggle}
            onTrackSave={handleTrackSave}
            onTrackDelete={handleDeleteTrack}
            onSearch={(query) => {
              console.log('Search:', query);
              // TODO: Implement search functionality
            }}
          />
        </div>
      )}

      {/* Barry AI Chat Button */}
      <div className="absolute bottom-8 right-16 z-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setShowBarryChat(true)}
              size="lg"
              className="rounded-full h-14 w-14 p-0 shadow-lg bg-unimog-500 hover:bg-unimog-600 border-2 border-white"
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
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Chat with Barry - AI Mechanic</p>
          </TooltipContent>
        </Tooltip>
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
            <EnhancedBarryChat className="h-full" location={location || undefined} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Options Dropdown - Bottom Right */}
      <div className="absolute bottom-[88px] right-4 z-40">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
          <MapOptionsDropdown 
            map={mapRef}
            currentMapStyle={currentMapStyle}
            onStyleChange={handleStyleChange}
          />
        </div>
      </div>

      {/* Map Help Info Box */}
      <div className="absolute bottom-[36px] left-16 z-40">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 max-w-xs">
          <Button
            variant="ghost"
            size="sm"
            className="w-full p-3 justify-between hover:bg-gray-50"
            onClick={() => setShowMapHelp(!showMapHelp)}
          >
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Map Controls</span>
            </div>
            {showMapHelp ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </Button>
          
          {showMapHelp && (
            <div className="px-3 pb-3 text-xs text-gray-600 space-y-2 border-t border-gray-100">
              <div className="pt-2">
                <div className="font-medium text-gray-800 mb-1">Map Interaction:</div>
                <ul className="space-y-1">
                  <li>• Right-click + drag to rotate</li>
                  <li>• Ctrl/Cmd + drag to pitch/tilt</li>
                  <li>• Touch: two-finger rotation</li>
                </ul>
              </div>
              
              <div>
                <div className="font-medium text-gray-800 mb-1 flex items-center gap-1">
                  <Compass className="h-3 w-3" />
                  Compass Reset:
                </div>
                <p>Click compass to reset map orientation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      </div>
    </ErrorBoundary>
  );
};

export default FullScreenTripMapWithWaypoints;