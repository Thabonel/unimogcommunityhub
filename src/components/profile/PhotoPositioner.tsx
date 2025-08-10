import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Move, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/toast';

interface PhotoPositionerProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImageUrl: string) => void;
  aspectRatio?: number; // Default 1 for square
  type?: 'profile' | 'vehicle'; // To determine which bucket to use
}

const PhotoPositioner = ({ 
  imageUrl, 
  isOpen, 
  onClose, 
  onSave,
  aspectRatio = 1,
  type = 'profile'
}: PhotoPositionerProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Reset when opening with new image
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageUrl]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = async () => {
    if (!imageRef.current || !containerRef.current) return;
    
    // Create a canvas for cropping
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to create a square output
    const outputSize = 400; // Size of the final cropped image
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Create a new image element to ensure it's loaded
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Get the displayed dimensions of the image in the container
      const containerRect = containerRef.current!.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Calculate the visible circle area (90% of container, as r=45%)
      const circleRadius = Math.min(containerWidth, containerHeight) * 0.45;
      const circleDiameter = circleRadius * 2;
      
      // Calculate the actual image dimensions with zoom applied
      const displayedWidth = img.naturalWidth * zoom;
      const displayedHeight = img.naturalHeight * zoom;
      
      // Calculate the crop area in the source image
      // The center of the container is where the circle is
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      // Calculate where the crop starts in the zoomed image
      const cropStartX = (centerX - circleRadius - position.x) / zoom;
      const cropStartY = (centerY - circleRadius - position.y) / zoom;
      const cropSize = circleDiameter / zoom;
      
      // Draw the cropped circular area
      ctx.save();
      
      // Create circular clipping path
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // Draw the image with the calculated crop
      ctx.drawImage(
        img,
        cropStartX, cropStartY, cropSize, cropSize,  // Source rectangle
        0, 0, outputSize, outputSize                  // Destination rectangle
      );
      
      ctx.restore();
      
      // Convert canvas to blob and upload to Supabase
      canvas.toBlob(async (blob) => {
        if (blob && user) {
          try {
            setIsSaving(true);
            
            // Generate unique filename
            const timestamp = Date.now();
            const fileName = `${user.id}/cropped_${timestamp}.jpg`;
            
            // Determine which bucket to use
            const bucketName = type === 'vehicle' ? 'vehicles' : 'avatars';
            
            // Upload to Supabase
            const { data, error } = await supabase.storage
              .from(bucketName)
              .upload(fileName, blob, {
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
              // Fall back to blob URL if upload fails
              const croppedUrl = URL.createObjectURL(blob);
              onSave(croppedUrl);
            } else {
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
            }
          } catch (error) {
            console.error('Error uploading cropped image:', error);
            // Fall back to blob URL if upload fails
            const croppedUrl = URL.createObjectURL(blob);
            onSave(croppedUrl);
          } finally {
            setIsSaving(false);
            onClose();
          }
        } else if (blob) {
          // If no user, just use blob URL
          const croppedUrl = URL.createObjectURL(blob);
          onSave(croppedUrl);
          onClose();
        }
      }, 'image/jpeg', 0.9);
    };
    
    img.onerror = () => {
      console.error('Failed to load image for cropping');
      // Fallback to original image if cropping fails
      onSave(imageUrl);
      onClose();
    };
    
    img.src = imageUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Position Your Photo</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Move className="h-4 w-4" />
            Drag to position • Use slider to zoom
          </div>
          
          {/* Photo container */}
          <div 
            ref={containerRef}
            className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Circular mask overlay - fills the container */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* Dark overlay with circular cutout */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <mask id="circle-mask">
                    <rect width="100%" height="100%" fill="white" />
                    <circle 
                      cx="50%" 
                      cy="50%" 
                      r="45%"  
                      fill="black" 
                    />
                  </mask>
                </defs>
                <rect 
                  width="100%" 
                  height="100%" 
                  fill="rgba(0, 0, 0, 0.5)" 
                  mask="url(#circle-mask)"
                />
                {/* White circle border */}
                <circle 
                  cx="50%" 
                  cy="50%" 
                  r="45%" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="3"
                  strokeDasharray="5 5"
                  opacity="0.8"
                />
              </svg>
            </div>
            
            {/* Image */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt="Position your photo"
              className="absolute"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transformOrigin: 'center',
                maxWidth: 'none',
                height: 'auto',
                width: `${100 * zoom}%`,
                userSelect: 'none',
                pointerEvents: 'none'
              }}
              draggable={false}
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

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
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