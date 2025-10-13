import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Map, List, MapPin, Layers, Save, Car, Footprints, Bike, Trash2, Navigation, Share2, Wrench, Crosshair, Mountain, ArrowLeft, Compass, Info, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
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
import { MobileNavigationSheet } from './mobile/MobileNavigationSheet';

// Map styles configuration - Off-road focused styles compatible with Directions plugin
const MAP_STYLES = {
  OUTDOORS: 'mapbox://styles/mapbox/outdoors-v12', // Primary off-road style - WORKING
  SATELLITE: 'mapbox://styles/mapbox/satellite-streets-v12', // Satellite with street data for plugin compatibility
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

  // Track map bounds for trail search
  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);

  // Mapbox GL Directions plugin state
  const directionsRef = useRef<MapboxDirections | null>(null);
  const swapButtonInsertedRef = useRef(false); // Track if swap button is already inserted
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
      // Track is already visible - remove it from map
      loadedTracks.delete(trackId);
      setLoadedTracks(new window.Map(loadedTracks));

      // Clear the directions plugin waypoints
      clearWaypoints();

      toast.info(`Track removed from map: ${track.name}`);
      return;
    }

    // SINGLE TRACK MODE: Clear any other loaded tracks first
    if (loadedTracks.size > 0) {
      clearWaypoints();
      loadedTracks.clear();
    }

    // Load track waypoints to map using plugin
    if (track.segments && directionsRef.current) {
      try {
        // Load track points as waypoints using plugin
        const points = track.segments.points;
        console.log('🗺️ Loading track to map:', {
          trackName: track.name,
          hasSegments: !!track.segments,
          pointsCount: points?.length,
          firstPoint: points?.[0],
          lastPoint: points?.[points.length - 1]
        });

        if (points && points.length >= 2) {
          const origin = [points[0].lon, points[0].lat];
          const destination = [points[points.length - 1].lon, points[points.length - 1].lat];

          console.log('📍 Setting origin and destination:', { origin, destination });
          directionsRef.current.setOrigin(origin);
          directionsRef.current.setDestination(destination);

          // Add intermediate waypoints - Mapbox Directions API has 25 total waypoint limit
          // Max 23 intermediate waypoints (25 total - origin - destination = 23)
          const maxIntermediateWaypoints = 23;
          const totalPoints = points.length;

          // Only add waypoints if we have more points than just origin/destination
          if (totalPoints > 2) {
            // Calculate how many waypoints to add (evenly distributed)
            const numWaypoints = Math.min(maxIntermediateWaypoints, totalPoints - 2);
            const step = (totalPoints - 1) / (numWaypoints + 1);

            console.log('➕ Adding intermediate waypoints:', {
              totalPoints,
              numWaypoints,
              step,
              totalWaypoints: numWaypoints + 2 // +2 for origin/destination
            });

            // Add waypoints at calculated intervals
            for (let i = 0; i < numWaypoints; i++) {
              const pointIndex = Math.round(step * (i + 1));
              directionsRef.current.addWaypoint(i, [points[pointIndex].lon, points[pointIndex].lat]);
            }
            console.log(`✅ Added ${numWaypoints} intermediate waypoints (${numWaypoints + 2} total with origin/destination)`);
          } else {
            console.log('✅ Track has only origin and destination, no intermediate waypoints needed');
          }
        } else {
          console.error('❌ Insufficient points for track:', points?.length);
        }
        loadedTracks.set(trackId, track);
        setLoadedTracks(new window.Map(loadedTracks));
        toast.success(`Showing track: ${track.name}`);

        // Fit map to track bounds if available and valid
        if (mapRef.current && track.segments.bounds) {
          const { minLat, maxLat, minLon, maxLon } = track.segments.bounds;

          // Validate bounds are not NaN or all zeros (invalid data)
          const isValidBounds = minLat !== 0 && maxLat !== 0 && minLon !== 0 && maxLon !== 0 &&
                               !isNaN(minLat) && !isNaN(maxLat) && !isNaN(minLon) && !isNaN(maxLon);

          if (isValidBounds) {
            console.log('📐 Fitting map to track bounds:', { minLat, maxLat, minLon, maxLon });
            mapRef.current.fitBounds(
              [[minLon, minLat], [maxLon, maxLat]],
              { padding: 50, duration: 1000 }
            );
          } else {
            // Fallback to flying to origin point if bounds are invalid
            console.warn('⚠️ Invalid bounds detected, flying to origin instead:', track.segments.bounds);
            if (points && points.length >= 1) {
              mapRef.current.flyTo({
                center: [points[0].lon, points[0].lat],
                zoom: 12,
                duration: 1000
              });
            }
          }
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

    // Track map bounds for trail search
    map.on('moveend', () => {
      const bounds = map.getBounds();
      setMapBounds({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest()
      });
    });

    // Add navigation controls (zoom in/out, compass)
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Add geolocation control for blue dot (position) and green circle (accuracy)
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      },
      trackUserLocation: true,
      showUserLocation: true,  // Show blue dot for user position
      showAccuracyCircle: true, // Show green circle for GPS accuracy
      showUserHeading: true,    // Show direction arrow when moving
      fitBoundsOptions: {
        maxZoom: 16,
        padding: 50
      }
    });

    map.addControl(geolocateControl, 'bottom-right');
    console.log('✅ NavigationControl and GeolocateControl added to map');

    // Auto-trigger location request on page load
    setTimeout(() => {
      try {
        geolocateControl.trigger();
        console.log('📍 Geolocation auto-triggered - requesting user location');
      } catch (err) {
        console.warn('⚠️ Could not auto-trigger location (user can click button manually):', err);
      }
    }, 1000);
    
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
          setPluginInitialized(true); // Set plugin initialized to true
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

            // Extract waypoints from the plugin properly
            const waypointsFromPlugin = directions.getWaypoints();
            console.log('📊 Waypoints from plugin:', waypointsFromPlugin);

            // Create proper waypoints array from origin and destination
            const properWaypoints = [];

            // Get origin and destination from the plugin
            const origin = directions.getOrigin();
            const destination = directions.getDestination();

            if (origin && origin.geometry) {
              properWaypoints.push({
                coords: [origin.geometry.coordinates[0], origin.geometry.coordinates[1]],
                name: origin.place_name || 'Origin',
                type: 'start'
              });
            }

            if (destination && destination.geometry) {
              properWaypoints.push({
                coords: [destination.geometry.coordinates[0], destination.geometry.coordinates[1]],
                name: destination.place_name || 'Destination',
                type: 'end'
              });
            }

            console.log('📊 Proper waypoints created:', properWaypoints);
            console.log('📊 Waypoints count:', properWaypoints.length);
            setWaypoints(properWaypoints);

            // Update input boxes with addresses instead of coordinates
            updateInputBoxesWithAddresses(origin, destination);

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
          console.error('🚨 Full error object:', e);

          // Show ALL errors for debugging
          if (e.error && e.error.message) {
            const errorMsg = e.error.message.toLowerCase();
            if (!errorMsg.includes('layer') &&
                !errorMsg.includes('does not exist') &&
                !errorMsg.includes('cannot be queried')) {
              toast.error(`Route error: ${e.error.message}`);
            } else {
              // Log layer errors with full details
              console.warn('Layer-related error:', {
                message: e.error.message,
                code: e.error.code,
                full: e.error
              });
            }
          } else {
            console.error('❌ Error with no message:', e);
          }
        });

        // Listen for layer-related errors and handle gracefully
        directions.on('origin', () => {
          console.log('📍 Origin set');
          // Update origin with address when set
          const origin = directions.getOrigin();
          if (origin?.geometry) {
            reverseGeocode(origin.geometry.coordinates[0], origin.geometry.coordinates[1])
              .then(address => {
                if (address) {
                  setTimeout(() => {
                    const originInput = document.querySelector('.mapbox-directions-component input') as HTMLInputElement;
                    if (originInput) {
                      originInput.value = address;
                      console.log('📍 Updated origin with address:', address);
                    }
                  }, 100);
                }
              });
          }
        });

        directions.on('destination', () => {
          console.log('🎯 Destination set');
          // Update destination with address when set
          const destination = directions.getDestination();
          if (destination?.geometry) {
            reverseGeocode(destination.geometry.coordinates[0], destination.geometry.coordinates[1])
              .then(address => {
                if (address) {
                  setTimeout(() => {
                    const inputs = document.querySelectorAll('.mapbox-directions-component input');
                    const destinationInput = inputs[1] as HTMLInputElement;
                    if (destinationInput) {
                      destinationInput.value = address;
                      console.log('🎯 Updated destination with address:', address);
                    }
                  }, 100);
                }
              });
          }
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

  // Reinitialize Directions plugin with state restoration
  const reinitializeDirectionsPlugin = useCallback((
    savedOrigin: any = null,
    savedDestination: any = null,
    savedWaypoints: any[] = []
  ) => {
    console.log('🔄 Reinitializing Directions plugin with state restoration...');

    if (!mapRef.current) {
      console.warn('⚠️ Cannot reinitialize plugin: no map available');
      return;
    }

    // Clean up existing plugin first
    if (directionsRef.current) {
      try {
        mapRef.current.removeControl(directionsRef.current);
        console.log('🗑️ Removed old plugin successfully');
      } catch (error) {
        console.warn('⚠️ Error removing old plugin:', error);
      }
      directionsRef.current = null;
    }

    // Reset state
    setPluginInitialized(false);
    setPluginError(null);

    // Wait a bit for cleanup to complete
    setTimeout(() => {
      if (!mapRef.current) return;

      try {
        console.log('🔄 Creating new plugin instance...');

        const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

        // Create new directions plugin
        const directions = new MapboxDirections({
          accessToken: mapboxToken,
          unit: 'metric',
          profile: `mapbox/${routeProfile}`,
          interactive: true,
          controls: {
            inputs: true,
            instructions: false,
            profileSwitcher: false
          },
          flyTo: false,
          placeholderOrigin: 'Choose a starting place',
          placeholderDestination: 'Choose destination'
        });

        // Add the same error handling and overrides as the original
        mapRef.current.on('error', (e) => {
          if (e.error && e.error.message) {
            const errorMsg = e.error.message;
            if (errorMsg.includes('does not exist') && errorMsg.includes('layer')) {
              console.warn('Map layer error (suppressed):', errorMsg);
              return;
            }
          }
          console.error('Map error:', e.error);
        });

        // Override queryRenderedFeatures to handle missing layers
        const originalQueryRenderedFeatures = mapRef.current.queryRenderedFeatures.bind(mapRef.current);
        mapRef.current.queryRenderedFeatures = function(pointOrBox, options) {
          try {
            if (options && options.layers) {
              const existingLayers = options.layers.filter(layerId => {
                try {
                  return mapRef.current!.getLayer(layerId) !== undefined;
                } catch (e) {
                  console.warn(`Layer ${layerId} does not exist, skipping query`);
                  return false;
                }
              });

              if (existingLayers.length === 0) {
                console.warn('No valid layers to query, returning empty array');
                return [];
              }

              options = { ...options, layers: existingLayers };
            }

            return originalQueryRenderedFeatures(pointOrBox, options);
          } catch (error) {
            console.warn('queryRenderedFeatures error caught:', error.message);
            return [];
          }
        };

        // Add to map
        mapRef.current.addControl(directions, 'top-left');
        directionsRef.current = directions;
        console.log('✅ New plugin added to map successfully');

        // Set up event listeners
        directions.on('route', (e) => {
          console.log('✅ Route calculated after style change:', e.route[0]);
          const route = e.route[0];
          if (route) {
            setCurrentRoute({
              distance: route.distance,
              duration: route.duration,
              geometry: route.geometry
            });

            const waypointsFromPlugin = directions.getWaypoints();
            const properWaypoints = [];

            const origin = directions.getOrigin();
            const destination = directions.getDestination();

            if (origin && origin.geometry) {
              properWaypoints.push({
                coords: [origin.geometry.coordinates[0], origin.geometry.coordinates[1]],
                name: origin.place_name || 'Origin',
                type: 'start'
              });
            }

            if (destination && destination.geometry) {
              properWaypoints.push({
                coords: [destination.geometry.coordinates[0], destination.geometry.coordinates[1]],
                name: destination.place_name || 'Destination',
                type: 'end'
              });
            }

            setWaypoints(properWaypoints);

            // Update input boxes with addresses inline (since function isn't in scope yet)
            if (origin?.geometry && destination?.geometry) {
              // This will be handled by the plugin's own event listeners
              console.log('📍 Route restored, input boxes will be updated by plugin events');
            }

            toast.success(`Route restored: ${(route.distance / 1000).toFixed(1)}km`);
          }
        });

        directions.on('clear', () => {
          console.log('🧹 Route cleared after style change');
          setCurrentRoute(null);
          setWaypoints([]);
        });

        directions.on('error', (e) => {
          console.error('🚨 Routing error after style change:', e.error);
          if (e.error && e.error.message) {
            const errorMsg = e.error.message.toLowerCase();
            if (!errorMsg.includes('layer') &&
                !errorMsg.includes('does not exist') &&
                !errorMsg.includes('cannot be queried')) {
              toast.error(`Route error: ${e.error.message}`);
            } else {
              console.warn('Layer-related error (suppressed):', e.error.message);
            }
          }
        });

        directions.on('origin', () => {
          console.log('📍 Origin set after style change');
          const origin = directions.getOrigin();
          if (origin?.geometry) {
            // Inline reverse geocoding since function isn't in scope yet
            const [lng, lat] = origin.geometry.coordinates;
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&types=address,poi,place&limit=1`)
              .then(response => response.ok ? response.json() : null)
              .then(data => {
                if (data?.features?.[0]) {
                  const address = data.features[0].place_name || data.features[0].text;
                  if (address) {
                    setTimeout(() => {
                      const originInput = document.querySelector('.mapbox-directions-component input') as HTMLInputElement;
                      if (originInput) {
                        originInput.value = address;
                        console.log('📍 Updated origin with address:', address);
                      }
                    }, 100);
                  }
                }
              })
              .catch(error => console.warn('Reverse geocoding error for origin:', error));
          }
        });

        directions.on('destination', () => {
          console.log('🎯 Destination set after style change');
          const destination = directions.getDestination();
          if (destination?.geometry) {
            // Inline reverse geocoding since function isn't in scope yet
            const [lng, lat] = destination.geometry.coordinates;
            fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&types=address,poi,place&limit=1`)
              .then(response => response.ok ? response.json() : null)
              .then(data => {
                if (data?.features?.[0]) {
                  const address = data.features[0].place_name || data.features[0].text;
                  if (address) {
                    setTimeout(() => {
                      const inputs = document.querySelectorAll('.mapbox-directions-component input');
                      const destinationInput = inputs[1] as HTMLInputElement;
                      if (destinationInput) {
                        destinationInput.value = address;
                        console.log('🎯 Updated destination with address:', address);
                      }
                    }, 100);
                  }
                }
              })
              .catch(error => console.warn('Reverse geocoding error for destination:', error));
          }
        });

        setPluginInitialized(true);
        setPluginError(null);
        console.log('🎉 Plugin reinitialized successfully!');

        // Restore previous state if available
        if (savedOrigin || savedDestination) {
          console.log('🔄 Restoring previous route state...');
          setTimeout(() => {
            try {
              if (savedOrigin && savedOrigin.geometry) {
                directions.setOrigin(savedOrigin.geometry.coordinates);
                console.log('📍 Restored origin:', savedOrigin.place_name);
              }

              if (savedDestination && savedDestination.geometry) {
                directions.setDestination(savedDestination.geometry.coordinates);
                console.log('🎯 Restored destination:', savedDestination.place_name);
              }

              // Note: Intermediate waypoints restoration could be added here if needed
              if (savedWaypoints.length > 2) {
                console.log('⚠️ Intermediate waypoints found but not restored (feature could be added)');
              }

              console.log('✅ Route state restoration completed');
            } catch (error) {
              console.error('❌ Error restoring route state:', error);
              toast.warn('Route partially restored - some waypoints may be missing');
            }
          }, 500); // Wait for plugin to be fully ready
        }

      } catch (error) {
        console.error('❌ Plugin reinitialization failed:', error);
        setPluginError(error instanceof Error ? error.message : 'Plugin reinitialization failed');
        setPluginInitialized(false);
      }
    }, 100); // Short delay to ensure cleanup is complete
  }, [routeProfile]);

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

  // Handle map style change - Complete plugin reinitialization approach (Mapbox community solution)
  const handleStyleChange = useCallback((style: string) => {
    console.log('🎨 Changing map style to:', style);
    setCurrentMapStyle(style);

    if (!mapRef.current) return;

    // Store current view before style change
    const currentCenter = mapRef.current.getCenter();
    const currentZoom = mapRef.current.getZoom();
    const currentBearing = mapRef.current.getBearing();
    const currentPitch = mapRef.current.getPitch();

    // Store current route data before style change
    let routeData = null;
    if (directionsRef.current && pluginInitialized) {
      try {
        const origin = directionsRef.current.getOrigin();
        const destination = directionsRef.current.getDestination();
        const waypoints = directionsRef.current.getWaypoints();

        routeData = {
          origin: origin && origin.geometry ? origin.geometry.coordinates : null,
          destination: destination && destination.geometry ? destination.geometry.coordinates : null,
          waypoints: waypoints || []
        };

        console.log('💾 Saved route data:', {
          hasOrigin: !!routeData.origin,
          hasDestination: !!routeData.destination,
          waypointCount: routeData.waypoints.length
        });

        // Completely remove the directions plugin
        mapRef.current.removeControl(directionsRef.current);
        directionsRef.current = null;
        setPluginInitialized(false);

      } catch (error) {
        console.warn('⚠️ Could not save route data:', error);
        // Still remove plugin if it exists
        if (directionsRef.current) {
          try {
            mapRef.current.removeControl(directionsRef.current);
            directionsRef.current = null;
            setPluginInitialized(false);
          } catch (removeError) {
            console.warn('Error removing plugin:', removeError);
          }
        }
      }
    }

    // Change style
    mapRef.current.setStyle(style);

    // Use styledata event instead of style.load (community recommended approach)
    mapRef.current.once('styledata', () => {
      if (!mapRef.current) return;

      console.log('🔄 Style loaded, restoring view and recreating plugin...');

      // Restore view first
      mapRef.current.jumpTo({
        center: currentCenter,
        zoom: currentZoom,
        bearing: currentBearing,
        pitch: currentPitch
      });

      // Recreate directions plugin completely
      try {
        const newDirections = new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: 'metric',
          profile: 'mapbox/driving',
          controls: {
            instructions: false,
            inputs: true
          },
          interactive: true,
          flyTo: false // Prevent automatic flyTo which can interfere with our view restoration
        });

        mapRef.current.addControl(newDirections, 'top-left');
        directionsRef.current = newDirections;
        setPluginInitialized(true);
        setPluginError(null);

        console.log('✅ Directions plugin recreated successfully');

        // Restore NavigationControl and GeolocateControl (removed by setStyle)
        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

        const geolocateControl = new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
          },
          trackUserLocation: true,
          showUserLocation: true,
          showAccuracyCircle: false,
          showUserHeading: true,
          fitBoundsOptions: {
            maxZoom: 16,
            padding: 50
          }
        });

        mapRef.current.addControl(geolocateControl, 'bottom-right');

        // Auto-trigger location request after style change
        setTimeout(() => {
          geolocateControl.trigger();
        }, 2000);

        console.log('✅ Controls restored after style change');

        // Restore route data if we had one
        if (routeData && (routeData.origin || routeData.destination)) {
          setTimeout(() => {
            try {
              if (routeData.origin && directionsRef.current) {
                console.log('📍 Restoring origin:', routeData.origin);
                directionsRef.current.setOrigin(routeData.origin);
              }
              if (routeData.destination && directionsRef.current) {
                console.log('🎯 Restoring destination:', routeData.destination);
                directionsRef.current.setDestination(routeData.destination);
              }
              console.log('✅ Route data restored successfully');
            } catch (error) {
              console.error('❌ Error restoring route data:', error);
            }
          }, 300); // Slightly longer delay for plugin to be fully ready
        }

      } catch (error) {
        console.error('❌ Error recreating directions plugin:', error);
        setPluginError('Failed to recreate directions plugin');
        setPluginInitialized(false);
      }
    });
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

  // Swap waypoints A and B
  const swapWaypoints = useCallback(() => {
    if (!directionsRef.current) {
      toast.error('Route not initialized');
      return;
    }

    const origin = directionsRef.current.getOrigin();
    const destination = directionsRef.current.getDestination();

    if (!origin || !destination) {
      toast.error('Need both start and destination to swap');
      return;
    }

    // Use built-in Mapbox API reverse method
    directionsRef.current.reverse();
    toast.success('⇅ Swapped start and destination');
  }, []);

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

  // Reverse geocoding to convert coordinates to addresses
  const reverseGeocode = async (lng: number, lat: number): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&types=address,poi,place&limit=1`
      );

      if (!response.ok) {
        console.warn('Reverse geocoding failed:', response.status);
        return null;
      }

      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const place = data.features[0];
        return place.place_name || place.text || null;
      }

      return null;
    } catch (error) {
      console.warn('Reverse geocoding error:', error);
      return null;
    }
  };

  // Update input boxes with addresses instead of coordinates
  const updateInputBoxesWithAddresses = async (origin: any, destination: any) => {
    if (!origin?.geometry || !destination?.geometry) return;

    try {
      // Get addresses for both points
      const [originAddress, destinationAddress] = await Promise.all([
        reverseGeocode(origin.geometry.coordinates[0], origin.geometry.coordinates[1]),
        reverseGeocode(destination.geometry.coordinates[0], destination.geometry.coordinates[1])
      ]);

      // Update the input boxes in the DOM
      setTimeout(() => {
        const inputs = document.querySelectorAll('.mapbox-directions-component input');
        if (inputs.length >= 2) {
          const originInput = inputs[0] as HTMLInputElement;
          const destinationInput = inputs[1] as HTMLInputElement;

          if (originAddress && originInput) {
            originInput.value = originAddress;
            originInput.setAttribute('data-address', originAddress);
          }

          if (destinationAddress && destinationInput) {
            destinationInput.value = destinationAddress;
            destinationInput.setAttribute('data-address', destinationAddress);
          }

          console.log('📍 Updated input boxes with addresses:', {
            origin: originAddress,
            destination: destinationAddress
          });
        }
      }, 100);
    } catch (error) {
      console.warn('Failed to update input boxes with addresses:', error);
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

  // Inject swap button into Mapbox Directions UI (RESTORED ORIGINAL WORKING VERSION)
  useEffect(() => {
    if (!pluginInitialized || !directionsRef.current) {
      console.log('🔄 Swap button waiting:', { pluginInitialized, hasDirectionsRef: !!directionsRef.current });
      return;
    }

    console.log('✅ Swap button: Plugin initialized, starting interval check...');

    // Wait for plugin DOM to render and inject swap button
    const checkInterval = setInterval(() => {
      const inputsContainer = document.querySelector('.mapbox-directions-inputs');
      const existingButton = document.querySelector('#waypoint-swap-btn');

      console.log('🔍 Swap button check:', {
        foundInputsContainer: !!inputsContainer,
        existingButton: !!existingButton,
        inputsContainerClass: inputsContainer?.className
      });

      if (inputsContainer && !existingButton) {
        // Create swap button container
        const swapContainer = document.createElement('div');
        swapContainer.id = 'waypoint-swap-btn';
        swapContainer.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 8px auto;
          padding: 0;
        `;

        // Create swap button
        const swapBtn = document.createElement('button');
        swapBtn.setAttribute('type', 'button');
        swapBtn.setAttribute('aria-label', 'Swap start and destination');
        swapBtn.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
          padding: 0;
        `;

        // Add hover effects
        swapBtn.onmouseenter = () => {
          swapBtn.style.background = '#f5f5f5';
          swapBtn.style.borderColor = '#4264fb';
        };
        swapBtn.onmouseleave = () => {
          swapBtn.style.background = 'white';
          swapBtn.style.borderColor = '#ddd';
        };

        // Add icon (ArrowUpDown)
        swapBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21 16-4 4-4-4"></path>
            <path d="M17 20V4"></path>
            <path d="m3 8 4-4 4 4"></path>
            <path d="M7 4v16"></path>
          </svg>
        `;

        // Add click handler
        swapBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          swapWaypoints();
        };

        swapContainer.appendChild(swapBtn);

        // Insert between first and second input - use direct input selector
        const inputs = inputsContainer.querySelectorAll('input');
        console.log('🔍 Found inputs:', { count: inputs.length, firstInput: inputs[0]?.className });

        if (inputs.length >= 2) {
          // Insert after the first input's parent container
          const firstInputParent = inputs[0].closest('.mapbox-directions-origin') || inputs[0].parentElement;
          firstInputParent?.insertAdjacentElement('afterend', swapContainer);
          console.log('✅ SWAP BUTTON INSERTED SUCCESSFULLY!');
          console.log('📍 Button location:', swapContainer.getBoundingClientRect());
          console.log('📍 First input parent:', firstInputParent?.className);
          clearInterval(checkInterval);
        } else {
          console.warn('⚠️ Not enough inputs found:', inputs.length);
        }
      }
    }, 500);

    // Cleanup
    return () => {
      clearInterval(checkInterval);
      const existingButton = document.querySelector('#waypoint-swap-btn');
      if (existingButton) {
        existingButton.remove();
      }
    };
  }, [pluginInitialized, swapWaypoints]);

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

      {/* Desktop Search Bar - Hide when plugin is active and on mobile */}
      {!pluginInitialized && (
      <div className="hidden md:block absolute top-16 left-4 right-4 z-50">
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

      {/* Desktop Control Panel */}
      <div className="hidden md:block absolute top-48 left-4 z-50">
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

      {/* Desktop Toggle View Button - Hidden on mobile */}
      <div className="hidden md:block absolute top-4 right-4 z-50">
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
            key={loadedTracks.size}
            userLocation={location}
            mapBounds={mapBounds}
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

      {/* Desktop Barry AI Chat Button - Hidden on mobile (conflicts with bottom sheet) */}
      <div className="hidden md:block absolute bottom-8 right-16 z-10">
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

      {/* Desktop Map Options Dropdown - Hidden on mobile (replaced by FAB button) */}
      <div className="hidden md:block absolute bottom-[88px] right-4 z-40">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
          <MapOptionsDropdown
            map={mapRef}
            currentMapStyle={currentMapStyle}
            onStyleChange={handleStyleChange}
          />
        </div>
      </div>

      {/* Desktop Map Help Info Box */}
      <div className="hidden md:block absolute bottom-[36px] left-16 z-40">
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

      {/* Mobile Bottom Sheet Navigation - Hidden on desktop */}
      <div className="block md:hidden">
        <MobileNavigationSheet
          currentRoute={currentRoute}
          waypoints={waypoints}
          isNavigating={false}
          onStartNavigation={() => {
            if (!currentRoute || waypoints.length < 2) {
              toast.error('Need a route to start navigation');
              return;
            }
            toast.info('Turn-by-turn navigation coming soon!');
          }}
          onStopNavigation={() => {
            toast.info('Navigation stopped');
          }}
          onAddWaypoint={toggleWaypointMode}
          onSaveRoute={handleSaveRoute}
          onClearRoute={clearWaypoints}
          onViewSavedTrips={toggleView}
          elevationData={elevationData}
        />
      </div>
      </div>
    </ErrorBoundary>
  );
};

export default FullScreenTripMapWithWaypoints;