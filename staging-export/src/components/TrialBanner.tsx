
import { useTrial } from '@/hooks/use-trial';
import { useSubscription } from '@/hooks/use-subscription';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';

const TrialBannerContent = () => {
  const { trialStatus, trialData, isLoading: trialLoading } = useTrial();
  const { hasActiveSubscription, isLoading: subscriptionLoading } = useSubscription();
  
  // Handle loading state
  if (trialLoading || subscriptionLoading) {
    return (
      <div className="bg-muted py-1 px-4 text-sm text-center">
        <div className="container flex items-center justify-center gap-2">
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Loading trial status...</span>
        </div>
      </div>
    );
  }
  
  // Don't show banner for users with active subscriptions
  if (hasActiveSubscription()) {
    return null;
  }
  
  // Show different banners based on trial status
  if (trialStatus === 'active' && trialData) {
    return (
      <div className="bg-primary/10 py-1.5 px-4 text-sm text-center">
        <div className="container flex flex-wrap items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
          <span>
            Your free trial is active! {trialData?.daysRemaining} {trialData?.daysRemaining === 1 ? 'day' : 'days'} remaining.
          </span>
          <Link to="/pricing">
            <Button variant="link" size="sm" className="h-auto p-0 text-primary">
              Subscribe now
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  if (trialStatus === 'expired') {
    return (
      <div className="bg-amber-100 py-1.5 px-4 text-sm text-center">
        <div className="container flex flex-wrap items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Your free trial has expired.</span>
          <Link to="/pricing">
            <Button variant="link" size="sm" className="h-auto p-0 text-primary">
              Subscribe now to continue
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return null;
};

export function TrialBanner() {
  return (
    <ErrorBoundary fallback={null}>
      <TrialBannerContent />
    </ErrorBoundary>
  );
}

export default TrialBanner;
