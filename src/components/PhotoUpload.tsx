
import { useEffect } from 'react';
import { PhotoUploadProvider } from './shared/photo-upload/PhotoUploadProvider';
import { AvatarDisplay } from './shared/photo-upload/AvatarDisplay';
import { PhotoUploadButton } from './shared/photo-upload/PhotoUploadButton';
import { PhotoRemoveButton } from './shared/photo-upload/PhotoRemoveButton';
import { UploadStatus } from './shared/photo-upload/UploadStatus';
import { usePhotoUpload } from './shared/photo-upload/PhotoUploadProvider';
import { ensureStorageBuckets } from '@/lib/supabase';
import { Camera, Loader2 } from 'lucide-react';

interface PhotoUploadProps {
  initialImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  type: 'profile' | 'vehicle';
  className?: string;
}

// Main component that renders the photo upload UI
const PhotoUploadContent = ({ size = 'md', className = '' }: { size: 'sm' | 'md' | 'lg', className: string }) => {
  const { imageUrl, previewUrl, isUploading } = usePhotoUpload();
  
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative group">
        <div className="relative overflow-hidden rounded-full transition-all duration-300 hover:shadow-lg">
          <AvatarDisplay size={size} />
          
          {/* Hover overlay effect */}
          {!isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="h-8 w-8 text-white/90" />
            </div>
          )}
          
          {/* Loading spinner */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
        
        {(imageUrl || previewUrl) && <PhotoRemoveButton />}
        <PhotoUploadButton />
      </div>
      
      <UploadStatus />
    </div>
  );
};

// Wrapper component that provides the context
export const PhotoUpload = ({
  initialImageUrl,
  onImageUploaded,
  size = 'md',
  type,
  className = '',
}: PhotoUploadProps) => {
  // Ensure storage buckets exist when component mounts
  useEffect(() => {
    console.log(`PhotoUpload component mounted, type: ${type}`);
    ensureStorageBuckets().catch(console.error);
  }, [type]);

  return (
    <PhotoUploadProvider
      initialImageUrl={initialImageUrl}
      onImageUploaded={onImageUploaded}
      type={type}
    >
      <PhotoUploadContent size={size} className={className} />
    </PhotoUploadProvider>
  );
};
