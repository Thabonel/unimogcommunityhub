
import { useEffect, useRef, useState } from 'react';

export interface BotpressConfig {
  botId: string;
  clientId: string;
  webhookId: string;
  themeColor?: string;
  composerPlaceholder?: string;
  botConversationDescription?: string;
}

export const useBotpress = (config: BotpressConfig) => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const setupBotpress = () => {
    setIsLoading(true);
    setHasError(false);
    
    // Clear any existing scripts to avoid duplicates
    if (scriptRef.current && document.head.contains(scriptRef.current)) {
      document.head.removeChild(scriptRef.current);
    }
    
    // Clear any existing Botpress elements
    const widgetContainer = document.getElementById('bp-web-widget-container');
    if (widgetContainer) {
      widgetContainer.remove();
    }

    // Load Botpress script
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
    script.async = true;
    script.onload = () => {
      try {
        // Check if the botpressWebChat object is available
        if (typeof window.botpressWebChat === 'undefined') {
          console.error('Botpress WebChat not available after script load');
          setHasError(true);
          setIsLoading(false);
          return;
        }

        // Configure and initialize the webchat
        window.botpressWebChat.init({
          "composerPlaceholder": config.composerPlaceholder || "Ask a question...",
          "botConversationDescription": config.botConversationDescription || "Ask about maintenance and repairs",
          "botId": config.botId,
          "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
          "messagingUrl": "https://messaging.botpress.cloud",
          "clientId": config.clientId,
          "webhookId": config.webhookId,
          "lazySocket": true,
          "themeName": "prism",
          "frontendVersion": "v1",
          "showPoweredBy": false,
          "theme": "light",
          "themeColor": config.themeColor || "#3B82F6"
        });

        // Add event listener for when the chat is fully loaded
        window.botpressWebChat.onEvent(
          function(event) {
            if (event.type === 'LIFECYCLE.LOADED') {
              console.log('Botpress webchat loaded successfully');
              setIsLoading(false);
            }
          },
          ['LIFECYCLE.LOADED']
        );

        // Add custom styles after a short delay to ensure they apply
        setTimeout(() => {
          const styles = document.createElement('style');
          styles.innerHTML = `
            #bp-web-widget-container {
              position: static !important;
              width: 100% !important;
              height: 100% !important;
              max-height: 100% !important;
              max-width: 100% !important;
              z-index: 999 !important;
            }
            .bp-widget-web {
              border-radius: 0.5rem !important;
              position: static !important;
              width: 100% !important;
              height: 100% !important;
              max-height: 100% !important;
              max-width: 100% !important;
            }
            .bp-widget-widget {
              position: static !important;
              width: 100% !important;
              height: 100% !important;
              max-height: 100% !important;
              max-width: 100% !important;
              border-radius: 0.5rem !important;
              box-shadow: none !important;
            }
            .bpw-layout {
              border-radius: 0.5rem !important;
            }
            .bpw-send-button, .bpw-button, .bpw-header {
              background-color: ${config.themeColor || "#3B82F6"} !important;
            }
          `;
          document.head.appendChild(styles);
        }, 1000);

        // Set timeout to check if webchat loaded correctly
        setTimeout(() => {
          // Check if the webchat container exists
          const container = document.getElementById('bp-web-widget-container');
          if (!container || container.childElementCount === 0) {
            console.error('Botpress container not found or empty after timeout');
            setHasError(true);
          }
          setIsLoading(false);
        }, 10000);
      } catch (e) {
        console.error('Error initializing Botpress webchat:', e);
        setHasError(true);
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      console.error('Failed to load Botpress script');
      setHasError(true);
      setIsLoading(false);
    };

    document.head.appendChild(script);
    scriptRef.current = script;
  };

  useEffect(() => {
    setupBotpress();

    // Cleanup function
    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      
      // Remove any Botpress elements from the DOM
      const widgetContainer = document.getElementById('bp-web-widget-container');
      if (widgetContainer) {
        widgetContainer.remove();
      }
    };
  }, []);

  return {
    isLoading,
    hasError,
    retry: setupBotpress
  };
};

// Add this declaration to fix TypeScript error
declare global {
  interface Window {
    botpressWebChat: {
      init: (config: any) => void;
      onEvent: (callback: (event: any) => void, events: string[]) => void;
    };
  }
}
