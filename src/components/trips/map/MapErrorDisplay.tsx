
import { AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MapErrorDisplayProps {
  error: string;
  onResetToken: () => void;
}

const MapErrorDisplay = ({ error, onResetToken }: MapErrorDisplayProps) => {
  return (
    <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
          <p className="font-medium">Map Loading Error</p>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {error || "Failed to load map. Please check your Mapbox access token."}
        </p>
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Common solutions:</p>
          <ul className="text-xs text-muted-foreground list-disc list-inside">
            <li>Make sure your token is valid and has the correct permissions</li>
            <li>Check your internet connection</li>
            <li>Try using a different browser</li>
          </ul>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={onResetToken}
          className="self-start"
        >
          Enter New Token
        </Button>
      </div>
    </Card>
  );
};

export default MapErrorDisplay;
