import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Move } from 'lucide-react';

interface PhotoPositionerProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImageUrl: string) => void;
  aspectRatio?: number; // Default 1 for square
}

const PhotoPositioner = ({ 
  imageUrl, 
  isOpen, 
  onClose, 
  onSave,
  aspectRatio = 1 
}: PhotoPositionerProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    // For now, just save the positioning data
    // The actual cropping would need to be done server-side or with a proper image processing library
    // For MVP, we'll just use the original image with CSS positioning
    
    // You could store zoom and position in metadata
    const positionData = {
      zoom,
      x: position.x,
      y: position.y
    };
    
    console.log('Position data to save:', positionData);
    
    // For now, just return the original URL
    // In a full implementation, you'd upload the cropped image to Supabase
    onSave(imageUrl);
    onClose();
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
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Position
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoPositioner;