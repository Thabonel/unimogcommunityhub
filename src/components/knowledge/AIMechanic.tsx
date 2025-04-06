
import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

interface AIBotProps {
  height?: string;
  width?: string;
}

export const AIMechanic = ({ height = "600px", width = "100%" }: AIBotProps) => {
  useEffect(() => {
    // Load Botpress script
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v2.3/inject.js';
    script.async = true;
    document.head.appendChild(script);

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

    // Cleanup function
    return () => {
      document.head.removeChild(script);
      if (document.body.contains(initScript)) {
        document.body.removeChild(initScript);
      }
      document.head.removeChild(styles);
    };
  }, []);

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Wrench className="h-5 w-5 mr-2 text-primary" />
          <CardTitle>Barry - AI Mechanic</CardTitle>
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

export default AIMechanic;
