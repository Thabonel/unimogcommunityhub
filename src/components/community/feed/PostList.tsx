
import { Button } from '@/components/ui/button';
import { PostWithUser } from '@/types/post';
import PostItem from '../PostItem';

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
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border p-6 space-y-4 animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-3 w-32 bg-muted rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-4/5 bg-muted rounded"></div>
            </div>
            <div className="h-40 bg-muted rounded-md"></div>
            <div className="flex justify-between">
              <div className="h-8 w-16 bg-muted rounded"></div>
              <div className="h-8 w-16 bg-muted rounded"></div>
              <div className="h-8 w-16 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
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
          <Button onClick={onLoadMore} variant="outline" disabled={isLoading}>
            {isLoading && page > 0 ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-primary rounded-full"></span>
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
