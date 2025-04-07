
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { ManualFormValues } from "@/types/manuals";

// Maximum file size: 100MB (in bytes)
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

export const uploadManual = async (
  data: ManualFormValues,
  selectedFile: File,
  setUploadProgress: (progress: number) => void
): Promise<boolean> => {
  try {
    setUploadProgress(15);
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to submit a manual",
        variant: "destructive",
      });
      return false;
    }
    
    // Generate a unique file path to prevent naming conflicts
    const fileExt = selectedFile.name.split('.').pop();
    const filePath = `${uuidv4()}.${fileExt}`;
    
    // Increment progress to show we're starting the upload
    setUploadProgress(30);
    
    // For very large files, inform the user this may take some time
    if (selectedFile.size > 50 * 1024 * 1024) { // If larger than 50MB
      toast({
        title: "Large file detected",
        description: "Your file is large. The upload may take some time to complete.",
      });
    }
    
    // Since we can't use onUploadProgress directly, we'll simulate progress
    let currentProgress = 30;
    // Start a progress simulation
    const progressInterval = setInterval(() => {
      // Cap the progress at 90% until we confirm the upload is complete
      if (currentProgress < 90) {
        currentProgress += 1;
        setUploadProgress(currentProgress);
      }
    }, 1000);

    // First ensure manuals bucket exists
    try {
      const { error: bucketError } = await supabase.storage.getBucket('manuals');
      
      if (bucketError) {
        console.log('Manuals bucket does not exist, creating it...');
        await supabase.storage.createBucket('manuals', { public: false });
      }
    } catch (bucketError) {
      console.error('Error checking/creating bucket:', bucketError);
      // Continue anyway and attempt the upload
    }
    
    // Upload the file to Supabase Storage in the 'manuals' bucket
    const { error: uploadError, data: fileData } = await supabase.storage
      .from('manuals')
      .upload(filePath, selectedFile, {
        cacheControl: '3600',
        upsert: false
      });
      
    // Clear the interval once upload is complete
    clearInterval(progressInterval);
    
    // Set progress to 95% if we completed the file upload
    setUploadProgress(95);
      
    if (uploadError) {
      console.error("Error uploading manual:", uploadError);
      if (uploadError.message.includes("exceeded the maximum allowed size")) {
        throw new Error("The file is too large. Supabase limits uploads to 100MB. Please compress your PDF or split it into smaller parts.");
      }
      throw new Error(uploadError.message);
    }
    
    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('manuals')
      .getPublicUrl(filePath);
      
    // Save metadata to the manuals table
    const { error: dbError } = await supabase
      .from('manuals')
      .insert({
        title: data.title,
        description: data.description,
        file_path: filePath,
        file_size: selectedFile.size,
        submitted_by: user.id,
        approved: false, // All manuals start as unapproved
      });
      
    if (dbError) {
      // If there was an error saving to the database, delete the uploaded file
      await supabase.storage.from('manuals').remove([filePath]);
      throw new Error(dbError.message);
    }
    
    // Finally set progress to 100% when everything is complete
    setUploadProgress(100);
    
    toast({
      title: "Manual submitted",
      description: "Your manual has been submitted for review",
    });
    
    return true;
  } catch (error: any) {
    console.error("Error uploading manual:", error);
    toast({
      title: "Upload failed",
      description: error.message || "An error occurred while uploading the manual",
      variant: "destructive",
    });
    return false;
  }
};
