
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
}

const PostItem = ({ post }: PostItemProps) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  
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
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3 flex justify-between">
        <PostHeader post={post} />
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
          initialLiked={post.liked_by_user}
          likesCount={post.likes_count}
          commentsCount={post.comments_count}
          sharesCount={post.shares_count}
          commentsOpen={commentsOpen}
          onToggleComments={loadComments}
        />
        
        <CommentsSection 
          postId={post.id}
          comments={comments}
          isOpen={commentsOpen}
          onOpenChange={setCommentsOpen}
          isLoadingComments={isLoadingComments}
          setComments={setComments}
        />
      </CardFooter>
    </Card>
  );
};

export default PostItem;
