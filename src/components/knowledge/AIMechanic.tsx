
import React, { useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useBotpress } from '@/hooks/useBotpress';
import AIBotLoader from './AIBotLoader';
import AIBotError from './AIBotError';
import { Button } from '@/components/ui/button';

interface AIBotProps {
  height?: string;
  width?: string;
}

export const AIMechanic = ({ height = "600px", width = "100%" }: AIBotProps) => {
  const botContainerRef = useRef<HTMLDivElement>(null);
  
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

  useEffect(() => {
    // Ensure bot container is visible and properly sized when loaded
    if (botContainerRef.current && isInitialized) {
      const chatContainer = document.querySelector('.bpw-chat-container') as HTMLElement;
      if (chatContainer) {
        chatContainer.style.display = 'flex';
        chatContainer.style.flexDirection = 'column';
        chatContainer.style.height = 'calc(100% - 50px)';
      }
      
      const composerContainer = document.querySelector('.bpw-composer') as HTMLElement;
      if (composerContainer) {
        composerContainer.style.display = 'flex';
        composerContainer.style.alignItems = 'center';
        composerContainer.style.padding = '8px';
      }
    }
  }, [isInitialized]);

  // Force a script reload if in an error state
  const handleRetry = () => {
    if (botContainerRef.current) {
      // Clear the container before retrying
      while (botContainerRef.current.firstChild) {
        botContainerRef.current.removeChild(botContainerRef.current.firstChild);
      }
    }
    retry();
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-unimog-500">
              <AvatarImage src="/lovable-uploads/2cfd91cd-2db0-40fa-8b3f-d6b3505e98ef.png" alt="Barry the AI Mechanic" />
              <AvatarFallback>
                <Wrench className="h-5 w-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <CardTitle>Barry - AI Mechanic</CardTitle>
          </div>
        </div>
        <CardDescription>
          Ask Barry about maintenance, repairs, or any technical questions about your Unimog
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div
          id="barry-webchat"
          ref={botContainerRef}
          style={{
            width: width,
            height: height,
            overflow: "hidden",
            borderRadius: "0 0 0.5rem 0.5rem",
            position: "relative"
          }}
        >
          {isLoading && <AIBotLoader />}
          {hasError && <AIBotError onRetry={handleRetry} />}
          
          {!isLoading && !hasError && !isInitialized && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-b-lg">
              <p className="text-sm text-muted-foreground mb-4">Barry is ready but not responding</p>
              <Button onClick={handleRetry}>Restart Barry</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIMechanic;
