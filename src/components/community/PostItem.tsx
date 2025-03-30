
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Author {
  id: string;
  name: string;
  avatar: string | null;
  unimogModel: string | null;
  location?: string | null;
  experience?: string | null;
}

interface Post {
  id: string;
  author: Author;
  content: string;
  images: string[];
  createdAt: Date;
  likes: number;
  comments: number;
  shares: number;
}

interface PostItemProps {
  post: Post;
}

const PostItem = ({ post }: PostItemProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  
  const handleLike = () => {
    if (liked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setLiked(!liked);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3 flex justify-between">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar || undefined} alt={post.author.name} />
            <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">
              <Link to={`/profile/${post.author.id}`} className="hover:underline">
                {post.author.name}
              </Link>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
              {post.author.unimogModel && (
                <span>{post.author.unimogModel} Owner</span>
              )}
              
              {post.author.unimogModel && post.author.location && (
                <span className="mx-1">•</span>
              )}
              
              {post.author.location && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 cursor-help">
                        <MapPin size={12} />
                        <span className="truncate max-w-[100px]">{post.author.location}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Location: {post.author.location}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              <span className="mx-1">•</span>
              <time dateTime={post.createdAt.toISOString()}>
                {format(post.createdAt, 'MMM d, yyyy')}
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Save post</DropdownMenuItem>
            <DropdownMenuItem>Hide post</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Report post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent>
        <p className="whitespace-pre-wrap mb-4">{post.content}</p>
        {post.images.length > 0 && (
          <div className="grid grid-cols-1 gap-2 mt-3">
            {post.images.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt="Post attachment" 
                className="rounded-md w-full object-cover max-h-96" 
              />
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3">
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-2 ${liked ? 'text-red-500' : ''}`}
            onClick={handleLike}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            <span>{likesCount}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle size={18} />
            <span>{post.comments}</span>
          </Button>
          
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 size={18} />
            <span>{post.shares}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostItem;
