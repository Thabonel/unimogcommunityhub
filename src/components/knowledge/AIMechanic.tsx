
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Wrench, RefreshCw } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface AIBotProps {
  height?: string;
  width?: string;
}

export const AIMechanic = ({ height = "600px", width = "100%" }: AIBotProps) => {
  // Create refs to track the elements we add to the DOM
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const initScriptRef = useRef<HTMLScriptElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const setupBotpress = () => {
    // Clear any existing scripts to avoid duplicates
    if (scriptRef.current && document.head.contains(scriptRef.current)) {
      document.head.removeChild(scriptRef.current);
    }
    if (initScriptRef.current && document.body.contains(initScriptRef.current)) {
      document.body.removeChild(initScriptRef.current);
    }
    if (styleRef.current && document.head.contains(styleRef.current)) {
      document.head.removeChild(styleRef.current);
    }

    setIsLoading(true);
    setHasError(false);

    // Load Botpress script
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2/inject.js';
    script.async = true;
    document.head.appendChild(script);
    scriptRef.current = script;

    // Initialize Botpress when script is loaded
    script.onload = () => {
      try {
        const initScript = document.createElement('script');
        initScript.innerHTML = `
          window.botpressWebChat = window.botpressWebChat || {};
          window.botpressWebChat.init({
            "composerPlaceholder": "Ask Barry a question...",
            "botConversationDescription": "Ask about maintenance and repairs for your Unimog",
            "botId": "8096bf45-c681-4f43-9bb0-d382b5b6532d",
            "hostUrl": "https://cdn.botpress.cloud/webchat/v2",
            "messagingUrl": "https://messaging.botpress.cloud",
            "clientId": "081343f3-99d0-4409-bb90-7d3afc48c483",
            "webhookId": "8ceac81d-d2a2-4af9-baed-77c80eb4b0d3",
            "lazySocket": true,
            "themeName": "prism",
            "frontendVersion": "v2",
            "showPoweredBy": false,
            "theme": "light",
            "themeColor": "#3B82F6"
          });
          window.botpressWebChat.onEvent(
            function(event) {
              if (event.type === 'LIFECYCLE.LOADED') {
                console.log('Botpress webchat loaded successfully');
                document.querySelector('#barry-loader')?.remove();
              }
            },
            ['LIFECYCLE.LOADED']
          );
        `;
        document.body.appendChild(initScript);
        initScriptRef.current = initScript;

        // Add custom styles
        const styles = document.createElement('style');
        styles.innerHTML = `
          #bp-web-widget-container {
            position: static !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            max-width: 100% !important;
            z-index: 999 !important;
          }
          .bp-widget-web {
            border-radius: 0.5rem !important;
            position: static !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            max-width: 100% !important;
          }
          .bp-widget-widget {
            position: static !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            max-width: 100% !important;
            border-radius: 0.5rem !important;
            box-shadow: none !important;
          }
          .bpw-layout {
            border-radius: 0.5rem !important;
          }
          .bpw-send-button, .bpw-button, .bpw-header {
            background-color: #3B82F6 !important;
          }
        `;
        document.head.appendChild(styles);
        styleRef.current = styles;

        // Set timeout to check if webchat loaded correctly
        setTimeout(() => {
          // If the loader is still visible after 10 seconds, consider it an error
          if (document.querySelector('#barry-loader')) {
            setHasError(true);
          }
          setIsLoading(false);
        }, 10000);
      } catch (e) {
        console.error('Error initializing Botpress webchat:', e);
        setHasError(true);
        setIsLoading(false);
      }
    };

    script.onerror = () => {
      console.error('Failed to load Botpress script');
      setHasError(true);
      setIsLoading(false);
    };
  };

  useEffect(() => {
    setupBotpress();

    // Cleanup function
    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      
      if (initScriptRef.current && document.body.contains(initScriptRef.current)) {
        document.body.removeChild(initScriptRef.current);
      }
      
      if (styleRef.current && document.head.contains(styleRef.current)) {
        document.head.removeChild(styleRef.current);
      }
      
      // Remove any Botpress elements from the DOM
      const widgetContainer = document.getElementById('bp-web-widget-container');
      if (widgetContainer) {
        widgetContainer.remove();
      }
    };
  }, []);

  const handleRetry = () => {
    setupBotpress();
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
          style={{
            width: width,
            height: height,
            overflow: "hidden",
            borderRadius: "0 0 0.5rem 0.5rem",
            position: "relative"
          }}
        >
          {isLoading && (
            <div 
              id="barry-loader"
              className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-b-lg"
            >
              <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-sm text-muted-foreground">Loading Barry...</p>
            </div>
          )}
          
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-b-lg">
              <div className="text-center p-6">
                <Wrench className="h-10 w-10 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Failed to load Barry</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  There was a problem connecting to Barry. Please try again.
                </p>
                <Button onClick={handleRetry} className="mx-auto">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Add this declaration to fix TypeScript error
declare global {
  interface Window {
    botpressWebChat: {
      init: (config: any) => void;
      onEvent: (callback: (event: any) => void, events: string[]) => void;
    };
  }
}

export default AIMechanic;
