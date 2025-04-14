
import { useEffect } from 'react';
import { PhotoUploadProvider } from './photo-upload/PhotoUploadProvider';
import { AvatarDisplay } from './photo-upload/AvatarDisplay';
import { PhotoUploadButton } from './photo-upload/PhotoUploadButton';
import { PhotoRemoveButton } from './photo-upload/PhotoRemoveButton';
import { UploadStatus } from './photo-upload/UploadStatus';
import { usePhotoUpload } from './photo-upload/PhotoUploadProvider';
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
  // Initialize storage buckets when component mounts
  useEffect(() => {
    console.log(`PhotoUpload component mounted, initializing storage for ${type}`);
    
    // Prioritize storage initialization for better user experience
    const initializeStorage = async () => {
      try {
        const result = await ensureStorageBuckets();
        if (!result.success) {
          console.error("Failed to initialize storage buckets:", result.error);
        }
      } catch (error) {
        console.error("Error initializing storage:", error);
      }
    };
    
    initializeStorage();
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
