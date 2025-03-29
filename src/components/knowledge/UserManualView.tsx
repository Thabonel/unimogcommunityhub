
import { ManualsList } from "@/components/knowledge/ManualsList";
import { StorageManual } from "@/types/manuals";

interface UserManualViewProps {
  approvedManuals: StorageManual[];
  isLoading: boolean;
  onView: (fileName: string) => void;
  onSubmit: () => void;
}

export function UserManualView({
  approvedManuals,
  isLoading,
  onView,
  onSubmit
}: UserManualViewProps) {
  return (
    <ManualsList
      manuals={approvedManuals}
      isLoading={isLoading}
      onView={onView}
      onSubmit={onSubmit}
      isAdmin={false}
    />
  );
}
