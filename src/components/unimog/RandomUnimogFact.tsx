
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

// Enhanced array of Unimog facts
const unimogFacts = [
  "The name 'Unimog' is an abbreviation of the German term 'Universal-Motor-Gerät,' meaning 'Universal Motor Machine'.",
  "The first Unimog prototype was introduced in 1948 at a trade fair in Frankfurt, impressing audiences with its versatility.",
  "Unimogs were originally designed in the 1940s as agricultural machines to assist Germany's post-war recovery.",
  "Unimogs have equal-sized wheels, portal axles for high ground clearance, and a flexible frame that acts as part of the suspension.",
  "Many early Unimogs from the late 1940s are still operational today, showcasing their exceptional durability.",
  "Unimogs can operate a wide range of equipment, including snowplows, hydraulic cranes, and saws.",
  "Over 1,000 Unimogs were used by the Australian Defence Force during the 1980s and 1990s.",
  "Although initially designed for civilian purposes, Unimogs have been widely adopted by militaries worldwide.",
  "Unimogs have competed in extreme events like the Dakar Rally, showcasing their ruggedness and off-road prowess.",
  "Unimogs can ford through water up to 1.2 meters deep without preparation.",
  "Mercedes-Benz has produced over 380,000 Unimogs since 1948.",
  "Unimogs can climb slopes of up to 45 degrees thanks to their unique chassis design.",
  "While primarily manufactured in Germany, Unimogs have also been produced under license in Argentina.",
  "The Unimog's flexible frame allows the wheels to maintain ground contact even on extremely uneven terrain.",
  "Since 1951, Unimogs have been manufactured by Daimler-Benz and bear the Mercedes-Benz star.",
  "Unimogs are versatile vehicles used for tasks ranging from street sweeping to hedge trimming and wood chipping.",
  "The U 4023 and U 5023 models feature air-conditioned cabs and advanced gear systems for comfort in demanding operations.",
  "Early Unimogs were explicitly forbidden by their inventor from being used for military purposes—a rule later ignored.",
  "The first Unimog series featured an ox-head logo before adopting the Mercedes-Benz three-pointed star in 1953.",
  "Unimogs feature portal axles that provide exceptional ground clearance, making them ideal for off-road terrains.",
  "Unimogs are so versatile they've been deployed in war zones like Iraq and Afghanistan by various military forces.",
  "Unimog's design allows for incredible axle articulation, with wheels maintaining ground contact on the roughest terrain.",
];

export const getRandomUnimogFact = (): string => {
  return unimogFacts[Math.floor(Math.random() * unimogFacts.length)];
};

interface RandomUnimogFactProps {
  showAsButton?: boolean;
}

export const RandomUnimogFact = ({ showAsButton = false }: RandomUnimogFactProps) => {
  const { toast } = useToast();
  
  const showRandomFact = () => {
    const fact = getRandomUnimogFact();
    
    toast({
      title: "Unimog Fact",
      description: fact,
      duration: 5000,
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
