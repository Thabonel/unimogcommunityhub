
import React from 'react';
import { Wrench, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIBotErrorProps {
  onRetry: () => void;
}

const AIBotError = ({ onRetry }: AIBotErrorProps) => {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-b-lg"
      role="alert"
      aria-live="assertive"
    >
      <div className="text-center p-6">
        <div className="rounded-full bg-red-100 p-3 mx-auto w-fit mb-4">
          <AlertCircle className="h-10 w-10 text-destructive" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium mb-2" id="error-heading">Failed to load Barry</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md">
          There was a problem connecting to Barry. This might be due to network issues or the service being temporarily unavailable.
        </p>
        <div className="space-y-2">
          <Button 
            onClick={onRetry} 
            className="mx-auto"
            aria-labelledby="error-heading"
          >
            <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
            <span>Retry Connection</span>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            If the problem persists, try again later or check your internet connection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIBotError;
