
import { useState, useEffect } from 'react';
import { checkIsAdmin } from '@/utils/adminUtils';
import { User } from '@supabase/supabase-js';

export function useAdminStatus(user: User | null) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        // In development mode, always consider users as admins
        // This simplifies testing and development
        if (process.env.NODE_ENV === 'development') {
          setIsAdmin(true);
        } else {
          const isUserAdmin = await checkIsAdmin(user.id);
          setIsAdmin(isUserAdmin);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to check admin status:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        // Default to false on error
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [user]);

  return { isAdmin, isLoading, error };
}
