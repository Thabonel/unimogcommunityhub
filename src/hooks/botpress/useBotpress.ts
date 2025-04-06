
import { useState, useEffect } from 'react';
import { BotpressConfig } from './types';
import { useInitBotpress } from './useInitBotpress';
import { useCleanupBotpress } from './useCleanupBotpress';
import { toast } from '@/hooks/toast';

export { BotpressConfig } from './types';

/**
 * Main hook for Botpress integration
 * Handles initialization, lifecycle, and cleanup of the Botpress widget
 */
export const useBotpress = (config: BotpressConfig) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { initBotpress, scriptRef, instanceFlagRef } = useInitBotpress();
  const cleanupBotpress = useCleanupBotpress();

  const setupBotpress = () => {
    // Reset state
    setIsLoading(true);
    setHasError(false);
    setIsInitialized(false);
    
    // Clean up any existing Botpress elements first
    cleanupBotpress();
    
    console.log('Setting up Botpress with config:', config);
    
    // Initialize Botpress
    initBotpress(
      config,
      // On loaded callback
      () => {
        setIsLoading(false);
        setIsInitialized(true);
        
        // Notify user that Barry is ready
        toast({
          title: "Barry is ready",
          description: "Ask me anything about your Unimog!",
        });
      },
      // On error callback
      () => {
        setHasError(true);
        setIsLoading(false);
        instanceFlagRef.current = false;
      }
    );
  };

  useEffect(() => {
    setupBotpress();

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
    retry: setupBotpress
  };
};

// Re-export for backward compatibility
export default useBotpress;
