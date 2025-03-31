
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PdfZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function PdfZoomControls({ scale, onZoomIn, onZoomOut }: PdfZoomControlsProps) {
  return (
    <div className="flex items-center">
      <Button variant="outline" size="sm" onClick={onZoomOut}>
        <ZoomOut size={16} />
        <span className="sr-only">Zoom out</span>
      </Button>
      <span className="text-sm px-2">{Math.round(scale * 100)}%</span>
      <Button variant="outline" size="sm" onClick={onZoomIn}>
        <ZoomIn size={16} />
        <span className="sr-only">Zoom in</span>
      </Button>
    </div>
  );
}
