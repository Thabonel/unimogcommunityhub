
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface MapErrorDisplayProps {
  error: string;
  onResetToken: () => void;
}

const MapErrorDisplay = ({ error, onResetToken }: MapErrorDisplayProps) => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle>Map Error</AlertTitle>
      <AlertDescription className="mt-2 space-y-4">
        <p>{error}</p>
        <Button variant="outline" size="sm" onClick={onResetToken}>
          Reset Map Token
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default MapErrorDisplay;
