
import { ExternalLink } from 'lucide-react';

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
          
        return (
          <div className="aspect-video mt-4">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full rounded-md"
              allowFullScreen
              title="YouTube video"
            ></iframe>
          </div>
        );
      }
      
      // Vimeo embedding
      if (url.hostname.includes('vimeo.com')) {
        const videoId = video_url.split('/').pop();
        
        return (
          <div className="aspect-video mt-4">
            <iframe 
              src={`https://player.vimeo.com/video/${videoId}`}
              className="w-full h-full rounded-md"
              allowFullScreen
              title="Vimeo video"
            ></iframe>
          </div>
        );
      }
      
      // Direct video URL
      return (
        <video 
          src={video_url} 
          controls 
          className="w-full rounded-md mt-4"
          preload="metadata"
        ></video>
      );
    } catch (error) {
      // If URL parsing fails, try as direct video source
      return (
        <video 
          src={video_url} 
          controls 
          className="w-full rounded-md mt-4"
          preload="metadata"
        ></video>
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
