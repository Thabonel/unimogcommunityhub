
import { useState, useEffect, useRef } from 'react';
import { validateMapboxToken, hasMapboxToken } from '../mapConfig';
import { toast } from 'sonner';

/**
 * Hook for handling Mapbox token validation
 */
export const useMapValidation = () => {
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didValidateTokenRef = useRef(false);
  
  // Check if token exists
  const tokenExists = hasMapboxToken();
  
  // Validate token
  useEffect(() => {
    let isMounted = true;
    
    const validateToken = async () => {
      if (tokenExists && isMounted && !didValidateTokenRef.current) {
        didValidateTokenRef.current = true;
        setIsValidatingToken(true);
        try {
          const isValid = await validateMapboxToken();
          if (!isValid && isMounted) {
            const errorMsg = 'Mapbox token validation failed. Map may not display correctly.';
            console.warn(errorMsg);
            setError(errorMsg);
            toast.warning('Your Mapbox token may be invalid. Map functionality might be limited.');
          }
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Error validating token';
          console.error('Error validating token:', err);
          if (isMounted) setError(errorMsg);
        } finally {
          if (isMounted) setIsValidatingToken(false);
        }
      }
    };
    
    validateToken();
    
    return () => {
      isMounted = false;
    };
  }, [tokenExists]);
  
  return {
    isValidatingToken,
    tokenExists,
    error
  };
};
