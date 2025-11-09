
/// <reference types="vite/client" />

// Extending Window interface
interface Window {
  // Future window extensions can go here
}

// Environment variables
interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_MAPBOX_ACCESS_TOKEN: string;
  // Add other env vars as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
