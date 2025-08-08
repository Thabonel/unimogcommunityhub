
import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AdminSetup from './admin/AdminSetup';
import { useToast } from '@/hooks/use-toast';
import { useAdminStatus } from '@/hooks/use-admin-status';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/use-subscription';
import { useTrial } from '@/hooks/use-trial';
import { Card } from '@/components/ui/card';
import { Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

interface SubscriptionGuardProps {
  children: ReactNode;
  redirectTo?: string;
  showUpgradePage?: boolean;
  allowTrial?: boolean; // New prop to indicate if trial users should be allowed
}

export default function SubscriptionGuard({ 
  children, 
  redirectTo = '/login', 
  showUpgradePage = true,
  allowTrial = true
}: SubscriptionGuardProps) {
  const { user, isLoading: authLoading } = useAuth();  // Changed loading to isLoading
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin, isLoading: isCheckingAdmin, error: adminError } = useAdminStatus(user);
  const { hasActiveSubscription, isLoading: subscriptionLoading, error: subscriptionError } = useSubscription();
  const { trialStatus, trialData, isLoading: trialLoading } = useTrial();
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [secondsWaiting, setSecondsWaiting] = useState(0);
  const [forceContinue, setForceContinue] = useState(false);

  // Check if this is the master user or admin for bypassing checks
  const isMasterUser = user?.email === 'master@development.com';
  const isOwner = user?.email === 'thabonel0@gmail.com'; // Site owner
  
  // Check if user has free lifetime access (set by admin)
  const [hasFreeAccess, setHasFreeAccess] = useState(false);
  
  useEffect(() => {
    const checkFreeAccess = async () => {
      if (!user) return;
      
      // Check if user has free lifetime access in their profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('has_free_access, subscription_type')
        .eq('id', user.id)
        .single();
        
      if (profile?.has_free_access || profile?.subscription_type === 'lifetime_free') {
        setHasFreeAccess(true);
      }
    };
    
    checkFreeAccess();
  }, [user]);

  // Show error toast if checks fail
  useEffect(() => {
    if (adminError) {
      // Don't show error for admins
      if (!isAdmin && !isOwner) {
        toast({
          title: "Admin verification error",
          description: "Failed to verify admin privileges. Using fallback mode.",
          variant: "destructive",
        });
      }
    }
    
    if (subscriptionError) {
      // Don't show error for admins
      if (!isAdmin && !isOwner) {
        toast({
          title: "Subscription verification error",
          description: "Failed to verify subscription status. Please try again later.",
          variant: "destructive",
        });
      }
    }
  }, [adminError, subscriptionError, toast, isAdmin, isOwner]);

  // Set a timeout to prevent infinite loading and add a seconds counter
  useEffect(() => {
    const isLoading = authLoading || isCheckingAdmin || subscriptionLoading || trialLoading;
    
    // Don't set timer if master user or if already forced to continue
    if (isLoading && !isMasterUser && !forceContinue) {
      const interval = setInterval(() => {
        setSecondsWaiting(prev => {
          const newValue = prev + 1;
          if (newValue >= 3) {  // Timeout after 3 seconds
            setTimeoutReached(true);
            clearInterval(interval);
          }
          return newValue;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
    
    // Reset counter if loading completes
    if (!isLoading) {
      setSecondsWaiting(0);
    }
  }, [authLoading, isCheckingAdmin, subscriptionLoading, trialLoading, isMasterUser, forceContinue]);

  // Force bypass loading state after user interaction
  const handleForceContinue = () => {
    setForceContinue(true);
    setTimeoutReached(true);
  };

  // If timeout reached or force continue activated, bypass the loading state
  if (timeoutReached || forceContinue) {
    console.log("Verification timeout reached or bypassed");

    // If we're on a profile page in development mode, let's try to redirect to login if no user
    if (!user && location.pathname.includes('/profile')) {
      console.log("Auth timeout: no user, redirecting to login");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // In development mode, just let users through
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode: Bypassing verification check after timeout");
      return <>{children}</>;
    }
  }

  // Master users, owner, and admins get immediate access
  if (isMasterUser || isOwner || isAdmin) {
    console.log("SubscriptionGuard: Admin/Owner detected, granting immediate access");
    return <>{children}</>;
  }
  
  // Users with free access granted by admin get immediate access
  if (hasFreeAccess) {
    console.log("SubscriptionGuard: User has free lifetime access, granting immediate access");
    return <>{children}</>;
  }

  // Show loading while checking states
  const isLoading = authLoading || isCheckingAdmin || subscriptionLoading || trialLoading;
  if (isLoading && !timeoutReached) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we verify your access. ({secondsWaiting}s)
          </p>
          {secondsWaiting >= 2 && (
            <div className="mt-4 space-y-2">
              <p className="text-amber-500">Taking longer than expected...</p>
              <Button 
                variant="outline" 
                onClick={handleForceContinue}
                className="mx-2"
              >
                Continue Anyway
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/login'}
              >
                Go to Login Page
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log("SubscriptionGuard: User not authenticated, redirecting to login");
    toast({
      title: "Authentication required",
      description: "Please sign in to access this content",
    });
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check if user has an active trial and trials are allowed for this content
  const hasActiveTrial = allowTrial && trialStatus === 'active';
  
  // Allow admin access - admins, owner, and users with free access always get in
  const hasAdminAccess = isAdmin || isOwner || hasFreeAccess;

  // If user has an active subscription or trial or special access, show the protected content
  if (hasActiveSubscription() || hasActiveTrial || hasAdminAccess) {
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
            {trialStatus === 'expired' ? (
              "Your free trial has expired. Please upgrade your membership to continue accessing all features."
            ) : (
              "This content is only available to subscribers. Upgrade your membership to access all Unimog Community Hub features."
            )}
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
