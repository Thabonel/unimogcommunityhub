
import { useEffect } from 'react';
import type { BotpressConfig } from './types';
import { useSetupBotpress } from './useSetupBotpress';

/**
 * Main hook for Botpress integration
 * Handles initialization, lifecycle, and cleanup of the Botpress widget
 */
export const useBotpress = (config: BotpressConfig) => {
  const {
    isLoading,
    hasError,
    isInitialized,
    setupBotpress,
    cleanupBotpress,
    instanceFlagRef,
    scriptRef
  } = useSetupBotpress();

  // Setup Botpress on component mount
  useEffect(() => {
    setupBotpress(config);

    // Cleanup function
    return () => {
      console.log('Cleaning up Botpress');
      cleanupBotpress();
      
      // Reset instance flag
      if (instanceFlagRef.current) {
        instanceFlagRef.current = false;
      }
      
      // Reset script ref
      if (scriptRef.current) {
        scriptRef.current = null;
      }
    };
  }, []);

  return {
    isLoading,
    hasError,
    isInitialized,
    retry: () => setupBotpress(config)
  };
};
