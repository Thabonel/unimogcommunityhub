
/// <reference types="vite/client" />

// Extending Window interface
interface Window {
  // Legacy Botpress interface (deprecated)
  botpressWebChat?: {
    init: (config: any) => void;
    onEvent?: (callback: (event: any) => void, events: string[]) => void;
    close?: () => void;
    isInitialized?: boolean;
  };
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
