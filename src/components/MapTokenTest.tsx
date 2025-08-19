
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { validateAndTestCurrentToken, getActiveToken, isTokenFormatValid } from './trips/map/utils/tokenUtils';
import { MAPBOX_CONFIG } from '@/config/env';

const MapTokenTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean; message: string} | null>(null);
  const token = getActiveToken();
  
  const runTokenTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      if (!token) {
        setTestResult({
          success: false,
          message: 'No Mapbox token found in environment or localStorage'
        });
        return;
      }
      
      // Check format first
      if (!isTokenFormatValid(token)) {
        setTestResult({
          success: false,
          message: `Token format is invalid. Using secret token (sk.*) instead of public token (pk.*)`
        });
        return;
      }
      
      // Test if it works
      const isValid = await validateAndTestCurrentToken();
      
      if (isValid) {
        setTestResult({
          success: true,
          message: 'Token is valid and working correctly!'
        });
      } else {
        setTestResult({
          success: false,
          message: 'Token validation failed. The token may be invalid or expired.'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error during token test: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card className="max-w-lg mx-auto my-6">
      <CardHeader>
        <CardTitle>Mapbox Token Test</CardTitle>
        <CardDescription>
          Verify if your Mapbox token is working correctly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm font-medium">Current Token</p>
          <p className="font-mono text-xs break-all mt-1">
            {token ? (
              <>
                {token.substring(0, 8)}...{token.substring(token.length - 8)}
                {!isTokenFormatValid(token) && (
                  <span className="ml-2 text-red-500">(Invalid format: should start with pk.*)</span>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">No token available</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Token source: {token === MAPBOX_CONFIG.accessToken ? 'Environment variable' : 'localStorage'}
          </p>
        </div>
        
        {testResult && (
          <div className={`p-4 rounded-md ${testResult.success ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
            <div className="flex items-start gap-3">
              {testResult.success ? (
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${testResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {testResult.success ? 'Success!' : 'Error'}
                </p>
                <p className="text-sm mt-1">
                  {testResult.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={runTokenTest} 
          disabled={isTesting}
          className="w-full"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Mapbox Token'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MapTokenTest;
