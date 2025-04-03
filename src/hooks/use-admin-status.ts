
import { useState, useEffect } from 'react';
import { checkIsAdmin } from '@/utils/adminUtils';
import { User } from '@supabase/supabase-js';

export function useAdminStatus(user: User | null) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const adminStatus = await checkIsAdmin(user.id);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Failed to check admin status:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    if (user) {
      verifyAdmin();
    }
  }, [user]);

  return { isAdmin, isLoading };
}
