import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Session, User } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  loading: boolean; // Alias for isLoading to maintain backward compatibility
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const initializeAuth = async () => {
      try {
        // Get initial session with retry logic
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Failed to get initial session', error, {
            component: 'AuthContext',
            action: 'init_session_error'
          });
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsInitialized(true);
          setIsLoading(false);

          // Only set up listener after initial session is loaded
          const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
            logger.info('Auth state changed', {
              component: 'AuthContext',
              action: 'auth_state_change',
              event
            });

            if (mounted) {
              // Prevent race condition by checking if session actually changed
              if (newSession?.access_token !== session?.access_token) {
                setSession(newSession);
                setUser(newSession?.user ?? null);
              }
            }
          });
          
          authSubscription = data.subscription;
        }
      } catch (error) {
        logger.error('Auth initialization error', error as Error, {
          component: 'AuthContext',
          action: 'init_error'
        });
        
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      authSubscription?.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      logger.info('Sign in attempt', { 
        component: 'AuthContext', 
        action: 'signin_attempt',
        email 
      });
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        logger.error('Sign in failed', error, { 
          component: 'AuthContext', 
          action: 'signin_failed',
          email 
        });
      } else {
        logger.info('Sign in successful', { 
          component: 'AuthContext', 
          action: 'signin_success',
          email 
        });
        
        // Wait for auth state to update
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      return { error };
    } catch (error) {
      logger.error('Sign in error', error as Error, { 
        component: 'AuthContext', 
        action: 'signin_error',
        email 
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    try {
      logger.info('Sign up attempt', { 
        component: 'AuthContext', 
        action: 'signup_attempt',
        email 
      });
      
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (!error && data.user) {
        logger.info('User signed up successfully', { 
          component: 'AuthContext', 
          action: 'signup_success', 
          email,
          trial_duration: '45-day' 
        });
      } else if (error) {
        logger.error('Sign up failed', error, { 
          component: 'AuthContext', 
          action: 'signup_failed',
          email 
        });
      }
      
      return { data, error };
    } catch (error) {
      logger.error('Sign up error', error as Error, { 
        component: 'AuthContext', 
        action: 'signup_error',
        email 
      });
      return { error, data: null };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true);
      
      logger.info('Sign out attempt', { 
        component: 'AuthContext', 
        action: 'signout_attempt' 
      });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        logger.error('Sign out error', error, { 
          component: 'AuthContext', 
          action: 'signout_error' 
        });
      } else {
        logger.info('Sign out successful', { 
          component: 'AuthContext', 
          action: 'signout_success' 
        });
        
        // Clear local state immediately
        setUser(null);
        setSession(null);
      }
    } catch (error) {
      logger.error('Sign out error', error as Error, { 
        component: 'AuthContext', 
        action: 'signout_error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        loading: isLoading, // Provide loading as alias to isLoading
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {isInitialized ? children : <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook directly
export const useAuth = () => useContext(AuthContext);

// For backward compatibility, also export useAuthContext
export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;