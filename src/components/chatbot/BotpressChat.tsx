
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface BotpressChatProps {
  containerClassName?: string;
  configUrl: string;
  height?: string;
  width?: string;
}

/**
 * A reusable Botpress chatbot component that can be integrated anywhere in the application
 */
const BotpressChat: React.FC<BotpressChatProps> = ({
  containerClassName = "",
  configUrl,
  height = "500px",
  width = "100%"
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const chatInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!chatContainerRef.current || chatInitializedRef.current) return;
    
    // Clean up any existing Botpress elements to prevent duplicates
    const existingBotpress = document.getElementById('bp-web-widget-container');
    if (existingBotpress) {
      existingBotpress.remove();
    }

    // Create and inject the Botpress script
    const script = document.createElement('script');
    script.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
    script.async = true;
    
    script.onload = () => {
      if (typeof window.botpressWebChat !== 'undefined') {
        // Initialize the webchat with the provided config URL
        window.botpressWebChat.init({
          configUrl,
          containerSelector: chatContainerRef.current ? `#${chatContainerRef.current.id}` : undefined
        });
        
        chatInitializedRef.current = true;
        
        // Listen for postMessage events from the chat iframe
        window.addEventListener('message', handleBotMessage);
      } else {
        console.error("Botpress WebChat not available after script load");
        toast.error("Failed to load chat assistant");
      }
    };
    
    script.onerror = () => {
      console.error("Failed to load Botpress script");
      toast.error("Failed to load chat assistant");
    };

    document.head.appendChild(script);
    scriptRef.current = script;

    // Cleanup function
    return () => {
      window.removeEventListener('message', handleBotMessage);
      
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
      
      // Clean up any Botpress elements
      const botpressContainer = document.getElementById('bp-web-widget-container');
      if (botpressContainer) {
        botpressContainer.remove();
      }
      
      chatInitializedRef.current = false;
    };
  }, [configUrl]);

  // Handle messages from the Botpress chat
  const handleBotMessage = (event: MessageEvent) => {
    // We only process messages that have a type property and are from Botpress
    if (event.data && typeof event.data === 'object' && 'type' in event.data) {
      console.log('Received message from Botpress:', event.data);
      
      // Here we could handle specific message types from the bot
      // For example, trip planning data
    }
  };

  const uniqueId = `botpress-chat-container-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div 
      id={uniqueId}
      ref={chatContainerRef}
      className={`botpress-chat-container ${containerClassName}`}
      style={{ 
        height, 
        width,
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  );
};

export default BotpressChat;
