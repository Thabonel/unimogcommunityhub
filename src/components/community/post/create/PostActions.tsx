
import { Button } from '@/components/ui/button';
import { ImageIcon, Video, Link, Send } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

interface PostActionsProps {
  isSubmitting: boolean;
  isOverLimit: boolean;
  hasContent: boolean;
  onSubmit: () => void;
  setPostType: (type: 'image' | 'video' | 'link') => void;
}

const PostActions = ({
  isSubmitting,
  isOverLimit,
  hasContent,
  onSubmit,
  setPostType
}: PostActionsProps) => {
  const { isMobile } = useMobile();
  
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "sm"} 
          className="text-blue-500 flex-1 sm:flex-initial"
          onClick={() => setPostType('image')}
        >
          <ImageIcon size={isMobile ? 16 : 18} className="mr-1" />
          <span className="hidden sm:inline">Photo</span>
        </Button>
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "sm"} 
          className="text-green-500 flex-1 sm:flex-initial"
          onClick={() => setPostType('video')}
        >
          <Video size={isMobile ? 16 : 18} className="mr-1" />
          <span className="hidden sm:inline">Video</span>
        </Button>
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "sm"} 
          className="text-amber-500 flex-1 sm:flex-initial"
          onClick={() => setPostType('link')}
        >
          <Link size={isMobile ? 16 : 18} className="mr-1" />
          <span className="hidden sm:inline">Link</span>
        </Button>
      </div>
      <Button 
        onClick={onSubmit} 
        disabled={!hasContent || isSubmitting || isOverLimit} 
        className="flex items-center w-full sm:w-auto"
        size={isMobile ? "sm" : "default"}
      >
        <Send size={16} className="mr-1" />
        Post
      </Button>
    </>
  );
};

export default PostActions;
