
import React from 'react';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AIBotErrorProps {
  onRetry: () => void;
}

const AIBotError = ({ onRetry }: AIBotErrorProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-b-lg">
      <div className="text-center p-6">
        <Wrench className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Failed to load Barry</h3>
        <p className="text-sm text-muted-foreground mb-4">
          There was a problem connecting to Barry. Please try again.
        </p>
        <Button onClick={onRetry} className="mx-auto">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default AIBotError;
