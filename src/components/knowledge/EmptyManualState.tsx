
import { Button } from "@/components/ui/button";
import { FileSearch, Upload } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface EmptyManualStateProps {
  onSubmitClick: () => void;
}

export function EmptyManualState({ onSubmitClick }: EmptyManualStateProps) {
  const { t } = useTranslation('knowledge');

  return (
    <div className="text-center py-10 bg-muted/20 rounded-lg border border-dashed">
      <FileSearch size={48} className="mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium mb-2">{t('manuals.no_manuals_title')}</h3>
      <p className="text-muted-foreground mb-4">{t('manuals.no_manuals_description')}</p>
      <Button onClick={onSubmitClick} className="gap-2">
        <Upload size={16} />
        {t('manuals.submit_manual')}
      </Button>
    </div>
  );
}
