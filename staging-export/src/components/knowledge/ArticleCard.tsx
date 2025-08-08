
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ThumbsUp, Eye, Bookmark, BookOpen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

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
  onDelete?: (id: string) => void;
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
  onDelete,
}: ArticleCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="card-hover overflow-hidden border bg-card/80 backdrop-blur-sm">
        <Link to={`/knowledge/article/${id}`} className="block overflow-hidden">
          <div className="aspect-video overflow-hidden relative group">
            {coverImage ? (
              <>
                <img 
                  src={coverImage} 
                  alt={title} 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/lovable-uploads/56c274f5-535d-42c0-98b7-fc29272c4faa.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/50">
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
          
          <Link to={`/knowledge/article/${id}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors mb-2">{title}</h3>
          </Link>
          
          <p className="text-muted-foreground text-sm line-clamp-2">{excerpt}</p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 border-t flex justify-between items-center">
          <div className="flex items-center">
            <div className="profile-image w-8 h-8 flex items-center justify-center text-xs font-medium text-primary-foreground bg-primary mr-2">
              {author.avatarUrl ? (
                <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
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
            <div className="flex items-center hover:text-primary transition-colors">
              <ThumbsUp size={14} className="mr-1" />
              <span className="text-xs">{likes}</span>
            </div>
            <div className="flex items-center hover:text-primary transition-colors">
              <Eye size={14} className="mr-1" />
              <span className="text-xs">{views}</span>
            </div>
            {onDelete && (
              <Button 
                variant="ghost" 
                className="p-0 h-auto hover:bg-transparent hover:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 size={14} />
              </Button>
            )}
            <div className="hover:text-primary transition-colors">
              <Bookmark size={14} className={isSaved ? "text-primary fill-primary" : ""} />
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ArticleCard;
