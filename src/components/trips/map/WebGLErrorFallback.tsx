import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebGLErrorFallbackProps {
  error?: string;
  onRetry?: () => void;
}

const WebGLErrorFallback: React.FC<WebGLErrorFallbackProps> = ({ 
  error = 'WebGL is not available', 
  onRetry 
}) => {
  const handleRefresh = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Map Cannot Load</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <h3 className="font-semibold text-lg">How to fix this issue:</h3>
          
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="font-semibold">1.</span>
              <span>Try refreshing the page</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">2.</span>
              <span>Check if hardware acceleration is enabled in your browser</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">3.</span>
              <span>Try a different browser (Chrome, Firefox, or Safari recommended)</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">4.</span>
              <span>Clear your browser cache and cookies</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">5.</span>
              <span>Disable browser extensions that might interfere with WebGL</span>
            </li>
          </ol>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleRefresh}
              className="flex-1"
              variant="default"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
            
            <Button
              onClick={() => window.open('https://get.webgl.org/troubleshooting/', '_blank')}
              className="flex-1"
              variant="outline"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              WebGL Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebGLErrorFallback;