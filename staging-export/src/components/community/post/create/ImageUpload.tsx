
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface ImageUploadProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

const ImageUpload = ({ imageUrl, setImageUrl }: ImageUploadProps) => {
  return (
    <div className="space-y-2">
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt="Preview" 
          className="max-h-60 rounded object-cover" 
          onError={() => {
            toast({
              title: 'Invalid image URL',
              description: 'The provided URL cannot be loaded as an image',
              variant: 'destructive',
            });
            setImageUrl('');
          }}
        />
      )}
    </div>
  );
};

export default ImageUpload;
