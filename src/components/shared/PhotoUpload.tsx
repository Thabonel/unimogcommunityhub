
import { useEffect } from 'react';
import { PhotoUploadProvider } from './photo-upload/PhotoUploadProvider';
import { AvatarDisplay } from './photo-upload/AvatarDisplay';
import { PhotoUploadButton } from './photo-upload/PhotoUploadButton';
import { PhotoRemoveButton } from './photo-upload/PhotoRemoveButton';
import { UploadStatus } from './photo-upload/UploadStatus';
import { usePhotoUpload } from './photo-upload/PhotoUploadProvider';
import { ensureStorageBuckets } from '@/lib/supabase';

interface PhotoUploadProps {
  initialImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  type: 'profile' | 'vehicle';
  className?: string;
}

// Main component that renders the photo upload UI
const PhotoUploadContent = ({ size = 'md', className = '' }: { size: 'sm' | 'md' | 'lg', className: string }) => {
  const { imageUrl, previewUrl } = usePhotoUpload();
  
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative">
        <AvatarDisplay size={size} />
        
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
