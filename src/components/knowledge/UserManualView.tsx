
import { ManualsList } from "@/components/knowledge/ManualsList";
import { StorageManual } from "@/types/manuals";

interface UserManualViewProps {
  approvedManuals: StorageManual[];
  isLoading: boolean;
  onView: (fileName: string) => void;
  onSubmit: () => void;
  error?: string | null;
}

export function UserManualView({
  approvedManuals,
  isLoading,
  onView,
  onSubmit,
  error
}: UserManualViewProps) {
  return (
    <ManualsList
      manuals={approvedManuals}
      isLoading={isLoading}
      onView={onView}
      onSubmit={onSubmit}
      isAdmin={false}
      error={error}
    />
  );
}
