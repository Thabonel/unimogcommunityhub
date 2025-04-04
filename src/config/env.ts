
// Environment variables configuration

// Log the direct environment variable
console.log('Direct env access in config:', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);

// Mapbox configuration
export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
};

// App URLs
export const APP_CONFIG = {
  appUrl: import.meta.env.VITE_APP_URL || 'localhost:8080',
};

// Check for missing critical environment variables
export const validateEnvVariables = (): void => {
  if (!MAPBOX_CONFIG.accessToken) {
    console.warn('VITE_MAPBOX_ACCESS_TOKEN is not defined in environment. Map functionality will require manual token entry.');
  } else {
    console.log('MAPBOX_CONFIG.accessToken is defined:', !!MAPBOX_CONFIG.accessToken);
    console.log('Token length:', MAPBOX_CONFIG.accessToken ? MAPBOX_CONFIG.accessToken.length : 0);
    console.log('Token first/last chars:', MAPBOX_CONFIG.accessToken ? 
      `${MAPBOX_CONFIG.accessToken.substring(0, 5)}...${MAPBOX_CONFIG.accessToken.substring(MAPBOX_CONFIG.accessToken.length - 5)}` : 'none');
  }
};

// Call validation on import
validateEnvVariables();
