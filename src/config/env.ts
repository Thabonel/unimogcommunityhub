
// Environment variables accessible throughout the application

// Gemini Configuration (replacing OpenAI/Claude)
export const GEMINI_CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  model: 'gemini-1.5-flash' // Fast and efficient model for Barry AI
};

// Legacy OpenAI Configuration (deprecated)
export const OPENAI_CONFIG = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  model: 'gpt-4o' // Uses the latest available GPT model automatically
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
// NO HARDCODED FALLBACKS - they cause auth token conflicts!
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
