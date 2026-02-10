import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export const useExpenseUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (file.size > maxFileSize) {
      return {
        valid: false,
        error: `File ${file.name} is too large. Maximum size is 10MB.`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported. Allowed types: PDF, images, Word, Excel.`,
      };
    }

    return { valid: true };
  }, []);

  const uploadFiles = useCallback(
    async (
      files: File[],
      expenseId: string,
      bucketName: string = 'expense-receipts'
    ): Promise<{ success: boolean; files: string[]; errors: string[] }> => {
      setIsUploading(true);
      const uploadedFiles: string[] = [];
      const errors: string[] = [];

      setUploadProgress(
        files.map((file) => ({
          fileName: file.name,
          progress: 0,
          status: 'pending',
        }))
      );

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const validation = validateFile(file);
        if (!validation.valid) {
          setUploadProgress((prev) =>
            prev.map((p, idx) =>
              idx === i
                ? { ...p, status: 'error', error: validation.error }
                : p
            )
          );
          errors.push(validation.error!);
          continue;
        }

        try {
          setUploadProgress((prev) =>
            prev.map((p, idx) =>
              idx === i ? { ...p, status: 'uploading', progress: 0 } : p
            )
          );

          const fileExt = file.name.split('.').pop();
          const fileName = `${expenseId}/${Date.now()}-${Math.random().toString(36).slice(2, 11)}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (error) throw error;

          uploadedFiles.push(fileName);

          setUploadProgress((prev) =>
            prev.map((p, idx) =>
              idx === i
                ? { ...p, progress: 100, status: 'success' }
                : p
            )
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : `Failed to upload ${file.name}`;

          setUploadProgress((prev) =>
            prev.map((p, idx) =>
              idx === i
                ? { ...p, status: 'error', error: errorMessage }
                : p
            )
          );

          errors.push(errorMessage);
        }
      }

      setIsUploading(false);
      return {
        success: errors.length === 0,
        files: uploadedFiles,
        errors,
      };
    },
    [validateFile]
  );

  const deleteFile = useCallback(
    async (filePath: string, bucketName: string = 'expense-receipts') => {
      try {
        const { error } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);

        if (error) throw error;
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to delete file',
        };
      }
    },
    []
  );

  const getPublicUrl = (filePath: string, bucketName: string = 'expense-receipts'): string => {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  };

  return {
    uploadFiles,
    deleteFile,
    getPublicUrl,
    uploadProgress,
    isUploading,
    validateFile,
  };
};
