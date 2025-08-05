/**
 * Mapbox Helper - Token synchronization and management utilities
 * Handles environment variable to localStorage synchronization
 */

import { MAPBOX_CONFIG } from '@/config/env';

const MAPBOX_TOKEN_KEY = 'mapbox-token'; // Standardized localStorage key

/**
 * Get Mapbox token from all possible sources with priority order
 * Priority: 1. Environment variable 2. localStorage
 */
export const getMapboxTokenFromAnySource = (): string | null => {
  // 1. Try environment variable first (highest priority)
  if (MAPBOX_CONFIG.accessToken && MAPBOX_CONFIG.accessToken !== '') {
    return MAPBOX_CONFIG.accessToken;
  }
  
  // 2. Try direct env access (fallback in case config isn't working)
  if (import.meta.env.VITE_MAPBOX_ACCESS_TOKEN && import.meta.env.VITE_MAPBOX_ACCESS_TOKEN !== '') {
    return import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  }
  
  // 3. Try localStorage (lowest priority)
  const storedToken = localStorage.getItem(MAPBOX_TOKEN_KEY);
  if (storedToken && storedToken !== '') {
    return storedToken;
  }
  
  return null;
};

/**
 * Synchronize Mapbox token from environment to localStorage
 * This ensures localStorage has the latest token from environment variables
 * Returns true if sync was performed, false if no action needed
 */
export const syncMapboxTokenToStorage = (): boolean => {
  const envToken = MAPBOX_CONFIG.accessToken || import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  
  if (envToken && envToken !== '') {
    const storedToken = localStorage.getItem(MAPBOX_TOKEN_KEY);
    
    // If no token in storage, or stored token is different, update it
    if (!storedToken || storedToken !== envToken) {
      localStorage.setItem(MAPBOX_TOKEN_KEY, envToken);
      
      // Clean up any legacy keys to avoid confusion
      localStorage.removeItem('mapbox_access_token');
      
      console.log('✅ Synced Mapbox token from environment to localStorage');
      return true;
    }
  }
  
  return false;
};

/**
 * Validate Mapbox token format
 * Returns true if token appears to be a valid Mapbox public token
 */
export const isValidMapboxTokenFormat = (token: string): boolean => {
  return token.startsWith('pk.') && token.length > 20;
};

/**
 * Clean up all Mapbox token storage (both current and legacy keys)
 * Useful for logout or token reset scenarios
 */
export const clearMapboxTokenStorage = (): void => {
  localStorage.removeItem(MAPBOX_TOKEN_KEY);
  localStorage.removeItem('mapbox_access_token'); // Legacy cleanup
  console.log('🧹 Cleared all Mapbox token storage');
};

/**
 * Debug helper to check token status across all sources
 * Only runs in development mode
 */
export const debugMapboxTokenStatus = (): void => {
  if (!import.meta.env.DEV) return;
  
  console.group('🗺️ Mapbox Token Debug Status');
  console.log('Environment Variable (MAPBOX_CONFIG):', MAPBOX_CONFIG.accessToken ? '✅ Set' : '❌ Not set');
  console.log('Environment Variable (direct):', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ? '✅ Set' : '❌ Not set');
  console.log('localStorage (current key):', localStorage.getItem(MAPBOX_TOKEN_KEY) ? '✅ Set' : '❌ Not set');
  console.log('localStorage (legacy key):', localStorage.getItem('mapbox_access_token') ? '⚠️ Found legacy' : '❌ Not set');
  
  const finalToken = getMapboxTokenFromAnySource();
  console.log('Final resolved token:', finalToken ? `✅ Available (${finalToken.substring(0, 10)}...)` : '❌ None available');
  
  if (finalToken && !isValidMapboxTokenFormat(finalToken)) {
    console.warn('⚠️ Token format appears invalid - should start with "pk."');
  }
  
  console.groupEnd();
};

/**
 * Get the standardized localStorage key for Mapbox tokens
 * This helps ensure consistency across the application
 */
export const getMapboxTokenStorageKey = (): string => {
  return MAPBOX_TOKEN_KEY;
};