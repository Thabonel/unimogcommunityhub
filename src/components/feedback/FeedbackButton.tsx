
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
import { FeedbackDialog } from './FeedbackDialog';
import { useAnalytics } from '@/hooks/use-analytics';

interface FeedbackButtonProps {
  variant?: 'default' | 'outline' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function FeedbackButton({ variant = 'outline', size }: FeedbackButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { trackFeatureUse } = useAnalytics();
  
  const handleOpenDialog = () => {
    trackFeatureUse('feedback_button_click');
    setDialogOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleOpenDialog}
        className="flex items-center gap-2"
      >
        <MessageSquarePlus size={16} />
        <span>Feedback</span>
      </Button>
      <FeedbackDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
