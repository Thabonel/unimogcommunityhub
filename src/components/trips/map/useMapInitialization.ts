
import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useUserLocation } from '@/hooks/use-user-location';

interface MapInitializationProps {
  onMapClick?: () => void;
  defaultZoom?: number;
  defaultCenter?: [number, number];
}

export const useMapInitialization = ({ 
  onMapClick,
  defaultZoom = 5,
  defaultCenter = [-99.5, 40.0]  // Default to US center
}: MapInitializationProps = {}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const { location } = useUserLocation();

  // Try to get token from local storage or use the default one
  useEffect(() => {
    const token = localStorage.getItem('mapbox-token') || 
                  'pk.eyJ1IjoidGhhYm9uZWwiLCJhIjoiY204d3lwMnhwMDBmdTJqb2JsdWgzdmZ2YyJ9.0wyj48txMJAJht1kYfyOdQ';
    
    if (token) {
      mapboxgl.accessToken = token;
      setHasToken(true);
    }
  }, []);

  // Initialize map when component mounts and token is available
  useEffect(() => {
    if (!hasToken || !mapContainer.current || map.current) return;

    const initializeMap = async () => {
      setIsLoading(true);
      try {
        // Use user's location if available, otherwise use default center
        const center = location ? [location.longitude, location.latitude] as [number, number] : defaultCenter;
        
        console.log('Initializing map with center:', center);
        
        const newMap = new mapboxgl.Map({
          container: mapContainer.current!,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: center,
          zoom: defaultZoom
        });

        // Add navigation controls (zoom, bearing, pitch)
        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Log when the map has loaded
        newMap.on('load', () => {
          console.log('Mapbox map loaded successfully');
          setIsLoading(false);
        });

        map.current = newMap;
      } catch (err) {
        console.error('Error initializing Mapbox map:', err);
        setError('Failed to initialize the map. Please check your token or try again later.');
        setIsLoading(false);
      }
    };

    initializeMap();

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [hasToken, location, defaultCenter, defaultZoom]);

  // Handle token saving
  const handleTokenSave = (token: string) => {
    localStorage.setItem('mapbox-token', token);
    mapboxgl.accessToken = token;
    setHasToken(true);
    setError(null);
  };

  // Handle token reset
  const handleResetToken = () => {
    localStorage.removeItem('mapbox-token');
    window.location.reload();
  };

  // Handle map click
  const handleMapClick = (event: any) => {
    if (onMapClick) onMapClick();
  };

  return {
    mapContainer,
    map: map.current,
    isLoading,
    error,
    hasToken,
    handleTokenSave,
    handleResetToken,
    handleMapClick
  };
};
