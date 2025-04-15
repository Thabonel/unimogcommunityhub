
import { useAuth as useAuthFromContext } from '@/contexts/AuthContext';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  error: AuthError | Error | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean, data?: any, error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean, data?: any, error?: string }>;
  signOut: () => Promise<{ success: boolean, error?: string }>;
  refreshSession: () => Promise<void>;
  isAuthenticated: boolean;
}

// This is a wrapper hook that forwards the auth context
export function useAuth(): AuthContextType {
  const authContext = useAuthFromContext();
  
  // Provide default values for properties that might not exist in the original context
  return {
    ...authContext,
    error: null,
    isAuthenticated: !!authContext.user,
    refreshSession: async () => {},
    // Transform the return types to match the expected interface
    signIn: async (email, password) => {
      const result = await authContext.signIn(email, password);
      return { 
        success: !result.error, 
        error: result.error ? String(result.error) : undefined
      };
    },
    signUp: async (email, password, metadata) => {
      const result = await authContext.signUp(email, password);
      return { 
        success: !result.error, 
        data: result.data,
        error: result.error ? String(result.error) : undefined
      };
    },
    signOut: async () => {
      await authContext.signOut();
      return { success: true };
    }
  };
}

// For backward compatibility
export default useAuth;
