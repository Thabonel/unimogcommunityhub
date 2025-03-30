
import { ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

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
  const [videoError, setVideoError] = useState<boolean>(false);
  const [videoStarted, setVideoStarted] = useState<boolean>(false);
  const [videoPlayed, setVideoPlayed] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { trackContentEngagement } = useAnalytics();
  
  // Reset video error state when video URL changes
  useEffect(() => {
    if (video_url) {
      setVideoError(false);
      setVideoStarted(false);
      setVideoPlayed(0);
    }
  }, [video_url]);
  
  // Track media engagement
  useEffect(() => {
    if (image_url) {
      // Track image view
      trackContentEngagement('page_view', contentId, 'image', {
        action: 'view',
        mediaType: 'image'
      });
    } else if (video_url) {
      // Video tracking is handled by event listeners
    } else if (link_url) {
      // Track link view
      trackContentEngagement('page_view', contentId, 'link', {
        action: 'view',
        mediaType: 'link',
        linkUrl: link_url
      });
    }
  }, [image_url, video_url, link_url, contentId, trackContentEngagement]);
  
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
  
  const handleLinkClick = () => {
    trackContentEngagement('link_click', contentId, 'link', {
      action: 'click',
      mediaType: 'link',
      linkUrl: link_url
    });
  };
  
  if (image_url) {
    return (
      <img 
        src={image_url} 
        alt="Post attachment" 
        className="rounded-md w-full object-cover max-h-96 mt-4" 
      />
    );
  }
  
  if (video_url) {
    try {
      const url = new URL(video_url);
      
      // YouTube embedding
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        const videoId = url.hostname.includes('youtube.com') 
          ? new URL(video_url).searchParams.get('v')
          : video_url.split('/').pop();
          
        if (!videoId) {
          throw new Error("Invalid YouTube URL");
        }
        
        return (
          <div className="aspect-video mt-4">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full rounded-md"
              allowFullScreen
              title="YouTube video"
              onError={() => {
                setVideoError(true);
                trackContentEngagement('feature_use', contentId, 'video', {
                  action: 'error',
                  mediaType: 'youtube',
                  errorType: 'load_failure'
                });
              }}
              onLoad={() => {
                trackContentEngagement('video_play', contentId, 'video', {
                  action: 'load',
                  mediaType: 'youtube'
                });
              }}
            ></iframe>
            {videoError && (
              <div className="mt-2 text-sm text-red-500">
                Error loading video. The video may be private or unavailable.
              </div>
            )}
          </div>
        );
      }
      
      // Vimeo embedding
      if (url.hostname.includes('vimeo.com')) {
        const videoId = video_url.split('/').pop();
        
        if (!videoId || isNaN(Number(videoId))) {
          throw new Error("Invalid Vimeo URL");
        }
        
        return (
          <div className="aspect-video mt-4">
            <iframe 
              src={`https://player.vimeo.com/video/${videoId}`}
              className="w-full h-full rounded-md"
              allowFullScreen
              title="Vimeo video"
              onError={() => {
                setVideoError(true);
                trackContentEngagement('feature_use', contentId, 'video', {
                  action: 'error',
                  mediaType: 'vimeo',
                  errorType: 'load_failure'
                });
              }}
              onLoad={() => {
                trackContentEngagement('video_play', contentId, 'video', {
                  action: 'load',
                  mediaType: 'vimeo'
                });
              }}
            ></iframe>
            {videoError && (
              <div className="mt-2 text-sm text-red-500">
                Error loading video. The video may be private or unavailable.
              </div>
            )}
          </div>
        );
      }
      
      // Dailymotion embedding
      if (url.hostname.includes('dailymotion.com') || url.hostname.includes('dai.ly')) {
        let videoId;
        if (url.hostname.includes('dailymotion.com')) {
          videoId = url.pathname.split('/').pop()?.split('_')[0];
        } else {
          videoId = url.pathname.split('/').pop();
        }
        
        if (!videoId) {
          throw new Error("Invalid Dailymotion URL");
        }
        
        return (
          <div className="aspect-video mt-4">
            <iframe 
              src={`https://www.dailymotion.com/embed/video/${videoId}`}
              className="w-full h-full rounded-md"
              allowFullScreen
              title="Dailymotion video"
              onError={() => {
                setVideoError(true);
                trackContentEngagement('feature_use', contentId, 'video', {
                  action: 'error',
                  mediaType: 'dailymotion',
                  errorType: 'load_failure'
                });
              }}
              onLoad={() => {
                trackContentEngagement('video_play', contentId, 'video', {
                  action: 'load',
                  mediaType: 'dailymotion'
                });
              }}
            ></iframe>
            {videoError && (
              <div className="mt-2 text-sm text-red-500">
                Error loading video. The video may be private or unavailable.
              </div>
            )}
          </div>
        );
      }
      
      // Direct video URL
      return (
        <div className="mt-4">
          <video 
            ref={videoRef}
            src={video_url} 
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
        <div className="mt-4">
          <video 
            ref={videoRef}
            src={video_url} 
            controls 
            className="w-full rounded-md"
            preload="metadata"
            onError={handleVideoError}
            onPlay={handleVideoPlay}
            onTimeUpdate={handleVideoProgress}
          >
            Your browser does not support the video tag.
          </video>
          {videoError && (
            <div className="mt-2 text-sm text-red-500">
              Error loading video. The URL might be incorrect or the video format is not supported.
            </div>
          )}
        </div>
      );
    }
  }
  
  if (link_url) {
    return (
      <a 
        href={link_url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block mt-4 border rounded-md overflow-hidden hover:shadow-md transition-shadow"
        onClick={handleLinkClick}
      >
        {link_image && (
          <img 
            src={link_image} 
            alt={link_title || "Link preview"} 
            className="w-full h-40 object-cover" 
          />
        )}
        <div className="p-3 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-medium text-blue-600 dark:text-blue-400 flex items-center">
            {link_title || link_url}
            <ExternalLink size={14} className="ml-1 inline-block" />
          </h3>
          {link_description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {link_description}
            </p>
          )}
        </div>
      </a>
    );
  }
  
  return null;
};

export default PostMedia;
