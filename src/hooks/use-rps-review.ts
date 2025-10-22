import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Illustration {
  id: string;
  description: string;
  image_url: string;
  page_number: number;
  group_code: string;
}

interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  corrected: number;
}

export function useRPSReview(groupFilter?: string) {
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ReviewStats>({
    total: 0,
    pending: 0,
    approved: 0,
    corrected: 0
  });
  const { user } = useAuth();

  // Fetch illustrations that haven't been reviewed yet
  const fetchIllustrations = async () => {
    try {
      setIsLoading(true);

      // Get illustrations with no review or pending review
      let query = supabase
        .from('rps_illustrations')
        .select('id, description, image_url, page_number, group_code')
        .not('image_url', 'is', null)
        .order('page_number', { ascending: true });

      if (groupFilter) {
        query = query.eq('group_code', groupFilter);
      }

      const { data: illustrationsData, error } = await query;

      if (error) throw error;

      // Transform the data
      const formattedIllustrations = (illustrationsData || []).map((item: any) => ({
        id: item.id,
        description: item.description || 'Unnamed Illustration',
        image_url: item.image_url,
        page_number: item.page_number,
        group_code: item.group_code || 'Unknown'
      }));

      setIllustrations(formattedIllustrations);

      // Fetch stats
      await fetchStats();
    } catch (error) {
      console.error('Error fetching illustrations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load illustrations',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch review statistics
  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('rps_illustration_reviews')
        .select('review_status');

      if (error) throw error;

      const statuses = data || [];
      setStats({
        total: statuses.length,
        pending: statuses.filter(s => s.review_status === 'pending').length,
        approved: statuses.filter(s => s.review_status === 'approved').length,
        corrected: statuses.filter(s => s.review_status === 'corrected').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Approve illustration name
  const approve = async () => {
    if (!user || !illustrations[currentIndex]) return;

    const illustration = illustrations[currentIndex];

    try {
      const { error } = await supabase
        .from('rps_illustration_reviews')
        .insert({
          illustration_id: illustration.id,
          original_description: illustration.description,
          review_status: 'approved',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Approved',
        description: 'Illustration name approved'
      });

      // Move to next or remove from list
      if (currentIndex < illustrations.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Remove approved from list
        setIllustrations(illustrations.filter((_, i) => i !== currentIndex));
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }

      await fetchStats();
    } catch (error) {
      console.error('Error approving:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve illustration',
        variant: 'destructive'
      });
    }
  };

  // Reject and correct illustration name
  const reject = async (correctedName: string) => {
    if (!user || !illustrations[currentIndex]) return;

    const illustration = illustrations[currentIndex];

    try {
      // Save review
      const { error: reviewError } = await supabase
        .from('rps_illustration_reviews')
        .insert({
          illustration_id: illustration.id,
          original_description: illustration.description,
          corrected_description: correctedName,
          review_status: 'corrected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        });

      if (reviewError) throw reviewError;

      // Update the illustration description
      const { error: updateError } = await supabase
        .from('rps_illustrations')
        .update({ description: correctedName })
        .eq('id', illustration.id);

      if (updateError) throw updateError;

      toast({
        title: 'Corrected',
        description: 'Illustration name updated successfully'
      });

      // Move to next or remove from list
      if (currentIndex < illustrations.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIllustrations(illustrations.filter((_, i) => i !== currentIndex));
        setCurrentIndex(Math.max(0, currentIndex - 1));
      }

      await fetchStats();
    } catch (error) {
      console.error('Error correcting:', error);
      toast({
        title: 'Error',
        description: 'Failed to update illustration name',
        variant: 'destructive'
      });
    }
  };

  // Skip illustration (mark as pending for later review)
  const skip = () => {
    if (currentIndex < illustrations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  // Navigation
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < illustrations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Load illustrations on mount
  useEffect(() => {
    fetchIllustrations();
  }, [groupFilter]);

  return {
    currentIllustration: illustrations[currentIndex],
    currentIndex,
    totalIllustrations: illustrations.length,
    isLoading,
    stats,
    approve,
    reject,
    skip,
    goToPrevious,
    goToNext,
    hasPrevious: currentIndex > 0,
    hasNext: currentIndex < illustrations.length - 1,
    refresh: fetchIllustrations
  };
}
