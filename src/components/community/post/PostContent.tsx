
import React from 'react';

interface PostContentProps {
  content: string;
  image_url?: string | null;
  video_url?: string | null;
  link_url?: string | null;
  link_title?: string | null;
  link_description?: string | null;
  link_image?: string | null;
}

const PostContent: React.FC<PostContentProps> = ({ 
  content,
  image_url,
  video_url,
  link_url,
  link_title,
  link_description,
  link_image
}) => {
  // Parse content to extract video and link information
  const parseContent = (content: string) => {
    const parts = {
      mainContent: content,
      videoUrl: video_url || '',
      linkUrl: link_url || '',
      linkTitle: link_title || '',
      linkDescription: link_description || '',
    };
    
    // If we don't have explicit video_url or link_url passed as props,
    // try to extract them from the content
    if (!video_url) {
      // Extract video URL
      const videoMatch = content.match(/\n\nVideo: (.*?)(\n|$)/);
      if (videoMatch) {
        parts.videoUrl = videoMatch[1];
        parts.mainContent = parts.mainContent.replace(/\n\nVideo: .*?(\n|$)/, '');
      }
    }
    
    if (!link_url) {
      // Extract link information
      const linkMatch = content.match(/\n\nLink: (.*?)(\n|$)/);
      if (linkMatch) {
        parts.linkUrl = linkMatch[1];
        parts.mainContent = parts.mainContent.replace(/\n\nLink: .*?(\n|$)/, '');
        
        const titleMatch = content.match(/\nTitle: (.*?)(\n|$)/);
        if (titleMatch) {
          parts.linkTitle = titleMatch[1];
          parts.mainContent = parts.mainContent.replace(/\nTitle: .*?(\n|$)/, '');
        }
        
        const descMatch = content.match(/\nDescription: (.*?)(\n|$)/);
        if (descMatch) {
          parts.linkDescription = descMatch[1];
          parts.mainContent = parts.mainContent.replace(/\nDescription: .*?(\n|$)/, '');
        }
      }
    }
    
    return parts;
  };
  
  const { mainContent, videoUrl, linkUrl, linkTitle, linkDescription } = parseContent(content);
  
  return (
    <div className="space-y-3">
      <div className="whitespace-pre-wrap text-sm md:text-base">
        {mainContent}
      </div>
      
      {image_url && (
        <img 
          src={image_url} 
          alt="Post attachment" 
          className="rounded-md w-full object-cover max-h-96 mt-4" 
        />
      )}
      
      {videoUrl && (
        <div className="mt-2">
          <div className="bg-muted rounded-md p-3 text-sm">
            <div className="font-medium text-primary flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Video
            </div>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
              {videoUrl}
            </a>
          </div>
        </div>
      )}
      
      {linkUrl && (
        <div className="mt-2">
          <div className="bg-muted rounded-md p-3 text-sm">
            <div className="font-medium text-primary flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 010-5.656l4-4a4 4 0 015.656 5.656l-1.1 1.1" />
              </svg>
              Link
            </div>
            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium break-all">
              {linkTitle || linkUrl}
            </a>
            {linkDescription && <p className="mt-1 text-muted-foreground">{linkDescription}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostContent;
