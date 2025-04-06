
import React from 'react';
import { RefreshCw } from 'lucide-react';

const AIBotLoader = () => {
  return (
    <div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-b-lg"
    >
      <RefreshCw className="h-8 w-8 text-primary animate-spin mb-4" />
      <p className="text-sm text-muted-foreground">Loading Barry...</p>
    </div>
  );
};

export default AIBotLoader;
