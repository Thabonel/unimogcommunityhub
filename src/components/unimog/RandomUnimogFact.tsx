
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startTransition } from "react";

// Array of Unimog facts
const unimogFacts = [
  "Unimogs were originally designed as agricultural machines in the 1940s.",
  "The name 'Unimog' stands for 'Universal Motor Gerät,' meaning 'Universal Motor Machine'.",
  "Unimogs can ford through deep riverbeds and climb steep slopes thanks to their unique chassis design.",
  "Australia used over 1,000 Unimogs in its armed forces during the 1980s and 1990s.",
  "The first Unimog was presented at a trade fair in Frankfurt in 1948.",
  "Mercedes-Benz has produced over 380,000 Unimogs since 1948.",
  "Unimogs have a flexible frame that allows the wheels to maintain ground contact even on extremely uneven terrain.",
  "Unimogs can climb slopes of up to 45 degrees.",
  "The Unimog's portal axles give it exceptionally high ground clearance.",
  "Some Unimog models can drive through water up to 1.2 meters deep without preparation."
];

export const getRandomUnimogFact = (): string => {
  return unimogFacts[Math.floor(Math.random() * unimogFacts.length)];
};

interface RandomUnimogFactProps {
  showAsButton?: boolean;
  onClick?: () => void;
}

export const RandomUnimogFact = ({ showAsButton = false, onClick }: RandomUnimogFactProps) => {
  const { toast } = useToast();
  
  const showRandomFact = () => {
    const fact = getRandomUnimogFact();
    
    // Wrap in startTransition to prevent suspension errors
    startTransition(() => {
      toast({
        title: "Unimog Fact",
        description: fact,
        duration: 5000,
      });
      
      if (onClick) {
        onClick();
      }
    });
  };
  
  if (showAsButton) {
    return (
      <Button 
        onClick={showRandomFact}
        variant="ghost" 
        size="sm"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <Info className="h-4 w-4" />
        Random Unimog Fact
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={showRandomFact}
      variant="ghost"
      size="icon"
      className="rounded-full"
      title="Show a random Unimog fact"
    >
      <Info className="h-4 w-4" />
    </Button>
  );
};
