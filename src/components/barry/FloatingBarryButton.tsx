import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Wrench } from 'lucide-react';
import { BarryChat } from '../knowledge/BarryChat';
import { useUserLocation } from '@/hooks/use-user-location';

export function FloatingBarryButton() {
  const [showBarryChat, setShowBarryChat] = useState(false);
  const { location } = useUserLocation();

  return (
    <>
      {/* Floating Barry Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setShowBarryChat(true)}
              size="lg"
              className="rounded-full h-14 w-14 p-0 shadow-lg bg-unimog-500 hover:bg-unimog-600 border-2 border-white"
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
            <p>Chat with Barry - AI Mechanic</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Barry AI Chat Modal */}
      <Dialog open={showBarryChat} onOpenChange={setShowBarryChat}>
        <DialogContent className="max-w-4xl max-h-[85vh] p-0 flex flex-col">
          <DialogHeader className="p-6 pb-0 flex-shrink-0">
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
                  Ask Barry about maintenance, repairs, or any technical questions about your Unimog
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto min-h-0">
            <BarryChat className="h-full" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}