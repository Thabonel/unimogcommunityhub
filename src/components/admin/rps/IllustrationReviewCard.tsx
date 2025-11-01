import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ZoomableImage } from '@/components/knowledge/ZoomableImage';

interface IllustrationData {
  id: string;
  description: string;
  image_url: string;
  page_number: number;
  group_code: string;
}

interface IllustrationReviewCardProps {
  illustration: IllustrationData;
  currentIndex: number;
  total: number;
  onApprove: () => void;
  onReject: (correctedName: string) => void;
  onSkip: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function IllustrationReviewCard({
  illustration,
  currentIndex,
  total,
  onApprove,
  onReject,
  onSkip,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}: IllustrationReviewCardProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [correctedName, setCorrectedName] = useState('');
  const [imageError, setImageError] = useState(false);

  const handleApprove = () => {
    onApprove();
    setIsRejecting(false);
    setCorrectedName('');
  };

  const handleRejectClick = () => {
    setIsRejecting(true);
    setCorrectedName(illustration.description);
  };

  const handleSaveCorrection = () => {
    if (correctedName.trim()) {
      onReject(correctedName.trim());
      setIsRejecting(false);
      setCorrectedName('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isRejecting) {
      if (e.key === 'y' || e.key === 'Y') {
        e.preventDefault();
        handleApprove();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleRejectClick();
      } else if (e.key === 'ArrowLeft' && hasPrevious) {
        e.preventDefault();
        onPrevious();
      } else if (e.key === 'ArrowRight' && hasNext) {
        e.preventDefault();
        onNext();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveCorrection();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsRejecting(false);
      setCorrectedName('');
    }
  };

  const progressPercentage = Math.round((currentIndex / total) * 100);

  return (
    <Card className="w-full max-w-4xl mx-auto" onKeyDown={handleKeyDown} tabIndex={0}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>RPS Illustration Review</CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              {currentIndex + 1} / {total}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {progressPercentage}% Complete
            </span>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Image Preview */}
        <div className="flex items-center justify-center bg-muted rounded-lg p-4 min-h-[400px]">
          {imageError ? (
            <div className="text-center text-muted-foreground">
              <p className="mb-2">Failed to load image</p>
              <p className="text-sm">{illustration.image_url}</p>
            </div>
          ) : (
            <ZoomableImage
              src={illustration.image_url}
              alt={illustration.description}
              className="max-h-[500px] max-w-full object-contain"
            />
          )}
        </div>

        {/* Illustration Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <Badge>Group: {illustration.group_code}</Badge>
            <Badge variant="secondary">Page: {illustration.page_number}</Badge>
          </div>

          <div>
            <Label className="text-base font-semibold">Current Name:</Label>
            <p className="text-lg mt-1">{illustration.description}</p>
          </div>
        </div>

        {/* Rename Input (shown when rejecting) */}
        {isRejecting && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <Label htmlFor="correctedName">Corrected Name:</Label>
            <Input
              id="correctedName"
              value={correctedName}
              onChange={(e) => setCorrectedName(e.target.value)}
              placeholder="Enter the correct illustration name..."
              className="text-base"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleSaveCorrection}
                disabled={!correctedName.trim()}
                className="flex-1"
              >
                Save Correction & Next
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRejecting(false);
                  setCorrectedName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Action Buttons (hidden when renaming) */}
        {!isRejecting && (
          <div className="space-y-3">
            <p className="text-center text-muted-foreground text-sm">
              Is this name correct?
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                variant="default"
                className="flex-1 h-12"
                size="lg"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Yes, Approve (Y)
              </Button>
              <Button
                onClick={handleRejectClick}
                variant="destructive"
                className="flex-1 h-12"
                size="lg"
              >
                <XCircle className="mr-2 h-5 w-5" />
                No, Rename (N)
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onSkip}
          disabled={isRejecting}
        >
          <SkipForward className="mr-2 h-4 w-4" />
          Skip
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!hasPrevious || isRejecting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={onNext}
            disabled={!hasNext || isRejecting}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
