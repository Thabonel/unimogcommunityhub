import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

/**
 * Production-ready error fallback component with better UX
 * Provides clear messaging and recovery actions
 */
function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.DEV;

  useEffect(() => {
    // Log error to console in development
    if (isDevelopment) {
      console.error('Error Boundary Caught:', error);
    }

    // In production, you would send this to an error tracking service
    if (!isDevelopment && typeof window !== 'undefined') {
      // Example: Send to error tracking service
      // logErrorToService(error);
    }
  }, [error, isDevelopment]);

  const handleGoHome = () => {
    resetErrorBoundary();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          
          <p className="text-gray-600 mb-6">
            We're sorry, but something unexpected happened. Please try refreshing the page or going back to the homepage.
          </p>

          {/* Show error details only in development */}
          {isDevelopment && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-48">
                {error.message}
                {error.stack && '\n\nStack trace:\n' + error.stack}
              </pre>
            </details>
          )}

          <div className="flex gap-3 justify-center">
            <Button
              onClick={resetErrorBoundary}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            
            <Button
              onClick={handleGoHome}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>

          <p className="mt-6 text-xs text-gray-500">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

interface EnhancedErrorBoundaryProps {
  children: React.ReactNode;
  fallbackComponent?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

/**
 * Enhanced error boundary wrapper with better error handling
 * Use this to wrap major sections of your app
 */
export function EnhancedErrorBoundary({ 
  children, 
  fallbackComponent = ErrorFallback,
  onError 
}: EnhancedErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={fallbackComponent}
      onError={(error, errorInfo) => {
        // Log to console in development
        if (import.meta.env.DEV) {
          console.error('ErrorBoundary caught:', error, errorInfo);
        }

        // Call custom error handler if provided
        if (onError) {
          onError(error, errorInfo);
        }

        // In production, log to error service
        if (!import.meta.env.DEV) {
          // Example: Send to Sentry or other error tracking
          // Sentry.captureException(error, { extra: errorInfo });
        }
      }}
      onReset={() => {
        // Clear any error state
        window.location.hash = '';
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export default EnhancedErrorBoundary;