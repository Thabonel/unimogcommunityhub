
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserOnlineStatus } from '@/services/userProfileService';

export const useUserPresence = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Set user as online when they load the app
    const handleConnectionChange = async () => {
      if (navigator.onLine && user) {
        await updateUserOnlineStatus(true);
      }
    };
    
    // Set up listeners for online/offline status
    window.addEventListener('online', handleConnectionChange);
    window.addEventListener('offline', handleConnectionChange);
    
    // Set initial online status
    if (user) {
      updateUserOnlineStatus(true);
    }
    
    // Set up channel for presence tracking
    let presenceChannel: any;
    if (user) {
      presenceChannel = supabase.channel('online-users');
      
      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          // User presence synced
        })
        .on('presence', { event: 'join' }, ({ newPresences }: { newPresences: any[] }) => {
          console.log('Users joined:', newPresences);
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }: { leftPresences: any[] }) => {
          console.log('Users left:', leftPresences);
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            await presenceChannel.track({
              user_id: user.id,
              online_at: new Date().toISOString()
            });
          }
        });
    }
    
    // Set user as offline when they leave/close the app
    const handleBeforeUnload = () => {
      if (user) {
        // We use navigator.sendBeacon for more reliable delivery during page unload
        const data = new FormData();
        data.append('user_id', user.id);
        data.append('online', 'false');
        navigator.sendBeacon('/api/update-presence', data);
        
        // Also try the direct approach as backup
        updateUserOnlineStatus(false);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('online', handleConnectionChange);
      window.removeEventListener('offline', handleConnectionChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Set user as offline when component unmounts
      if (user) {
        updateUserOnlineStatus(false);
      }
      
      // Clean up presence channel
      if (presenceChannel) {
        supabase.removeChannel(presenceChannel);
      }
    };
  }, [user]);
};
