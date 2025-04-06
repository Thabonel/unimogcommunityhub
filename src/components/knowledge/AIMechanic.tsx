
import React, { Suspense, lazy } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useBotpress } from '@/hooks/botpress';
import type { BotpressConfig } from '@/hooks/botpress';
import AIBotHeader from './AIBotHeader';
import AIBotLoader from './AIBotLoader';
import { BOTPRESS_CONFIG } from '@/config/env';

// Lazy load the AIBotContainer component
const AIBotContainer = lazy(() => import('./AIBotContainer'));

interface AIBotProps {
  height?: string;
  width?: string;
}

export const AIMechanic = ({ height = "600px", width = "100%" }: AIBotProps) => {
  // Get Botpress configuration from environment
  const botpressConfig: BotpressConfig = {
    botId: BOTPRESS_CONFIG.botId,
    clientId: BOTPRESS_CONFIG.clientId,
    webhookId: BOTPRESS_CONFIG.webhookId,
    themeColor: BOTPRESS_CONFIG.themeColor,
    composerPlaceholder: BOTPRESS_CONFIG.composerPlaceholder,
    botConversationDescription: BOTPRESS_CONFIG.botConversationDescription
  };

  // Use our custom hook to handle Botpress setup and state
  const { isLoading, hasError, isInitialized, retry } = useBotpress(botpressConfig);

  return (
    <Card className="shadow-md overflow-hidden">
      <AIBotHeader />
      <CardContent className="p-0">
        <Suspense fallback={<AIBotLoader />}>
          <AIBotContainer
            config={botpressConfig}
            isLoading={isLoading}
            hasError={hasError}
            isInitialized={isInitialized}
            retry={retry}
            width={width}
            height={height}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default AIMechanic;
