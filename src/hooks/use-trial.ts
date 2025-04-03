
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type TrialStatus = 'active' | 'expired' | 'none' | 'loading';

export interface TrialData {
  startDate: string | null;
  expiryDate: string | null;
  daysRemaining: number | null;
  isActive: boolean;
}

export function useTrial() {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>('loading');
  const [trialData, setTrialData] = useState<TrialData>({
    startDate: null,
    expiryDate: null,
    daysRemaining: null,
    isActive: false
  });
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Function to fetch trial status
  const fetchTrialStatus = async () => {
    if (!user) {
      setTrialStatus('none');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_trials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw error;
      }
      
      if (!data) {
        setTrialStatus('none');
        return;
      }
      
      const now = new Date();
      const expiryDate = new Date(data.expires_at);
      const isActive = data.is_active && expiryDate > now;
      
      // Calculate days remaining
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTrialData({
        startDate: data.started_at,
        expiryDate: data.expires_at,
        daysRemaining: diffDays > 0 ? diffDays : 0,
        isActive
      });
      
      setTrialStatus(isActive ? 'active' : 'expired');
    } catch (error) {
      console.error('Error fetching trial status:', error);
      setTrialStatus('none');
    }
  };
  
  // Function to start a free trial
  const startFreeTrial = async (email: string): Promise<boolean> => {
    try {
      // If user is already logged in, create trial for current user
      if (user) {
        // Check if user already has a trial
        const { data: existingTrial } = await supabase
          .from('user_trials')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (existingTrial) {
          toast({
            title: "Trial already exists",
            description: "You already have an active or expired trial.",
            variant: "destructive"
          });
          return false;
        }
        
        // Create trial for logged in user
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // 7 day trial
        
        const { error } = await supabase
          .from('user_trials')
          .insert({
            user_id: user.id,
            expires_at: expiryDate.toISOString()
          });
        
        if (error) throw error;
        
        await fetchTrialStatus();
        
        toast({
          title: "Free trial started!",
          description: "Your 7-day free trial has been activated.",
        });
        
        return true;
      } else {
        // User is not logged in, handle sign up logic here
        toast({
          title: "Please sign up first",
          description: "You need to create an account to start your free trial.",
        });
        return false;
      }
    } catch (error) {
      console.error('Error starting free trial:', error);
      toast({
        title: "Trial activation failed",
        description: "There was an error starting your free trial. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // On mount and when user changes, fetch trial status
  useEffect(() => {
    if (user) {
      fetchTrialStatus();
    } else {
      setTrialStatus('none');
    }
  }, [user]);
  
  return {
    trialStatus,
    trialData,
    startFreeTrial,
    refreshTrialStatus: fetchTrialStatus
  };
}
