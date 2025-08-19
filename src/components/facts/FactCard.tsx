
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, X } from 'lucide-react';

interface FactCardProps {
  title: string;
  content: string;
  source?: string;
}

export const FactCard = ({ title, content, source }: FactCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the card when user clicks the trigger
  const showCard = () => {
    setIsVisible(true);
  };

  // Hide the card
  const hideCard = () => {
    setIsVisible(false);
  };

  // Auto-hide after 1 minute
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible) {
      timer = setTimeout(() => {
        setIsVisible(false);
      }, 60000); // 60 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible]);

  return (
    <>
      {/* Trigger button - always visible */}
      {!isVisible && (
        <Button 
          onClick={showCard} 
          className="fixed bottom-4 right-4 rounded-full w-10 h-10 p-0 bg-amber-500 hover:bg-amber-600"
          aria-label="Show Unimog fact"
        >
          <Lightbulb size={18} />
        </Button>
      )}
      
      {/* Fact card - visible when triggered */}
      {isVisible && (
        <Card className="fixed bottom-4 right-4 max-w-xs z-50 shadow-lg">
          <Button 
            onClick={hideCard} 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1"
            aria-label="Close fact"
          >
            <X size={16} />
          </Button>
          <CardTitle className="p-4 pb-0 text-lg flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" />
            <span>{title}</span>
          </CardTitle>
          <CardContent className="pt-3">
            <p className="text-sm">{content}</p>
          </CardContent>
          {source && (
            <CardFooter className="pt-0">
              <CardDescription className="text-xs">Source: {source}</CardDescription>
            </CardFooter>
          )}
        </Card>
      )}
    </>
  );
};

export default FactCard;
