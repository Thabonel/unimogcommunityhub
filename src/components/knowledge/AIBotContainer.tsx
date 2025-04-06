
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
      
      // Add ARIA labels for accessibility
      const textarea = document.querySelector('.bpw-composer textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.setAttribute('aria-label', config.composerPlaceholder || 'Type your message');
        textarea.setAttribute('role', 'textbox');
      }
      
      // Make the chat container properly focusable
      const chatWidget = document.querySelector('.bp-widget-widget') as HTMLElement;
      if (chatWidget) {
        chatWidget.setAttribute('role', 'region');
        chatWidget.setAttribute('aria-label', 'Chat with Barry, the AI Mechanic');
      }
    }
  }, [isInitialized, config.composerPlaceholder]);

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
      role="complementary"
      aria-label="Barry AI Mechanic Chat Interface"
    >
      {isLoading && <AIBotLoader />}
      {hasError && <AIBotError onRetry={retry} />}
      
      {!isLoading && !hasError && !isInitialized && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-b-lg"
          aria-live="polite"
        >
          <p className="text-sm text-muted-foreground mb-4">Barry is ready but not responding</p>
          <Button 
            onClick={retry} 
            aria-label="Restart Barry AI Assistant"
          >
            Restart Barry
          </Button>
        </div>
      )}
      
      {/* Hidden fallback content for no-script environments */}
      <noscript>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            The AI Mechanic requires JavaScript to be enabled in your browser.
          </p>
        </div>
      </noscript>
    </div>
  );
};

export default AIBotContainer;
