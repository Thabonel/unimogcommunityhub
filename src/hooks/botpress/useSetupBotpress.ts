
import { useState } from 'react';
import type { BotpressConfig } from './types';
import { useInitBotpress } from './useInitBotpress';
import { useCleanupBotpress } from './useCleanupBotpress';
import { toast } from '@/hooks/toast';

/**
 * Hook to handle the setup process for Botpress
 */
export const useSetupBotpress = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { initBotpress, scriptRef, instanceFlagRef } = useInitBotpress();
  const cleanupBotpress = useCleanupBotpress();

  const setupBotpress = (config: BotpressConfig) => {
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

  return {
    isLoading,
    hasError,
    isInitialized,
    setupBotpress,
    cleanupBotpress,
    instanceFlagRef,
    scriptRef
  };
};
