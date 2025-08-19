
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface PreviewToggleProps {
  showPreview: boolean;
  onToggle: () => void;
}

const PreviewToggle = ({ showPreview, onToggle }: PreviewToggleProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={onToggle}
      className="gap-1"
    >
      {showPreview ? (
        <>
          <EyeOff className="h-4 w-4" />
          <span>Hide Preview</span>
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          <span>Show Preview</span>
        </>
      )}
    </Button>
  );
};

export default PreviewToggle;
