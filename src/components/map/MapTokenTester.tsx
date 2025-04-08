
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateAndTestCurrentToken } from '../trips/map/utils/tokenUtils';

interface MapTokenTesterProps {
  className?: string;
}

const MapTokenTester = ({ className }: MapTokenTesterProps) => {
  const [testingToken, setTestingToken] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Test the token when requested
  const handleTestToken = async () => {
    setTestingToken(true);
    try {
      const isValid = await validateAndTestCurrentToken();
      setTokenValid(isValid);
    } finally {
      setTestingToken(false);
    }
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleTestToken}
        disabled={testingToken}
      >
        {testingToken ? 'Testing...' : 'Test Mapbox Token'}
      </Button>
      
      {tokenValid !== null && (
        <span className={cn(
          "flex items-center text-sm",
          tokenValid ? "text-green-600" : "text-red-600"
        )}>
          {tokenValid ? (
            <>
              <Check className="h-4 w-4 mr-1" />
              Token valid
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 mr-1" />
              Token invalid
            </>
          )}
        </span>
      )}
    </div>
  );
};

export default MapTokenTester;
