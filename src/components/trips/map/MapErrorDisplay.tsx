
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface MapErrorDisplayProps {
  error: string;
  onResetToken: () => void;
}

const MapErrorDisplay = ({ error, onResetToken }: MapErrorDisplayProps) => {
  const isTokenError = error.toLowerCase().includes('token') || error.toLowerCase().includes('access');
  
  const handleRefresh = () => {
    window.location.reload();
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Map Error
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error Loading Map</AlertTitle>
          <AlertDescription className="mt-2">
            {error}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-4">
          <div className="text-sm space-y-2">
            <h4 className="font-medium">Possible solutions:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {isTokenError && (
                <>
                  <li>Your Mapbox token may be invalid or expired</li>
                  <li>You might need to update your Mapbox account permissions</li>
                </>
              )}
              <li>Check your internet connection</li>
              <li>Try refreshing the page</li>
              <li>Clear your browser cache</li>
              {isTokenError && <li>Reset your token and enter a new one</li>}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Page
        </Button>
        <Button 
          variant="destructive" 
          onClick={onResetToken}
        >
          Reset Map Token
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MapErrorDisplay;
