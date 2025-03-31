
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageIcon, X, Upload, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface PhotoUploadProps {
  initialImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  type: 'profile' | 'vehicle';
  className?: string;
}

export const PhotoUpload = ({
  initialImageUrl,
  onImageUploaded,
  size = 'md',
  type,
  className = '',
}: PhotoUploadProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Define the dimensions based on the size prop
  const dimensions = {
    sm: 'h-24 w-24',
    md: 'h-32 w-32',
    lg: 'h-40 w-40',
  };

  // Define the fallback text based on the type
  const fallbackText = type === 'profile' ? 'User' : 'Vehicle';
  const bucketId = type === 'profile' ? 'avatars' : 'vehicle_photos';
  const acceptedTypes = '.jpg,.jpeg,.png';
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (.jpg, .jpeg, .png)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      setIsUploading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create a unique file path with user ID
      const userId = user.id;
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from(bucketId)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage.from(bucketId).getPublicUrl(filePath);

      // Update state and trigger the callback
      setImageUrl(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: "Upload successful",
        description: `Your ${type === 'profile' ? 'profile' : 'vehicle'} photo has been uploaded.`,
      });

    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error.message || `Failed to upload ${type} photo.`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setImageUrl(null);
    setPreviewUrl(null);
    onImageUploaded('');
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <Avatar className={`${dimensions[size]} relative bg-muted`}>
          {(imageUrl || previewUrl) ? (
            <AvatarImage 
              src={previewUrl || imageUrl || ''} 
              alt={`${type === 'profile' ? 'User' : 'Vehicle'} photo`} 
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="text-2xl">
              {type === 'profile' ? (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              )}
            </AvatarFallback>
          )}
        </Avatar>
        
        {(imageUrl || previewUrl) && (
          <Button 
            variant="destructive"
            size="icon"
            onClick={handleRemove} 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute bottom-0 right-0 rounded-full bg-background shadow-sm"
          disabled={isUploading}
          asChild
        >
          <label htmlFor={`${type}-photo-upload`}>
            <Camera className="h-4 w-4" />
            <span className="sr-only">Upload photo</span>
            <input 
              type="file"
              id={`${type}-photo-upload`}
              accept={acceptedTypes}
              onChange={handleFileChange}
              className="sr-only"
              disabled={isUploading}
            />
          </label>
        </Button>
      </div>
      
      <div className="text-center text-sm">
        {isUploading ? (
          <p className="text-muted-foreground">Uploading...</p>
        ) : (
          <p className="text-muted-foreground">
            {imageUrl || previewUrl ? (
              <span>Click camera to change</span>
            ) : (
              <span>Click camera to upload</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
