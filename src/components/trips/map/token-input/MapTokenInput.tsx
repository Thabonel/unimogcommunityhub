
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';
import { MAPBOX_CONFIG } from '@/config/env';
import CardDescription from './CardDescription';
import TokenValidationField from './TokenValidationField';
import EnvironmentTokenAlert from './EnvironmentTokenAlert';

interface MapTokenInputProps {
  onTokenSave: (token: string) => void;
}

const MapTokenInput = ({ onTokenSave }: MapTokenInputProps) => {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');
  const [validationMessage, setValidationMessage] = useState('');
  const [isCheckingEnvToken, setIsCheckingEnvToken] = useState(false);

  // Load env token on component mount
  useEffect(() => {
    const envToken = MAPBOX_CONFIG.accessToken;
    if (envToken) {
      console.log('Found environment token, setting as default');
      setToken(envToken);
      // Automatically validate environment token on load
      validateEnvironmentToken();
    }
  }, []);

  const handleTokenChange = (newToken: string) => {
    setToken(newToken);
    setValidationStatus('idle');
    setValidationMessage('');
  };

  const validateEnvironmentToken = async () => {
    const envToken = MAPBOX_CONFIG.accessToken;
    
    if (!envToken) {
      return;
    }
    
    setIsCheckingEnvToken(true);
    setToken(envToken);
    
    try {
      const { isValid, message } = await validateToken(envToken);
      setValidationStatus(isValid ? 'valid' : 'invalid');
      setValidationMessage(message);
    } finally {
      setIsCheckingEnvToken(false);
    }
  };

  const validateToken = async (tokenToValidate: string) => {
    // Import functions dynamically to avoid circular dependencies
    const { saveMapboxToken, validateMapboxToken, isTokenFormatValid } = await import('../mapConfig');
    
    if (!tokenToValidate.trim()) {
      return { isValid: false, message: 'Token cannot be empty' };
    }
    
    // First check token format
    if (!isTokenFormatValid(tokenToValidate.trim())) {
      return { 
        isValid: false, 
        message: 'Token format appears invalid. Mapbox tokens typically start with "pk."' 
      };
    }
    
    // Save token temporarily for validation
    saveMapboxToken(tokenToValidate.trim());
    
    // Test if token works by trying to validate
    const isValid = await validateMapboxToken();
    
    if (isValid) {
      return { isValid: true, message: 'Token validated successfully!' };
    } else {
      return { 
        isValid: false, 
        message: 'Token validation failed. Please check your token and try again.' 
      };
    }
  };

  const handleValidate = async () => {
    setValidationStatus('validating');
    setValidationMessage('Validating token...');
    
    try {
      const { isValid, message } = await validateToken(token);
      setValidationStatus(isValid ? 'valid' : 'invalid');
      setValidationMessage(message);
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
      // Import functions dynamically to avoid circular dependencies
      const { saveMapboxToken, validateMapboxToken, isTokenFormatValid } = await import('../mapConfig');
      
      // Validate token format first
      const isValidFormat = isTokenFormatValid(token.trim());
      
      // Attempt to validate token
      saveMapboxToken(token.trim());
      const isValid = await validateMapboxToken();
      
      if (!isValid) {
        if (!confirm('The token could not be validated. Continue anyway?')) {
          setIsSubmitting(false);
          return;
        }
      }
      
      onTokenSave(token.trim());
    } catch (err) {
      console.error('Error saving token:', err);
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
        <CardDescription />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            After signing up, go to your Mapbox account and copy your default public token from the Access Tokens section.
          </p>
          
          {MAPBOX_CONFIG.accessToken && (
            <EnvironmentTokenAlert 
              isChecking={isCheckingEnvToken} 
              onValidate={validateEnvironmentToken} 
            />
          )}
          
          <TokenValidationField
            token={token}
            onTokenChange={handleTokenChange}
            validationStatus={validationStatus}
            validationMessage={validationMessage}
            onValidate={handleValidate}
          />
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
