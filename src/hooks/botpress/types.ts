
export interface BotpressConfig {
  botId: string;
  clientId: string;
  webhookId: string;
  themeColor?: string;
  composerPlaceholder?: string;
  botConversationDescription?: string;
}

// Add this declaration to fix TypeScript error
declare global {
  interface Window {
    botpressWebChat: {
      init: (config: any) => void;
      onEvent: (callback: (event: any) => void, events: string[]) => void;
      close?: () => void;
      isInitialized?: boolean;
    };
  }
}
