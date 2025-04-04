
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { saveMapboxToken, validateMapboxToken } from './mapConfig';
import { Map, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MapTokenInputProps {
  onTokenSave: (token: string) => void;
}

const MapTokenInput = ({ onTokenSave }: MapTokenInputProps) => {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [validationMessage, setValidationMessage] = useState('');

  // Basic client-side validation of token format
  const isValidTokenFormat = (token: string) => {
    return token.startsWith('pk.') && token.length > 20;
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    setValidationStatus('idle');
    setValidationMessage('');
  };

  const validateToken = async () => {
    if (!token.trim()) return;
    
    // First check token format
    if (!isValidTokenFormat(token.trim())) {
      setValidationStatus('invalid');
      setValidationMessage('Token format appears invalid. Mapbox tokens typically start with "pk."');
      return;
    }
    
    setValidationStatus('validating');
    setValidationMessage('Validating token...');
    
    try {
      // Test if token works by trying to create a map
      const isValid = await validateMapboxToken();
      
      if (isValid) {
        setValidationStatus('valid');
        setValidationMessage('Token validated successfully!');
      } else {
        setValidationStatus('invalid');
        setValidationMessage('Token validation failed. Please check your token and try again.');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setValidationStatus('invalid');
      setValidationMessage('Error validating token. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!token.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Validate token format first
      if (!isValidTokenFormat(token.trim())) {
        toast.warning('Token format appears invalid. Map functionality may not work correctly.');
      }
      
      // Attempt to validate token
      const isValid = await validateMapboxToken();
      
      if (!isValid) {
        if (!confirm('The token could not be validated. Continue anyway?')) {
          setIsSubmitting(false);
          return;
        }
      }
      
      saveMapboxToken(token.trim());
      onTokenSave(token.trim());
      toast.success('Mapbox token saved successfully');
    } catch (err) {
      console.error('Error saving token:', err);
      toast.error('Failed to save token. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-6 w-6" />
          Map Configuration Required
        </CardTitle>
        <CardDescription>
          Please enter your Mapbox access token to enable map functionality.
          You can get one for free from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            After signing up, go to your Mapbox account and copy your default public token from the Access Tokens section.
          </p>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="pk.eyJ1Ijoi..."
                value={token}
                onChange={handleTokenChange}
                className="font-mono flex-1"
              />
              <Button 
                variant="outline" 
                onClick={validateToken}
                disabled={!token.trim() || validationStatus === 'validating'}
              >
                Validate
              </Button>
            </div>
            
            {validationStatus !== 'idle' && (
              <Alert variant={validationStatus === 'valid' ? 'default' : 'destructive'}>
                {validationStatus === 'valid' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {validationMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={!token.trim() || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Token'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MapTokenInput;
