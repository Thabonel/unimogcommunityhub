
import { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MAPBOX_CONFIG } from '@/config/env';

interface EnvironmentTokenAlertProps {
  isChecking: boolean;
  onValidate: () => void;
}

const EnvironmentTokenAlert = ({ isChecking, onValidate }: EnvironmentTokenAlertProps) => {
  const [hasEnvToken, setHasEnvToken] = useState(false);
  
  useEffect(() => {
    // Check if there's a token in environment
    const envTokenExists = !!MAPBOX_CONFIG.accessToken;
    setHasEnvToken(envTokenExists);
  }, []);
  
  if (!hasEnvToken) {
    return null; // Don't show anything if no env token
  }
  
  if (isChecking) {
    return (
      <Alert className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        <AlertTitle>Checking environment token</AlertTitle>
        <AlertDescription>
          Validating the Mapbox token from your environment...
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertTitle>Environment token available</AlertTitle>
      <AlertDescription className="flex flex-col">
        <p className="mb-2">
          A Mapbox token is available in your environment. You can use it directly.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="self-start" 
          onClick={onValidate}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Use environment token
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default EnvironmentTokenAlert;
