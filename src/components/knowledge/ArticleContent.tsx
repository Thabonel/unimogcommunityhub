
interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  if (!content) {
    return (
      <p className="text-muted-foreground">No content available for this article.</p>
    );
  }
  
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      {content.split('\n\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </div>
  );
}
