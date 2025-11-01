import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <TransformComponent
            wrapperClass="!w-full !h-full"
            contentClass="!w-full !h-full"
          >
            <img
              src={src}
              alt={alt}
              className={`cursor-move select-none ${className}`}
              loading="lazy"
              draggable={false}
            />
          </TransformComponent>

          {showControls && (
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
