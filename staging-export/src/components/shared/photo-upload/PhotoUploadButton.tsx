
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { usePhotoUpload } from './PhotoUploadProvider';

export const PhotoUploadButton = () => {
  const { isUploading, type, handleFileUpload } = usePhotoUpload();
  const acceptedTypes = '.jpg,.jpeg,.png';
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    console.log(`File selected for ${type} upload:`, files[0].name);
    handleFileUpload(files[0]);
  };
  
  return (
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
  );
};
