
import { useState, useEffect, useRef } from 'react';
import { validateMapboxToken, hasMapboxToken } from '../mapConfig';
import { toast } from 'sonner';

/**
 * Hook for handling Mapbox token validation
 */
export const useMapValidation = () => {
  const [isValidatingToken, setIsValidatingToken] = useState(false);
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
            console.warn('Mapbox token validation failed. Map may not display correctly.');
            toast.warning('Your Mapbox token may be invalid. Map functionality might be limited.');
          }
        } catch (err) {
          console.error('Error validating token:', err);
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
    tokenExists
  };
};
