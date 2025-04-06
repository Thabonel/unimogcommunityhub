
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Map, RefreshCcw, Info } from 'lucide-react';

interface MapErrorDisplayProps {
  error: string;
  onResetToken: () => void;
}

const MapErrorDisplay = ({ error, onResetToken }: MapErrorDisplayProps) => {
  const isTokenFormatError = error.includes('public access token') || error.includes('pk.*');
  const isGenericError = error.includes('Unknown error');
  
  // Helper function to suggest solutions based on error type
  const getSuggestion = () => {
    if (isTokenFormatError) {
      return "Please use a public access token that starts with 'pk.' not a secret token that starts with 'sk.'";
    } else if (isGenericError) {
      return "This might be due to an invalid Mapbox token, network connectivity issues, or browser permissions. Try refreshing the page or using a different browser.";
    } else {
      return "This might be due to an invalid Mapbox token or network connectivity issues.";
    }
  };
  
  // Helper function to get troubleshooting steps
  const getTroubleshootingSteps = () => {
    if (isGenericError) {
      return (
        <div className="bg-muted p-3 rounded-md mt-3">
          <p className="text-sm font-medium flex items-center">
            <Info className="h-4 w-4 mr-2 text-primary" />
            Troubleshooting steps:
          </p>
          <ul className="text-xs text-muted-foreground mt-1 list-disc list-inside space-y-1">
            <li>Check your internet connection</li>
            <li>Try using a different Mapbox token</li>
            <li>Ensure your browser allows location access (if needed)</li>
            <li>Try disabling extensions that might block external resources</li>
            <li>Clear your browser cache and reload</li>
          </ul>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <Map className="h-5 w-5" />
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
              
              {isTokenFormatError && (
                <p className="text-sm mt-2 font-medium">
                  You are using a secret token (sk.*) instead of a public token (pk.*).
                  Mapbox GL requires a public token for browser usage.
                </p>
              )}
              
              {getTroubleshootingSteps()}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {getSuggestion()}
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
