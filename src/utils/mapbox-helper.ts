import { MAPBOX_CONFIG } from '@/config/env';

/**
 * Syncs Mapbox token from environment variables to localStorage if needed
 * This ensures backward compatibility and provides a fallback mechanism
 */
export const syncMapboxTokenToStorage = (): void => {
  try {
    // Check if we have a token in environment variables
    const envToken = MAPBOX_CONFIG.accessToken;
    
    if (envToken && envToken.trim() !== '') {
      // Check if localStorage already has a token
      const storageToken = localStorage.getItem('mapbox_access_token') || localStorage.getItem('mapbox-token');
      
      // If no token in storage, or if env token is different, sync it
      if (!storageToken || storageToken !== envToken) {
        localStorage.setItem('mapbox_access_token', envToken);
        console.log('Mapbox token synced from environment to localStorage');
      }
    }
  } catch (error) {
    console.warn('Failed to sync Mapbox token to storage:', error);
  }
};

/**
 * Debug function to log Mapbox token status in development
 */
export const debugMapboxTokenStatus = (): void => {
  try {
    const envToken = MAPBOX_CONFIG.accessToken;
    const storageToken = localStorage.getItem('mapbox_access_token') || localStorage.getItem('mapbox-token');
    
    console.group('🗺️ Mapbox Token Status Debug');
    console.log('Environment token present:', !!envToken);
    console.log('Environment token format valid:', envToken ? envToken.startsWith('pk.') : false);
    console.log('Storage token present:', !!storageToken);
    console.log('Storage token format valid:', storageToken ? storageToken.startsWith('pk.') : false);
    console.log('Tokens match:', envToken === storageToken);
    
    if (envToken && !envToken.startsWith('pk.')) {
      console.warn('⚠️ Environment token does not start with "pk." - this may be invalid');
    }
    
    if (storageToken && !storageToken.startsWith('pk.')) {
      console.warn('⚠️ Storage token does not start with "pk." - this may be invalid');
    }
    
    if (!envToken && !storageToken) {
      console.warn('⚠️ No Mapbox token found in environment or storage');
    }
    
    console.groupEnd();
  } catch (error) {
    console.error('Failed to debug Mapbox token status:', error);
  }
};

/**
 * Gets the active Mapbox token from environment or storage
 */
export const getActiveMapboxToken = (): string | null => {
  const envToken = MAPBOX_CONFIG.accessToken;
  if (envToken && envToken.trim() !== '') {
    return envToken;
  }
  
  return localStorage.getItem('mapbox_access_token') || localStorage.getItem('mapbox-token') || null;
};

/**
 * Validates if a token has the correct format
 */
export const isTokenFormatValid = (token: string): boolean => {
  return token && token.startsWith('pk.') && token.length > 10;
};