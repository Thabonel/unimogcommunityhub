
import React, { useEffect, useRef } from 'react';

interface SteveTravelPlannerProps {
  position?: 'fixed' | 'relative';
  height?: string;
  width?: string;
}

const SteveTravelPlanner = ({ 
  position = 'fixed', 
  height = '100%', 
  width = '100%' 
}: SteveTravelPlannerProps) => {
  const chatbotContainerRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const iframeId = "steve-travel-planner-iframe";

  useEffect(() => {
    if (!chatbotContainerRef.current) return;

    // Remove any existing script to prevent duplicates
    if (scriptRef.current) {
      scriptRef.current.remove();
      scriptRef.current = null;
    }

    // Create and inject the Botpress script
    const script = document.createElement('script');
    script.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
    script.async = true;
    
    script.onload = () => {
      if (typeof window.botpressWebChat !== 'undefined') {
        window.botpressWebChat.init({
          configUrl: "https://files.bpcontent.cloud/2025/04/08/02/20250408023207-KLOFIO54.json",
          containerSelector: chatbotContainerRef.current ? `#${chatbotContainerRef.current.id}` : undefined,
          // Add custom styling to position the bot in TripPlanner
          stylesheet: position === 'relative' ? '' : `
            .bp-widget-widget {
              right: 15px !important;
              bottom: 80px !important;
            }
          `
        });

        // Custom event to notify when Botpress is ready
        const botpressReadyEvent = new CustomEvent('botpress:ready');
        window.dispatchEvent(botpressReadyEvent);
      } else {
        console.error("Botpress WebChat not available after script load");
      }
    };

    document.head.appendChild(script);
    scriptRef.current = script;

    // Cleanup function
    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
      
      // Clean up any Botpress elements
      const botpressContainer = document.getElementById('bp-web-widget-container');
      if (botpressContainer) {
        botpressContainer.remove();
      }
    };
  }, [position]);

  return (
    <div 
      id="steve-travel-planner-container"
      ref={chatbotContainerRef}
      style={{ 
        position: position as any, 
        height, 
        width,
        bottom: position === 'fixed' ? '0' : undefined,
        right: position === 'fixed' ? '0' : undefined,
        zIndex: position === 'fixed' ? 1000 : undefined,
      }}
    />
  );
};

export default SteveTravelPlanner;
