
// Environment variables configuration

// Mapbox configuration
export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
};

// App URLs
export const APP_CONFIG = {
  appUrl: import.meta.env.VITE_APP_URL || 'localhost:8080',
};

// Botpress configuration
export const BOTPRESS_CONFIG = {
  botId: import.meta.env.VITE_BOTPRESS_BOT_ID || '',
  clientId: import.meta.env.VITE_BOTPRESS_CLIENT_ID || '',
  webhookId: import.meta.env.VITE_BOTPRESS_WEBHOOK_ID || '',
  themeColor: '#3B82F6',
  composerPlaceholder: 'Ask Barry a question...',
  botConversationDescription: 'Ask about maintenance and repairs for your Unimog'
};

// Check for missing critical environment variables
export const validateEnvVariables = (): void => {
  if (!MAPBOX_CONFIG.accessToken) {
    console.warn('VITE_MAPBOX_ACCESS_TOKEN is not defined in environment. Map functionality will require manual token entry.');
  } else {
    console.log('MAPBOX_CONFIG.accessToken is available, length:', MAPBOX_CONFIG.accessToken.length);
    console.log('Token first/last chars:', MAPBOX_CONFIG.accessToken ? 
      `${MAPBOX_CONFIG.accessToken.substring(0, 5)}...${MAPBOX_CONFIG.accessToken.substring(MAPBOX_CONFIG.accessToken.length - 5)}` : 'none');
  }
  
  // Validate Botpress configuration
  if (!BOTPRESS_CONFIG.botId || !BOTPRESS_CONFIG.clientId || !BOTPRESS_CONFIG.webhookId) {
    console.warn('One or more Botpress configuration variables are missing. AI Mechanic functionality may be limited.');
  }
};

// Call validation on import
validateEnvVariables();
