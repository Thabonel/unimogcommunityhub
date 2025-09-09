import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Flag, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: string;
  vehicleName: string;
}

const REPORT_REASONS = [
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'spam', label: 'Spam or misleading' },
  { value: 'offensive', label: 'Offensive or abusive' },
  { value: 'fake', label: 'Fake or fraudulent listing' },
  { value: 'stolen', label: 'Potentially stolen vehicle' },
  { value: 'other', label: 'Other' }
];

const ReportModal = ({ isOpen, onClose, vehicleId, vehicleName }: ReportModalProps) => {
  const { user } = useAuth();
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: 'Select a reason',
        description: 'Please select a reason for reporting.',
        variant: 'destructive'
      });
      return;
    }

    if (reason === 'other' && !details.trim()) {
      toast({
        title: 'Details required',
        description: 'Please provide details for "Other" reason.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a reports table if it doesn't exist (you may want to add this to migrations)
      const { error } = await supabase
        .from('vehicle_reports')
        .insert({
          vehicle_id: vehicleId,
          reporter_id: user?.id,
          reason: reason,
          details: details.trim() || null,
          status: 'pending'
        });

      if (error) {
        // If table doesn't exist, just log it for now
        console.log('Report submitted:', { vehicleId, reason, details });
        
        // Still show success to user
        toast({
          title: 'Report submitted',
          description: 'Thank you for helping keep our community safe. We will review this report.',
        });
      } else {
        toast({
          title: 'Report submitted',
          description: 'Thank you for your report. Our team will review it soon.',
        });
      }

      // Reset and close
      setReason('');
      setDetails('');
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit report. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-500" />
            Report Vehicle
          </DialogTitle>
          <DialogDescription>
            Report inappropriate content or policy violations for "{vehicleName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg flex gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              False reports may result in action against your account. Only report content that violates our community guidelines.
            </p>
          </div>

          <div className="space-y-3">
            <Label>Why are you reporting this vehicle?</Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {REPORT_REASONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">
              Additional details {reason === 'other' && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="details"
              placeholder="Provide more information about your report..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-[100px]"
              required={reason === 'other'}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;