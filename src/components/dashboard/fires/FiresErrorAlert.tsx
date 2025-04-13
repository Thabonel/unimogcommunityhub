
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface FiresErrorAlertProps {
  error: Error | string;
  onRetry: () => void;
}

export const FiresErrorAlert = ({ error, onRetry }: FiresErrorAlertProps) => {
  const errorMessage = error instanceof Error ? error.message : error;
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex justify-between items-center">
        <span>{errorMessage}</span>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={onRetry}
          className="ml-2"
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};
