import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Star } from 'lucide-react';

interface ReviewPromptProps {
  trigger?: 'barry_usage' | 'manual_views' | 'trip_saved' | 'time_active';
}

export function ReviewPrompt({ trigger = 'barry_usage' }: ReviewPromptProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const STORAGE_KEY = 'review_prompt_status';
  const SNOOZE_DAYS = 14;

  useEffect(() => {
    if (!user) return;

    const checkAndShowPrompt = async () => {
      const storedStatus = localStorage.getItem(STORAGE_KEY);
      if (storedStatus) {
        const status = JSON.parse(storedStatus);

        if (status.neverAskAgain) return;

        if (status.snoozedUntil && new Date(status.snoozedUntil) > new Date()) {
          return;
        }
      }

      const hasExistingReview = await checkExistingReview();
      if (hasExistingReview) return;

      const meetsEngagementCriteria = await checkEngagementCriteria();
      if (meetsEngagementCriteria && !dismissed) {
        setOpen(true);
      }
    };

    checkAndShowPrompt();
  }, [user, trigger, dismissed]);

  const checkExistingReview = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id')
        .eq('user_id', user.id)
        .single();

      return !error && !!data;
    } catch {
      return false;
    }
  };

  const checkEngagementCriteria = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) return false;

      const accountAge = Math.floor(
        (new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (accountAge < 7) return false;

      if (trigger === 'barry_usage') {
        const { count, error } = await supabase
          .from('barry_answer_feedback')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (error) return false;
        return (count || 0) >= 3;
      }

      return false;
    } catch {
      return false;
    }
  };

  const handleLeaveReview = () => {
    setOpen(false);
    navigate('/submit-testimonial');
  };

  const handleMaybeLater = () => {
    const snoozeUntil = new Date();
    snoozeUntil.setDate(snoozeUntil.getDate() + SNOOZE_DAYS);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ snoozedUntil: snoozeUntil.toISOString() })
    );

    setOpen(false);
    setDismissed(true);
  };

  const handleDontAskAgain = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ neverAskAgain: true })
    );

    setOpen(false);
    setDismissed(true);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-military-green/10 rounded-lg">
                <MessageCircle className="h-6 w-6 text-military-green" />
              </div>
              <DialogTitle className="text-xl">Loving UnimogCommunityHub?</DialogTitle>
            </div>
          </div>
          <DialogDescription className="pt-4">
            Help us grow the community by sharing your experience! Your review helps other Unimog
            owners discover UnimogCommunityHub.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">Takes less than 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">Helps fellow Unimog enthusiasts</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-medium">Shows appreciation for our work</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            onClick={handleLeaveReview}
            className="w-full bg-military-green hover:bg-military-green/90"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Leave a Review
          </Button>
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleMaybeLater}
              variant="outline"
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleDontAskAgain}
              variant="ghost"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Don't Ask Again
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
