
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_PHOTOS = 10;

interface PhotoUploadProps {
  photos: File[];
  setPhotos: React.Dispatch<React.SetStateAction<File[]>>;
}

export function PhotoUpload({ photos, setPhotos }: PhotoUploadProps) {
  const { toast } = useToast();
  
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: File[] = [];
    const invalidFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (file too large, max 5MB)`);
        continue;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid file type, must be JPG, PNG or WebP)`);
        continue;
      }
      newPhotos.push(file);
    }

    if (invalidFiles.length > 0) {
      toast({
        title: 'Some files could not be uploaded',
        description: (
          <ul className="list-disc pl-4">
            {invalidFiles.map((file, i) => (
              <li key={i}>{file}</li>
            ))}
          </ul>
        ) as unknown as string, // Cast to string to satisfy the toast prop type
        variant: 'destructive',
      });
    }

    if (photos.length + newPhotos.length > MAX_PHOTOS) {
      toast({
        title: "Too many images",
        description: `You can upload a maximum of ${MAX_PHOTOS} images`,
        variant: 'destructive',
      });
      return;
    }

    setPhotos([...photos, ...newPhotos]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        Photos <span className="text-muted-foreground">(up to {MAX_PHOTOS})</span>
      </label>
      <div className="flex flex-wrap gap-4 mb-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative w-24 h-24 rounded-md overflow-hidden border"
          >
            <img
              src={URL.createObjectURL(photo)}
              alt={`Preview ${index}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <div className="w-24 h-24 flex items-center justify-center border border-dashed rounded-md">
            <label
              htmlFor="photos"
              className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-sm text-muted-foreground"
            >
              <Upload className="h-6 w-6 mb-1" />
              <span>Upload</span>
            </label>
            <input
              id="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotoUpload}
              className="sr-only"
            />
          </div>
        )}
      </div>
      {photos.length === 0 && (
        <p className="text-sm text-destructive mb-2">At least one photo is required</p>
      )}
    </div>
  );
}
