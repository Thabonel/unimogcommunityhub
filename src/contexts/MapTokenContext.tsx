import React, { createContext, useContext, useState, useEffect } from 'react';

interface MapTokenContextType {
  mapboxToken: string | null;
  isTokenValid: boolean;
  loading: boolean;
  error: string | null;
  refreshToken: () => Promise<void>;
}

const MapTokenContext = createContext<MapTokenContextType | undefined>(undefined);

export const useMapToken = () => {
  const context = useContext(MapTokenContext);
  if (!context) {
    throw new Error('useMapToken must be used within a MapTokenProvider');
  }
  return context;
};

export const MapTokenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${token}`
      );
      return response.status !== 401;
    } catch {
      return false;
    }
  };

  const refreshToken = async () => {
    setLoading(true);
    setError(null);

    try {
      // First try environment variable
      const envToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      
      if (envToken && envToken !== 'undefined') {
        const isValid = await validateToken(envToken);
        if (isValid) {
          setMapboxToken(envToken);
          setIsTokenValid(true);
          localStorage.setItem('mapbox_token', envToken);
          setLoading(false);
          return;
        }
      }

      // Try localStorage
      const storedToken = localStorage.getItem('mapbox_token');
      if (storedToken) {
        const isValid = await validateToken(storedToken);
        if (isValid) {
          setMapboxToken(storedToken);
          setIsTokenValid(true);
          setLoading(false);
          return;
        }
      }

      // No valid token found
      setError('No valid Mapbox token found');
      setIsTokenValid(false);
    } catch (err) {
      setError('Failed to validate Mapbox token');
      setIsTokenValid(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshToken();
  }, []);

  const value = {
    mapboxToken,
    isTokenValid,
    loading,
    error,
    refreshToken,
  };

  return (
    <MapTokenContext.Provider value={value}>
      {children}
    </MapTokenContext.Provider>
  );
};