
import { useEffect } from 'react';
import { PhotoUploadProvider } from './photo-upload/PhotoUploadProvider';
import { AvatarDisplay } from './photo-upload/AvatarDisplay';
import { PhotoUploadButton } from './photo-upload/PhotoUploadButton';
import { PhotoRemoveButton } from './photo-upload/PhotoRemoveButton';
import { UploadStatus } from './photo-upload/UploadStatus';
import { usePhotoUpload } from './photo-upload/PhotoUploadProvider';
import { ensureStorageBuckets } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

interface PhotoUploadProps {
  initialImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  type: 'profile' | 'vehicle';
  className?: string;
}

// Main component that renders the photo upload UI
const PhotoUploadContent = ({ size = 'md', className = '' }: { size: 'sm' | 'md' | 'lg', className: string }) => {
  const { imageUrl, previewUrl, isBucketReady } = usePhotoUpload();
  
  if (!isBucketReady) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <div className="w-20 h-20 border rounded-full flex items-center justify-center bg-muted">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Initializing upload...</p>
      </div>
    );
  }
  
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
    const initStorage = async () => {
      try {
        await ensureStorageBuckets();
        console.log(`Storage buckets initialized for ${type} photo upload`);
      } catch (error) {
        console.error(`Failed to initialize storage for ${type} photo upload:`, error);
      }
    };
    
    initStorage();
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
