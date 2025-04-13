
import { useTrial } from '@/hooks/use-trial';
import { useSubscription } from '@/hooks/use-subscription';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function TrialBanner() {
  try {
    const { trialStatus, trialData } = useTrial();
    const { hasActiveSubscription } = useSubscription();
    
    // Don't show banner for users with active subscriptions
    if (hasActiveSubscription()) {
      return null;
    }
    
    // Show different banners based on trial status
    if (trialStatus === 'active') {
      return (
        <div className="bg-primary/10 py-2 px-4 text-sm text-center">
          <div className="container flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
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
        <div className="bg-amber-100 py-2 px-4 text-sm text-center">
          <div className="container flex items-center justify-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600" />
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
  } catch (error) {
    // Silently fail if we're outside an auth context
    console.log("Error rendering TrialBanner:", error);
    return null;
  }
}

export default TrialBanner;
