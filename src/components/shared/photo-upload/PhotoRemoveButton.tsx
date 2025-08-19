
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { usePhotoUpload } from './PhotoUploadProvider';

export const PhotoRemoveButton = () => {
  const { handleRemovePhoto } = usePhotoUpload();
  
  return (
    <Button 
      variant="destructive"
      size="icon"
      onClick={handleRemovePhoto} 
      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
    >
      <X className="h-3 w-3" />
    </Button>
  );
};
