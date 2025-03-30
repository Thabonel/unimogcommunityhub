
import { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RatingStars } from './RatingStars';
import { submitFeedback } from '@/services/feedbackService';
import { toast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/use-analytics';

interface SurveyQuestion {
  id: string;
  type: 'rating' | 'text';
  question: string;
  required?: boolean;
}

interface SurveyPopupProps {
  title: string;
  description: string;
  questions: SurveyQuestion[];
  triggerAfterTime?: number; // Show after this many seconds
  triggerAfterEvents?: number; // Show after this many user interactions
  onComplete?: () => void;
}

export function SurveyPopup({
  title,
  description,
  questions,
  triggerAfterTime = 60,
  triggerAfterEvents = 5,
  onComplete,
}: SurveyPopupProps) {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [eventCount, setEventCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Check if survey has been completed or dismissed recently
    const lastSurvey = localStorage.getItem('lastSurveyTime');
    if (lastSurvey && Date.now() - parseInt(lastSurvey) < 1000 * 60 * 60 * 24) {
      // Don't show again within 24 hours
      return;
    }

    // Time-based trigger
    const timeoutId = setTimeout(() => {
      if (eventCount >= triggerAfterEvents) {
        setOpen(true);
        trackEvent('survey_shown', { trigger: 'time', survey_title: title });
      }
    }, triggerAfterTime * 1000);

    // Event-based listener
    const handleUserEvent = () => {
      setEventCount(prev => {
        const newCount = prev + 1;
        if (newCount === triggerAfterEvents) {
          setOpen(true);
          trackEvent('survey_shown', { trigger: 'events', survey_title: title });
        }
        return newCount;
      });
    };

    document.addEventListener('click', handleUserEvent);
    document.addEventListener('keydown', handleUserEvent);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleUserEvent);
      document.removeEventListener('keydown', handleUserEvent);
    };
  }, [eventCount, triggerAfterEvents, triggerAfterTime, title, trackEvent]);

  const handleSubmit = async () => {
    const requiredQuestionsAnswered = questions
      .filter(q => q.required)
      .every(q => answers[q.id] !== undefined);

    if (!requiredQuestionsAnswered) {
      toast({
        title: 'Missing answers',
        description: 'Please answer all required questions.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Find first rating question to use as primary rating
      const ratingQuestion = questions.find(q => q.type === 'rating');
      const rating = ratingQuestion ? answers[ratingQuestion.id] : undefined;

      const result = await submitFeedback({
        type: 'general',
        content: `Survey: ${title}`,
        rating: rating as any,
        metadata: {
          survey_title: title,
          survey_responses: answers,
        },
      });

      if (result) {
        toast({
          title: 'Thank you for your feedback!',
          description: 'Your responses have been recorded.',
        });

        // Track survey completion
        trackEvent('survey_completed', {
          survey_title: title,
          questions_count: questions.length,
        });

        // Save that user completed the survey
        localStorage.setItem('lastSurveyTime', Date.now().toString());
        
        setOpen(false);
        if (onComplete) onComplete();
      } else {
        toast({
          title: 'Submission failed',
          description: 'Unable to submit survey. Please try again later.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('lastSurveyTime', Date.now().toString());
    trackEvent('survey_dismissed', { survey_title: title });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-2 space-y-6">
          {questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label htmlFor={question.id}>
                {question.question}
                {question.required && <span className="text-red-500"> *</span>}
              </Label>
              {question.type === 'rating' ? (
                <RatingStars
                  rating={answers[question.id]}
                  onChange={(value) =>
                    setAnswers((prev) => ({ ...prev, [question.id]: value }))
                  }
                />
              ) : (
                <Textarea
                  id={question.id}
                  placeholder="Enter your answer..."
                  value={answers[question.id] || ''}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
        </div>
        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Not Now
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
