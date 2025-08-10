
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Session, User } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';
import authRecoveryService from '@/services/core/AuthRecoveryService';
import tokenManager from '@/services/core/TokenManager';

export interface RecoveryState {
  isRecovering: boolean;
  recoveryAttempts: number;
  recoveryError: string | null;
  lastRecoveryTime: number | null;
  circuitBreakerOpen: boolean;
  environmentCheckPassed: boolean;
}

export interface LoadingState {
  initializing: boolean;
  authenticating: boolean;
  refreshing: boolean;
  recovering: boolean;
  signingOut: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  loading: boolean; // Alias for isLoading to maintain backward compatibility
  loadingState: LoadingState;
  recoveryState: RecoveryState;
  isRecoveryAvailable: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  forceRefresh: () => Promise<void>;
  triggerRecovery: () => Promise<void>;
  clearRecoveryError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  loading: true,
  loadingState: {
    initializing: true,
    authenticating: false,
    refreshing: false,
    recovering: false,
    signingOut: false,
  },
  recoveryState: {
    isRecovering: false,
    recoveryAttempts: 0,
    recoveryError: null,
    lastRecoveryTime: null,
    circuitBreakerOpen: false,
    environmentCheckPassed: false,
  },
  isRecoveryAvailable: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
  forceRefresh: async () => {},
  triggerRecovery: async () => {},
  clearRecoveryError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    initializing: true,
    authenticating: false,
    refreshing: false,
    recovering: false,
    signingOut: false,
  });
  const [recoveryState, setRecoveryState] = useState<RecoveryState>({
    isRecovering: false,
    recoveryAttempts: 0,
    recoveryError: null,
    lastRecoveryTime: null,
    circuitBreakerOpen: false,
    environmentCheckPassed: false,
  });
  
  // Initialize recovery service and token manager
  const recoveryService = authRecoveryService;
  const tokenManagerInstance = tokenManager;
  const [isRecoveryAvailable, setIsRecoveryAvailable] = useState(false);

  // Update loading state helper
  const updateLoadingState = (updates: Partial<LoadingState>) => {
    setLoadingState(prev => {
      const newState = { ...prev, ...updates };
      const isAnyLoading = Object.values(newState).some(loading => loading);
      setIsLoading(isAnyLoading);
      return newState;
    });
  };

  // Update recovery state helper
  const updateRecoveryState = (updates: Partial<RecoveryState>) => {
    setRecoveryState(prev => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    let isMounted = true;

    // Initialize authentication system
    const initializeAuth = async () => {
      updateLoadingState({ initializing: true });
      
      try {
        logger.info('Initializing enhanced authentication system', { 
          component: 'AuthContext', 
          action: 'auth_init_start' 
        });

        // Wait for enhanced client initialization
        await (supabase as any).waitForInitialization();
        
        // Set up recovery service event listeners
        setupRecoveryListeners();
        
        // Set up token manager event listeners
        setupTokenManagerListeners();
        
        // Check if recovery is available
        const recoveryServiceState = recoveryService.getRecoveryState();
        setIsRecoveryAvailable(recoveryServiceState.environmentCheckPassed);
        updateRecoveryState(recoveryServiceState);

        // Check active session
        await checkInitialSession();
        
      } catch (error) {
        logger.error('Authentication initialization failed', error as Error, { 
          component: 'AuthContext', 
          action: 'auth_init_failed' 
        });
      } finally {
        if (isMounted) {
          updateLoadingState({ initializing: false });
        }
      }
    };

    const setupRecoveryListeners = () => {
      recoveryService.on('recovery:started', () => {
        if (isMounted) {
          updateLoadingState({ recovering: true });
          updateRecoveryState({ isRecovering: true, recoveryError: null });
        }
      });

      recoveryService.on('recovery:success', (data) => {
        if (isMounted) {
          updateLoadingState({ recovering: false });
          updateRecoveryState({ 
            isRecovering: false, 
            recoveryError: null,
            lastRecoveryTime: Date.now(),
          });
          
          if (data.session) {
            setSession(data.session);
            setUser(data.session.user);
            tokenManagerInstance.setSession(data.session);
          }
        }
      });

      recoveryService.on('recovery:failed', (data) => {
        if (isMounted) {
          updateLoadingState({ recovering: false });
          updateRecoveryState({ 
            isRecovering: false, 
            recoveryError: data.error?.message || 'Recovery failed',
          });
        }
      });

      recoveryService.on('circuit-breaker:opened', () => {
        if (isMounted) {
          updateRecoveryState({ circuitBreakerOpen: true });
        }
      });

      recoveryService.on('circuit-breaker:reset', () => {
        if (isMounted) {
          updateRecoveryState({ circuitBreakerOpen: false });
        }
      });

      recoveryService.on('environment:valid', () => {
        if (isMounted) {
          setIsRecoveryAvailable(true);
          updateRecoveryState({ environmentCheckPassed: true });
        }
      });

      recoveryService.on('environment:invalid', () => {
        if (isMounted) {
          setIsRecoveryAvailable(false);
          updateRecoveryState({ environmentCheckPassed: false });
        }
      });
    };

    const setupTokenManagerListeners = () => {
      tokenManagerInstance.on('refresh:started', () => {
        if (isMounted) {
          updateLoadingState({ refreshing: true });
        }
      });

      tokenManagerInstance.on('refresh:success', (session) => {
        if (isMounted) {
          updateLoadingState({ refreshing: false });
          setSession(session);
          setUser(session.user);
        }
      });

      tokenManagerInstance.on('refresh:failed', () => {
        if (isMounted) {
          updateLoadingState({ refreshing: false });
        }
      });
    };

    const checkInitialSession = async () => {
      try {
        updateLoadingState({ authenticating: true });
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          logger.error('Session check failed', error, { 
            component: 'AuthContext', 
            action: 'session_check_failed' 
          });
          
          // Try recovery for recoverable errors
          const isRecoverable = error.message?.includes('JWT expired') || 
                               error.message?.includes('Invalid JWT') ||
                               error.message?.includes('Network');
          
          if (isRecoverable && isRecoveryAvailable) {
            logger.info('Attempting session recovery', { 
              component: 'AuthContext', 
              action: 'session_recovery_attempt' 
            });
            
            const recoveryResult = await recoveryService.recover((supabase as any).getClient(), error);
            if (recoveryResult.success && recoveryResult.session) {
              setSession(recoveryResult.session);
              setUser(recoveryResult.user || null);
              tokenManagerInstance.setSession(recoveryResult.session);
            }
          }
        } else if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          tokenManagerInstance.setSession(data.session);
        }
      } catch (error) {
        logger.error('Initial session check failed', error as Error, { 
          component: 'AuthContext', 
          action: 'initial_session_check_failed' 
        });
      } finally {
        if (isMounted) {
          updateLoadingState({ authenticating: false });
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      
      logger.debug('Auth state changed', { 
        component: 'AuthContext', 
        action: 'auth_state_change', 
        event 
      });
      
      switch (event) {
        case 'SIGNED_IN':
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession) {
            tokenManagerInstance.setSession(newSession);
          }
          updateLoadingState({ authenticating: false });
          break;
          
        case 'SIGNED_OUT':
          setSession(null);
          setUser(null);
          tokenManagerInstance.setSession(null);
          updateLoadingState({ signingOut: false });
          break;
          
        case 'TOKEN_REFRESHED':
          if (newSession) {
            setSession(newSession);
            setUser(newSession.user);
            tokenManagerInstance.setSession(newSession);
          } else {
            // Token refresh failed, try recovery
            if (isRecoveryAvailable) {
              logger.warn('Token refresh failed, attempting recovery', { 
                component: 'AuthContext', 
                action: 'token_refresh_failed_recovery' 
              });
              
              const recoveryResult = await recoveryService.recover((supabase as any).getClient());
              if (!recoveryResult.success) {
                await supabase.auth.signOut();
                setSession(null);
                setUser(null);
                tokenManagerInstance.setSession(null);
              }
            } else {
              await supabase.auth.signOut();
              setSession(null);
              setUser(null);
              tokenManagerInstance.setSession(null);
            }
          }
          updateLoadingState({ refreshing: false });
          break;
          
        case 'USER_UPDATED':
          if (newSession?.user) {
            setUser(newSession.user);
          }
          break;
      }
    });

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      recoveryService.removeAllListeners();
      tokenManagerInstance.destroy();
    };
  }, [recoveryService, tokenManager, isRecoveryAvailable]);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    updateLoadingState({ authenticating: true });
    
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
    } finally {
      updateLoadingState({ authenticating: false });
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    updateLoadingState({ authenticating: true });
    
    try {
      logger.info('Sign up attempt', { 
        component: 'AuthContext', 
        action: 'signup_attempt',
        email 
      });
      
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      // If signup successful, the database trigger will automatically start the 45-day trial
      // We just need to ensure the signup succeeds
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
    } finally {
      updateLoadingState({ authenticating: false });
    }
  };

  // Sign out
  const signOut = async () => {
    updateLoadingState({ signingOut: true });
    
    try {
      logger.info('Sign out attempt', { 
        component: 'AuthContext', 
        action: 'signout_attempt' 
      });
      
      tokenManagerInstance.setSession(null);
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
    } finally {
      updateLoadingState({ signingOut: false });
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

  // Force refresh token
  const forceRefresh = async () => {
    try {
      logger.info('Forcing token refresh', { 
        component: 'AuthContext', 
        action: 'force_refresh' 
      });
      
      const refreshedSession = await tokenManagerInstance.forceRefresh();
      if (refreshedSession) {
        setSession(refreshedSession);
        setUser(refreshedSession.user);
      }
    } catch (error) {
      logger.error('Force refresh failed', error as Error, { 
        component: 'AuthContext', 
        action: 'force_refresh_failed' 
      });
    }
  };

  // Trigger manual recovery
  const triggerRecovery = async () => {
    try {
      logger.info('Triggering manual recovery', { 
        component: 'AuthContext', 
        action: 'manual_recovery' 
      });
      
      const recoveryResult = await recoveryService.recover((supabase as any).getClient());
      if (recoveryResult.success && recoveryResult.session) {
        setSession(recoveryResult.session);
        setUser(recoveryResult.user || null);
        tokenManagerInstance.setSession(recoveryResult.session);
      }
    } catch (error) {
      logger.error('Manual recovery failed', error as Error, { 
        component: 'AuthContext', 
        action: 'manual_recovery_failed' 
      });
    }
  };

  // Clear recovery error
  const clearRecoveryError = () => {
    updateRecoveryState({ recoveryError: null });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        loading: isLoading, // Provide loading as alias to isLoading
        loadingState,
        recoveryState,
        isRecoveryAvailable,
        signIn,
        signUp,
        signOut,
        resetPassword,
        forceRefresh,
        triggerRecovery,
        clearRecoveryError,
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
