import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map } from 'lucide-react';
import { TripCardProps } from './TripCard';
import { useUserLocation } from '@/hooks/use-user-location';
import { MAPBOX_CONFIG } from '@/config/env';
import { useNavigate } from 'react-router-dom';
import MapTopControls from './map/MapTopControls';
import MapSidebar from './map/MapSidebar';
import MapControls from './map/MapControls';
import { useMapMarkers } from './map/hooks/useMapMarkers';
import { addTopographicalLayers, TOPO_LAYERS } from './map/mapConfig';
import { Track } from '@/types/track';
import { addTrackToMap, removeTrackFromMap } from './map/utils/trackUtils';
import { toast } from 'sonner';

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
  const [terrainEnabled, setTerrainEnabled] = useState(true);
  const [importedTracks, setImportedTracks] = useState<Track[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (map.current) return; // Map already initialized
    
    // Try to get token from environment variables first, then local storage, or use default
    const token = MAPBOX_CONFIG.accessToken || 
                  localStorage.getItem('mapbox-token');
    
    if (!token) {
      console.error('No Mapbox token available');
      return;
    }

    mapboxgl.accessToken = token;

    // Default location (Stuttgart, Germany - Unimog homeland)
    const defaultLocation: [number, number] = [9.1829, 48.7758];
    const initMapCenter = location && location.longitude && location.latitude ? 
                        [location.longitude, location.latitude] as [number, number] : 
                        defaultLocation;

    const initMap = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/outdoors-v12', // Outdoors style good for off-road routes
      center: initMapCenter,
      zoom: location ? 9 : 5,
    });

    // Add navigation controls
    initMap.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
    // Add scale control
    initMap.addControl(new mapboxgl.ScaleControl(), 'bottom-left');
    
    // When the map is loaded, add markers and topographical layers
    initMap.on('load', () => {
      setMapLoaded(true);
      
      // Add topographical layers
      addTopographicalLayers(initMap);
      
      // Add user's location marker if available
      if (location && location.longitude && location.latitude) {
        new mapboxgl.Marker({ color: '#3880ff' })
          .setLngLat([location.longitude, location.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <h3 class="text-sm font-bold">Your Location</h3>
            <p class="text-xs">${location.city || ''}, ${location.country || ''}</p>
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

  const toggleTerrain = () => {
    if (!map.current) return;
    
    if (terrainEnabled) {
      // Disable terrain
      map.current.setTerrain(null);
      
      // Hide hillshade and contours
      map.current.setLayoutProperty(TOPO_LAYERS.HILLSHADE, 'visibility', 'none');
      map.current.setLayoutProperty(TOPO_LAYERS.CONTOUR, 'visibility', 'none');
    } else {
      // Enable terrain
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
      
      // Optionally show hillshade
      map.current.setLayoutProperty(TOPO_LAYERS.HILLSHADE, 'visibility', 'visible');
    }
    
    setTerrainEnabled(!terrainEnabled);
  };

  const handleTrackImported = (track: Track) => {
    setImportedTracks(prevTracks => [...prevTracks, track]);
    toast.success(`Imported track: ${track.name}`);
  };

  const { flyToTrip } = useMapMarkers(
    map.current, 
    trips, 
    activeTrip, 
    onTripSelect,
    mapLoaded
  );

  const filteredTrips = trips.filter(trip => 
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.terrainTypes.some(terrain => 
      terrain.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleTripSelect = (trip: TripCardProps) => {
    setActiveTrip(trip.id);
    onTripSelect(trip);
    flyToTrip(trip);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />
      
      {/* Top control bar */}
      <MapTopControls 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateTrip={onCreateTrip}
      />
      
      {/* Map controls and sidebar toggle */}
      <MapControls 
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        terrainEnabled={terrainEnabled}
        toggleTerrain={toggleTerrain}
        map={map.current}
        onTrackImported={handleTrackImported}
        tracks={importedTracks}
      />
      
      {/* Sidebar */}
      <MapSidebar
        isOpen={sidebarOpen}
        filteredTrips={filteredTrips}
        activeTrip={activeTrip}
        onTripSelect={handleTripSelect}
        onCreateTrip={onCreateTrip}
        importedTracks={importedTracks}
      />
    </div>
  );
};

export default FullScreenTripMap;
