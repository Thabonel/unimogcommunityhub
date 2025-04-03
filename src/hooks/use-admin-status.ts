
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
        // For development purposes, make all authenticated users admin
        // Remove this in production and use the actual checkIsAdmin function
        const adminStatus = true; // await checkIsAdmin(user.id);
        console.log("Admin status check result:", adminStatus);
        setIsAdmin(adminStatus);
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
