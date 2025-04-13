
import { useAuthContext } from '@/contexts/AuthContext';

// This is a wrapper hook that forwards the auth context
export function useAuth() {
  return useAuthContext();
}
