/**
 * React hooks for authentication
 * Provides clean interface to AuthService
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthService, AuthState, SignInCredentials, SignUpCredentials, AuthResult } from '@/services/core/AuthService';
import { User, Session } from '@supabase/supabase-js';

// Main auth hook
export function useAuth() {
  const authService = useMemo(() => AuthService.getInstance(), []);
  const [state, setState] = useState<AuthState>(authService.getState());
  
  useEffect(() => {
    // Subscribe to auth state changes
    const handleStateChange = (newState: AuthState) => {
      setState(newState);
    };
    
    authService.on('auth:state-change', handleStateChange);
    
    // Get initial state
    setState(authService.getState());
    
    return () => {
      authService.off('auth:state-change', handleStateChange);
    };
  }, [authService]);
  
  const signIn = useCallback(
    async (credentials: SignInCredentials): Promise<AuthResult> => {
      return authService.signIn(credentials);
    },
    [authService]
  );
  
  const signUp = useCallback(
    async (credentials: SignUpCredentials): Promise<AuthResult> => {
      return authService.signUp(credentials);
    },
    [authService]
  );
  
  const signOut = useCallback(async (): Promise<AuthResult> => {
    return authService.signOut();
  }, [authService]);
  
  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      return authService.resetPassword(email);
    },
    [authService]
  );
  
  const updatePassword = useCallback(
    async (newPassword: string): Promise<AuthResult> => {
      return authService.updatePassword(newPassword);
    },
    [authService]
  );
  
  const refreshSession = useCallback(async (): Promise<AuthResult> => {
    return authService.refreshSession();
  }, [authService]);
  
  return {
    ...state,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    refreshSession
  };
}

// Hook for current user
export function useUser(): User | null {
  const { user } = useAuth();
  return user;
}

// Hook for current session
export function useSession(): Session | null {
  const { session } = useAuth();
  return session;
}

// Hook for auth status
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
}

// Hook for auth loading state
export function useAuthLoading(): boolean {
  const { isLoading } = useAuth();
  return isLoading;
}

// Hook for auth events
export function useAuthEvent(
  event: 'signed-in' | 'signed-out' | 'token-refreshed' | 'user-updated' | 'reauth-required',
  callback: (data?: any) => void
) {
  const authService = useMemo(() => AuthService.getInstance(), []);
  
  useEffect(() => {
    const eventName = `auth:${event}`;
    authService.on(eventName, callback);
    
    return () => {
      authService.off(eventName, callback);
    };
  }, [authService, event, callback]);
}

// Hook for protected routes
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShouldRedirect(true);
      // Store the current location for redirect after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);
  
  return { isAuthenticated, isLoading, shouldRedirect };
}

// Hook for guest routes (redirect if authenticated)
export function useRequireGuest(redirectTo = '/dashboard') {
  const { isAuthenticated, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setShouldRedirect(true);
      // Check if there's a stored redirect path
      const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
      if (storedRedirect) {
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = storedRedirect;
      } else {
        window.location.href = redirectTo;
      }
    }
  }, [isAuthenticated, isLoading, redirectTo]);
  
  return { isAuthenticated, isLoading, shouldRedirect };
}

// Hook for session refresh
export function useSessionRefresh(intervalMs = 300000) { // 5 minutes default
  const { refreshSession } = useAuth();
  const { session } = useAuth();
  
  useEffect(() => {
    if (!session) return;
    
    const interval = setInterval(async () => {
      const result = await refreshSession();
      if (!result.success && result.requiresReauth) {
        console.error('Session refresh failed, user needs to re-authenticate');
      }
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [session, refreshSession, intervalMs]);
}