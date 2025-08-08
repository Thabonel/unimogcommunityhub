
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export interface TrialData {
  daysRemaining: number;
  startDate: string;
  endDate: string;
}

export function useTrial() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [trialStatus, setTrialStatus] = useState<'loading' | 'active' | 'expired' | 'not_started'>('loading');
  const [trialData, setTrialData] = useState<TrialData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load trial data
  useEffect(() => {
    const fetchTrialStatus = async () => {
      if (!user) {
        setTrialStatus('not_started');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_trials')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching trial:', error);
          setTrialStatus('not_started');
          return;
        }
        
        if (!data) {
          setTrialStatus('not_started');
        } else {
          // Parse dates
          const startDate = new Date(data.started_at);
          const endDate = new Date(data.expires_at);
          const now = new Date();
          
          // Calculate days remaining
          const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (now > endDate) {
            setTrialStatus('expired');
          } else {
            setTrialStatus('active');
            setTrialData({
              daysRemaining,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString()
            });
          }
        }
      } catch (err) {
        console.error('Error in trial hook:', err);
        setTrialStatus('not_started');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrialStatus();
  }, [user]);
  
  // Start trial function
  const startTrial = async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start your trial",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setIsLoading(true);
      
      // Check if trial already exists
      const { data: existingTrial } = await supabase
        .from('user_trials')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (existingTrial) {
        // Trial already exists
        toast({
          title: "Trial Already Active",
          description: "You already have an active trial"
        });
        
        // Refresh trial data
        setTrialStatus('active');
        const startDate = new Date(existingTrial.started_at);
        const endDate = new Date(existingTrial.expires_at);
        const now = new Date();
        const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        setTrialData({
          daysRemaining,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        });
        
        return true;
      }
      
      // Create new trial
      const now = new Date();
      const endDate = new Date();
      endDate.setDate(now.getDate() + 14); // 14 day trial
      
      const { error } = await supabase
        .from('user_trials')
        .insert({
          user_id: user.id,
          started_at: now.toISOString(),
          expires_at: endDate.toISOString(),
          is_active: true
        });
        
      if (error) throw error;
      
      // Update local state
      setTrialStatus('active');
      setTrialData({
        daysRemaining: 14,
        startDate: now.toISOString(),
        endDate: endDate.toISOString()
      });
      
      toast({
        title: "Trial Started",
        description: "Your 14-day trial has been activated"
      });
      
      return true;
    } catch (err) {
      console.error('Error starting trial:', err);
      toast({
        title: "Trial Activation Failed",
        description: "There was an error starting your trial. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    trialStatus,
    trialData,
    startTrial,
    isLoading
  };
}
