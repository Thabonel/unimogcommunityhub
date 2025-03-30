
import { PostWithUser } from '@/types/post';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { highlightText } from '@/utils/searchUtils';
import { format } from 'date-fns';

interface PostSearchResultsProps {
  results: PostWithUser[];
  query: string;
}

const PostSearchResults = ({ results, query }: PostSearchResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-unimog-700 dark:text-unimog-200">No posts found</h3>
        <p className="text-muted-foreground mt-1">
          Try searching with different keywords
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <div className="space-y-4">
      {results.map((post) => {
        const displayName = post.profile?.display_name || post.profile?.full_name || 'User';
        const initials = displayName.substring(0, 2).toUpperCase();
        
        return (
          <Card key={post.id} className="offroad-card hover:shadow-md transition-shadow border-unimog-100 dark:border-unimog-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="h-8 w-8 border-2 border-terrain-400">
                  <AvatarImage src={post.profile?.avatar_url || undefined} alt={displayName} />
                  <AvatarFallback className="bg-terrain-500 text-white">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <Link to={`/profile/${post.user_id}`} className="text-sm font-medium text-unimog-800 dark:text-unimog-100 hover:underline">
                    {displayName}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(post.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-unimog-800 dark:text-unimog-200" dangerouslySetInnerHTML={{ 
                  __html: highlightText(post.content, query) 
                }} />
              </div>
              
              {post.image_url && (
                <div className="mt-3">
                  <img 
                    src={post.image_url} 
                    alt="Post attachment" 
                    className="rounded-md max-h-40 object-cover" 
                  />
                </div>
              )}
              
              <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center">
                    <Heart size={14} className="mr-1" />
                    {post.likes_count}
                  </span>
                  <span className="flex items-center">
                    <MessageSquare size={14} className="mr-1" />
                    {post.comments_count}
                  </span>
                </div>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="border-unimog-200 hover:bg-unimog-100 dark:border-unimog-700 dark:hover:bg-unimog-800"
                >
                  <Link to={`/community?post=${post.id}`}>
                    <ExternalLink size={14} className="mr-1 text-unimog-600 dark:text-unimog-300" />
                    View Post
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PostSearchResults;
