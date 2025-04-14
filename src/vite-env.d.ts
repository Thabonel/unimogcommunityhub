
/// <reference types="vite/client" />

// Extending Window interface for Botpress
interface Window {
  botpressWebChat?: {
    init: (config: any) => void;
    onEvent?: (callback: (event: any) => void, events: string[]) => void;
    close?: () => void;
    isInitialized?: boolean;
  };
}
