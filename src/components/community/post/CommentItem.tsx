
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart } from 'lucide-react';
import { Comment } from '@/types/post';
import { formatDistanceToNow, format } from 'date-fns';

interface CommentItemProps {
  comment: Comment;
  onLike: () => void;
}

const CommentItem = ({ comment, onLike }: CommentItemProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  return (
    <div className="flex space-x-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src={comment.profile?.avatar_url || undefined} alt="User avatar" />
        <AvatarFallback className="bg-military-olive text-military-sand">
          {comment.profile?.display_name?.substring(0, 2).toUpperCase() || 
           comment.profile?.full_name?.substring(0, 2).toUpperCase() || 
           comment.profile?.email?.split('@')[0]?.substring(0, 2).toUpperCase() ||
           'UN'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-accent p-3 rounded-lg">
          <div className="font-medium text-sm">
            {comment.profile?.display_name || comment.profile?.full_name || 'User'}
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <button 
            className={`mr-3 flex items-center ${comment.liked_by_user ? 'text-red-500' : ''}`}
            onClick={onLike}
          >
            <Heart size={12} className="mr-1" fill={comment.liked_by_user ? 'currentColor' : 'none'} />
            {comment.likes_count || 0} {comment.likes_count === 1 ? 'Like' : 'Likes'}
          </button>
          <span>{formatTimestamp(comment.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
