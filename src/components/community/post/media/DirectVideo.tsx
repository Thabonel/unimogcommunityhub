
import { useState, useEffect, useRef } from 'react';

interface DirectVideoProps {
  videoUrl: string;
  contentId?: string;
  trackContentEngagement: (event: string, contentId: string, contentType: string, metadata: Record<string, any>) => void;
}

const DirectVideo = ({ videoUrl, contentId = 'unknown', trackContentEngagement }: DirectVideoProps) => {
  const [videoError, setVideoError] = useState<boolean>(false);
  const [videoStarted, setVideoStarted] = useState<boolean>(false);
  const [videoPlayed, setVideoPlayed] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Track video playback
  const handleVideoPlay = () => {
    if (!videoStarted) {
      setVideoStarted(true);
      trackContentEngagement('video_play', contentId, 'video', {
        action: 'play',
        mediaType: 'video'
      });
    }
  };
  
  const handleVideoProgress = () => {
    if (videoRef.current) {
      const currentProgress = Math.floor((videoRef.current.currentTime / videoRef.current.duration) * 100);
      
      // Track at 25%, 50%, 75%, and 100% progress points
      const progressPoints = [25, 50, 75, 100];
      
      // Find the next progress point we haven't tracked yet
      const nextPoint = progressPoints.find(point => point > videoPlayed && currentProgress >= point);
      
      if (nextPoint) {
        setVideoPlayed(nextPoint);
        trackContentEngagement('feature_use', contentId, 'video', {
          action: 'video_progress',
          progress: nextPoint,
          mediaType: 'video'
        });
      }
    }
  };
  
  const handleVideoError = () => {
    setVideoError(true);
    trackContentEngagement('feature_use', contentId, 'video', {
      action: 'error',
      mediaType: 'video',
      errorType: 'load_failure'
    });
  };

  return (
    <div className="mt-4">
      <video 
        ref={videoRef}
        src={videoUrl} 
        controls 
        className="w-full rounded-md"
        preload="metadata"
        onError={handleVideoError}
        onPlay={handleVideoPlay}
        onTimeUpdate={handleVideoProgress}
        onEnded={() => {
          trackContentEngagement('feature_use', contentId, 'video', {
            action: 'complete',
            mediaType: 'direct_video'
          });
        }}
      >
        Your browser does not support the video tag.
      </video>
      {videoError && (
        <div className="mt-2 text-sm text-red-500">
          Error loading video. The format may not be supported by your browser or the URL might be incorrect.
        </div>
      )}
    </div>
  );
};

export default DirectVideo;
