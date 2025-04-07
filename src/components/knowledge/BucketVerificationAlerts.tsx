
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BucketVerificationAlertsProps {
  bucketError: string | null;
  isVerifying: boolean;
  verificationResult: {success: boolean, message: string} | null;
  onRetry: () => void;
}

export function BucketVerificationAlerts({
  bucketError,
  isVerifying,
  verificationResult,
  onRetry
}: BucketVerificationAlertsProps) {
  return (
    <>
      {bucketError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Storage Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{bucketError}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4"
              onClick={onRetry}
              disabled={isVerifying}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isVerifying ? 'animate-spin' : ''}`} />
              {isVerifying ? 'Checking...' : 'Retry'}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isVerifying && !bucketError && (
        <Alert className="mb-6">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <AlertTitle>Initializing storage...</AlertTitle>
          <AlertDescription>
            Setting up the manuals storage. This will only take a moment.
          </AlertDescription>
        </Alert>
      )}
      
      {verificationResult && verificationResult.success && !isVerifying && (
        <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Storage Ready</AlertTitle>
          <AlertDescription>
            {verificationResult.message}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}
