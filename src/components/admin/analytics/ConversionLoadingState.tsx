
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ConversionLoadingState: React.FC = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Trial Conversion Funnel</CardTitle>
        <CardDescription>Tracking visitors through trial and subscription</CardDescription>
      </CardHeader>
      <CardContent className="h-[350px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
};
