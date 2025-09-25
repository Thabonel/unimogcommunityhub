import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Wrench } from 'lucide-react';
import { EnhancedBarryChat } from '../knowledge/EnhancedBarryChat';
import { useUserLocation } from '@/hooks/use-user-location';
import { useProfile } from '@/hooks/profile';
import { useLocation } from 'react-router-dom';
import { useBarry } from '@/contexts/BarryContext';

export function FloatingBarryButton() {
  const [showBarryChat, setShowBarryChat] = useState(false);
  const { location } = useUserLocation();
  const { userData } = useProfile();
  const routerLocation = useLocation();
  const { onWISAction } = useBarry();

  // Detect if we're on the WIS page
  const isWISPage = routerLocation.pathname.includes('/knowledge/wis');

  // Handle Barry button click - different behavior for WIS page
  const handleBarryClick = () => {
    console.log('🤖 Barry clicked!', {
      pathname: routerLocation.pathname,
      isWISPage,
      hasWISAction: !!onWISAction
    });

    if (isWISPage && onWISAction) {
      console.log('🤖 Activating Barry WIS mode');
      // On WIS page, trigger WIS integration
      onWISAction('activate_barry_mode');
    } else {
      console.log('🤖 Showing Barry chat modal');
      // On other pages, show normal chat modal
      setShowBarryChat(true);
    }
  };

  return (
    <>
      {/* Floating Barry Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleBarryClick}
              size="lg"
              className={`rounded-full h-14 w-14 p-0 shadow-lg border-2 border-white transition-colors ${
                isWISPage
                  ? 'bg-military-green hover:bg-military-green/90'
                  : 'bg-unimog-500 hover:bg-unimog-600'
              }`}
            >
              <div className="relative w-10 h-10">
                <img
                  src="/barry-avatar.png"
                  alt="Barry"
                  className="w-full h-full rounded-full object-cover"
                />
                <Wrench className="h-4 w-4 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 text-unimog-500" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{isWISPage ? 'Barry WIS Assistant' : 'Chat with Barry - AI Mechanic'}</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Barry AI Chat Modal - Only show on non-WIS pages */}
      {!isWISPage && (
        <Dialog open={showBarryChat} onOpenChange={setShowBarryChat}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-6 pb-4 flex-shrink-0 border-b">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/barry-avatar.png"
                  alt="Barry the AI Mechanic"
                  className="w-12 h-12 rounded-full border-2 border-unimog-500"
                />
                <Wrench className="h-4 w-4 absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 text-unimog-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-unimog-800 dark:text-unimog-200">
                  Barry - AI Mechanic with Manual Access
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ask Barry about maintenance, repairs, or any technical questions about your {userData?.unimogModel || 'Unimog'}
                </p>
              </div>
            </div>
          </DialogHeader>
          {/* Fixed height container for proper scrolling */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <EnhancedBarryChat className="h-full" location={location} userModel={userData?.unimogModel} />
          </div>
        </DialogContent>
        </Dialog>
      )}
    </>
  );
}