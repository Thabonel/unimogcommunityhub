
import { useRef, useCallback } from 'react';
import { BotpressConfig } from './types';
import { useStyleBotpress } from './useStyleBotpress';
import { useWebchatConfig } from './useWebchatConfig';
import { useErrorHandler } from '@/hooks/use-error-handler';

/**
 * Handles the initialization of the Botpress script and widget
 */
export const useInitBotpress = () => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const instanceFlagRef = useRef<boolean>(false);
  const applyCustomStyles = useStyleBotpress();
  const { createWebchatConfig } = useWebchatConfig();
  const { handleError } = useErrorHandler();

  const initBotpress = useCallback((config: BotpressConfig, onLoaded: () => void, onError: () => void) => {
    // Prevent multiple instances
    if (instanceFlagRef.current) {
      console.log('Botpress already initialized, skipping setup');
      return;
    }

    // Set instance flag to prevent duplicate initialization
    instanceFlagRef.current = true;
    
    // Create and load the Botpress script with better error handling
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
    script.async = true;
    script.defer = true; // Add defer for better performance
    
    // Set timeout to detect script loading failures
    const scriptTimeout = setTimeout(() => {
      if (!window.botpressWebChat) {
        handleError(new Error('Botpress script loading timed out'), {
          context: 'Botpress Initialization',
          showToast: true
        });
        onError();
        instanceFlagRef.current = false;
      }
    }, 15000); // 15 second timeout
    
    script.onload = () => {
      clearTimeout(scriptTimeout);
      try {
        // Check if the botpressWebChat object is available
        if (typeof window.botpressWebChat === 'undefined') {
          const error = new Error('Botpress WebChat not available after script load');
          handleError(error, { context: 'Botpress Initialization' });
          onError();
          return;
        }

        // Configure and initialize the webchat with generated config
        const webchatConfig = createWebchatConfig(config);
        window.botpressWebChat.init(webchatConfig);

        // Register event listener for when chat is fully loaded
        // Only proceed if the onEvent method exists
        if (window.botpressWebChat.onEvent) {
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
        } else {
          // Fallback if onEvent is not available
          console.log('Botpress webchat onEvent method not available, assuming loaded');
          onLoaded();
          
          // Apply custom styles after a short delay
          setTimeout(() => {
            applyCustomStyles(config);
          }, 1000);
        }

        // Advanced error checking
        setTimeout(() => {
          // Check if the webchat container exists and has children
          const container = document.getElementById('bp-web-widget-container');
          if (!container || container.childElementCount === 0) {
            const error = new Error('Botpress container not found or empty after timeout');
            handleError(error, { context: 'Botpress Initialization' });
            onError();
          }
        }, 10000);
      } catch (e) {
        clearTimeout(scriptTimeout);
        handleError(e, { 
          context: 'Botpress Initialization',
          showToast: true
        });
        onError();
        instanceFlagRef.current = false;
      }
    };

    script.onerror = () => {
      clearTimeout(scriptTimeout);
      handleError(new Error('Failed to load Botpress script'), {
        context: 'Botpress Initialization',
        showToast: true
      });
      onError();
      instanceFlagRef.current = false;
    };

    document.head.appendChild(script);
    scriptRef.current = script;

    return script;
  }, [applyCustomStyles, createWebchatConfig, handleError]);

  return {
    initBotpress,
    scriptRef,
    instanceFlagRef
  };
};
