
import { useState } from 'react';
import { 
  Collapsible,
  CollapsibleContent
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Comment } from '@/types/post';
import { addComment, toggleLikeComment } from '@/services/post';
import CommentItem from './CommentItem';

interface CommentsSectionProps {
  postId: string;
  comments: Comment[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoadingComments: boolean;
  setComments: (comments: Comment[]) => void;
}

const CommentsSection = ({ 
  postId, 
  comments, 
  isOpen, 
  onOpenChange, 
  isLoadingComments,
  setComments
}: CommentsSectionProps) => {
  const [commentContent, setCommentContent] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;
    
    setIsPostingComment(true);
    
    try {
      const newComment = await addComment(postId, commentContent);
      if (newComment) {
        setComments([...comments, newComment]);
        setCommentContent('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsPostingComment(false);
    }
  };
  
  const handleCommentLike = async (commentId: string, index: number) => {
    const currentComments = [...comments];
    const comment = currentComments[index];
    
    // Optimistic update
    const wasLiked = comment.liked_by_user || false;
    const currentLikes = comment.likes_count || 0;
    
    currentComments[index] = {
      ...comment,
      liked_by_user: !wasLiked,
      likes_count: wasLiked ? currentLikes - 1 : currentLikes + 1
    };
    
    setComments(currentComments);
    
    const success = await toggleLikeComment(commentId);
    
    // Revert if failed
    if (!success) {
      currentComments[index] = {
        ...comment,
        liked_by_user: wasLiked,
        likes_count: currentLikes
      };
      setComments(currentComments);
    }
  };
  
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="w-full">
      <CollapsibleContent className="space-y-4 mt-3">
        {isLoadingComments ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {comments.map((comment, index) => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  onLike={() => handleCommentLike(comment.id, index)}
                />
              ))}
              
              {comments.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Write a comment..."
                className="resize-none text-sm min-h-[40px]"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleCommentSubmit();
                  }
                }}
              />
              <Button 
                size="sm" 
                onClick={handleCommentSubmit} 
                disabled={isPostingComment || !commentContent.trim()}
              >
                <Send size={16} />
              </Button>
            </div>
          </>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CommentsSection;
