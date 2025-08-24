import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FloatingBarryButton } from './FloatingBarryButton';

// Global flag to track if Barry is already mounted
let barryInstance: string | null = null;

export function BarryWrapper() {
  const location = useLocation();
  const [instanceId] = useState(() => `barry-${Date.now()}-${Math.random()}`);
  const [shouldRender, setShouldRender] = useState(false);
  
  // Don't show Barry on the homepage or on pages with their own Barry
  const pagesWithOwnBarry = ['/', '/trips'];
  const shouldShowBarry = !pagesWithOwnBarry.includes(location.pathname);
  
  useEffect(() => {
    if (!shouldShowBarry) {
      setShouldRender(false);
      return;
    }
    
    // Check if Barry is already mounted
    if (barryInstance && barryInstance !== instanceId) {
      console.warn(`Barry already mounted with instance ${barryInstance}, skipping duplicate`);
      setShouldRender(false);
      return;
    }
    
    // Register this instance
    barryInstance = instanceId;
    setShouldRender(true);
    
    // Cleanup on unmount
    return () => {
      if (barryInstance === instanceId) {
        barryInstance = null;
      }
    };
  }, [shouldShowBarry, instanceId]);
  
  if (!shouldRender) {
    return null;
  }
  
  return (
    <TooltipProvider>
      <div data-barry-instance={instanceId} className="barry-wrapper-singleton">
        <FloatingBarryButton />
      </div>
    </TooltipProvider>
  );
}