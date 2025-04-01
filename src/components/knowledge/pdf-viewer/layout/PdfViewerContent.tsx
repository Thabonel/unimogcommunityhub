
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PdfViewerContentProps {
  children: React.ReactNode;
  isLoading: boolean;
  error: string | null;
}

export function PdfViewerContent({ children, isLoading, error }: PdfViewerContentProps) {
  return (
    <ScrollArea className="flex-1 bg-gray-100 overflow-auto pdf-container">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4" aria-live="polite">Loading PDF document...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 text-destructive">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="pdf-content-container">
          {children}
        </div>
      )}
    </ScrollArea>
  );
}
