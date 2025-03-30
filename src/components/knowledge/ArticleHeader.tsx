
interface ArticleHeaderProps {
  title: string;
  categories: string[];
}

export function ArticleHeader({ title, categories }: ArticleHeaderProps) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category, index) => (
          <span 
            key={index}
            className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
          >
            {category}
          </span>
        ))}
      </div>
    </>
  );
}
