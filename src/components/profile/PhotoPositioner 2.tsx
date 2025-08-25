import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Move, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/toast';
import Cropper from 'react-easy-crop';
import { Area, Point } from 'react-easy-crop/types';

interface PhotoPositionerProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImageUrl: string) => void;
  aspectRatio?: number; // Default 1 for square
  type?: 'profile' | 'vehicle'; // To determine which bucket to use
}

// Helper function to create cropped image
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

// Helper function to crop image
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // Set canvas size to the safe area
  canvas.width = safeArea;
  canvas.height = safeArea;

  // Translate to center and rotate
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // Draw rotated image
  ctx.drawImage(
    image,
    safeArea / 2 - image.width * 0.5,
    safeArea / 2 - image.height * 0.5
  );

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // Set canvas width to final desired crop size
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Paste generated rotate image at the top left corner
  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      }
    }, 'image/jpeg', 0.9);
  });
};

const PhotoPositioner = ({ 
  imageUrl, 
  isOpen, 
  onClose, 
  onSave,
  aspectRatio = 1,
  type = 'profile'
}: PhotoPositionerProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = useCallback(async () => {
    if (!croppedAreaPixels || !user) return;

    try {
      setIsSaving(true);
      
      // Generate cropped image blob
      const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels, rotation);
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${user.id}/cropped_${timestamp}.jpg`;
      
      // Determine which bucket to use
      const bucketName = type === 'vehicle' ? 'vehicles' : 'avatars';
      
      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, croppedBlob, {
          contentType: 'image/jpeg',
          upsert: true
        });
      
      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: "Failed to save the cropped image",
          variant: "destructive"
        });
        return;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
      
      console.log('Cropped image uploaded:', publicUrl);
      onSave(publicUrl);
      toast({
        title: "Photo positioned",
        description: "Your photo has been cropped and saved",
      });
      
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Processing failed", 
        description: "Failed to process the image",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
      onClose();
    }
  }, [croppedAreaPixels, imageUrl, rotation, user, type, onSave, onClose, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Position Your Photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Move className="h-4 w-4" />
            Drag to position • Use slider to zoom • Scroll or pinch to zoom
          </div>
          
          {/* Cropper container */}
          <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
            <Cropper
              image={imageUrl}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              cropShape="round"
              showGrid={false}
              style={{
                containerStyle: {
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#f3f4f6'
                }
              }}
            />
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-4">
            <ZoomOut className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
              min={1}
              max={3}
              step={0.1}
              className="flex-1"
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground w-12">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Rotation controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Rotate:</span>
            <Slider
              value={[rotation]}
              onValueChange={([value]) => setRotation(value)}
              min={-180}
              max={180}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-12">
              {rotation}°
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !croppedAreaPixels}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Position'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoPositioner;