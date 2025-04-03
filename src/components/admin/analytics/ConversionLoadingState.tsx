
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ConversionLoadingStateProps {
  timeout?: number; // Optional timeout in ms, defaults to 10000 (10 seconds)
  onRetry?: () => void; // Optional retry callback
}

export const ConversionLoadingState: React.FC<ConversionLoadingStateProps> = ({ 
  timeout = 10000,
  onRetry 
}) => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [loadingTime, setLoadingTime] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const startTime = Date.now();
    const timer = setTimeout(() => {
      setIsTimedOut(true);
      setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  const handleRetry = () => {
    setIsTimedOut(false);
    setLoadingTime(0);
    
    if (onRetry) {
      toast({
        title: "Retrying",
        description: "Attempting to fetch conversion metrics again"
      });
      onRetry();
    }
  };

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
            {onRetry && (
              <Button 
                onClick={handleRetry}
                className="mt-4"
                variant="outline"
              >
                Retry Now
              </Button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading conversion metrics...</p>
            <p className="text-xs text-muted-foreground mt-2">This may take a moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
