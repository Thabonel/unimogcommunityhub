
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostWithUser } from '@/types/post';

interface PostHeaderProps {
  post: PostWithUser;
}

const PostHeader = ({ post }: PostHeaderProps) => {
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
    <div className="pb-3 flex justify-between">
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.profile?.avatar_url || undefined} alt={post.profile?.display_name || ''} />
          <AvatarFallback className="bg-military-olive text-military-sand">
            {post.profile?.display_name?.substring(0, 2).toUpperCase() || 
             post.profile?.full_name?.substring(0, 2).toUpperCase() || 
             post.profile?.email?.split('@')[0]?.substring(0, 2).toUpperCase() ||
             'UN'}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">
            <Link to={`/profile/${post.user_id}`} className="hover:underline">
              {post.profile?.display_name || post.profile?.full_name || 'User'}
            </Link>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
            {post.profile?.unimog_model && (
              <span>{post.profile.unimog_model} Owner</span>
            )}
            
            {post.profile?.unimog_model && post.profile?.location && (
              <span className="mx-1">•</span>
            )}
            
            {post.profile?.location && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <MapPin size={12} />
                      <span className="truncate max-w-[100px]">{post.profile.location}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Location: {post.profile.location}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <span className="mx-1">•</span>
            <time dateTime={post.created_at}>
              {formatTimestamp(post.created_at)}
            </time>
          </div>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background border shadow-lg">
          <DropdownMenuItem>Save post</DropdownMenuItem>
          <DropdownMenuItem>Hide post</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-500">Report post</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default PostHeader;
