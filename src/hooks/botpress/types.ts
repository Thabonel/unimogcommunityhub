
export interface BotpressConfig {
  botId: string;
  clientId: string;
  webhookId: string;
  themeColor?: string;
  composerPlaceholder?: string;
  botConversationDescription?: string;
}

// We don't need to redeclare the Window interface here since we already have it in vite-env.d.ts
// This prevents the duplicate declaration error
