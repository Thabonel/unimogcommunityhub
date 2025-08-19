
import { Calendar, Clock, Eye, ThumbsUp, User, Bookmark } from 'lucide-react';
import { ArticleData } from './types';

interface ArticleMetadataProps {
  article: ArticleData;
}

export function ArticleMetadata({ article }: ArticleMetadataProps) {
  return (
    <div className="flex items-center justify-between mb-8 text-muted-foreground border-b border-t py-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <User size={16} className="mr-2" />
          <span>{article.author.name}</span>
        </div>
        <div className="flex items-center">
          <Calendar size={16} className="mr-2" />
          <span>{article.publishedAt}</span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="mr-2" />
          <span>{article.readingTime} min read</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <ThumbsUp size={16} className="mr-1" />
          <span>{article.likes}</span>
        </div>
        <div className="flex items-center">
          <Eye size={16} className="mr-1" />
          <span>{article.views}</span>
        </div>
        <div>
          <Bookmark size={16} className={article.isSaved ? "text-primary" : ""} />
        </div>
      </div>
    </div>
  );
}
