
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapOff, RefreshCcw } from 'lucide-react';

interface MapErrorDisplayProps {
  error: string;
  onResetToken: () => void;
}

const MapErrorDisplay = ({ error, onResetToken }: MapErrorDisplayProps) => {
  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <MapOff className="h-5 w-5" />
          Map Error
        </CardTitle>
        <CardDescription>
          There was a problem initializing the map.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-destructive/10 p-4 rounded-md mb-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Error Details</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          This might be due to an invalid Mapbox token or network connectivity issues.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          variant="outline"
          className="w-full" 
          onClick={onResetToken}
          size="sm"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reset Map Token
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2">
          Resetting the token will allow you to enter a new one.
        </p>
      </CardFooter>
    </Card>
  );
};

export default MapErrorDisplay;
