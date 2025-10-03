import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { sharePost } from '@/services/post';

interface PostFooterProps {
  postId: string;
  initialLiked: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  commentsOpen: boolean;
  onToggleComments: () => void;
  onToggleLike?: (postId: string) => void;
}

const PostFooter = ({
  postId,
  initialLiked,
  likesCount,
  commentsCount,
  sharesCount,
  commentsOpen,
  onToggleComments,
  onToggleLike
}: PostFooterProps) => {
  const handleLike = () => {
    if (onToggleLike) {
      onToggleLike(postId);
    }
  };
  
  const handleShare = async () => {
    await sharePost(postId);
  };
  
  return (
    <div className="border-t pt-3 flex flex-col">
      <div className="flex justify-between w-full mb-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-2 ${initialLiked ? 'text-blue-500' : ''}`}
                onClick={handleLike}
              >
                <ThumbsUp size={18} fill={initialLiked ? 'currentColor' : 'none'} />
                <span>{likesCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{initialLiked ? 'Unlike this post' : 'Like this post'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={onToggleComments}
              >
                <MessageCircle size={18} />
                <span>{commentsCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{commentsOpen ? 'Hide comments' : 'Show comments'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
                <Share2 size={18} />
                <span>{sharesCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share this post</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default PostFooter;
