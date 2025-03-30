
import { ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PostMediaProps {
  image_url?: string | null;
  video_url?: string | null;
  link_url?: string | null;
  link_title?: string | null;
  link_description?: string | null;
  link_image?: string | null;
}

const PostMedia = ({ 
  image_url, 
  video_url, 
  link_url, 
  link_title, 
  link_description, 
  link_image 
}: PostMediaProps) => {
  const [videoError, setVideoError] = useState<boolean>(false);
  
  // Reset video error state when video URL changes
  useEffect(() => {
    if (video_url) {
      setVideoError(false);
    }
  }, [video_url]);
  
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
              onError={() => setVideoError(true)}
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
              onError={() => setVideoError(true)}
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
              onError={() => setVideoError(true)}
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
            src={video_url} 
            controls 
            className="w-full rounded-md"
            preload="metadata"
            onError={() => setVideoError(true)}
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
      
      // If URL parsing fails, try as direct video source
      return (
        <div className="mt-4">
          <video 
            src={video_url} 
            controls 
            className="w-full rounded-md"
            preload="metadata"
            onError={() => setVideoError(true)}
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
