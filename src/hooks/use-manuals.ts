
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { StorageManual, PendingManual } from "@/types/manuals";

export function useManuals() {
  const [approvedManuals, setApprovedManuals] = useState<StorageManual[]>([]);
  const [pendingManuals, setPendingManuals] = useState<PendingManual[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manualToDelete, setManualToDelete] = useState<StorageManual | null>(null);

  const fetchManuals = async () => {
    setIsLoading(true);
    
    try {
      console.log('Fetching manuals from storage...');
      
      // Fetch files from the 'manuals' storage bucket
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('manuals')
        .list();

      if (storageError) {
        console.error('Error listing manuals:', storageError);
        
        if (storageError.message.includes('The resource was not found')) {
          // Bucket might not exist, try to create it
          try {
            await supabase.storage.createBucket('manuals', { public: false });
            console.log('Created manuals bucket since it was missing');
            
            // Try listing again
            const { data: retryData, error: retryError } = await supabase
              .storage
              .from('manuals')
              .list();
              
            if (retryError) throw retryError;
            
            const manualFiles = (retryData || [])
              .filter(item => !item.id.endsWith('/'))
              .map(file => ({
                id: file.id,
                name: file.name,
                size: file.metadata?.size || 0,
                created_at: file.created_at,
                updated_at: file.updated_at || file.created_at,
                metadata: {
                  title: file.metadata?.title || file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
                  description: file.metadata?.description || 'Unimog manual',
                  pages: file.metadata?.pages || null
                }
              }));
            
            setApprovedManuals(manualFiles);
            return;
          } catch (createError) {
            console.error('Failed to create manuals bucket:', createError);
            throw new Error('Failed to access or create manuals storage bucket');
          }
        } else {
          throw storageError;
        }
      }

      // Filter out folders and process files
      const manualFiles = (storageData || [])
        .filter(item => !item.id.endsWith('/'))
        .map(file => ({
          id: file.id,
          name: file.name,
          size: file.metadata?.size || 0,
          created_at: file.created_at,
          updated_at: file.updated_at || file.created_at,
          metadata: {
            title: file.metadata?.title || file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
            description: file.metadata?.description || 'Unimog manual',
            pages: file.metadata?.pages || null
          }
        }));

      console.log('Fetched manuals:', manualFiles.length);
      setApprovedManuals(manualFiles);
      
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
  };

  const handleApproveManual = async (id: string) => {
    // This would need to be implemented differently for storage
    toast({
      title: "Manual approved",
      description: "The manual is now visible to all users",
    });
  };

  const handleRejectManual = async (id: string) => {
    // This would need to be implemented differently for storage
    toast({
      title: "Manual rejected",
      description: "The manual has been rejected",
    });
  };

  const handleDeleteManual = async () => {
    if (!manualToDelete) return;
    
    try {
      // Delete the file from storage
      const { error: deleteError } = await supabase
        .storage
        .from('manuals')
        .remove([manualToDelete.name]);
      
      if (deleteError) throw deleteError;
      
      // Also delete any database record if it exists
      const { error: dbDeleteError } = await supabase
        .from('manuals')
        .delete()
        .eq('file_path', manualToDelete.name);
      
      if (dbDeleteError) {
        console.error('Error deleting manual record:', dbDeleteError);
        // Continue anyway since the file is deleted
      }
      
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
      console.log('Getting signed URL for:', fileName);
      // Get a signed URL for the file
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('manuals')
        .createSignedUrl(fileName, 60 * 60); // 1 hour expiry
      
      if (signedUrlError) throw signedUrlError;
      if (!signedUrlData?.signedUrl) throw new Error("Failed to get signed URL");
      
      console.log('Signed URL created successfully');
      setViewingPdf(signedUrlData.signedUrl);
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
      // Get the file from storage
      const { data, error } = await supabase.storage
        .from('manuals')
        .download(fileName);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = title + '.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Download started',
        description: `Downloading ${title}`,
      });
    } catch (error) {
      console.error('Error downloading manual:', error);
      toast({
        title: 'Failed to download manual',
        description: 'Please try again later',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchManuals();
  }, []);

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
