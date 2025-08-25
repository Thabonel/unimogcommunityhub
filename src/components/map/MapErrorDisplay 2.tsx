
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MapErrorDisplayProps {
  error: string;
}

const MapErrorDisplay = ({ error }: MapErrorDisplayProps) => {
  return (
    <Alert variant="destructive" className="absolute top-4 left-4 right-4 z-50">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default MapErrorDisplay;
