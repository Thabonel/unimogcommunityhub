
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualsList } from "@/components/knowledge/ManualsList";
import { PendingManualsList } from "@/components/knowledge/PendingManualsList";
import { StorageManual, PendingManual } from "@/types/manuals";

interface AdminManualViewProps {
  approvedManuals: StorageManual[];
  pendingManuals: PendingManual[];
  isLoading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onView: (fileName: string) => void;
  onDownload: (fileName: string, title: string) => void;
  onDelete: (manual: StorageManual) => void;
  onSubmit: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function AdminManualView({
  approvedManuals,
  pendingManuals,
  isLoading,
  activeTab,
  setActiveTab,
  onView,
  onDownload,
  onDelete,
  onSubmit,
  onApprove,
  onReject
}: AdminManualViewProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
      <TabsList>
        <TabsTrigger value="approved">Available Manuals</TabsTrigger>
        <TabsTrigger value="pending">
          Pending Approval
          {pendingManuals.length > 0 && (
            <span className="ml-2 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-xs">
              {pendingManuals.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="approved">
        <ManualsList
          manuals={approvedManuals}
          isLoading={isLoading}
          onView={onView}
          onDownload={onDownload}
          onDelete={onDelete}
          onSubmit={onSubmit}
          isAdmin={true}
        />
      </TabsContent>
      
      <TabsContent value="pending">
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-4">Manuals Pending Approval</h2>
          <PendingManualsList 
            pendingManuals={pendingManuals}
            onApprove={onApprove}
            onReject={onReject}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
