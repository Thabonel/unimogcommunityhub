import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ManualReference } from './ManualCitation';
import { ManualContent } from './ManualContent';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ManualDrawerProps {
  reference: ManualReference | null;
  open: boolean;
  onClose: () => void;
}

export function ManualDrawer({ reference, open, onClose }: ManualDrawerProps) {
  if (!reference) return null;

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent
        className={cn(
          "max-h-[85vh] overflow-hidden flex flex-col",
          // Desktop: side panel on right (uses media query in drawer component)
          "lg:right-0 lg:left-auto lg:top-0 lg:bottom-0 lg:h-screen lg:max-h-screen",
          "lg:w-[600px] lg:rounded-none lg:rounded-l-xl"
        )}
      >
        {/* Header with close button */}
        <DrawerHeader className="border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-lg font-semibold pr-8">
              Manual Reference
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ManualContent reference={reference} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
