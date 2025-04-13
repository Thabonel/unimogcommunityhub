
import { useAuthContext } from '@/contexts/AuthContext';
import { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthContextType {
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

// This is a wrapper hook that forwards the auth context
export function useAuth(): AuthContextType {
  return useAuthContext();
}
