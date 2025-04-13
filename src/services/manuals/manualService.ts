
import { supabase, verifyBucket } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

/**
 * Verify that the manuals bucket exists
 */
export async function verifyManualsBucket() {
  try {
    console.log('Verifying manuals bucket...');
    const bucketResult = await verifyBucket('manuals');
    
    if (!bucketResult.success) {
      console.error('Failed to verify manuals bucket:', bucketResult.error);
      return false;
    }
    
    console.log('Manuals bucket verified successfully');
    return true;
  } catch (error) {
    console.error('Error verifying manuals bucket:', error);
    return false;
  }
}

/**
 * Add a sample manual if none exist in the bucket
 */
export async function ensureSampleManualsExist() {
  try {
    // Check if the bucket exists
    const bucketExists = await verifyManualsBucket();
    if (!bucketExists) {
      console.error('Manuals bucket does not exist, cannot add sample manuals');
      return false;
    }
    
    // Check if any files already exist
    const { data: existingFiles, error: listError } = await supabase.storage
      .from('manuals')
      .list();
      
    if (listError) {
      console.error('Error checking for existing manuals:', listError);
      return false;
    }
    
    // If files already exist, no need to add sample
    if (existingFiles && existingFiles.length > 0) {
      console.log('Manuals already exist, skipping sample addition');
      return false;
    }
    
    // Add sample manual - for now we're using a public URL
    // In a production app, you'd upload an actual PDF
    console.log('Adding sample U1700L manual...');
    
    // Fetch a sample PDF (public domain PDF for demonstration)
    try {
      const response = await fetch('https://api.allorigins.win/raw?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sample PDF');
      }
      
      const pdfBlob = await response.blob();
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('manuals')
        .upload('UHB-Unimog-Cargo.pdf', pdfBlob, {
          contentType: 'application/pdf',
          upsert: true,
        });
        
      if (uploadError) {
        console.error('Error uploading sample manual:', uploadError);
        return false;
      }
      
      console.log('Sample manual added successfully');
      return true;
    } catch (error) {
      console.error('Error adding sample manual:', error);
      return false;
    }
  } catch (error) {
    console.error('Error in ensureSampleManualsExist:', error);
    return false;
  }
}

/**
 * Fetch all approved manuals from storage
 */
export async function fetchApprovedManuals() {
  try {
    // Ensure the bucket exists first
    const bucketExists = await verifyManualsBucket();
    if (!bucketExists) {
      console.error('Manuals bucket does not exist');
      return [];
    }
    
    // List all files in the manuals bucket
    const { data: files, error } = await supabase.storage
      .from('manuals')
      .list();
      
    if (error) {
      console.error('Error fetching manuals:', error);
      throw error;
    }
    
    if (!files || files.length === 0) {
      return [];
    }
    
    // Format the files for display
    return files.map((file) => ({
      id: file.id,
      name: file.name,
      size: file.metadata?.size || 0,
      created_at: file.created_at,
      metadata: {
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
      }
    }));
  } catch (error) {
    console.error('Error in fetchApprovedManuals:', error);
    return [];
  }
}

/**
 * Get a signed URL for viewing a manual
 */
export async function getManualSignedUrl(fileName) {
  try {
    const { data, error } = await supabase.storage
      .from('manuals')
      .createSignedUrl(fileName, 60 * 5); // 5 minutes expiry
    
    if (error) {
      console.error('Error getting signed URL:', error);
      throw error;
    }
    
    return data.signedUrl;
  } catch (error) {
    console.error('Error getting signed URL:', error);
    throw error;
  }
}

/**
 * Download a manual by name
 */
export async function downloadManual(fileName, displayName) {
  try {
    const { data, error } = await supabase.storage
      .from('manuals')
      .download(fileName);
      
    if (error) {
      console.error('Error downloading manual:', error);
      throw error;
    }
    
    // Create blob URL and trigger download
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = displayName ? `${displayName}.pdf` : fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading manual:', error);
    throw error;
  }
}

/**
 * Delete a manual from storage
 */
export async function deleteManual(fileName) {
  try {
    const { error } = await supabase.storage
      .from('manuals')
      .remove([fileName]);
      
    if (error) {
      console.error('Error deleting manual:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting manual:', error);
    throw error;
  }
}

/**
 * Approve a pending manual
 */
export async function approveManual(id) {
  try {
    const { error } = await supabase
      .from('manuals')
      .update({ approved: true })
      .eq('id', id);
      
    if (error) {
      console.error('Error approving manual:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error approving manual:', error);
    throw error;
  }
}

/**
 * Reject a pending manual
 */
export async function rejectManual(id) {
  try {
    const { error } = await supabase
      .from('manuals')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error rejecting manual:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error rejecting manual:', error);
    throw error;
  }
}

// Removed the unused addSampleManualToStorage function that caused the error
