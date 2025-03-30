
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ThumbsUp, Eye, Bookmark, BookOpen } from 'lucide-react';
import { AdminArticleControls } from './AdminArticleControls';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  readingTime: number;
  likes: number;
  views: number;
  categories: string[];
  isSaved?: boolean;
  isAdmin?: boolean;
  onArticleDeleted?: (articleId: string) => void;
  onArticleMoved?: (articleId: string) => void;
}

const ArticleCard = ({
  id,
  title,
  excerpt,
  coverImage,
  author,
  publishedAt,
  readingTime,
  likes,
  views,
  categories,
  isSaved,
  isAdmin = false,
  onArticleDeleted,
  onArticleMoved,
}: ArticleCardProps) => {
  // Callback handlers that pass the article ID
  const handleArticleDeleted = (articleId: string) => {
    console.log("ArticleCard: Article deleted with ID:", articleId);
    if (onArticleDeleted) {
      onArticleDeleted(articleId);
    }
  };

  const handleArticleMoved = (articleId: string) => {
    console.log("ArticleCard: Article moved with ID:", articleId);
    if (onArticleMoved) {
      onArticleMoved(articleId);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <Link to={`/knowledge/article/${id}`}>
        <div className="aspect-video bg-muted overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={title} 
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <BookOpen className="h-12 w-12" />
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="mb-2 flex flex-wrap gap-1">
          {categories.map((category, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-start">
          <Link to={`/knowledge/article/${id}`} className="flex-grow">
            <h3 className="font-semibold text-lg hover:text-primary transition-colors mb-2">{title}</h3>
          </Link>
          
          {isAdmin && (
            <AdminArticleControls 
              articleId={id} 
              category={categories[0]} 
              onArticleDeleted={handleArticleDeleted}
              onArticleMoved={handleArticleMoved}
            />
          )}
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2">{excerpt}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs mr-2">
            {author.avatarUrl ? (
              <img src={author.avatarUrl} alt={author.name} className="w-full h-full rounded-full" />
            ) : (
              author.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <Link to={`/profile/${author.id}`} className="text-sm hover:text-primary transition-colors">
              {author.name}
            </Link>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock size={12} className="mr-1" />
              <span>{readingTime} min read</span>
              <span className="mx-1">•</span>
              <span>{publishedAt}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 text-muted-foreground">
          <div className="flex items-center">
            <ThumbsUp size={14} className="mr-1" />
            <span className="text-xs">{likes}</span>
          </div>
          <div className="flex items-center">
            <Eye size={14} className="mr-1" />
            <span className="text-xs">{views}</span>
          </div>
          <div>
            <Bookmark size={14} className={isSaved ? "text-primary" : ""} />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;
