
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span className="text-sm text-muted-foreground">Loading models...</span>
    </div>
  );
};

export default LoadingState;
