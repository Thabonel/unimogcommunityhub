
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { MAPBOX_CONFIG } from '@/config/env';
import { getMapboxTokenFromAnySource, getMapboxTokenStorageKey, clearMapboxTokenStorage } from '@/utils/mapbox-helper';

interface MapTokenContextType {
  token: string | null;
  isTokenLoading: boolean;
  isTokenValid: boolean;
  setToken: (token: string) => void;
  clearToken: () => void;
  validateToken: () => Promise<boolean>;
}

const MapTokenContext = createContext<MapTokenContextType | undefined>(undefined);

export function MapTokenProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isTokenLoading, setIsTokenLoading] = useState<boolean>(true);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  // Initialize token from available sources
  useEffect(() => {
    const initializeToken = async () => {
      setIsTokenLoading(true);
      
      try {
        // Get token using our standardized helper
        let mapboxToken = getMapboxTokenFromAnySource();
        
        if (mapboxToken) {
          setTokenState(mapboxToken);
          
          // Validate token
          try {
            const isValid = await validateMapboxToken(mapboxToken);
            setIsTokenValid(isValid);
            
            if (!isValid) {
              console.warn('Stored Mapbox token is invalid');
            }
          } catch (error) {
            console.error('Error validating token:', error);
            setIsTokenValid(false);
          }
        } else {
          console.log('No Mapbox token found');
          setIsTokenValid(false);
        }
      } finally {
        setIsTokenLoading(false);
      }
    };
    
    initializeToken();
  }, []);

  // Validate a Mapbox token against the API
  const validateMapboxToken = async (tokenToValidate: string): Promise<boolean> => {
    try {
      // Try to fetch a small tile to validate token
      const response = await fetch(
        `https://api.mapbox.com/v4/mapbox.satellite/1/0/0@2x.png32?access_token=${tokenToValidate}`,
        { method: 'HEAD' }
      );
      
      return response.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  };

  // Set token and validate it
  const setToken = async (newToken: string) => {
    setIsTokenLoading(true);
    
    try {
      // Basic format validation
      if (!newToken.startsWith('pk.')) {
        toast.error('Invalid Mapbox token format. Public tokens should start with "pk."');
        setIsTokenValid(false);
        return;
      }
      
      // Validate with Mapbox API
      const isValid = await validateMapboxToken(newToken);
      
      if (isValid) {
        const storageKey = getMapboxTokenStorageKey();
        localStorage.setItem(storageKey, newToken);
        setTokenState(newToken);
        setIsTokenValid(true);
        toast.success('Mapbox token saved and validated');
      } else {
        toast.error('Mapbox token validation failed');
        setIsTokenValid(false);
      }
    } catch (error) {
      console.error('Error setting token:', error);
      toast.error('Error setting Mapbox token');
      setIsTokenValid(false);
    } finally {
      setIsTokenLoading(false);
    }
  };

  // Clear the token
  const clearToken = () => {
    clearMapboxTokenStorage(); // This handles both current and legacy keys
    setTokenState(null);
    setIsTokenValid(false);
    toast.info('Mapbox token has been reset');
  };

  // Validate the current token
  const validateToken = async (): Promise<boolean> => {
    if (!token) return false;
    
    try {
      const isValid = await validateMapboxToken(token);
      setIsTokenValid(isValid);
      return isValid;
    } catch (error) {
      console.error('Error validating token:', error);
      setIsTokenValid(false);
      return false;
    }
  };

  return (
    <MapTokenContext.Provider 
      value={{
        token,
        isTokenLoading,
        isTokenValid,
        setToken,
        clearToken,
        validateToken
      }}
    >
      {children}
    </MapTokenContext.Provider>
  );
}

export function useMapToken() {
  const context = useContext(MapTokenContext);
  
  if (context === undefined) {
    throw new Error('useMapToken must be used within a MapTokenProvider');
  }
  
  return context;
}
