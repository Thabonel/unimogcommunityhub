
import React from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

interface VideoPreviewProps {
  videoId: string | null;
  videoType: 'youtube' | 'vimeo' | 'dailymotion' | 'other' | null;
  videoUrl: string;
  isValidUrl: boolean;
}

const VideoPreview = ({ videoId, videoType, videoUrl, isValidUrl }: VideoPreviewProps) => {
  const { trackFeatureUse } = useAnalytics();

  if (videoId && videoType === 'youtube') {
    return (
      <div className="mt-4 aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full rounded-md"
          allowFullScreen
          title="YouTube video preview"
          onLoad={() => trackFeatureUse('video_preview', {
            action: 'load',
            provider: 'youtube',
            videoId
          })}
        ></iframe>
      </div>
    );
  }
  
  if (videoId && videoType === 'vimeo') {
    return (
      <div className="mt-4 aspect-video">
        <iframe 
          src={`https://player.vimeo.com/video/${videoId}`}
          className="w-full h-full rounded-md"
          allowFullScreen
          title="Vimeo video preview"
          onLoad={() => trackFeatureUse('video_preview', {
            action: 'load',
            provider: 'vimeo',
            videoId
          })}
        ></iframe>
      </div>
    );
  }
  
  if (videoId && videoType === 'dailymotion') {
    return (
      <div className="mt-4 aspect-video">
        <iframe 
          src={`https://www.dailymotion.com/embed/video/${videoId}`}
          className="w-full h-full rounded-md"
          allowFullScreen
          title="Dailymotion video preview"
          onLoad={() => trackFeatureUse('video_preview', {
            action: 'load',
            provider: 'dailymotion',
            videoId
          })}
        ></iframe>
      </div>
    );
  }
  
  if (videoType === 'other' && isValidUrl && videoUrl) {
    return (
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
    );
  }
  
  return null;
};

export default VideoPreview;
