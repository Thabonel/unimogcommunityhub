
import React from 'react';
import MapTokenInput from './token-input/MapTokenInput';
import { hasMapboxToken } from './mapConfig';

interface TokenInputProps {
  onTokenSave: (token: string) => void;
}

/**
 * Token input component that provides a UI for entering a Mapbox token.
 * Used when no token is available in localStorage or environment variables.
 */
const TokenInput = ({ onTokenSave }: TokenInputProps) => {
  // Check if a token exists
  const hasToken = hasMapboxToken();
  
  if (hasToken) {
    return null;
  }
  
  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <MapTokenInput onTokenSave={onTokenSave} />
    </div>
  );
};

export default TokenInput;
