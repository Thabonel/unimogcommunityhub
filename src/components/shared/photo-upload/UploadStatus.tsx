
import { usePhotoUpload } from './PhotoUploadProvider';

export const UploadStatus = () => {
  const { isUploading, imageUrl, previewUrl } = usePhotoUpload();
  
  return (
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
  );
};
