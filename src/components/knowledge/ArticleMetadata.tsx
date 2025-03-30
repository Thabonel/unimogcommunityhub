
import { Calendar, Clock, User, Eye, ThumbsUp, Bookmark } from 'lucide-react';

interface ArticleMetadataProps {
  author: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  publishedAt: string;
  readingTime: number;
  likes: number;
  views: number;
  isSaved?: boolean;
}

export function ArticleMetadata({ 
  author, 
  publishedAt, 
  readingTime, 
  likes, 
  views, 
  isSaved 
}: ArticleMetadataProps) {
  return (
    <div className="flex items-center justify-between mb-8 text-muted-foreground border-b border-t py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <User size={16} className="mr-2" />
          <span>{author.name}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="mr-2" />
          <span>{publishedAt}</span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="mr-2" />
          <span>{readingTime} min read</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <ThumbsUp size={16} className="mr-1" />
          <span>{likes}</span>
        </div>
        <div className="flex items-center">
          <Eye size={16} className="mr-1" />
          <span>{views}</span>
        </div>
        <div>
          <Bookmark size={16} className={isSaved ? "text-primary" : ""} />
        </div>
      </div>
    </div>
  );
}
