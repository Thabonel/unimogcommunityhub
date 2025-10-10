
import { StorageManual } from "@/types/manuals";
import { ManualCard } from "./ManualCard";
import { EmptyManualState } from "./EmptyManualState";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from 'react-i18next';

interface ManualsListProps {
  manuals: StorageManual[];
  isLoading: boolean;
  onView: (fileName: string) => void;
  onDelete?: (manual: StorageManual) => void;
  onSubmit: () => void;
  isAdmin?: boolean;
  error?: string | null;
}

export function ManualsList({
  manuals,
  isLoading,
  onView,
  onDelete,
  onSubmit,
  isAdmin = false,
  error = null
}: ManualsListProps) {
  const { t } = useTranslation('knowledge');

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">{t('manuals.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('manuals.error_title')}</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <button
              onClick={onSubmit}
              className="text-sm underline hover:text-primary"
            >
              {t('manuals.try_upload')}
            </button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (manuals.length === 0) {
    return <EmptyManualState onSubmitClick={onSubmit} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-4">
      {manuals.map((manual) => (
        <ManualCard
          key={manual.name} // Use name as key since id might not exist
          manual={manual}
          onView={onView}
          onDelete={isAdmin ? onDelete : undefined}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
