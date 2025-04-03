
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, MapPin } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { initializeMap, saveMapboxToken, hasMapboxToken } from './map/mapConfig';
import { useMapLocations } from './map/useMapLocations';
import { MAPBOX_CONFIG } from '@/config/env';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface TripMapProps {
  startLocation?: string;
  endLocation?: string;
  waypoints?: string[];
  onMapClick?: () => void;
}

const MapTokenInput = ({ onTokenSave }: { onTokenSave: (token: string) => void }) => {
  const [token, setToken] = useState('');
  
  const handleSaveToken = () => {
    if (!token.trim()) {
      toast({
        title: "Token Required",
        description: "Please enter a valid Mapbox token",
        variant: "destructive",
      });
      return;
    }
    
    onTokenSave(token);
    toast({
      title: "Token Saved",
      description: "Your Mapbox token has been saved and will be remembered for future sessions",
    });
  };
  
  return (
    <Card className="p-4 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-300">
          <MapPin className="h-5 w-5" />
          <h3 className="font-medium">Mapbox Token Required</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Your environment token isn't working. Please enter your Mapbox access token manually. You can get one for free at{" "}
          <a 
            href="https://mapbox.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline hover:text-primary"
          >
            mapbox.com
          </a>
        </p>
        
        <div className="space-y-2">
          <Input 
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your Mapbox access token"
            className="w-full"
          />
          <Button onClick={handleSaveToken} className="w-full">
            Save Token & Load Map
          </Button>
        </div>
      </div>
    </Card>
  );
};

const TripMap = ({ 
  startLocation, 
  endLocation,
  waypoints = [],
  onMapClick 
}: TripMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { trackFeatureUse } = useAnalytics();
  const [hasToken, setHasToken] = useState(hasMapboxToken());
  
  // Log the available token for debugging
  useEffect(() => {
    console.log('Environment Mapbox token available:', !!MAPBOX_CONFIG.accessToken);
    console.log('LocalStorage Mapbox token available:', !!localStorage.getItem('mapbox_access_token'));
  }, []);
  
  // Handle token save
  const handleTokenSave = (token: string) => {
    saveMapboxToken(token);
    setHasToken(true);
    // Force reload the component to initialize the map with the new token
    setIsLoading(true);
  };
  
  // Validate environment variables when component mounts
  useEffect(() => {
    // Check for Mapbox token
    if (!hasToken) {
      setError('Mapbox access token is missing. Please enter your token below.');
      setIsLoading(false);
    }
  }, [hasToken]);
  
  // Initialize the map
  useEffect(() => {
    // Don't try to initialize if we already detected an error or don't have a token
    if (error || !mapContainer.current || !hasToken) return;
    
    try {
      map.current = initializeMap(mapContainer.current);
      
      map.current.on('load', () => {
        setIsLoading(false);
        trackFeatureUse('map_view', { action: 'loaded' });
      });
      
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map resources');
        setIsLoading(false);
      });
      
      // Add this check to handle potential token error
      if (!mapboxgl.accessToken) {
        setError('Mapbox token not recognized. Please try entering a different token.');
        setHasToken(false);
        setIsLoading(false);
        return;
      }
      
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }
    
    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [trackFeatureUse, error, hasToken]);
  
  // Use the locations hook to manage map locations and routes
  useMapLocations({
    map: map.current,
    startLocation,
    endLocation,
    isLoading,
    error
  });
  
  const handleMapClick = () => {
    if (onMapClick) {
      onMapClick();
    } else {
      trackFeatureUse('map_interaction', { action: 'click' });
    }
  };
  
  if (!hasToken) {
    return <MapTokenInput onTokenSave={handleTokenSave} />;
  }
  
  if (error) {
    return (
      <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <p>Failed to load map: {error}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setHasToken(false);
              setError(null);
            }}
          >
            Enter New Token
          </Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="relative overflow-hidden">
      {isLoading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <CardContent className="p-0">
          <div 
            ref={mapContainer}
            className="h-[300px] w-full"
            onClick={handleMapClick}
          />
        </CardContent>
      )}
    </Card>
  );
};

export default TripMap;
