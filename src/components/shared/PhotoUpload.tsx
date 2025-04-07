
import { useEffect } from 'react';
import { PhotoUploadProvider } from './photo-upload/PhotoUploadProvider';
import { AvatarDisplay } from './photo-upload/AvatarDisplay';
import { PhotoUploadButton } from './photo-upload/PhotoUploadButton';
import { PhotoRemoveButton } from './photo-upload/PhotoRemoveButton';
import { UploadStatus } from './photo-upload/UploadStatus';
import { usePhotoUpload } from './photo-upload/PhotoUploadProvider';
import { ensureStorageBuckets } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/toast';

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
  const { toast } = useToast();
  
  // Force proceed option for when buckets can't be created (for master users in development)
  const handleForceProceed = () => {
    toast({
      title: "Development Mode",
      description: "Proceeding in development mode without bucket verification",
    });
    
    // The force refresh will make the component re-mount
    window.location.reload();
  };
  
  if (!isBucketReady) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
        <div className="w-20 h-20 border rounded-full flex items-center justify-center bg-muted">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">Initializing upload...</p>
        
        {/* Force proceed option for development */}
        {localStorage.getItem('isMasterUser') === 'true' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={handleForceProceed}
          >
            Force proceed (Dev mode)
          </Button>
        )}
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
  const { toast } = useToast();
  
  // Check if we're in master user mode
  const isMasterUser = localStorage.getItem('isMasterUser') === 'true';
  
  // Try to initialize buckets on component mount, but don't block rendering
  useEffect(() => {
    console.log(`PhotoUpload component mounted, type: ${type}`);
    
    const initStorage = async () => {
      try {
        // Add a short delay to avoid race conditions
        setTimeout(async () => {
          console.log("Initializing storage buckets from PhotoUpload");
          await ensureStorageBuckets();
          console.log(`Storage buckets initialized for ${type} photo upload`);
        }, 500);
      } catch (error) {
        console.error(`Failed to initialize storage for ${type} photo upload:`, error);
        
        // For master users, we show a helpful message but don't block the UI
        if (isMasterUser) {
          toast({
            title: "Development Mode",
            description: "Storage initialization failed, but you can continue in development mode",
          });
        }
      }
    };
    
    initStorage();
  }, [type, toast, isMasterUser]);

  // For master users, ensure we have the flag set
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email === 'master@development.com') {
      localStorage.setItem('isMasterUser', 'true');
    }
  }, []);

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
