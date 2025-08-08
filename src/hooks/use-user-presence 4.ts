
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserPresence = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    // Update user's online status when they connect
    const updateOnlineStatus = async () => {
      try {
        await supabase
          .from('profiles')
          .update({ online: true })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating online status:', error);
      }
    };
    
    // Mark user as offline when they disconnect
    const handleOffline = async () => {
      try {
        await supabase
          .from('profiles')
          .update({ online: false })
          .eq('id', user.id);
      } catch (error) {
        console.error('Error updating offline status:', error);
      }
    };
    
    // Set up beforeunload event listener
    const handleBeforeUnload = () => {
      handleOffline();
    };
    
    // Update online status when component mounts
    updateOnlineStatus();
    
    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Clean up on component unmount
    return () => {
      handleOffline();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);
};
