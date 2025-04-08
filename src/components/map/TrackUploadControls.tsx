
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Track } from '@/types/track';

interface TrackUploadControlsProps {
  tracks?: Track[];
}

const TrackUploadControls = ({ tracks = [] }: TrackUploadControlsProps) => {
  // Function to handle GPX/KML file uploads
  const handleFileUpload = () => {
    // For now, just show a toast since we'll implement the full functionality later
    toast("File upload functionality coming soon");
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleFileUpload}
      >
        <Upload className="h-4 w-4 mr-1" />
        Upload Track
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={tracks.length === 0}
      >
        <Download className="h-4 w-4 mr-1" />
        Export Tracks
      </Button>
    </div>
  );
};

export default TrackUploadControls;
