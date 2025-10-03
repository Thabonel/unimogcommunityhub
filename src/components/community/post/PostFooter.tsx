import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { sharePost } from '@/services/post';
import { isWebShareSupported, shareViaWebShareAPI, generateShareText, generatePostShareUrl } from '@/utils/shareUtils';
import ShareDialog from './ShareDialog';
import { toast } from '@/hooks/use-toast';

interface PostFooterProps {
  postId: string;
  postContent: string;
  postAuthor: string;
  initialLiked: boolean;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  commentsOpen: boolean;
  onToggleComments: () => void;
  onToggleLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const PostFooter = ({
  postId,
  postContent,
  postAuthor,
  initialLiked,
  likesCount,
  commentsCount,
  sharesCount,
  commentsOpen,
  onToggleComments,
  onToggleLike,
  onShare
}: PostFooterProps) => {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const handleLike = () => {
    if (onToggleLike) {
      onToggleLike(postId);
    }
  };

  const handleShare = async () => {
    // OPTION 3 HYBRID APPROACH:
    // 1. Try native Web Share API first (mobile devices)
    // 2. Fallback to custom share dialog (desktop)

    const shareUrl = generatePostShareUrl(postId);
    const shareText = generateShareText(postContent, postAuthor);

    // Try native share on mobile devices
    if (isWebShareSupported()) {
      const shared = await shareViaWebShareAPI(
        'Unimog Community Post',
        shareText,
        shareUrl
      );

      if (shared) {
        // User completed native share - record it
        if (onShare) {
          onShare(postId);
        }
        await sharePost(postId);

        toast({
          title: 'Post shared!',
          description: 'Thanks for sharing with your community!',
        });
        return;
      }
    }

    // Fallback to custom dialog (desktop or if native share failed)
    setShareDialogOpen(true);

    // Record share when dialog opens
    if (onShare) {
      onShare(postId);
    }
    await sharePost(postId);
  };
  
  return (
    <>
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

      {/* Share Dialog - Only shown on desktop or if native share fails */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        postId={postId}
        postContent={postContent}
        postAuthor={postAuthor}
      />
    </>
  );
};

export default PostFooter;
