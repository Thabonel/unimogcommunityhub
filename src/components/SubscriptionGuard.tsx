
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSubscription } from '@/hooks/use-subscription';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface SubscriptionGuardProps {
  children: ReactNode;
  redirectTo?: string;
  showUpgradePage?: boolean;
}

export default function SubscriptionGuard({ 
  children, 
  redirectTo = '/login', 
  showUpgradePage = true 
}: SubscriptionGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, isLoading: subscriptionLoading } = useSubscription();
  const location = useLocation();
  const { toast } = useToast();

  // Handle loading state
  if (authLoading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-lg font-medium mb-2">Loading...</h2>
          <p className="text-muted-foreground text-sm">Checking subscription status</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    toast({
      title: "Authentication required",
      description: "Please sign in to access this content",
      variant: "destructive",
    });
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user has an active subscription, show the protected content
  if (hasActiveSubscription()) {
    return <>{children}</>;
  }

  // Otherwise, show the upgrade page or redirect
  if (showUpgradePage) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto p-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <Crown className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Subscription Required</h1>
          <p className="text-muted-foreground mb-6">
            This content is only available to subscribers. Upgrade your membership to access all Unimog Community Hub features.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/pricing">
              <Button className="px-6">
                Upgrade Membership
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Redirect if upgrade page is not shown
  toast({
    title: "Subscription required",
    description: "Please upgrade your membership to access this content",
  });
  return <Navigate to="/pricing" state={{ from: location }} replace />;
}
