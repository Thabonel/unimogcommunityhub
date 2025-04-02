
import { AlertCircle, RefreshCw, ShieldAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface VehicleErrorAlertProps {
  error: Error | null;
  onRetry: () => void;
  isAutoRetrying: boolean;
  networkStatus: 'online' | 'offline' | 'checking';
  isNetworkError: boolean;
}

export default function VehicleErrorAlert({ 
  error, 
  onRetry, 
  isAutoRetrying, 
  networkStatus,
  isNetworkError
}: VehicleErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert variant={isNetworkError ? "warning" : "destructive"} className="mb-4">
      {isNetworkError ? (
        <>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span>
              Unable to connect to the server. This could be due to network issues or the server might be temporarily unavailable.
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRetry}
              className="self-end"
              disabled={isAutoRetrying || networkStatus === 'checking'}
            >
              <RefreshCw size={14} className={`mr-1 ${isAutoRetrying || networkStatus === 'checking' ? 'animate-spin' : ''}`} />
              {isAutoRetrying || networkStatus === 'checking' ? 'Checking Connection...' : 'Retry Connection'}
            </Button>
          </AlertDescription>
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>
              {error.message || "Loading Vehicles Failed"}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRetry}
              className="ml-2"
            >
              <RefreshCw size={14} className="mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </>
      )}
    </Alert>
  );
}
