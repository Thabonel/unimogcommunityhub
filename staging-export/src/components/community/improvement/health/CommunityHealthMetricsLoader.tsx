
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommunityHealthMetrics } from '@/services/analytics/types/communityHealthTypes';

interface LoadingProps {
  onRetry: () => void;
}

export function LoadingState() {
  return (
    <div className="py-8 flex items-center justify-center">
      <RefreshCw className="h-6 w-6 animate-spin" />
      <span className="ml-2">Loading metrics...</span>
    </div>
  );
}

export function ErrorState({ onRetry }: LoadingProps) {
  return (
    <div className="py-8 text-center">
      <p>Failed to load community metrics</p>
      <Button 
        variant="outline" 
        className="mt-4" 
        onClick={onRetry}
      >
        Try Again
      </Button>
    </div>
  );
}
