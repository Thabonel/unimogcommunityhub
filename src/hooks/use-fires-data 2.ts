
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface IncidentCoordinates {
  latitude: number;
  longitude: number;
}

export interface FireIncident {
  id: string;
  title: string;
  location: string;
  status: string;
  type: string;
  alert_level?: string;
  council_area?: string;
  size?: string;
  updated: string;
  description?: string;
  coordinates: IncidentCoordinates;
  publication_date: string;
  uri?: string;
}

interface FiresDataCache {
  incidents: FireIncident[];
  timestamp: string;
}

export function useFiresData() {
  const fetchFiresData = useCallback(async () => {
    console.log('Fetching fires data...');
    
    // List of CORS proxies to try in order
    const corsProxies = [
      'https://corsproxy.io/?',
      'https://cors-anywhere.herokuapp.com/',
      'https://api.allorigins.win/raw?url='
    ];
    
    const apiUrl = 'https://www.rfs.nsw.gov.au/feeds/majorIncidents.json';
    let response = null;
    let proxyIndex = 0;
    let succeeded = false;
    
    // Try each proxy until one works or we run out of options
    while (proxyIndex < corsProxies.length && !succeeded) {
      try {
        const proxy = corsProxies[proxyIndex];
        console.log(`Attempting to fetch with proxy ${proxy}`);
        response = await fetch(proxy + encodeURIComponent(apiUrl));
        
        if (response.ok) {
          succeeded = true;
          break;
        } else {
          proxyIndex++;
        }
      } catch (err) {
        console.warn(`Proxy ${corsProxies[proxyIndex]} failed:`, err);
        proxyIndex++;
      }
    }
    
    // If no proxy worked, try direct access as a last resort
    if (!succeeded) {
      console.log('All proxies failed, attempting direct access');
      response = await fetch(apiUrl);
    }
    
    if (!response || !response.ok) {
      throw new Error(`Failed to fetch fire data: ${response ? response.statusText : 'Network error'}`);
    }
    
    const data = await response.json();
    
    // Process the GeoJSON data
    const processedIncidents = data.features.map((feature: any) => {
      const { properties, geometry } = feature;
      
      return {
        id: properties.guid || `fire-${Math.random().toString(36).substring(2, 9)}`,
        title: properties.title || 'Unknown Incident',
        location: properties.location || 'Unknown Location',
        status: properties.status || 'Unknown Status',
        type: properties.category || properties.type || 'Fire',
        alert_level: properties.alert_level,
        council_area: properties.council_area,
        size: properties.size,
        updated: properties.updated || properties.pubDate,
        description: properties.description,
        coordinates: {
          latitude: geometry.coordinates[1],
          longitude: geometry.coordinates[0]
        },
        publication_date: properties.pubDate,
        uri: properties.guid
      };
    });
    
    // Save to local storage for offline fallback
    try {
      localStorage.setItem('fire-incidents-cache', JSON.stringify({
        incidents: processedIncidents,
        timestamp: new Date().toISOString()
      }));
    } catch (err) {
      console.warn('Failed to cache fire incidents:', err);
    }
    
    console.log(`Successfully loaded ${processedIncidents.length} fire incidents`);
    
    return processedIncidents;
  }, []);
  
  // Try to load from cache immediately if available
  const loadCachedData = useCallback((): FireIncident[] | null => {
    try {
      const cachedData = localStorage.getItem('fire-incidents-cache');
      if (cachedData) {
        const { incidents, timestamp } = JSON.parse(cachedData) as FiresDataCache;
        const cacheAge = (new Date().getTime() - new Date(timestamp).getTime()) / (1000 * 60); // minutes
        
        if (incidents?.length && cacheAge < 60) { // Cache less than 1 hour old
          console.log(`Using cached fire data from ${Math.round(cacheAge)} minutes ago`);
          toast.info(`Showing cached fire data from ${Math.round(cacheAge)} minutes ago`);
          return incidents;
        }
      }
    } catch (err) {
      console.warn('Failed to load cached fire incidents:', err);
    }
    return null;
  }, []);
  
  const { 
    data: incidents = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['fireIncidents'],
    queryFn: fetchFiresData,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
    initialData: loadCachedData,
    meta: {
      onError: (err: Error) => {
        toast.error(`Failed to load fire incidents data: ${err.message}`);
      }
    }
  });
  
  return {
    incidents,
    isLoading,
    error: error ? (error as Error).message : null,
    lastUpdated: new Date(),
    refetch
  };
}
