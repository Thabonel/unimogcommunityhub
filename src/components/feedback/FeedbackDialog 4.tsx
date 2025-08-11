
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FeedbackType, submitFeedback } from '@/services/feedbackService';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';
import { RatingStars } from './RatingStars';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('general');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const { trackEvent } = useAnalytics();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: 'Missing content',
        description: 'Please enter your feedback before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitFeedback({
        type: feedbackType,
        content: content.trim(),
        rating,
        metadata: {
          page: window.location.pathname,
          userAgent: navigator.userAgent,
        },
      });

      if (result) {
        toast({
          title: 'Feedback submitted',
          description: 'Thank you for your feedback!',
        });
        
        trackEvent('feedback_submit', {
          feedback_type: feedbackType,
          has_rating: !!rating,
        });

        // Reset and close
        setContent('');
        setFeedbackType('general');
        setRating(undefined);
        onOpenChange(false);
      } else {
        toast({
          title: 'Submission failed',
          description: 'Unable to submit feedback. Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share your feedback</DialogTitle>
          <DialogDescription>
            Help us improve your experience by sharing your thoughts or reporting issues.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>What type of feedback do you have?</Label>
            <RadioGroup
              value={feedbackType}
              onValueChange={(value) => setFeedbackType(value as FeedbackType)}
              className="grid grid-cols-2 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="general" />
                <Label htmlFor="general">General</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bug" id="bug" />
                <Label htmlFor="bug">Bug Report</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="suggestion" id="suggestion" />
                <Label htmlFor="suggestion">Suggestion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="feature_request" id="feature_request" />
                <Label htmlFor="feature_request">Feature Request</Label>
              </div>
            </RadioGroup>
          </div>

          {feedbackType === 'general' && (
            <div className="space-y-2">
              <Label htmlFor="rating">How would you rate your experience?</Label>
              <RatingStars
                rating={rating}
                onChange={(value) => setRating(value as 1 | 2 | 3 | 4 | 5)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Your feedback</Label>
            <Textarea
              id="message"
              placeholder={
                feedbackType === 'bug'
                  ? "Please describe the issue and how to reproduce it..."
                  : feedbackType === 'feature_request'
                  ? "Describe the feature you'd like to see..."
                  : "Share your thoughts..."
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
