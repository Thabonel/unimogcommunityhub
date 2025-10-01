
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import MapStateContent from './MapStateContent';

interface TopographicalContentProps {
  mapLoaded: boolean;
  layersInitialized: boolean;
  visibleLayers: Record<string, boolean>;
  onForceInitialize: () => void;
  onToggleLayer: (layerId: string) => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <Alert variant="destructive">
    <AlertDescription className="flex flex-col space-y-2">
      <div className="text-sm">Failed to load terrain layers: {error.message}</div>
      <Button 
        variant="outline" 
        size="sm" 
        className="self-start"
        onClick={resetErrorBoundary}
      >
        <RefreshCw className="h-3 w-3 mr-1" /> Try Again
      </Button>
    </AlertDescription>
  </Alert>
);

const TopographicalContent = ({
  mapLoaded,
  layersInitialized,
  visibleLayers,
  onForceInitialize,
  onToggleLayer
}: TopographicalContentProps) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        console.log('Error boundary reset in TopographicalContent');
        // Optionally force initialization when error boundary is reset
        onForceInitialize();
      }}
    >
      <MapStateContent
        mapLoaded={mapLoaded}
        layersInitialized={layersInitialized}
        visibleLayers={visibleLayers}
        onForceInitialize={onForceInitialize}
        onToggleLayer={onToggleLayer}
      />
    </ErrorBoundary>
  );
};

export default TopographicalContent;
