
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { StorageManual, PendingManual } from "@/types/manuals";
import { 
  fetchApprovedManuals, 
  deleteManual, 
  getManualSignedUrl,
  downloadManual,
  approveManual,
  rejectManual
} from "@/services/manuals/manualService";

export function useManuals() {
  const [approvedManuals, setApprovedManuals] = useState<StorageManual[]>([]);
  const [pendingManuals, setPendingManuals] = useState<PendingManual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manualToDelete, setManualToDelete] = useState<StorageManual | null>(null);

  const fetchManuals = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch manuals from the service
      const manuals = await fetchApprovedManuals();
      setApprovedManuals(manuals);
      
      // For now, we don't have pending manuals from storage directly
      setPendingManuals([]);
    } catch (error) {
      console.error('Error fetching manuals:', error);
      toast({
        title: 'Failed to load manuals',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleApproveManual = async (id: string) => {
    try {
      await approveManual(id);
      fetchManuals(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Failed to approve manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleRejectManual = async (id: string) => {
    try {
      await rejectManual(id);
      fetchManuals(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Failed to reject manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteManual = async () => {
    if (!manualToDelete) return;
    
    try {
      await deleteManual(manualToDelete.name);
      
      // Close dialog and refresh
      setDeleteDialogOpen(false);
      setManualToDelete(null);
      
      toast({
        title: 'Manual deleted',
        description: `${manualToDelete.metadata?.title || manualToDelete.name} has been removed`,
      });
      
      // Refresh the manuals list
      fetchManuals();
    } catch (error) {
      console.error('Error deleting manual:', error);
      toast({
        title: 'Failed to delete manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleViewPdf = async (fileName: string) => {
    try {
      const signedUrl = await getManualSignedUrl(fileName);
      setViewingPdf(signedUrl);
    } catch (error) {
      console.error('Error viewing manual:', error);
      toast({
        title: 'Failed to view manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async (fileName: string, title: string) => {
    try {
      await downloadManual(fileName, title);
    } catch (error) {
      toast({
        title: 'Failed to download manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchManuals();
  }, [fetchManuals]);

  return {
    approvedManuals,
    pendingManuals,
    isLoading,
    viewingPdf,
    deleteDialogOpen,
    manualToDelete,
    setViewingPdf,
    setDeleteDialogOpen,
    setManualToDelete,
    handleApproveManual,
    handleRejectManual,
    handleDeleteManual,
    handleViewPdf,
    handleDownload,
    fetchManuals
  };
}
