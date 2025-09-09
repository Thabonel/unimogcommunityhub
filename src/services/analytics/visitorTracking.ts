
import { supabase } from '@/lib/supabase-client';
import { v4 as uuidv4 } from 'uuid';

// Initialize visitor tracking
export const initVisitorTracking = async (): Promise<string> => {
  let sessionId = localStorage.getItem('visitor_session_id');
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('visitor_session_id', sessionId);
    
    // Record new visitor in analytics
    try {
      const referrer = document.referrer;
      const metadata = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenSize: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      await supabase.from('visitor_analytics').insert({
        session_id: sessionId,
        referrer: referrer || null,
        metadata: metadata
      });
    } catch (error) {
      console.error('Error recording visitor:', error);
    }
  }
  
  return sessionId;
};

// Update visitor status when they convert
export const updateVisitorConversion = async (
  type: 'signed_up' | 'converted_to_trial' | 'converted_to_subscription'
): Promise<void> => {
  const sessionId = localStorage.getItem('visitor_session_id');
  
  if (!sessionId) return;
  
  try {
    const updateData: Record<string, boolean> = {
      [type]: true
    };
    
    await supabase
      .from('visitor_analytics')
      .update(updateData)
      .eq('session_id', sessionId);
  } catch (error) {
    console.error('Error updating visitor conversion:', error);
  }
};
