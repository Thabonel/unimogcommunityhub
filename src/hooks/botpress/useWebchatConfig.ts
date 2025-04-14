
import { BotpressConfig } from './types';

/**
 * Hook to generate and manage webchat configuration
 */
export const useWebchatConfig = () => {
  /**
   * Creates the webchat configuration object based on provided config
   */
  const createWebchatConfig = (config: BotpressConfig) => {
    // Create a configuration object that works with both old and new Botpress versions
    return {
      // For v1 format (using configUrl)
      configUrl: `https://cdn.botpress.cloud/webchat/v1/injection/config/${config.botId}.json`,
      
      // For v2/v3 format (using detailed config)
      "composerPlaceholder": config.composerPlaceholder || "Ask a question...",
      "botConversationDescription": config.botConversationDescription || "Ask about maintenance and repairs",
      "botId": config.botId,
      "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
      "messagingUrl": "https://messaging.botpress.cloud",
      "clientId": config.clientId,
      "webhookId": config.webhookId,
      "lazySocket": false, // Changed to false to ensure immediate connection
      "themeName": "prism",
      "frontendVersion": "v1",
      "showPoweredBy": false,
      "theme": "light",
      "themeColor": config.themeColor || "#3B82F6"
    };
  };

  return {
    createWebchatConfig
  };
};
