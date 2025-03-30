import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VideoUploadProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
}

const VideoUpload = ({ videoUrl, setVideoUrl }: VideoUploadProps) => {
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoType, setVideoType] = useState<'youtube' | 'vimeo' | 'other' | null>(null);

  // Validate video URL and extract video ID for preview
  useEffect(() => {
    if (!videoUrl.trim()) {
      setIsValidUrl(true);
      setVideoId(null);
      setVideoType(null);
      return;
    }

    try {
      const url = new URL(videoUrl);
      
      // YouTube validation
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        let id = null;
        if (url.hostname.includes('youtube.com')) {
          id = url.searchParams.get('v');
        } else if (url.hostname.includes('youtu.be')) {
          id = url.pathname.split('/').pop();
        }
        
        if (id) {
          setVideoId(id);
          setVideoType('youtube');
          setIsValidUrl(true);
        } else {
          setIsValidUrl(false);
        }
      } 
      // Vimeo validation
      else if (url.hostname.includes('vimeo.com')) {
        const id = url.pathname.split('/').pop();
        if (id) {
          setVideoId(id);
          setVideoType('vimeo');
          setIsValidUrl(true);
        } else {
          setIsValidUrl(false);
        }
      } 
      // Other video URLs
      else {
        setVideoType('other');
        setVideoId(null);
        // Basic validation - check if it ends with common video extensions
        const validExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        setIsValidUrl(
          validExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext))
        );
      }
    } catch (error) {
      setIsValidUrl(videoUrl.trim() === '');
      setVideoId(null);
      setVideoType(null);
    }
  }, [videoUrl]);

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          className={`w-full p-2 border rounded ${!isValidUrl ? 'border-red-500' : ''}`}
          placeholder="Video URL (YouTube, Vimeo, etc.)"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        
        {!isValidUrl && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please enter a valid video URL from YouTube, Vimeo, or a direct video file (.mp4, .webm, etc.)
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      {videoId && videoType === 'youtube' && (
        <div className="mt-4 aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            className="w-full h-full rounded-md"
            allowFullScreen
            title="YouTube video preview"
          ></iframe>
        </div>
      )}
      
      {videoId && videoType === 'vimeo' && (
        <div className="mt-4 aspect-video">
          <iframe 
            src={`https://player.vimeo.com/video/${videoId}`}
            className="w-full h-full rounded-md"
            allowFullScreen
            title="Vimeo video preview"
          ></iframe>
        </div>
      )}
      
      {videoType === 'other' && isValidUrl && videoUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Direct video link detected. Preview not available.</p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
