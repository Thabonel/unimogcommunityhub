
/// <reference types="vite/client" />

// Extending Window interface for Botpress
interface Window {
  botpressWebChat?: {
    init: (config: {
      configUrl: string;
      containerSelector?: string;
      stylesheet?: string;
    }) => void;
  };
}
