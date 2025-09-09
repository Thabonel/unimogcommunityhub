import React, { useEffect, useRef, useState, memo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { getMapboxTokenFromAnySource } from '@/utils/mapbox-helper';

export interface MapMarker {
  latitude: number;
  longitude: number;
  title: string;
  description?: string;
  color?: string;
}

export interface SimpleMapV2Props {
  height?: string;
  width?: string;
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
}

const SimpleMapV2 = ({
  height = '400px',
  width = '100%',
  center,
  zoom = 9,
  markers = []
}: SimpleMapV2Props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const token = getMapboxTokenFromAnySource();
    if (!token) {
      setError('No Mapbox token available');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Set token right before map creation (like Trip Planner does)
      mapboxgl.accessToken = token;

      // Create map with exact same pattern as working Trip Planner
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center || [9.1829, 48.7758], // Default to Stuttgart
        zoom: zoom,
        attributionControl: false
      });

      mapRef.current = map;

      // Critical: Handle load event properly (this is what makes Trip Planner work!)
      map.on('load', () => {
        console.log('SimpleMapV2: Map loaded successfully');
        
        // Add navigation controls after load
        try {
          map.addControl(new mapboxgl.NavigationControl(), 'top-right');
          map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');
        } catch (err) {
          console.warn('Controls may already exist:', err);
        }

        setIsMapReady(true);
        setIsLoading(false);
      });

      // Handle errors
      map.on('error', (e) => {
        console.error('SimpleMapV2: Map error:', e);
        // Don't set error for non-critical issues
        if (e.error?.message?.includes('403') || e.error?.message?.includes('terrain')) {
          return;
        }
        setError('Map loading error');
        setIsLoading(false);
      });

    } catch (err) {
      console.error('SimpleMapV2: Error initializing map:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setIsMapReady(false);
      }
    };
  }, []); // Only run once on mount

  // Handle markers ONLY after map is ready
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach(marker => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${marker.title}</h3><p>${marker.description || ''}</p>`);

      const mapMarker = new mapboxgl.Marker({
        color: marker.color || '#3FB1CE'
      })
        .setLngLat([marker.longitude, marker.latitude])
        .setPopup(popup)
        .addTo(mapRef.current!);

      markersRef.current.push(mapMarker);
    });

    // Fit bounds if multiple markers
    if (markers.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach(marker => {
        bounds.extend([marker.longitude, marker.latitude]);
      });
      
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12
      });
    }
  }, [markers, isMapReady]); // Only run when markers change AND map is ready

  return (
    <Card className="relative">
      {/* Map container with EXACT structure from working MapContainer */}
      <div className="relative w-full rounded-lg overflow-hidden" style={{ height }}>
        <div 
          ref={mapContainerRef}
          className="h-full w-full"
          style={{ minHeight: '400px' }} // Critical: This ensures container has height!
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default memo(SimpleMapV2);