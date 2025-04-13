import { FireIncident } from '@/hooks/use-fires-data';
import { Skeleton } from '@/components/ui/skeleton';
import { FiresErrorAlert } from './FiresErrorAlert';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Locate, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface FiresMapViewProps {
  incidents: FireIncident[] | null;
  isLoading: boolean;
  error: Error | null;
  radius: number;
  handleRefresh: () => void;
  location?: string;
}

export const FiresMapView = ({ 
  incidents, 
  isLoading, 
  error, 
  radius,
  handleRefresh,
  location = 'nsw-australia'
}: FiresMapViewProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<FireIncident | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Default center coordinates based on location
  const getDefaultCenter = () => {
    switch(location) {
      case 'nsw-australia':
        return { lat: -33.8688, lng: 151.2093 }; // Sydney
      case 'victoria-australia':
        return { lat: -37.8136, lng: 144.9631 }; // Melbourne
      case 'queensland-australia':
        return { lat: -27.4698, lng: 153.0251 }; // Brisbane
      case 'california-usa':
        return { lat: 36.7783, lng: -119.4179 }; // California
      case 'colorado-usa':
        return { lat: 39.5501, lng: -105.7821 }; // Colorado
      case 'germany':
        return { lat: 51.1657, lng: 10.4515 }; // Germany
      case 'france':
        return { lat: 46.2276, lng: 2.2137 }; // France
      default:
        return { lat: -33.8688, lng: 151.2093 }; // Default to Sydney
    }
  };
  
  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  
  // Initialize map when component mounts
  useEffect(() => {
    // Mock map initialization for demo purposes
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Update map when incidents change
  useEffect(() => {
    if (mapLoaded && incidents && incidents.length > 0) {
      // In a real implementation, this would update map markers
      console.log(`Updating map with ${incidents.length} incidents`);
    }
  }, [mapLoaded, incidents]);
  
  if (error) {
    return <FiresErrorAlert error={error} onRetry={handleRefresh} />;
  }
  
  if (isLoading || !mapLoaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] w-full rounded-md" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    );
  }
  
  if (!incidents || incidents.length === 0) {
    return (
      <Alert className="bg-muted/50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No fire incidents found within {radius}km of your location.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <div 
          ref={mapContainerRef}
          className="h-[400px] w-full rounded-md bg-muted/30 border flex items-center justify-center"
        >
          {/* This would be replaced with an actual map component */}
          <div className="text-center p-4">
            <p className="text-muted-foreground mb-2">
              Map showing {incidents.length} fire incidents in {location.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={getUserLocation}
              className="flex items-center gap-1"
            >
              <Locate className="h-3 w-3" />
              Center on my location
            </Button>
          </div>
          
          {/* Mock map markers */}
          {incidents.slice(0, 5).map((incident, index) => (
            <div 
              key={incident.id}
              className="absolute w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${20 + (index * 15)}%`, 
                top: `${30 + (index * 10)}%` 
              }}
              onClick={() => setSelectedIncident(incident)}
            >
              <MapPin size={14} />
            </div>
          ))}
          
          {/* Selected incident info window */}
          {selectedIncident && (
            <div 
              className="absolute bg-white p-3 rounded-md shadow-md max-w-xs z-10"
              style={{ 
                left: '50%', 
                top: '40%',
                transform: 'translate(-50%, -100%)' 
              }}
            >
              <h4 className="font-medium text-sm">{selectedIncident.title}</h4>
              <p className="text-xs text-muted-foreground mb-1">{selectedIncident.location}</p>
              <div className="flex gap-1 mb-2">
                <Badge variant="outline" className="text-xs">
                  {selectedIncident.status}
                </Badge>
                {selectedIncident.alert_level && (
                  <Badge variant="destructive" className="text-xs">
                    {selectedIncident.alert_level}
                  </Badge>
                )}
              </div>
              {selectedIncident.description && (
                <p className="text-xs mb-2">{selectedIncident.description}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Updated: {format(new Date(selectedIncident.updated), 'MMM d, h:mm a')}
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={() => setSelectedIncident(null)}
              >
                ×
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Showing {incidents.length} incidents</span>
        <span>Within {radius}km radius</span>
      </div>
    </div>
  );
};
