
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertCircle, MapPin } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { validateMapboxToken } from './mapConfig';

interface MapTokenInputProps {
  onTokenSave: (token: string) => void;
}

const MapTokenInput = ({ onTokenSave }: MapTokenInputProps) => {
  const [token, setToken] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setValidationError('Please enter a Mapbox Access Token');
      return;
    }
    
    // Reset validation state
    setIsValidating(true);
    setValidationError(null);
    
    try {
      // Validate the provided token
      const isValid = await validateMapboxToken(token);
      
      if (isValid) {
        onTokenSave(token);
      } else {
        setValidationError('The token appears to be invalid. Please check and try again.');
      }
    } catch (error) {
      setValidationError('Error validating token. Please try again.');
      console.error('Token validation error:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Mapbox Access Token Required
        </CardTitle>
        <CardDescription>
          To display maps, we need your Mapbox access token.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mapbox-token">Mapbox Access Token</Label>
            <Input
              id="mapbox-token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Mapbox access token"
              className="w-full"
              disabled={isValidating}
            />
            <p className="text-xs text-muted-foreground">
              You can get a free token by signing up at{' '}
              <a 
                href="https://mapbox.com/signup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          
          <Button 
            type="submit" 
            className="w-full mt-4" 
            disabled={isValidating || !token.trim()}
          >
            {isValidating ? 'Validating...' : 'Save Token'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-xs text-muted-foreground">
          Your token will be saved in your browser and only used to access Mapbox services.
        </p>
      </CardFooter>
    </Card>
  );
};

export default MapTokenInput;
