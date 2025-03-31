
import { ArticleData } from './types';
import { ArticleMetadata } from './ArticleMetadata';
import { ArticleFileDownload } from './ArticleFileDownload';
import { ArticleCategories } from './ArticleCategories';

interface ArticleContentProps {
  article: ArticleData;
  handleFileDownload: () => void;
}

export function ArticleContent({ article, handleFileDownload }: ArticleContentProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      
      <ArticleCategories categories={article.categories} />
      <ArticleMetadata article={article} />
      <ArticleFileDownload 
        originalFileUrl={article.originalFileUrl} 
        handleFileDownload={handleFileDownload} 
      />
      
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
