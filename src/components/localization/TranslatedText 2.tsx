
import { useState } from 'react';
import { useAutoTranslate } from '@/hooks/use-auto-translate';
import { Loader2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TranslatedTextProps {
  text: string;
  skipTranslation?: boolean;
  showOriginal?: boolean;
  className?: string;
  as?: React.ElementType;
}

export function TranslatedText({
  text,
  skipTranslation = false,
  showOriginal = false,
  className,
  as: Component = 'span',
}: TranslatedTextProps) {
  const [showingOriginal, setShowingOriginal] = useState(showOriginal);
  const { translatedText, isLoading, error } = useAutoTranslate(text, skipTranslation);

  // If translation is same as original or skip is true, just render the text
  if (skipTranslation || text === translatedText) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <div className={cn("inline relative group", className)}>
      <Component>
        {isLoading ? (
          <span className="inline-flex items-center">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            {text}
          </span>
        ) : showingOriginal ? text : translatedText}
      </Component>
      
      {/* Toggle button to switch between original and translated */}
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 absolute -right-6 top-0"
        onClick={() => setShowingOriginal(!showingOriginal)}
        title={showingOriginal ? "Show translation" : "Show original"}
      >
        <Globe className="h-3 w-3" />
      </Button>
    </div>
  );
}

// Variants for different heading levels
export function TranslatedH1(props: Omit<TranslatedTextProps, 'as'>) {
  return <TranslatedText as="h1" {...props} />;
}

export function TranslatedH2(props: Omit<TranslatedTextProps, 'as'>) {
  return <TranslatedText as="h2" {...props} />;
}

export function TranslatedH3(props: Omit<TranslatedTextProps, 'as'>) {
  return <TranslatedText as="h3" {...props} />;
}

export function TranslatedParagraph(props: Omit<TranslatedTextProps, 'as'>) {
  return <TranslatedText as="p" {...props} />;
}

export default TranslatedText;
