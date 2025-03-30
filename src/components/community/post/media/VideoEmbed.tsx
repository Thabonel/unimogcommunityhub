
import { useState } from 'react';

interface VideoEmbedProps {
  videoId: string;
  provider: 'youtube' | 'vimeo' | 'dailymotion';
  contentId?: string;
  trackContentEngagement: (event: string, contentId: string, contentType: string, metadata: Record<string, any>) => void;
}

const VideoEmbed = ({ videoId, provider, contentId = 'unknown', trackContentEngagement }: VideoEmbedProps) => {
  const [videoError, setVideoError] = useState<boolean>(false);
  
  let embedUrl = '';
  switch (provider) {
    case 'youtube':
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
      break;
    case 'vimeo':
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
      break;
    case 'dailymotion':
      embedUrl = `https://www.dailymotion.com/embed/video/${videoId}`;
      break;
  }
  
  const handleError = () => {
    setVideoError(true);
    trackContentEngagement('feature_use', contentId, 'video', {
      action: 'error',
      mediaType: provider,
      errorType: 'load_failure'
    });
  };
  
  const handleLoad = () => {
    trackContentEngagement('video_play', contentId, 'video', {
      action: 'load',
      mediaType: provider
    });
  };
  
  return (
    <div className="aspect-video mt-4">
      <iframe
        src={embedUrl}
        className="w-full h-full rounded-md"
        allowFullScreen
        title={`${provider} video`}
        onError={handleError}
        onLoad={handleLoad}
      ></iframe>
      {videoError && (
        <div className="mt-2 text-sm text-red-500">
          Error loading video. The video may be private or unavailable.
        </div>
      )}
    </div>
  );
};

export default VideoEmbed;
