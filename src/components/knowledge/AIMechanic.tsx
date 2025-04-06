
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useBotpress } from '@/hooks/botpress';
import AIBotHeader from './AIBotHeader';
import AIBotContainer from './AIBotContainer';

interface AIBotProps {
  height?: string;
  width?: string;
}

export const AIMechanic = ({ height = "600px", width = "100%" }: AIBotProps) => {
  // Barry's Botpress configuration
  const botpressConfig = {
    botId: "8096bf45-c681-4f43-9bb0-d382b5b6532d",
    clientId: "081343f3-99d0-4409-bb90-7d3afc48c483",
    webhookId: "8ceac81d-d2a2-4af9-baed-77c80eb4b0d3",
    themeColor: "#3B82F6",
    composerPlaceholder: "Ask Barry a question...",
    botConversationDescription: "Ask about maintenance and repairs for your Unimog"
  };

  // Use our custom hook to handle Botpress setup and state
  const { isLoading, hasError, isInitialized, retry } = useBotpress(botpressConfig);

  return (
    <Card className="shadow-md overflow-hidden">
      <AIBotHeader />
      <CardContent className="p-0">
        <AIBotContainer
          config={botpressConfig}
          isLoading={isLoading}
          hasError={hasError}
          isInitialized={isInitialized}
          retry={retry}
          width={width}
          height={height}
        />
      </CardContent>
    </Card>
  );
};

export default AIMechanic;
