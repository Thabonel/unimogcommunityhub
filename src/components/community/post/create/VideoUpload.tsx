
import React from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { useVideoValidation } from './hooks/useVideoValidation';
import VideoUrlInput from './VideoUrlInput';
import VideoPreview from './VideoPreview';

interface VideoUploadProps {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
}

const VideoUpload = ({ videoUrl, setVideoUrl }: VideoUploadProps) => {
  const { trackFeatureUse } = useAnalytics();
  const { isValidUrl, videoId, videoType, errorMessage } = useVideoValidation(videoUrl);
  
  // Track input interactions
  const handleUrlChange = (url: string) => {
    setVideoUrl(url);
    
    if (url.trim()) {
      trackFeatureUse('video_upload', {
        action: 'input',
        inputLength: url.length
      });
    }
  };

  return (
    <div className="space-y-4">
      <VideoUrlInput 
        videoUrl={videoUrl} 
        isValidUrl={isValidUrl} 
        errorMessage={errorMessage}
        onChange={handleUrlChange}
      />
      
      <VideoPreview 
        videoId={videoId} 
        videoType={videoType} 
        videoUrl={videoUrl} 
        isValidUrl={isValidUrl} 
      />
    </div>
  );
};

export default VideoUpload;
