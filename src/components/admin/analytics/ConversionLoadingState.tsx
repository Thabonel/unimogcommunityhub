
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      <CardContent className="h-[350px] flex items-center justify-center">
        {isTimedOut ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Taking longer than expected</p>
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          </div>
        ) : (
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        )}
      </CardContent>
    </Card>
  );
};
