
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const AIBotLoader = () => {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-b-lg"
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 text-primary animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading Barry...</p>
        <p className="text-xs text-muted-foreground max-w-xs text-center">
          Please wait while Barry gets ready. This may take a moment.
        </p>
        <div className="w-48 space-y-2">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-2 w-3/4" />
          <Skeleton className="h-2 w-5/6" />
        </div>
      </div>
    </div>
  );
};

export default AIBotLoader;
