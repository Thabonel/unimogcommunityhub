
// Environment variables accessible throughout the application

// Botpress Configuration
export const BOTPRESS_CONFIG = {
  botId: import.meta.env.VITE_BOTPRESS_BOT_ID ?? '8096bf45-c681-4f43-9bb0-d382b5b6532d',
  clientId: import.meta.env.VITE_BOTPRESS_CLIENT_ID ?? '081343f3-99d0-4409-bb90-7d3afc48c483',
  webhookId: import.meta.env.VITE_BOTPRESS_WEBHOOK_ID ?? '8ceac81d-d2a2-4af9-baed-77c80eb4b0d3',
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
  url: 'https://ydevatqwkoccxhtejdor.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMjAxNjEsImV4cCI6MjA1ODc5NjE2MX0.kbjmP9__CU21gJfZwyKbw0GVfjX_PL7jmVTZsY-W8uY',
  projectId: 'ydevatqwkoccxhtejdor'
};
