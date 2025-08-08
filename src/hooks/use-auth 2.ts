
import { useAuth as useAuthFromContext } from '@/contexts/AuthContext';
import { User, Session, AuthError } from '@supabase/supabase-js';

// This is a wrapper hook that forwards the auth context
export function useAuth() {
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

