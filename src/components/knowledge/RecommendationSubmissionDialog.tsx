import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecommendationSubmissionForm } from "./RecommendationSubmissionForm";
import { useTranslation } from 'react-i18next';

interface RecommendationSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  category?: string;
}

export function RecommendationSubmissionDialog({
  open,
  onOpenChange,
  onSuccess,
  category
}: RecommendationSubmissionDialogProps) {
  const { t } = useTranslation('knowledge');

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    else onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('recommendations.dialog_title')}</DialogTitle>
          <DialogDescription>
            {t('recommendations.dialog_description')}
          </DialogDescription>
        </DialogHeader>
        <RecommendationSubmissionForm
          onSuccess={handleSuccess}
          defaultCategory={category}
        />
      </DialogContent>
    </Dialog>
  );
}