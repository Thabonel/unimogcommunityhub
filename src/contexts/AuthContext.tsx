
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | Error | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean, data?: any, error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean, data?: any, error?: string }>;
  signOut: () => Promise<{ success: boolean, error?: string }>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | Error | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Reset error on page navigation
  useEffect(() => {
    const handleNavigation = () => {
      setError(null);
    };

    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsAuthenticated(!!data.session?.user);
    } catch (err) {
      console.error('Error refreshing session:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh session'));
    }
  }, []);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsAuthenticated(!!currentSession?.user);
        setLoading(false);
        
        // Track authentication events
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          try {
            await fetch('/api/auth-events', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                event, 
                userId: currentSession?.user.id,
                timestamp: new Date().toISOString()
              })
            });
          } catch (err) {
            console.error('Failed to track auth event:', err);
          }
        }
      }
    );

    // Then check for existing session
    refreshSession().then(() => setLoading(false));

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [refreshSession]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      setError(err);
      return {
        success: false,
        error: err.message || 'Failed to sign in'
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (err: any) {
      setError(err);
      return {
        success: false,
        error: err.message || 'Failed to sign up'
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local auth state
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      return { success: true };
    } catch (err: any) {
      setError(err);
      return {
        success: false,
        error: err.message || 'Failed to sign out'
      };
    } finally {
      setLoading(false);
    }
  };

  // Make the context object value
  const contextValue = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshSession,
    isAuthenticated
  };

  // Store the context in window for debugging purposes in development
  if (process.env.NODE_ENV === 'development') {
    (window as any).authContext = contextValue;
  }

  // provide the context value to children
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Add this extra export for backward compatibility
export const useAuth = useAuthContext;
