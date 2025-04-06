
import { useRef } from 'react';
import { BotpressConfig } from './types';
import { useStyleBotpress } from './useStyleBotpress';
import { useWebchatConfig } from './useWebchatConfig';

/**
 * Handles the initialization of the Botpress script and widget
 */
export const useInitBotpress = () => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const instanceFlagRef = useRef<boolean>(false);
  const applyCustomStyles = useStyleBotpress();
  const { createWebchatConfig } = useWebchatConfig();

  const initBotpress = (config: BotpressConfig, onLoaded: () => void, onError: () => void) => {
    // Prevent multiple instances
    if (instanceFlagRef.current) {
      console.log('Botpress already initialized, skipping setup');
      return;
    }

    // Set instance flag to prevent duplicate initialization
    instanceFlagRef.current = true;

    // Create and load the Botpress script
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
    script.async = true;
    
    script.onload = () => {
      try {
        // Check if the botpressWebChat object is available
        if (typeof window.botpressWebChat === 'undefined') {
          console.error('Botpress WebChat not available after script load');
          onError();
          return;
        }

        // Configure and initialize the webchat with generated config
        window.botpressWebChat.init(createWebchatConfig(config));

        // Register event listener for when chat is fully loaded
        window.botpressWebChat.onEvent(
          (event) => {
            if (event.type === 'LIFECYCLE.LOADED') {
              console.log('Botpress webchat loaded successfully');
              onLoaded();
              
              // Apply custom styles after a short delay to ensure they take effect
              setTimeout(() => {
                applyCustomStyles(config);
              }, 1000);
            }
          },
          ['LIFECYCLE.LOADED']
        );

        // Set timeout to check if webchat loaded correctly
        setTimeout(() => {
          // Check if the webchat container exists
          const container = document.getElementById('bp-web-widget-container');
          if (!container || container.childElementCount === 0) {
            console.error('Botpress container not found or empty after timeout');
            onError();
          }
        }, 10000);
      } catch (e) {
        console.error('Error initializing Botpress webchat:', e);
        onError();
        instanceFlagRef.current = false;
      }
    };

    script.onerror = () => {
      console.error('Failed to load Botpress script');
      onError();
      instanceFlagRef.current = false;
    };

    document.head.appendChild(script);
    scriptRef.current = script;

    return script;
  };

  return {
    initBotpress,
    scriptRef,
    instanceFlagRef
  };
};
