
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Map, RefreshCcw, Info, Globe, Loader, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { isMapboxSupported } from './utils/tokenUtils';

interface MapErrorDisplayProps {
  error: string;
  onResetToken: () => void;
}

const MapErrorDisplay = ({ error, onResetToken }: MapErrorDisplayProps) => {
  const [isCheckingBrowser, setIsCheckingBrowser] = useState(false);
  const [browserCompatible, setBrowserCompatible] = useState<boolean | null>(null);
  
  // Check if the error is token related
  const isTokenError = error.includes('access token') || 
                      error.includes('401') || 
                      error.includes('pk.*') ||
                      error.includes('token');
  
  // Check if error is related to container dimensions
  const isDimensionError = error.includes('container') || error.includes('dimensions');
  
  // Check if it's a generic unknown error
  const isGenericError = error.includes('Unknown error');
  
  // Check browser compatibility
  const checkBrowserCompatibility = () => {
    setIsCheckingBrowser(true);
    
    // Short delay to simulate checking
    setTimeout(() => {
      const isSupported = isMapboxSupported();
      setBrowserCompatible(isSupported);
      setIsCheckingBrowser(false);
    }, 500);
  };
  
  // Helper function to suggest solutions based on error type
  const getSuggestion = () => {
    if (isTokenError) {
      return "Please use a valid Mapbox public access token that starts with 'pk.' and ensure it has the required scopes.";
    } else if (isDimensionError) {
      return "The map container has invalid dimensions. Try resizing your browser window or check if the map container is hidden.";
    } else if (isGenericError) {
      return "This might be due to an invalid Mapbox token, network connectivity issues, or browser permissions. Try refreshing the page or using a different browser.";
    } else {
      return "This might be related to network connectivity issues or browser compatibility. Try refreshing the page or check console for specific errors.";
    }
  };
  
  // Helper function to get troubleshooting steps
  const getTroubleshootingSteps = () => {
    if (isGenericError || !isTokenError) {
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
            <li>Check browser console for specific error messages</li>
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
              
              {isTokenError && (
                <p className="text-sm mt-2 font-medium">
                  This appears to be a token-related issue. Make sure you're using a valid public token.
                </p>
              )}
              
              {getTroubleshootingSteps()}
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          {getSuggestion()}
        </p>
        
        {!isTokenError && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={checkBrowserCompatibility}
              disabled={isCheckingBrowser}
            >
              {isCheckingBrowser ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Checking Browser Compatibility...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4 mr-2" />
                  Check Browser Compatibility
                </>
              )}
            </Button>
            
            {browserCompatible !== null && (
              <div className={`mt-2 p-2 rounded text-sm ${browserCompatible ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {browserCompatible 
                  ? 'Your browser supports Mapbox GL. The issue is likely not browser-related.' 
                  : 'Your browser does not fully support Mapbox GL. Try using a different browser.'}
              </div>
            )}
          </div>
        )}
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
        
        <a 
          href="https://docs.mapbox.com/help/troubleshooting/mapbox-gl-js-common-issues/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button 
            variant="ghost"
            className="w-full text-xs"
            size="sm"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Mapbox Troubleshooting Guide
          </Button>
        </a>
        
        <p className="text-xs text-muted-foreground mt-2">
          Resetting the token will allow you to enter a new one.
        </p>
      </CardFooter>
    </Card>
  );
};

export default MapErrorDisplay;
