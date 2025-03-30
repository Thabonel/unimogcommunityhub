
import { Button } from '@/components/ui/button';
import { ImageIcon, Video, Link, Send } from 'lucide-react';

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
  return (
    <div className="border-t pt-3 flex justify-between">
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" className="text-blue-500" onClick={() => setPostType('image')}>
          <ImageIcon size={18} className="mr-1" />
          Photo
        </Button>
        <Button variant="ghost" size="sm" className="text-green-500" onClick={() => setPostType('video')}>
          <Video size={18} className="mr-1" />
          Video
        </Button>
        <Button variant="ghost" size="sm" className="text-amber-500" onClick={() => setPostType('link')}>
          <Link size={18} className="mr-1" />
          Link
        </Button>
      </div>
      <Button 
        onClick={onSubmit} 
        disabled={!hasContent || isSubmitting || isOverLimit} 
        className="flex items-center"
      >
        <Send size={16} className="mr-1" />
        Post
      </Button>
    </div>
  );
};

export default PostActions;
