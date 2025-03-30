import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  MapPin,
  Send,
  ExternalLink
} from 'lucide-react';
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
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PostWithUser, Comment } from '@/types/post';
import { 
  toggleLikePost, 
  sharePost, 
  addComment, 
  getComments, 
  toggleLikeComment 
} from '@/services/postService';

interface PostItemProps {
  post: PostWithUser;
}

const PostItem = ({ post }: PostItemProps) => {
  const [liked, setLiked] = useState(post.liked_by_user);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentContent, setCommentContent] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  
  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(wasLiked ? likesCount - 1 : likesCount + 1);
    
    const result = await toggleLikePost(post.id);
    
    // If the API call fails, revert the optimistic update
    if (result !== !wasLiked) {
      setLiked(wasLiked);
      setLikesCount(wasLiked ? likesCount : likesCount - 1);
    }
  };
  
  const handleShare = async () => {
    await sharePost(post.id);
  };
  
  const loadComments = async () => {
    if (!commentsOpen && !commentsLoaded) {
      setIsLoadingComments(true);
      setCommentsOpen(true);
      
      try {
        const fetchedComments = await getComments(post.id);
        setComments(fetchedComments);
        setCommentsLoaded(true);
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    } else {
      setCommentsOpen(!commentsOpen);
    }
  };
  
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) return;
    
    setIsPostingComment(true);
    
    try {
      const newComment = await addComment(post.id, commentContent);
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
  
  const renderMedia = () => {
    if (post.image_url) {
      return (
        <img 
          src={post.image_url} 
          alt="Post attachment" 
          className="rounded-md w-full object-cover max-h-96 mt-4" 
        />
      );
    }
    
    if (post.video_url) {
      // Simple video embedding
      if (post.video_url.includes('youtube.com') || post.video_url.includes('youtu.be')) {
        const videoId = post.video_url.includes('youtube.com') 
          ? new URL(post.video_url).searchParams.get('v')
          : post.video_url.split('/').pop();
          
        return (
          <div className="aspect-w-16 aspect-h-9 mt-4">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-[300px] rounded-md"
              allowFullScreen
            ></iframe>
          </div>
        );
      }
      
      return (
        <video 
          src={post.video_url} 
          controls 
          className="w-full rounded-md mt-4"
          preload="metadata"
        ></video>
      );
    }
    
    if (post.link_url) {
      return (
        <a 
          href={post.link_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block mt-4 border rounded-md overflow-hidden hover:shadow-md transition-shadow"
        >
          {post.link_image && (
            <img 
              src={post.link_image} 
              alt={post.link_title || "Link preview"} 
              className="w-full h-40 object-cover" 
            />
          )}
          <div className="p-3 bg-gray-50 dark:bg-gray-800">
            <h3 className="font-medium text-blue-600 dark:text-blue-400 flex items-center">
              {post.link_title || post.link_url}
              <ExternalLink size={14} className="ml-1 inline-block" />
            </h3>
            {post.link_description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                {post.link_description}
              </p>
            )}
          </div>
        </a>
      );
    }
    
    return null;
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3 flex justify-between">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.profile?.avatar_url || undefined} alt={post.profile?.display_name || ''} />
            <AvatarFallback>
              {post.profile?.display_name?.substring(0, 2).toUpperCase() || 
               post.profile?.full_name?.substring(0, 2).toUpperCase() || 
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
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Save post</DropdownMenuItem>
            <DropdownMenuItem>Hide post</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Report post</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
        {renderMedia()}
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex flex-col">
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
                  onClick={loadComments}
                >
                  <MessageCircle size={18} />
                  <span>{post.comments_count}</span>
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
                  <span>{post.shares_count}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Collapsible open={commentsOpen} onOpenChange={setCommentsOpen} className="w-full">
          <CollapsibleContent className="space-y-4 mt-3">
            {isLoadingComments ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {comments.map((comment, index) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={comment.profile?.avatar_url || undefined} alt="User avatar" />
                        <AvatarFallback>
                          {comment.profile?.display_name?.substring(0, 2).toUpperCase() || 
                           comment.profile?.full_name?.substring(0, 2).toUpperCase() || 
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
                            onClick={() => handleCommentLike(comment.id, index)}
                          >
                            <Heart size={12} className="mr-1" fill={comment.liked_by_user ? 'currentColor' : 'none'} />
                            {comment.likes_count || 0} {comment.likes_count === 1 ? 'Like' : 'Likes'}
                          </button>
                          <span>{formatTimestamp(comment.created_at)}</span>
                        </div>
                      </div>
                    </div>
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
      </CardFooter>
    </Card>
  );
};

export default PostItem;
