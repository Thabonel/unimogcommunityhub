
import { Bookmark, Calendar, Clock, Download, Eye, FileText, ThumbsUp, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArticleData } from './types';

interface ArticleContentProps {
  article: ArticleData;
  handleFileDownload: () => void;
}

export function ArticleContent({ article, handleFileDownload }: ArticleContentProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {article.categories.map((category, index) => (
          <span 
            key={index}
            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
          >
            {category}
          </span>
        ))}
      </div>
      
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
      
      {article.originalFileUrl && (
        <div className="mb-6 flex items-center justify-between p-4 border rounded-md bg-secondary/10">
          <div className="flex items-center">
            <FileText className="mr-3 text-primary" />
            <span>Original document available</span>
          </div>
          <Button onClick={handleFileDownload} variant="outline" size="sm" className="flex items-center gap-1">
            <Download size={16} />
            <span>View Original</span>
          </Button>
        </div>
      )}
      
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {article.content ? (
          article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        ) : (
          <p className="text-muted-foreground">No content available for this article.</p>
        )}
      </div>
    </div>
  );
}
