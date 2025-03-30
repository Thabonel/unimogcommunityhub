
import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import ImageMedia from './media/ImageMedia';
import LinkMedia from './media/LinkMedia';
import VideoEmbed from './media/VideoEmbed';
import DirectVideo from './media/DirectVideo';
import { parseVideoUrl } from './media/VideoHelpers';

interface PostMediaProps {
  image_url?: string | null;
  video_url?: string | null;
  link_url?: string | null;
  link_title?: string | null;
  link_description?: string | null;
  link_image?: string | null;
  contentId?: string;
}

const PostMedia = ({ 
  image_url, 
  video_url, 
  link_url, 
  link_title, 
  link_description, 
  link_image,
  contentId = 'unknown'
}: PostMediaProps) => {
  const { trackContentEngagement } = useAnalytics();
  const [videoError, setVideoError] = useState<boolean>(false);
  
  // Reset video error state when video URL changes
  useEffect(() => {
    if (video_url) {
      setVideoError(false);
    }
  }, [video_url]);
  
  if (image_url) {
    return (
      <ImageMedia 
        imageUrl={image_url} 
        contentId={contentId} 
        trackContentEngagement={trackContentEngagement} 
      />
    );
  }
  
  if (video_url) {
    try {
      const videoData = parseVideoUrl(video_url);
      
      if (!videoData) {
        throw new Error("Could not parse video URL");
      }
      
      if (videoData.provider === 'youtube' || videoData.provider === 'vimeo' || videoData.provider === 'dailymotion') {
        return (
          <VideoEmbed 
            videoId={videoData.videoId}
            provider={videoData.provider}
            contentId={contentId}
            trackContentEngagement={trackContentEngagement}
          />
        );
      }
      
      // Direct video URL
      return (
        <DirectVideo 
          videoUrl={video_url}
          contentId={contentId}
          trackContentEngagement={trackContentEngagement}
        />
      );
    } catch (error) {
      console.error("Error parsing video URL:", error);
      
      trackContentEngagement('feature_use', contentId, 'video', {
        action: 'error',
        mediaType: 'unknown',
        errorType: 'parse_error',
        error: String(error)
      });
      
      // If URL parsing fails, try as direct video source
      return (
        <DirectVideo 
          videoUrl={video_url}
          contentId={contentId}
          trackContentEngagement={trackContentEngagement}
        />
      );
    }
  }
  
  if (link_url) {
    return (
      <LinkMedia 
        linkUrl={link_url}
        linkTitle={link_title}
        linkDescription={link_description}
        linkImage={link_image}
        contentId={contentId}
        trackContentEngagement={trackContentEngagement}
      />
    );
  }
  
  return null;
};

export default PostMedia;
