
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Map is loading... Features will be available soon.
    </div>
  );
};

export default LoadingState;
