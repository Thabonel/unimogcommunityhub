
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConversionLoadingStateProps {
  timeout?: number; // Optional timeout in ms, defaults to 10000 (10 seconds)
}

export const ConversionLoadingState: React.FC<ConversionLoadingStateProps> = ({ 
  timeout = 10000 
}) => {
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Trial Conversion Funnel</CardTitle>
        <CardDescription>Tracking visitors through trial and subscription</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] flex flex-col items-center justify-center">
        {isTimedOut ? (
          <div className="text-center">
            <Alert variant="warning" className="mb-4">
              <AlertDescription>
                This is taking longer than expected. The server might be experiencing delays.
              </AlertDescription>
            </Alert>
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          </div>
        ) : (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading conversion metrics...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
