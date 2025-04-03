
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
      duration: 5000,
    });
  };
  
  return (
    <Button 
      onClick={handleClick}
      variant="outline"
      className="hidden md:flex items-center gap-2 text-unimog-700 hover:bg-unimog-50 dark:text-unimog-300"
    >
      <BookOpenCheck className="h-4 w-4" />
      Learn About Unimogs
    </Button>
  );
};
