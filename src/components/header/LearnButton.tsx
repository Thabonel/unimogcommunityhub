
import { Button } from '@/components/ui/button';
import { BookOpenCheck } from 'lucide-react';
import { getRandomUnimogFact } from '@/components/unimog/RandomUnimogFact';
import { useToast } from '@/hooks/use-toast';

export const LearnButton = () => {
  const { toast } = useToast();
  
  const handleClick = () => {
    // Show a random fact in a toast, without navigation
    const fact = getRandomUnimogFact();
    toast({
      title: "Unimog Fact",
      description: fact,
    });
  };
  
  return (
    <Button 
      onClick={handleClick}
      variant="outline"
      size="sm"
      className="hidden md:flex items-center gap-1 rounded-full border border-input text-sm"
    >
      <BookOpenCheck className="h-4 w-4 mr-1" />
      Learn About Unimogs
    </Button>
  );
};
