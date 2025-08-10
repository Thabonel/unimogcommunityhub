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

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      logger.info('Sign in attempt', { 
        component: 'AuthContext', 
        action: 'signin_attempt',
        email 
      });
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
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
      }
      
      return { error };
    } catch (error) {
      logger.error('Sign in error', error as Error, { 
        component: 'AuthContext', 
        action: 'signin_error',
        email 
      });
      return { error };
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
      logger.info('Sign out attempt', { 
        component: 'AuthContext', 
        action: 'signout_attempt' 
      });
      
      await supabase.auth.signOut();
      
      logger.info('Sign out successful', { 
        component: 'AuthContext', 
        action: 'signout_success' 
      });
    } catch (error) {
      logger.error('Sign out error', error as Error, { 
        component: 'AuthContext', 
        action: 'signout_error' 
      });
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
      {children}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook directly
export const useAuth = () => useContext(AuthContext);

// For backward compatibility, also export useAuthContext
export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;