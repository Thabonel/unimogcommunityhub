
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { PostWithUser, Comment } from '@/types/post';
import { getComments } from '@/services/post';

import PostHeader from './post/PostHeader';
import PostContent from './post/PostContent';
import PostFooter from './post/PostFooter';
import CommentsSection from './post/CommentsSection';

interface PostItemProps {
  post: PostWithUser;
  onPostDeleted?: (postId: string) => void;
  onToggleLike?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const PostItem = ({ post, onPostDeleted, onToggleLike, onShare }: PostItemProps) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const loadComments = async () => {
    console.log('[PostItem] loadComments called', { postId: post.id, commentsOpen, commentsLoaded });

    if (!commentsOpen && !commentsLoaded) {
      console.log('[PostItem] Loading comments for post:', post.id);
      setIsLoadingComments(true);
      setCommentsOpen(true);

      try {
        console.log('[PostItem] Calling getComments...');
        const fetchedComments = await getComments(post.id);
        console.log('[PostItem] Got comments:', fetchedComments);
        setComments(fetchedComments);
        setCommentsLoaded(true);
      } catch (error) {
        console.error('[PostItem] ERROR loading comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    } else {
      console.log('[PostItem] Toggling comments visibility');
      setCommentsOpen(!commentsOpen);
    }
  };

  const refreshComments = async () => {
    try {
      const fetchedComments = await getComments(post.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error refreshing comments:', error);
    }
  };
  
  const handlePostDeleted = () => {
    console.log('[PostItem] handlePostDeleted called for post:', post.id);
    console.log('[PostItem] onPostDeleted type:', typeof onPostDeleted);

    // Set deleting state immediately to prevent re-renders
    setIsDeleting(true);

    if (onPostDeleted) {
      console.log('[PostItem] Calling parent onPostDeleted with postId:', post.id);
      onPostDeleted(post.id);
    } else {
      console.error('[PostItem] CRITICAL: No onPostDeleted callback provided!');
      // Force page refresh as fallback
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  // Don't render if being deleted
  if (isDeleting) {
    console.log('[PostItem] Component is being deleted, returning null');
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3 flex justify-between">
        <PostHeader post={post} onPostDeleted={handlePostDeleted} />
      </CardHeader>
      
      <CardContent>
        <PostContent 
          content={post.content}
          image_url={post.image_url}
          video_url={post.video_url}
          link_url={post.link_url}
          link_title={post.link_title}
          link_description={post.link_description}
          link_image={post.link_image}
        />
      </CardContent>
      
      <CardFooter className="border-t pt-3 flex flex-col">
        <PostFooter
          postId={post.id}
          postContent={post.content}
          postAuthor={post.profile?.display_name || post.profile?.full_name || 'User'}
          initialLiked={post.liked_by_user}
          likesCount={post.likes_count}
          commentsCount={post.comments_count}
          sharesCount={post.shares_count}
          commentsOpen={commentsOpen}
          onToggleComments={loadComments}
          onToggleLike={onToggleLike}
          onShare={onShare}
        />
        
        <CommentsSection
          postId={post.id}
          comments={comments}
          isOpen={commentsOpen}
          onOpenChange={setCommentsOpen}
          isLoadingComments={isLoadingComments}
          setComments={setComments}
          refreshComments={refreshComments}
        />
      </CardFooter>
    </Card>
  );
};

export default PostItem;
