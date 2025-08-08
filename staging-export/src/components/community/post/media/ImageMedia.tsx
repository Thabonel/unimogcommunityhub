
interface ImageMediaProps {
  imageUrl: string;
  contentId?: string;
  trackContentEngagement: (event: string, contentId: string, contentType: string, metadata: Record<string, any>) => void;
}

const ImageMedia = ({ imageUrl, contentId = 'unknown', trackContentEngagement }: ImageMediaProps) => {
  // Track image view when component mounts
  trackContentEngagement('page_view', contentId, 'image', {
    action: 'view',
    mediaType: 'image'
  });
  
  return (
    <img 
      src={imageUrl} 
      alt="Post attachment" 
      className="rounded-md w-full object-cover max-h-96 mt-4" 
    />
  );
};

export default ImageMedia;
