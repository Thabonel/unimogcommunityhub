
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
export async function addSampleManualToStorage() {
  try {
    console.log('Adding sample manual...');
    
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
        throw uploadError;
      }
      
      console.log('Sample manual added successfully');
      return true;
    } catch (e) {
      console.error('Error adding sample manual:', e);
      throw e;
    }
  } catch (error) {
    console.error('Error adding sample manual:', error);
    return false;
  }
}

/**
 * Ensure sample manuals exist in the manuals bucket
 */
export async function ensureSampleManualsExist() {
  try {
    console.log('Checking for existing manuals...');
    
    // Check if any manuals already exist
    const { data: existingManuals, error: fetchError } = await supabase
      .storage
      .from('manuals')
      .list('');

    if (fetchError) {
      console.error('Error checking for existing manuals:', fetchError);
      throw fetchError;
    }

    if (!existingManuals || existingManuals.length === 0) {
      console.log('No manuals found, adding sample manual...');
      return await addSampleManualToStorage();
    }
    
    console.log('Manuals already exist, no need to add samples');
    return false;
  } catch (error) {
    console.error('Error ensuring sample manuals:', error);
    return false;
  }
}
