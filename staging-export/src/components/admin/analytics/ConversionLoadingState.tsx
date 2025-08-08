
import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface ConversionLoadingStateProps {
  timeout?: number; // Optional timeout in ms, defaults to 10000 (10 seconds)
  onRetry?: () => void; // Optional retry callback
  dataUpdatedAt?: number | null; // Optional timestamp when data was last fetched
}

export const ConversionLoadingState: React.FC<ConversionLoadingStateProps> = ({ 
  timeout = 15000, // Increased timeout to 15 seconds from 10 seconds
  onRetry,
  dataUpdatedAt
}) => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  // Function to handle retry logic
  const handleRetry = useCallback(() => {
    setIsTimedOut(false);
    setLoadingTime(0);
    setProgress(0);
    
    if (onRetry) {
      toast({
        title: "Retrying",
        description: "Attempting to fetch conversion metrics again"
      });
      onRetry();
    }
  }, [onRetry, toast]);

  // Progress bar and timeout effect
  useEffect(() => {
    if (isTimedOut) return; // Don't start timer if already timed out
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / timeout) * 100, 100);
      setProgress(newProgress);
      setLoadingTime(Math.floor(elapsed / 1000));
      
      if (elapsed >= timeout && !isTimedOut) {
        setIsTimedOut(true);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [timeout, isTimedOut]);
  
  // When data was last fetched message
  const lastUpdatedMessage = dataUpdatedAt ? (
    <p className="text-xs text-muted-foreground mt-2">
      <Clock className="inline h-3 w-3 mr-1" />
      Last data: {new Date(dataUpdatedAt).toLocaleTimeString()}
    </p>
  ) : null;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Trial Conversion Funnel</CardTitle>
        <CardDescription>Tracking visitors through trial and subscription</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] flex flex-col items-center justify-center">
        {isTimedOut ? (
          <div className="text-center max-w-md">
            <Alert variant="warning" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                This is taking longer than expected. The server might be experiencing delays. 
                (Waited for {loadingTime} seconds)
              </AlertDescription>
            </Alert>
            <div className="flex items-center justify-center mt-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
              <span className="text-muted-foreground">Still trying...</span>
            </div>
            {lastUpdatedMessage}
            {onRetry && (
              <Button 
                onClick={handleRetry}
                className="mt-4"
                variant="outline"
                disabled={loadingTime < 5} // Prevent rapid retries
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Now
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center w-full max-w-xs">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4 mx-auto" />
            <p className="text-muted-foreground">Loading conversion metrics...</p>
            <div className="mt-4 w-full">
              <Progress value={progress} className="h-1 w-full" />
              <p className="text-xs text-muted-foreground mt-2">{loadingTime}s elapsed</p>
            </div>
            {lastUpdatedMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
