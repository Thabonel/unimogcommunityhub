import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

interface TrialData {
  id: string;
  startDate: Date;
  expiryDate: Date;
  daysRemaining: number;
  isActive: boolean;
}

// Define type for our RPC function response matching the user_trials table structure
interface UserTrialResponse {
  id: string;
  user_id: string;
  started_at: string;
  expires_at: string;
  is_active: boolean;
  email_sent_at: string | null;
  converted_to_subscription: boolean;
  created_at: string;
}

export function useTrial() {
  const { user } = useAuth();
  const [trialStatus, setTrialStatus] = useState<'loading' | 'active' | 'expired' | 'not_started'>('loading');
  const [trialData, setTrialData] = useState<TrialData | null>(null);
  const { toast } = useToast();

  // Check trial status when component mounts
  useEffect(() => {
    if (!user) {
      setTrialStatus('not_started');
      return;
    }

    const checkTrialStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_trials')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          setTrialStatus('not_started');
          return;
        }

        // Check if trial is still active
        const expiryDate = new Date(data.expires_at);
        const isActive = data.is_active && expiryDate > new Date();

        if (isActive) {
          // Calculate days remaining
          const now = new Date();
          const startDate = new Date(data.started_at);
          const daysRemaining = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

          setTrialStatus('active');
          setTrialData({
            id: data.id,
            startDate: startDate,
            expiryDate: expiryDate,
            daysRemaining: Math.max(0, daysRemaining),
            isActive: true
          });
        } else {
          setTrialStatus('expired');
          setTrialData(null);
        }
      } catch (error) {
        console.error('Error checking trial status:', error);
        setTrialStatus('not_started');
      }
    };

    checkTrialStatus();
  }, [user]);

  // Start a trial for current user
  const startTrial = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in or sign up to start your free trial.",
        variant: "destructive",
      });
      return false;
    }

    try {
      // Check if user already has an active trial
      const { data: existingTrial } = await supabase
        .from('user_trials')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (existingTrial) {
        toast({
          title: "Trial already active",
          description: "You already have an active trial.",
        });
        return false;
      }

      // Calculate expiry date (7 days from now)
      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setDate(now.getDate() + 7);

      // Using RPC function to insert trial record to bypass RLS
      // The first type parameter should be the function name, the second is the return type
      const { data, error } = await supabase
        .rpc('start_user_trial', {
          p_user_id: user.id,
          p_started_at: now.toISOString(),
          p_expires_at: expiryDate.toISOString(),
        }) as { data: UserTrialResponse[] | null, error: any };

      if (error) {
        console.error('Error from RPC call:', error);
        throw error;
      }

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('No data returned from RPC call');
        throw new Error('Failed to create trial record');
      }

      const trialRecord = data[0];
      console.log('Trial record created:', trialRecord);

      // Update local state with new trial data
      setTrialStatus('active');
      setTrialData({
        id: trialRecord.id,
        startDate: now,
        expiryDate: expiryDate,
        daysRemaining: 7,
        isActive: true
      });

      toast({
        title: "Trial started",
        description: "Your 7-day free trial has been activated.",
      });

      return true;
    } catch (error) {
      console.error('Error starting trial:', error);
      toast({
        title: "Error",
        description: "Failed to start your trial. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    trialStatus,
    trialData,
    startTrial,
  };
}
