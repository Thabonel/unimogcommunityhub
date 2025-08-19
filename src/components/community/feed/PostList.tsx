
import { Button } from '@/components/ui/button';
import { PostWithUser } from '@/types/post';
import PostItem from '../PostItem';
import { PostListSkeleton } from './PostSkeleton';
import { Loader2 } from 'lucide-react';

interface PostListProps {
  posts: PostWithUser[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  selectedTags: string[];
  onLoadMore: () => void;
}

const PostList = ({
  posts,
  isLoading,
  page,
  hasMore,
  selectedTags,
  onLoadMore,
}: PostListProps) => {
  if (isLoading && page === 0) {
    return <PostListSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">No posts found</h3>
        <p className="text-muted-foreground">
          {selectedTags.length > 0 
            ? "No posts match your selected filters. Try different topics or clear filters."
            : "Be the first to post in the community!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => <PostItem key={post.id} post={post} />)}
      
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button 
            onClick={onLoadMore} 
            variant="outline" 
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading && page > 0 ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PostList;
