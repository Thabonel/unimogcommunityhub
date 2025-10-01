
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface InitializingStateProps {
  onForceInitialize: () => void;
}

const InitializingState = ({ onForceInitialize }: InitializingStateProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Initializing map layers...
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={onForceInitialize}
      >
        Force Initialize Layers
      </Button>
    </div>
  );
};

export default InitializingState;
