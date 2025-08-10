/**
 * Auth Loading Indicator
 * Shows loading state during authentication operations instead of errors
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

interface AuthLoadingIndicatorProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AuthLoadingIndicator: React.FC<AuthLoadingIndicatorProps> = ({
  message = 'Loading...',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <span className="text-sm text-muted-foreground">{message}</span>
    </div>
  );
};

export default AuthLoadingIndicator;