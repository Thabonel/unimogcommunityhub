
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
// CRITICAL: Use fallback values if env vars don't load
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjAxNjEsImV4cCI6MjA1ODc5NjE2MX0.kbjmP9__CU21gJfZwyKbw0GVfjX_PL7jmVTZsY-W8uY',
  projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID || 'ydevatqwkoccxhtejdor'
};

// Mapbox Configuration
export const MAPBOX_CONFIG = {
  accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '',
  defaultStyle: 'mapbox://styles/mapbox/outdoors-v12',
  defaultCenter: [9.1829, 48.7758] as [number, number], // Stuttgart, Germany
  defaultZoom: 5
};
