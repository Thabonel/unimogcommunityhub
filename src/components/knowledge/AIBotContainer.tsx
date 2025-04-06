
import React, { useRef, useEffect } from 'react';
import { BotpressConfig } from '@/hooks/botpress';
import AIBotLoader from './AIBotLoader';
import AIBotError from './AIBotError';
import { Button } from '@/components/ui/button';

interface AIBotContainerProps {
  config: BotpressConfig;
  isLoading: boolean;
  hasError: boolean;
  isInitialized: boolean;
  retry: () => void;
  width: string;
  height: string;
}

const AIBotContainer = ({
  config,
  isLoading,
  hasError,
  isInitialized,
  retry,
  width,
  height
}: AIBotContainerProps) => {
  const botContainerRef = useRef<HTMLDivElement>(null);

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

  return (
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
      {hasError && <AIBotError onRetry={retry} />}
      
      {!isLoading && !hasError && !isInitialized && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-b-lg">
          <p className="text-sm text-muted-foreground mb-4">Barry is ready but not responding</p>
          <Button onClick={retry}>Restart Barry</Button>
        </div>
      )}
    </div>
  );
};

export default AIBotContainer;
