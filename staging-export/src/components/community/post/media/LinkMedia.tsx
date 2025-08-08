
import { ExternalLink } from 'lucide-react';

interface LinkMediaProps {
  linkUrl: string;
  linkTitle?: string | null;
  linkDescription?: string | null;
  linkImage?: string | null;
  contentId?: string;
  trackContentEngagement: (event: string, contentId: string, contentType: string, metadata: Record<string, any>) => void;
}

const LinkMedia = ({ 
  linkUrl, 
  linkTitle, 
  linkDescription, 
  linkImage, 
  contentId = 'unknown',
  trackContentEngagement 
}: LinkMediaProps) => {
  // Track link view when component mounts
  trackContentEngagement('page_view', contentId, 'link', {
    action: 'view',
    mediaType: 'link',
    linkUrl
  });
  
  const handleLinkClick = () => {
    trackContentEngagement('link_click', contentId, 'link', {
      action: 'click',
      mediaType: 'link',
      linkUrl
    });
  };
  
  return (
    <a 
      href={linkUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="block mt-4 border rounded-md overflow-hidden hover:shadow-md transition-shadow"
      onClick={handleLinkClick}
    >
      {linkImage && (
        <img 
          src={linkImage} 
          alt={linkTitle || "Link preview"} 
          className="w-full h-40 object-cover" 
        />
      )}
      <div className="p-3 bg-gray-50 dark:bg-gray-800">
        <h3 className="font-medium text-blue-600 dark:text-blue-400 flex items-center">
          {linkTitle || linkUrl}
          <ExternalLink size={14} className="ml-1 inline-block" />
        </h3>
        {linkDescription && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
            {linkDescription}
          </p>
        )}
      </div>
    </a>
  );
};

export default LinkMedia;
