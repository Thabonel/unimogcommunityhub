
// Environment variables accessible throughout the application

// OpenAI Configuration
export const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  model: 'gpt-4-turbo-preview'
};

// Legacy Botpress Configuration (kept for reference)
export const BOTPRESS_CONFIG = {
  botId: '',
  clientId: '',
  webhookId: '',
  themeColor: '#0055FF',
  composerPlaceholder: 'Ask Barry about your Unimog',
  botConversationDescription: 'Barry the AI Mechanic is here to help with all your Unimog mechanical questions.'
};

// App Configuration
export const APP_CONFIG = {
  appUrl: import.meta.env.VITE_APP_URL ?? 'unimogcommunityhub.com'
};

// Stripe Configuration
export const STRIPE_CONFIG = {
  premiumMonthlyPriceId: import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID,
  lifetimePriceId: import.meta.env.VITE_STRIPE_LIFETIME_PRICE_ID
};

// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || '',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID || ''
};

// Mapbox Configuration
export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
  defaultStyle: 'mapbox://styles/mapbox/outdoors-v12',
  defaultCenter: [9.1829, 48.7758] as [number, number], // Stuttgart, Germany
  defaultZoom: 5
};
