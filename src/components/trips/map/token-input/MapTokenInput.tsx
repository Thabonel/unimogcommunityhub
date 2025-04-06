
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, MapPin, Info } from 'lucide-react';
import { saveMapboxToken, isTokenFormatValid } from '../utils/tokenUtils';
import { MAPBOX_CONFIG } from '@/config/env';

interface MapTokenInputProps {
  onTokenSave: (token: string) => void;
}

const MapTokenInput = ({ onTokenSave }: MapTokenInputProps) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  
  const handleTokenSave = () => {
    if (!token.trim()) {
      setError('Please enter a Mapbox access token');
      return;
    }
    
    if (!isTokenFormatValid(token)) {
      setError('Token format appears invalid. Mapbox tokens typically start with "pk."');
      // Allow continue anyway
    } else {
      setError(null);
    }
    
    // Save token to localStorage
    saveMapboxToken(token);
    onTokenSave(token);
  };
  
  const handleUseEnvToken = () => {
    const envToken = MAPBOX_CONFIG.accessToken;
    if (!envToken) {
      setError('No environment token available');
      return;
    }
    
    saveMapboxToken(envToken);
    onTokenSave(envToken);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Mapbox Access Token Required
        </CardTitle>
        <CardDescription>
          Please enter your Mapbox access token to enable maps
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Input
            placeholder="Enter your Mapbox token (starts with 'pk.')"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="font-mono text-sm"
          />
          
          <div className="flex justify-end">
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setShowHelp(!showHelp)}
            >
              <Info className="h-3 w-3 mr-1" />
              {showHelp ? 'Hide help' : 'How to get a token?'}
            </Button>
          </div>
        </div>
        
        {showHelp && (
          <Alert className="text-sm bg-muted">
            <div className="space-y-2">
              <p>To get a Mapbox access token:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2 text-xs">
                <li>Sign up/login at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a></li>
                <li>Go to your Account page</li>
                <li>Navigate to Access Tokens</li>
                <li>Copy an existing token or create a new one</li>
                <li>Make sure the token has the necessary scopes for map functionality</li>
              </ol>
            </div>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
        {MAPBOX_CONFIG.accessToken && (
          <Button 
            variant="outline" 
            onClick={handleUseEnvToken}
          >
            Use Default Token
          </Button>
        )}
        <Button 
          onClick={handleTokenSave}
          disabled={!token.trim()}
        >
          Save Token & Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MapTokenInput;
