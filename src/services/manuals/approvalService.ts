
import { supabase, verifyBucket } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

/**
 * Approve a pending manual submission
 */
export const approveManual = async (id: string): Promise<void> => {
  try {
    console.log(`Approving manual with ID: ${id}`);
    const { error } = await supabase
      .from('manuals')
      .update({ approved: true })
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error approving manual:', error);
    throw error;
  }
};

/**
 * Reject a pending manual submission
 */
export const rejectManual = async (id: string): Promise<void> => {
  try {
    console.log(`Rejecting manual with ID: ${id}`);
    const { error } = await supabase
      .from('manuals')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error rejecting manual:', error);
    throw error;
  }
};

/**
 * Add a sample manual if none exist (for development)
 */
export const addSampleManual = async (): Promise<boolean> => {
  try {
    // Verify bucket exists first
    const bucketCheck = await verifyBucket('manuals');
    if (!bucketCheck.success) {
      console.error('Could not verify or create manuals bucket');
      return false;
    }
    
    // Check if there are any files in the bucket
    const { data: files, error: listError } = await supabase
      .storage
      .from('manuals')
      .list('');
      
    if (listError) {
      console.error('Error checking for existing manuals:', listError);
      return false;
    }
    
    // If there are already files, don't add a sample
    if (files && files.length > 0) {
      console.log('Manuals already exist, not adding sample');
      return false;
    }
    
    console.log('No manuals found, adding sample manual...');
    
    // Sample PDF URL (public domain PDF)
    const samplePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    
    try {
      // Fetch the sample PDF
      const response = await fetch(samplePdfUrl);
      if (!response.ok) throw new Error('Failed to fetch sample PDF');
      
      const pdfBlob = await response.blob();
      
      // Upload to Supabase Storage
      const fileName = 'UHB-Unimog-Cargo.pdf';
      const { error: uploadError } = await supabase
        .storage
        .from('manuals')
        .upload(fileName, pdfBlob, {
          contentType: 'application/pdf',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Error uploading sample manual:', uploadError);
        return false;
      }
      
      // Also create a database record
      const { error: dbError } = await supabase
        .from('manuals')
        .insert({
          title: 'Unimog U1700L Owner Manual',
          description: 'Complete operator guide for the U1700L model',
          file_path: fileName,
          submitted_by: '00000000-0000-0000-0000-000000000000', // Placeholder ID
          approved: true,
          file_size: pdfBlob.size,
          pages: 5
        });
        
      if (dbError) {
        console.error('Error creating sample manual record:', dbError);
      }
      
      console.log('Sample manual added successfully');
      toast({
        title: 'Sample manual added',
        description: 'A sample Unimog manual has been added for demonstration',
      });
      
      return true;
    } catch (e) {
      console.error('Error adding sample manual:', e);
      return false;
    }
  } catch (error) {
    console.error('Error in addSampleManual:', error);
    return false;
  }
};
