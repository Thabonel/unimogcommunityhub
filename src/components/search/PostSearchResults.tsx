
import { PostWithUser } from '@/types/post';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { highlightText } from '@/utils/searchUtils';
import { Link } from 'react-router-dom';

interface PostSearchResultsProps {
  results: PostWithUser[];
  query: string;
}

const PostSearchResults = ({ results, query }: PostSearchResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No posts found</h3>
        <p className="text-muted-foreground mt-1">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((post) => {
        const profile = post.profile;
        const displayName = profile.display_name || profile.full_name || "User";
        const initials = displayName.substring(0, 2).toUpperCase();
        const postDate = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
        
        return (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar_url || undefined} alt={displayName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <Link to={`/profile/${profile.id}`} className="font-medium hover:underline">
                    {displayName}
                  </Link>
                  <p className="text-xs text-muted-foreground">{postDate}</p>
                </div>
              </div>
              
              <div className="text-sm" dangerouslySetInnerHTML={{ 
                __html: highlightText(post.content, query) 
              }} />
              
              {post.image_url && (
                <div className="mt-3">
                  <img 
                    src={post.image_url} 
                    alt="Post attachment" 
                    className="rounded-md max-h-64 object-cover"
                  />
                </div>
              )}
            </CardContent>
            
            <CardFooter className="px-4 py-2 border-t flex justify-between text-muted-foreground">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Heart size={16} className={post.liked_by_user ? "fill-red-500 text-red-500" : ""} />
                  <span className="text-xs">{post.likes_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  <span className="text-xs">{post.comments_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 size={16} />
                  <span className="text-xs">{post.shares_count}</span>
                </div>
              </div>
              
              <Button asChild variant="ghost" size="sm">
                <Link to={`/community/post/${post.id}`}>
                  View Post
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default PostSearchResults;
