
import React, { useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Wrench } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AIBotProps {
  height?: string;
  width?: string;
}

export const AIMechanic = ({ height = "600px", width = "100%" }: AIBotProps) => {
  // Create refs to track the elements we add to the DOM
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const initScriptRef = useRef<HTMLScriptElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    // Load Botpress script
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.3/inject.js';
    script.async = true;
    document.head.appendChild(script);
    scriptRef.current = script;

    // Initialize Botpress when script is loaded
    script.onload = () => {
      const initScript = document.createElement('script');
      initScript.innerHTML = `
        window.botpress = window.botpress || {};
        window.botpress.on("webchat:ready", () => {
          window.botpress.open();
        });
        window.botpress.init({
          "botId": "8096bf45-c681-4f43-9bb0-d382b5b6532d",
          "configuration": {
            "website": {},
            "email": {},
            "phone": {},
            "termsOfService": {},
            "privacyPolicy": {},
            "color": "#3B82F6",
            "variant": "solid",
            "themeMode": "light",
            "fontFamily": "inter",
            "radius": 1
          },
          "clientId": "081343f3-99d0-4409-bb90-7d3afc48c483",
          "selector": "#barry-webchat"
        });
      `;
      document.body.appendChild(initScript);
      initScriptRef.current = initScript;
    };

    // Add custom styles
    const styles = document.createElement('style');
    styles.innerHTML = `
      #barry-webchat .bpWebchat {
        position: unset;
        width: 100%;
        height: 100%;
        max-height: 100%;
        max-width: 100%;
        border-radius: 0.5rem;
      }
      #barry-webchat .bpFab {
        display: none;
      }
    `;
    document.head.appendChild(styles);
    styleRef.current = styles;

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
      
      // Cleanup Botpress
      if (window.botpress && typeof window.botpress.destroy === 'function') {
        try {
          window.botpress.destroy();
        } catch (e) {
          console.error('Error destroying Botpress webchat:', e);
        }
      }
    };
  }, []);

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
            borderRadius: "0 0 0.5rem 0.5rem"
          }}
        ></div>
      </CardContent>
    </Card>
  );
};

// Add this declaration to fix TypeScript error
declare global {
  interface Window {
    botpress: {
      on: (event: string, callback: () => void) => void;
      init: (config: any) => void;
      open: () => void;
      destroy?: () => void;
    };
  }
}

export default AIMechanic;
