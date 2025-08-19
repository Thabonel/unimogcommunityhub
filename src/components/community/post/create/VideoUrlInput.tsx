
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VideoUrlInputProps {
  videoUrl: string;
  isValidUrl: boolean;
  errorMessage: string | null;
  onChange: (url: string) => void;
}

const VideoUrlInput = ({ videoUrl, isValidUrl, errorMessage, onChange }: VideoUrlInputProps) => {
  return (
    <div>
      <label htmlFor="video-url" className="block text-sm font-medium mb-1">
        Video URL
      </label>
      <input
        id="video-url"
        type="text"
        className={`w-full p-2 border rounded ${!isValidUrl ? 'border-red-500' : ''}`}
        placeholder="Video URL (YouTube, Vimeo, etc.)"
        value={videoUrl}
        onChange={(e) => onChange(e.target.value)}
      />
      
      {!isValidUrl && errorMessage && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VideoUrlInput;
