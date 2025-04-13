
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface FiresErrorAlertProps {
  error: string;
  handleRefresh: () => void;
}

export const FiresErrorAlert = ({ error, handleRefresh }: FiresErrorAlertProps) => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error Loading Fire Data</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>{error}</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          className="self-start"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};
