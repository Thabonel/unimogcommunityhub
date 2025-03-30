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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validate video URL and extract video ID for preview
  useEffect(() => {
    if (!videoUrl.trim()) {
      setIsValidUrl(true);
      setVideoId(null);
      setVideoType(null);
      setErrorMessage(null);
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
          setErrorMessage(null);
        } else {
          setIsValidUrl(false);
          setErrorMessage('Invalid YouTube URL. Please use a standard YouTube URL format.');
        }
      } 
      // Vimeo validation
      else if (url.hostname.includes('vimeo.com')) {
        const id = url.pathname.split('/').pop();
        if (id && !isNaN(Number(id))) {
          setVideoId(id);
          setVideoType('vimeo');
          setIsValidUrl(true);
          setErrorMessage(null);
        } else {
          setIsValidUrl(false);
          setErrorMessage('Invalid Vimeo URL. Please use a standard Vimeo URL format.');
        }
      } 
      // Other video URLs
      else {
        setVideoType('other');
        setVideoId(null);
        // Validate by file extension
        const validExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        const hasValidExtension = validExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
        
        // Allow common video hosting domains even without extension
        const knownVideoDomains = ['player.vimeo.com', 'dailymotion.com', 'twitch.tv', 'streamable.com'];
        const isKnownDomain = knownVideoDomains.some(domain => url.hostname.includes(domain));
        
        if (hasValidExtension || isKnownDomain) {
          setIsValidUrl(true);
          setErrorMessage(null);
        } else {
          setIsValidUrl(false);
          setErrorMessage('Please enter a valid video URL. Supported formats: .mp4, .webm, .ogg, .mov or known video hosting sites.');
        }
      }
    } catch (error) {
      setIsValidUrl(false);
      setErrorMessage('Please enter a valid URL.');
      setVideoId(null);
      setVideoType(null);
    }
  }, [videoUrl]);

  return (
    <div className="space-y-4">
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
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        
        {!isValidUrl && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errorMessage || 'Please enter a valid video URL.'}
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
          <p className="text-sm text-gray-500 mb-2">
            Direct video link detected. Video will be available after posting.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md flex items-center justify-center aspect-video">
            <div className="text-center">
              <div className="rounded-full bg-primary/10 p-3 inline-flex mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
              <p className="text-sm font-medium">Video will play here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;
