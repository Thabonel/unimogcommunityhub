
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ImageIcon } from 'lucide-react';
import { usePhotoUpload } from './PhotoUploadProvider';

interface AvatarDisplayProps {
  size: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AvatarDisplay = ({ size, className = '' }: AvatarDisplayProps) => {
  const { imageUrl, previewUrl, type } = usePhotoUpload();
  
  // Define the dimensions based on the size prop
  const dimensions = {
    sm: 'h-24 w-24',
    md: 'h-32 w-32',
    lg: 'h-40 w-40',
  };

  // Define the fallback text based on the type
  const fallbackText = type === 'profile' ? 'User' : 'Vehicle';
  
  return (
    <Avatar className={`${dimensions[size]} bg-muted ${className}`}>
      {(imageUrl || previewUrl) ? (
        <AvatarImage 
          src={previewUrl || imageUrl || ''} 
          alt={`${fallbackText} photo`} 
          className="object-cover"
        />
      ) : (
        <AvatarFallback className="text-2xl">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};
