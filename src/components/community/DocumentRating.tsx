import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, MessageSquare, Send, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { communityDocumentService } from '@/services/community/CommunityDocumentService';
import { useToast } from '@/hooks/use-toast';

interface DocumentRatingProps {
  documentId: string;
  currentRating?: number;
  userRating?: number;
  onRatingUpdate: (newRating: number, newCount: number) => void;
  className?: string;
}

interface DocumentRating {
  id: string;
  created_at: string;
  document_id: string;
  user_id: string;
  rating: number;
  review_text?: string;
  profiles?: {
    display_name?: string;
    full_name?: string;
  };
}

export function DocumentRating({
  documentId,
  currentRating = 0,
  userRating,
  onRatingUpdate,
  className = ''
}: DocumentRatingProps) {
  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [existingReviews, setExistingReviews] = useState<DocumentRating[]>([]);
  const [showReviews, setShowReviews] = useState(false);
  const [hasUserRated, setHasUserRated] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    setSelectedRating(userRating || 0);
    setHasUserRated(!!userRating);
  }, [userRating]);

  const handleStarClick = async (rating: number) => {
    if (!user) {
      toast({
        title: 'Sign In Required',
        description: 'Please sign in to rate documents.',
        variant: 'default'
      });
      return;
    }

    setSelectedRating(rating);

    if (rating > 3) {
      // For ratings 4-5, show optional review dialog
      setShowReviewDialog(true);
    } else {
      // For ratings 1-3, submit immediately without review
      await submitRating(rating, '');
    }
  };

  const submitRating = async (rating: number, review?: string) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const success = await communityDocumentService.rateDocument(documentId, rating, review);

      if (success) {
        setHasUserRated(true);
        setShowReviewDialog(false);
        setReviewText('');

        toast({
          title: 'Rating Submitted',
          description: 'Thank you for your feedback!',
          variant: 'default'
        });

        // Refresh the document rating to get updated average
        // In a real app, we'd fetch the updated document
        // For now, we'll estimate the new average
        const newAverage = hasUserRated ? currentRating : ((currentRating * 1) + rating) / 2;
        onRatingUpdate(newAverage, 1);

      } else {
        toast({
          title: 'Rating Failed',
          description: 'Could not submit rating. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadReviews = async () => {
    try {
      const reviews = await communityDocumentService.getDocumentRatings(documentId, 10);
      setExistingReviews(reviews);
      setShowReviews(true);
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast({
        title: 'Error',
        description: 'Could not load reviews.',
        variant: 'destructive'
      });
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = starValue <= (hoveredRating || selectedRating);

      return (
        <button
          key={index}
          type="button"
          className={`transition-colors ${
            user ? 'cursor-pointer hover:scale-110' : 'cursor-default'
          } ${isActive ? 'text-yellow-400' : 'text-gray-300'}`}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => user && setHoveredRating(starValue)}
          onMouseLeave={() => user && setHoveredRating(0)}
          disabled={!user}
          title={
            !user
              ? 'Sign in to rate this document'
              : `Rate ${starValue} star${starValue !== 1 ? 's' : ''}`
          }
        >
          <Star
            className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`}
          />
        </button>
      );
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Star Rating Display */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {renderStars()}
        </div>
        <span className="text-sm text-muted-foreground">
          {currentRating > 0 ? currentRating.toFixed(1) : 'No ratings yet'}
        </span>
        {hasUserRated && (
          <span className="text-xs text-green-600 font-medium">
            You rated this
          </span>
        )}
      </div>

      {/* Reviews Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={loadReviews}
        className="gap-2 text-xs h-7 px-2"
      >
        <MessageSquare className="w-3 h-3" />
        Read Reviews
      </Button>

      {/* Review Submission Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add a Review (Optional)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Your rating:</span>
              <div className="flex">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${
                      index < selectedRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Tell other users what you think about this document... (optional)"
              rows={3}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewDialog(false);
                  submitRating(selectedRating, '');
                }}
                disabled={isSubmitting}
              >
                Skip Review
              </Button>
              <Button
                onClick={() => submitRating(selectedRating, reviewText)}
                disabled={isSubmitting}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reviews Display Dialog */}
      <Dialog open={showReviews} onOpenChange={setShowReviews}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Reviews</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {existingReviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reviews yet. Be the first to review this document!
              </p>
            ) : (
              existingReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {review.profiles?.display_name ||
                         review.profiles?.full_name ||
                         'Anonymous User'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className={`w-3 h-3 ${
                            index < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {review.review_text && (
                    <p className="text-sm text-muted-foreground">
                      {review.review_text}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}