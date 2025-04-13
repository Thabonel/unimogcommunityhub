
import { StorageManual } from "@/types/manuals";
import { ManualCard } from "./ManualCard";
import { EmptyManualState } from "./EmptyManualState";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Loading manuals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <button 
              onClick={onSubmit}
              className="text-sm underline hover:text-primary"
            >
              Try uploading a manual instead
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
