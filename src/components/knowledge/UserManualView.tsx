
import { ManualsList } from "@/components/knowledge/ManualsList";
import { StorageManual } from "@/types/manuals";

interface UserManualViewProps {
  approvedManuals: StorageManual[];
  isLoading: boolean;
  onView: (fileName: string) => void;
  onDownload: (fileName: string, title: string) => void;
  onSubmit: () => void;
}

export function UserManualView({
  approvedManuals,
  isLoading,
  onView,
  onDownload,
  onSubmit
}: UserManualViewProps) {
  return (
    <ManualsList
      manuals={approvedManuals}
      isLoading={isLoading}
      onView={onView}
      onDownload={onDownload}
      onSubmit={onSubmit}
      isAdmin={false}
    />
  );
}
