import { supabase } from '@/lib/supabase-client';
import { toast } from '@/hooks/use-toast';

export interface PendingManualUpload {
  id: string;
  filename: string;
  original_filename: string;
  title: string;
  description?: string;
  category: string;
  model_codes: string[];
  year_range?: string;
  file_size: number;
  uploaded_by: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  // Joined user data
  uploader_email?: string;
  uploader_name?: string;
}

export interface ManualUploadData {
  title: string;
  description?: string;
  category: string;
  model_codes?: string[];
  year_range?: string;
  file: File;
}

class ManualApprovalService {
  /**
   * Upload a manual for admin approval (user workflow)
   */
  async submitManualForApproval(data: ManualUploadData): Promise<PendingManualUpload> {
    try {
      const { file, title, description, category, model_codes, year_range } = data;
      const filename = `pending_${Date.now()}_${Math.random().toString(36).substring(2)}_${file.name}`;

      // Upload file to pending manuals bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('pending-manuals')
        .upload(filename, file, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Authentication required');
      }

      // Create pending upload record
      const { data: pendingUpload, error: dbError } = await supabase
        .from('pending_manual_uploads')
        .insert({
          filename,
          original_filename: file.name,
          title,
          description: description || '',
          category,
          model_codes: model_codes || [],
          year_range: year_range || null,
          file_size: file.size,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('pending-manuals').remove([filename]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      toast({
        title: 'Manual submitted for approval',
        description: 'Your manual has been submitted and is pending admin approval.',
      });

      return pendingUpload;
    } catch (error) {
      console.error('Error submitting manual for approval:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      throw error;
    }
  }

  /**
   * Get all pending manual uploads (admin only)
   */
  async getPendingUploads(): Promise<PendingManualUpload[]> {
    try {
      const { data, error } = await supabase
        .from('pending_manual_uploads')
        .select(`
          *,
          profiles!uploaded_by(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(upload => ({
        ...upload,
        uploader_email: upload.profiles?.email || 'Unknown Email',
        uploader_name: upload.profiles?.full_name || 'Unknown User',
      }));
    } catch (error) {
      console.error('Error fetching pending uploads:', error);
      toast({
        title: 'Error loading pending uploads',
        description: 'Could not fetch pending manual uploads',
        variant: 'destructive',
      });
      return [];
    }
  }

  /**
   * Get user's own uploaded manuals
   */
  async getUserUploads(): Promise<PendingManualUpload[]> {
    try {
      const { data, error } = await supabase
        .from('pending_manual_uploads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user uploads:', error);
      return [];
    }
  }

  /**
   * Approve a manual and trigger processing (admin only)
   */
  async approveManual(pendingUploadId: string): Promise<boolean> {
    try {
      // Call the database function to approve and create manual_metadata record
      const { data, error } = await supabase.rpc('approve_manual_for_processing', {
        pending_upload_id: pendingUploadId
      });

      if (error) throw error;

      const newManualId = data;

      // Get the approved upload details
      const { data: approvedUpload, error: fetchError } = await supabase
        .from('pending_manual_uploads')
        .select('filename')
        .eq('id', pendingUploadId)
        .single();

      if (fetchError) throw fetchError;

      // Move file from pending-manuals to manuals bucket
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('pending-manuals')
        .download(approvedUpload.filename);

      if (downloadError) throw downloadError;

      // Upload to main manuals bucket
      const { error: moveError } = await supabase.storage
        .from('manuals')
        .upload(approvedUpload.filename, fileData, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (moveError) throw moveError;

      // Remove from pending bucket
      const { error: removeError } = await supabase.storage
        .from('pending-manuals')
        .remove([approvedUpload.filename]);
      
      if (removeError) {
        console.warn('Warning: Could not remove file from pending bucket:', removeError);
        // Don't throw here as the approval was successful
      }

      // Now trigger processing
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Authentication required for processing');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-manual`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            filename: approvedUpload.filename,
            bucket: 'manuals'
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Processing failed:', error);
        // Don't throw here - the manual is approved even if processing fails
      }

      toast({
        title: 'Manual approved',
        description: 'The manual has been approved and is being processed.',
      });

      return true;
    } catch (error) {
      console.error('Error approving manual:', error);
      toast({
        title: 'Approval failed',
        description: error instanceof Error ? error.message : 'Could not approve manual',
        variant: 'destructive',
      });
      return false;
    }
  }

  /**
   * Reject a manual upload (admin only)
   */
  async rejectManual(pendingUploadId: string, reason?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('reject_manual_upload', {
        pending_upload_id: pendingUploadId,
        reason: reason || null
      });

      if (error) throw error;

      // Get the rejected upload details to clean up file
      const { data: rejectedUpload, error: fetchError } = await supabase
        .from('pending_manual_uploads')
        .select('filename, profiles!uploaded_by(email)')
        .eq('id', pendingUploadId)
        .single();

      if (!fetchError && rejectedUpload) {
        // Remove file from pending bucket
        await supabase.storage
          .from('pending-manuals')
          .remove([rejectedUpload.filename]);
      }

      toast({
        title: 'Manual rejected',
        description: reason ? `Manual rejected: ${reason}` : 'Manual has been rejected',
      });

      return true;
    } catch (error) {
      console.error('Error rejecting manual:', error);
      toast({
        title: 'Rejection failed',
        description: error instanceof Error ? error.message : 'Could not reject manual',
        variant: 'destructive',
      });
      return false;
    }
  }

  /**
   * Download a pending manual file (admin only)
   */
  async downloadPendingManual(filename: string): Promise<void> {
    try {
      const { data, error } = await supabase.storage
        .from('pending-manuals')
        .download(filename);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download failed',
        description: 'Could not download the manual',
        variant: 'destructive',
      });
    }
  }
}

export const manualApprovalService = new ManualApprovalService();