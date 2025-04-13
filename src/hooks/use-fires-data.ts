
import { useState, useEffect, useCallback } from 'react';
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

export function useFiresData() {
  const [incidents, setIncidents] = useState<FireIncident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const MAX_RETRIES = 3;
  
  const fetchFiresData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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
      
      // Reset retry count on successful fetch
      setRetryCount(0);
      
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
      
      setIncidents(processedIncidents);
      setLastUpdated(new Date());
      console.log(`Successfully loaded ${processedIncidents.length} fire incidents`);
      
      // Save to local storage for offline fallback
      try {
        localStorage.setItem('fire-incidents-cache', JSON.stringify({
          incidents: processedIncidents,
          timestamp: new Date().toISOString()
        }));
      } catch (err) {
        console.warn('Failed to cache fire incidents:', err);
      }
      
    } catch (err) {
      console.error('Error fetching fire data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load fire incidents data');
      toast.error('Failed to load fire incidents data. Retrying...');
      
      // Increment retry count
      const newRetryCount = retryCount + 1;
      setRetryCount(newRetryCount);
      
      // Try to load from cache if available
      try {
        const cachedData = localStorage.getItem('fire-incidents-cache');
        if (cachedData) {
          const { incidents: cachedIncidents, timestamp } = JSON.parse(cachedData);
          const cacheAge = (new Date().getTime() - new Date(timestamp).getTime()) / (1000 * 60); // minutes
          
          if (cachedIncidents?.length && cacheAge < 60) { // Cache less than 1 hour old
            setIncidents(cachedIncidents);
            setLastUpdated(new Date(timestamp));
            toast.info(`Showing cached fire data from ${Math.round(cacheAge)} minutes ago`);
          }
        }
      } catch (cacheErr) {
        console.warn('Failed to load cached fire incidents:', cacheErr);
      }
      
      // Retry fetch if under max retries
      if (newRetryCount < MAX_RETRIES) {
        const retryDelay = Math.pow(2, newRetryCount) * 1000; // Exponential backoff
        setTimeout(() => {
          fetchFiresData();
        }, retryDelay);
      } else {
        // Set empty incidents array to prevent undefined errors
        setIncidents([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [retryCount]);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchFiresData();
    
    // Refresh data every 30 minutes (same as the feed update frequency)
    const intervalId = setInterval(() => {
      fetchFiresData();
    }, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [fetchFiresData]);
  
  return {
    incidents,
    isLoading,
    error,
    lastUpdated,
    refetch: fetchFiresData
  };
}
