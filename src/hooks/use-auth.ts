
import { useAuthContext } from '@/contexts/AuthContext';
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

// This is a wrapper hook that forwards the auth context
export function useAuth(): AuthContextType {
  return useAuthContext();
}
