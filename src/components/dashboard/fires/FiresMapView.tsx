import { FireIncident } from '@/hooks/use-fires-data';
import { Skeleton } from '@/components/ui/skeleton';
import { FiresErrorAlert } from './FiresErrorAlert';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Locate, MapPin, Flame } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapboxTokenFromAnySource } from '@/utils/mapbox-helper';

interface FiresMapViewProps {
  incidents: FireIncident[] | null;
  isLoading: boolean;
  error: Error | null | string;
  radius: number;
  handleRefresh: () => void;
  location?: string;
}

// Mapbox token will be set in useEffect after validation

export const FiresMapView = ({ 
  incidents, 
  isLoading, 
  error, 
  radius,
  handleRefresh,
  location = 'nsw-australia'
}: FiresMapViewProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<FireIncident | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Default center coordinates based on location
  const getDefaultCenter = (): [number, number] => {
    switch(location) {
      case 'nsw-australia':
        return [151.2093, -33.8688]; // Sydney [lng, lat]
      case 'victoria-australia':
        return [144.9631, -37.8136]; // Melbourne
      case 'queensland-australia':
        return [153.0251, -27.4698]; // Brisbane
      case 'california-usa':
        return [-119.4179, 36.7783]; // California
      case 'colorado-usa':
        return [-105.7821, 39.5501]; // Colorado
      case 'germany':
        return [10.4515, 51.1657]; // Germany
      case 'france':
        return [2.2137, 46.2276]; // France
      default:
        return [151.2093, -33.8688]; // Default to Sydney
    }
  };
  
  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userCoords);
          
          // Center map on user location
          if (mapRef.current) {
            mapRef.current.flyTo({
              center: [userCoords.lng, userCoords.lat],
              zoom: 10,
              duration: 2000
            });
            
            // Add user location marker
            new mapboxgl.Marker({ color: '#3b82f6' })
              .setLngLat([userCoords.lng, userCoords.lat])
              .setPopup(new mapboxgl.Popup().setHTML('<p class="font-semibold">Your Location</p>'))
              .addTo(mapRef.current);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    
    // Get token from any available source (env, localStorage, etc.)
    const token = getMapboxTokenFromAnySource();
    
    if (!token) {
      console.error('FiresMapView: No Mapbox access token available');
      console.log('FiresMapView: Please ensure VITE_MAPBOX_ACCESS_TOKEN is set in .env file');
      setMapLoaded(true); // Set to true to show fallback
      return;
    }
    
    // Set the token for this component
    mapboxgl.accessToken = token;
    console.log('FiresMapView: Mapbox token set successfully');
    
    try {
      // Create map instance
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: getDefaultCenter(),
        zoom: 8,
        attributionControl: false
      });
      
      mapRef.current = map;
      
      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add scale control
      map.addControl(new mapboxgl.ScaleControl({ maxWidth: 200 }), 'bottom-left');
      
      // Add attribution control in custom position
      map.addControl(new mapboxgl.AttributionControl({
        compact: true
      }), 'bottom-right');
      
      // Map loaded event
      map.on('load', () => {
        setMapLoaded(true);
        
        // Add radius circle source and layer
        map.addSource('radius-circle', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: getDefaultCenter()
            },
            properties: {}
          }
        });
        
        map.addLayer({
          id: 'radius-circle-fill',
          type: 'fill',
          source: 'radius-circle',
          paint: {
            'fill-color': '#ff0000',
            'fill-opacity': 0.1
          }
        });
        
        map.addLayer({
          id: 'radius-circle-line',
          type: 'line',
          source: 'radius-circle',
          paint: {
            'line-color': '#ff0000',
            'line-width': 2,
            'line-opacity': 0.5
          }
        });
      });
      
      // Handle map errors
      map.on('error', (e) => {
        console.error('Map error:', e);
      });
      
    } catch (error) {
      console.error('Failed to initialize map:', error);
      setMapLoaded(true); // Set to true to show fallback
    }
    
    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);
  
  // Update map markers when incidents change
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !incidents) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Add new markers for incidents
    incidents.forEach(incident => {
      // Skip if no coordinates
      if (!incident.latitude || !incident.longitude) return;
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'fire-marker';
      el.style.cssText = `
        width: 24px;
        height: 24px;
        background: #ef4444;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      `;
      el.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M19.48 12.35c-1.57-4.08-7.16-4.3-5.81-10.23c.1-.44-.37-.78-.75-.55C9.29 3.71 6.68 8 8.87 13.62c.18.46-.36.89-.75.59c-1.81-1.37-2-3.34-1.84-4.75c.06-.52-.62-.77-.91-.34C4.69 10.16 4 11.84 4 14.37c.38 5.6 5.11 7.32 6.81 7.54c2.43.31 5.06-.14 6.95-1.87c2.08-1.93 2.84-5.01 1.72-7.69zm-9.28 5.03c1.44.35 2.18-1.39 1.38-1.95c-.69-.48-1.94-.48-2.63 0c-.84.57-.09 2.3 1.25 1.95z"/></svg>';
      
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([incident.longitude, incident.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-sm mb-1">${incident.title}</h3>
                <p class="text-xs text-gray-600 mb-1">${incident.location}</p>
                <div class="flex gap-1 mb-1">
                  <span class="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                    ${incident.status}
                  </span>
                  ${incident.alert_level ? `
                    <span class="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">
                      ${incident.alert_level}
                    </span>
                  ` : ''}
                </div>
                ${incident.description ? `<p class="text-xs mb-1">${incident.description}</p>` : ''}
                <p class="text-xs text-gray-500">
                  Updated: ${format(new Date(incident.updated), 'MMM d, h:mm a')}
                </p>
              </div>
            `)
        )
        .addTo(mapRef.current);
      
      markersRef.current.push(marker);
    });
    
    // Fit map to show all markers if there are any
    if (incidents.length > 0 && incidents.some(i => i.latitude && i.longitude)) {
      const bounds = new mapboxgl.LngLatBounds();
      incidents.forEach(incident => {
        if (incident.latitude && incident.longitude) {
          bounds.extend([incident.longitude, incident.latitude]);
        }
      });
      
      mapRef.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 12
      });
    }
  }, [mapLoaded, incidents]);
  
  // Update radius circle when location or radius changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    
    const center = userLocation ? [userLocation.lng, userLocation.lat] : getDefaultCenter();
    
    // Create circle GeoJSON with proper radius
    const createCircle = (center: number[], radiusInKm: number) => {
      const points = 64;
      const km = radiusInKm;
      const ret = [];
      const distanceX = km / (111.32 * Math.cos(center[1] * Math.PI / 180));
      const distanceY = km / 110.574;
      
      for (let i = 0; i < points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        const x = distanceX * Math.cos(theta);
        const y = distanceY * Math.sin(theta);
        ret.push([center[0] + x, center[1] + y]);
      }
      ret.push(ret[0]);
      
      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [ret]
        },
        properties: {}
      };
    };
    
    const source = mapRef.current.getSource('radius-circle') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData(createCircle(center, radius));
    }
  }, [mapLoaded, radius, userLocation, location]);
  
  if (error) {
    return <FiresErrorAlert error={error} onRetry={handleRefresh} />;
  }
  
  if (isLoading) {
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
  
  
  // Check if Mapbox token is not available
  if (!getMapboxTokenFromAnySource()) {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          Map service is temporarily unavailable. Fire incident data is still being collected, 
          but the visual map cannot be displayed at this time.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <div 
          ref={mapContainerRef}
          className="h-[400px] w-full rounded-md overflow-hidden"
        />
        
        {/* Center on location button */}
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={getUserLocation}
          className="absolute top-14 right-3 z-10 flex items-center gap-1 shadow-md"
        >
          <Locate className="h-3 w-3" />
          My Location
        </Button>
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Showing {incidents.length} incidents</span>
        <span>Within {radius}km radius</span>
      </div>
    </div>
  );
};