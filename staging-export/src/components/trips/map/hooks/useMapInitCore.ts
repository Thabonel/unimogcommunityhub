
import { useState, useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { isSupported } from '../mapConfig';
import { initializeMap, cleanupMap } from '../utils/mapInitUtils';

interface UseMapInitCoreProps {
  onMapClick?: () => void;
  initialCenter?: [number, number];
}

/**
 * Core map initialization hook that handles the actual map creation
 */
export const useMapInitCore = ({
  onMapClick,
  initialCenter
}: UseMapInitCoreProps = {}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initialCenterRef = useRef<[number, number] | undefined>(initialCenter);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const isMountedRef = useRef(true);
  const isInitializingRef = useRef(false);
  const mapInitAttempts = useRef(0);

  // Update initial center ref when prop changes
  useEffect(() => {
    initialCenterRef.current = initialCenter;
  }, [initialCenter]);

  // Mounted status tracking
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      // Mark component as unmounted to prevent state updates
      isMountedRef.current = false;
      
      // Clean up any map instance when component unmounts
      if (mapInstance.current) {
        console.log('Cleaning up map on unmount');
        cleanupMap(mapInstance.current);
        mapInstance.current = null;
      }
    };
  }, []);

  // Browser compatibility check
  useEffect(() => {
    if (!isSupported()) {
      setError('Your browser does not support Mapbox GL. Please try a different browser.');
      setIsLoading(false);
    }
  }, []);
  
  // Handle map click
  const handleMapClick = useCallback(() => {
    if (onMapClick) {
      onMapClick();
    }
  }, [onMapClick]);
  
  return {
    mapContainer,
    map,
    setMap, // Make sure to include setMap in the return object
    isLoading,
    setIsLoading,
    error,
    setError,
    initialCenterRef,
    mapInstance,
    isMountedRef,
    isInitializingRef,
    mapInitAttempts,
    handleMapClick
  };
};
