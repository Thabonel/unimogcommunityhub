
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

// Define supported languages
export const SUPPORTED_LANGUAGES = ['en', 'de', 'tr', 'es'];

// Define supported countries
export const SUPPORTED_COUNTRIES = ['AU', 'GB', 'DE', 'TR', 'AR'];

// Define default values
export const DEFAULT_COUNTRY = 'GB';
export const DEFAULT_LANGUAGE = 'en';
