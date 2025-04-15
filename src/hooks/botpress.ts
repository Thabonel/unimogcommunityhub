
import { useEffect, useState } from 'react';

export interface BotpressConfig {
  botId: string;
  clientId: string;
  webhookId: string;
  themeColor?: string;
  composerPlaceholder?: string;
  botConversationDescription?: string;
}

export function useBotpress(config: BotpressConfig) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initBotpress = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Load Botpress web script dynamically
        if (!(window as any).botpressWebChat) {
          const script = document.createElement('script');
          script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
          script.async = true;
          
          script.onload = () => {
            // Initialize Botpress after script loads
            initializeBot();
          };
          
          script.onerror = () => {
            console.error('Failed to load Botpress script');
            setHasError(true);
            setIsLoading(false);
          };
          
          document.body.appendChild(script);
        } else {
          // If script already loaded, just initialize
          initializeBot();
        }
      } catch (error) {
        console.error('Error initializing Botpress:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    const initializeBot = () => {
      try {
        const { botId, clientId, webhookId, themeColor, composerPlaceholder, botConversationDescription } = config;
        
        if ((window as any).botpressWebChat) {
          (window as any).botpressWebChat.init({
            botId,
            clientId,
            webhookId,
            hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
            messagingUrl: 'https://messaging.botpress.cloud',
            botName: 'Barry the AI Mechanic',
            stylesheet: 'https://webchat-styler-css.botpress.app/prod/code/d25c3db4-fb94-41ac-9820-271604824514/v48363/style.css',
            useSessionStorage: true,
            hideWidget: true,
            disableAnimations: false,
            composerPlaceholder: composerPlaceholder || 'Chat with Barry',
            botConversationDescription: botConversationDescription || 'AI Mechanic Assistant',
            frontendVersion: 'v1',
            theme: themeColor ? { style: { primaryColor: themeColor } } : undefined,
          });
          
          setIsInitialized(true);
        } else {
          throw new Error('botpressWebChat not available');
        }
      } catch (error) {
        console.error('Error in Botpress initialization:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    initBotpress();

    return () => {
      // Cleanup if needed
      if ((window as any).botpressWebChat) {
        try {
          // Optional: Close or cleanup Botpress chat if needed
        } catch (err) {
          console.error('Error cleaning up Botpress:', err);
        }
      }
    };
  }, [config]);

  const retry = () => {
    setHasError(false);
    setIsLoading(true);
    // Try to re-initialize
    if ((window as any).botpressWebChat) {
      try {
        const { botId, clientId, webhookId } = config;
        (window as any).botpressWebChat.init({
          botId, clientId, webhookId,
          hostUrl: 'https://cdn.botpress.cloud/webchat/v1',
          messagingUrl: 'https://messaging.botpress.cloud',
        });
        setIsInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error in Botpress retry:', error);
        setHasError(true);
        setIsLoading(false);
      }
    } else {
      setHasError(true);
      setIsLoading(false);
      console.error('Botpress Web Chat not available for retry');
    }
  };

  return {
    isLoading,
    hasError,
    isInitialized,
    retry,
  };
}
