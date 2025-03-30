
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toggleLikePost, sharePost } from '@/services/postService';

interface PostFooterProps {
  postId: string;
  initialLiked: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  commentsOpen: boolean;
  onToggleComments: () => void;
}

const PostFooter = ({ 
  postId, 
  initialLiked, 
  likesCount: initialLikesCount, 
  commentsCount, 
  sharesCount,
  commentsOpen,
  onToggleComments 
}: PostFooterProps) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  
  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(wasLiked ? likesCount - 1 : likesCount + 1);
    
    const result = await toggleLikePost(postId);
    
    // If the API call fails, revert the optimistic update
    if (result !== !wasLiked) {
      setLiked(wasLiked);
      setLikesCount(wasLiked ? likesCount : likesCount - 1);
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
                className={`gap-2 ${liked ? 'text-red-500' : ''}`}
                onClick={handleLike}
              >
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                <span>{likesCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{liked ? 'Unlike this post' : 'Like this post'}</p>
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
