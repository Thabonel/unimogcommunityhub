import { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  showControls?: boolean;
}

export function ZoomableImage({
  src,
  alt,
  className = "",
  showControls = true
}: ZoomableImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={8}
      wheel={{ step: 0.1 }}
      doubleClick={{ mode: "reset" }}
      panning={{ disabled: false }}
      limitToBounds={false}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <div className="relative group">
          <TransformComponent>
            {imageError ? (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground min-h-[200px]">
                <AlertCircle className="h-12 w-12 mb-2" />
                <p className="font-medium">Error Loading Image</p>
                <p className="text-sm">Failed to load image. Please try again.</p>
              </div>
            ) : (
              <>
                <img
                  src={src}
                  alt={alt}
                  className={cn(
                    "cursor-move select-none",
                    className,
                    !imageLoaded && "opacity-0"
                  )}
                  loading="lazy"
                  draggable={false}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
                {!imageLoaded && (
                  <div className="flex items-center justify-center min-h-[200px] text-muted-foreground">
                    <div className="animate-pulse">Loading image...</div>
                  </div>
                )}
              </>
            )}
          </TransformComponent>

          {showControls && imageLoaded && !imageError && (
            <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={() => zoomIn()}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={() => zoomOut()}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                onClick={() => resetTransform()}
                title="Reset Zoom"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </TransformWrapper>
  );
}
