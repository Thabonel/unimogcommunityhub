
import { ReactNode, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AdminSetup from './admin/AdminSetup';
import { useToast } from '@/hooks/use-toast';
import { useAdminStatus } from '@/hooks/use-admin-status';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin, isLoading: isCheckingAdmin, error } = useAdminStatus(user);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [secondsWaiting, setSecondsWaiting] = useState(0);
  const [forceContinue, setForceContinue] = useState(false);

  // Check if this is the master user for bypassing checks
  const isMasterUser = user?.email === 'master@development.com';

  // Show error toast if admin check fails
  useEffect(() => {
    if (error && requireAdmin) {
      toast({
        title: "Admin verification error",
        description: "Failed to verify admin privileges. Using fallback mode.",
        variant: "destructive",
      });
    }
  }, [error, requireAdmin, toast]);

  // Set a timeout to prevent infinite loading and add a seconds counter
  useEffect(() => {
    // Don't set timer if master user or if already forced to continue
    if ((loading || isCheckingAdmin) && !isMasterUser && !forceContinue) {
      const interval = setInterval(() => {
        setSecondsWaiting(prev => {
          const newValue = prev + 1;
          if (newValue >= 3) {  // Reduced to 3 seconds for faster timeout
            setTimeoutReached(true);
            clearInterval(interval);
          }
          return newValue;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [loading, isCheckingAdmin, isMasterUser, forceContinue]);

  // Force bypass loading state after user interaction
  const handleForceContinue = () => {
    setForceContinue(true);
    setTimeoutReached(true);
  };

  // If timeout reached or force continue activated, bypass the loading state
  if (timeoutReached || forceContinue) {
    console.log("Auth verification timeout reached or bypassed");

    // If we're on a profile page in development mode, let's try to redirect to login if no user
    if (!user && location.pathname.includes('/profile')) {
      console.log("Auth timeout: no user, redirecting to login");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // In development mode, just let users through
    if (process.env.NODE_ENV === 'development') {
      console.log("Development mode: Bypassing auth check after timeout");
      return <>{children}</>;
    }
  }

  // Master users get immediate access
  if (isMasterUser) {
    console.log("ProtectedRoute: Master user detected, granting immediate access");
    return <>{children}</>;
  }

  // Show loading while checking auth state, but with a timer display
  if ((loading || (requireAdmin && isCheckingAdmin && !timeoutReached))) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-muted-foreground">
            Please wait while we verify your session. ({secondsWaiting}s)
          </p>
          {requireAdmin && (
            <p className="text-muted-foreground mt-2">Checking admin privileges...</p>
          )}
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
    console.log("ProtectedRoute: User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Always allow access in development mode
  if (requireAdmin && process.env.NODE_ENV === 'development') {
    console.log("ProtectedRoute: Development mode - bypassing admin check");
    return <>{children}</>;
  }

  // Special case for master@development.com - always grant admin access
  if (requireAdmin && user.email === 'master@development.com') {
    console.log("ProtectedRoute: Master user detected, granting admin access");
    return <>{children}</>;
  }

  // For all environments, allow admin access if isAdmin is true
  const hasAdminAccess = requireAdmin ? isAdmin : true;

  // Show admin setup page if admin access is required but user doesn't have admin role
  if (requireAdmin && !hasAdminAccess) {
    console.log("ProtectedRoute: User does not have admin role, showing AdminSetup");
    return <AdminSetup />;
  }

  // Render children if all conditions are met
  console.log("ProtectedRoute: All conditions met, rendering children");
  return <>{children}</>;
};

export default ProtectedRoute;
